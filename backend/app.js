const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const { execFile } = require('child_process'); 
const axios = require('axios'); // Importa Axios para hacer solicitudes HTTP
const app = express();
const userRoutes = require('./routes/users');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Console } = require('console');

require('dotenv').config();

const PORT = process.env.PORT;
const API_KEY = process.env.GEMINI_API_KEY;
console.log(API_KEY);
//middlewares
app.use(express.json());
app.use(cors());

//routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));
app.use('/api/user', userRoutes);

const genAI = new GoogleGenerativeAI(API_KEY);

const getRecommendations = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim();
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch recommendations');
  }
};

app.post('/api/v1/getFinancialRecommendations', async (req, res) => {
  const { balance, income, expense} = req.body;
  const prompt = `
    You are a financial advisor. I have a balance of $${balance}, 
    I am a worker, with current income of $${income} and outgoings 
    of $${expense} and need recommendations.
  `;
  console.log(prompt);
  try {
    const recommendation = await getRecommendations(prompt);
    res.json({ recommendation });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.post('/api/v1/getIncomeRecommendations', async (req, res) => {
  const { income } = req.body;
  const prompt = `
  You are a financial advisor. Given an incomes of $${income}, recommend specific financial actions that the user should take. Consider the following:
  - Savings and investment strategies
  - Risk management
  - Short-term and long-term financial goals
  - Any potential market conditions
  Please provide detailed and actionable recommendations.
  `;
  console.log(prompt);
  try {
    const recommendation = await getRecommendations(prompt);
    res.json({ recommendation });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

/*app.post('/api/v1/getExpenseRecommendations', async (req, res) => {
  const { expense } = req.body;
  const prompt = `
  You are a financial advisor. Given an expense of $${expense}, recommend specific financial actions that the user should take. Consider the following:
  - Savings and investment strategies
  - Risk management
  - Short-term and long-term financial goals
  - Any potential market conditions
  Please provide detailed and actionable recommendations.
  `;
  console.log(prompt);
  try {
    const recommendation = await getRecommendations(prompt);
    res.json({ recommendation });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Nuevo endpoint para obtener recomendaciones financieras
/*app.post('/api/v1/getFinancialRecommendations', async (req, res) => {
  const { balance } = req.body;

  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'GPT-2', // Modelo de OpenAI
      prompt: `Given a balance of ${balance}, recommend financial actions.`,
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Clave de API de OpenAI
        'Content-Type': 'application/json'
      }
    });

    const recommendation = response.data.choices[0].text.trim();
    res.json({ recommendation });
  } catch (error) {
    console.error('Error:', error);
    console.error('Error data:', error.response.data); // Imprimir el objeto de error completo
    res.status(500).json({ error: 'Internal Server Error' });
  }
});*/

const server = () => {
  db();
  app.listen(PORT, () => {
    console.log('listening to port:', PORT);
  });
};

server();
