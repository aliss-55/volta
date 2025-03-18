const request = require('supertest');
const Income = require('../models/IncomeModel');

const baseURL = 'https://financeme-project-1.onrender.com/api/v1';

describe('Transactions API Endpoints', () => {
  let authToken; 

  beforeAll(async () => {
    const loginResponse = await request(baseURL)
      .post('/login') 
      .send({
        email: 'financee@gmail.com',
        password: 'Finance1.'
      });

    authToken = loginResponse.body.token; 
    
  });

  it('should add a new income', async () => {
    const newIncome = {
      title: 'Salary',
      amount: 3000,
      category: 'Job',
      description: 'Monthly salary',
      date: '2024-04-15'
    };

    const response = await request(baseURL)
      .post('/add-income')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newIncome); 

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Income Added');
  });

  it('should return an error if any required field is missing', async () => {
    const incompleteIncome = {
      amount: 3000,
      category: 'Job',
      description: 'Monthly salary',
      date: '2024-04-15'
    };

    const response = await request(baseURL)
      .post('/add-income')
      .set('Authorization', `Bearer ${authToken}`)
      .send(incompleteIncome); 

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('All fields are required!');
  });

  it('should return an error if amount is not a positive number', async () => {
    const invalidIncome = {
      title: 'Salary',
      amount: -3000, 
      category: 'Job',
      description: 'Monthly salary',
      date: '2024-04-15'
    };

    const response = await request(baseURL)
      .post('/add-income')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidIncome); 

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Amount must be a positive number!');
  });

  it('should return an error if amount is not a number', async () => {
    const invalidIncome = {
      title: 'Salary',
      amount: 'asdasd', 
      category: 'Job',
      description: 'Monthly salary',
      date: '2024-04-15'
    };
  
    const response = await request(baseURL)
      .post('/add-income')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidIncome);
  
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Amount must be a positive number!');
  });

  it('should get all incomes', async () => {
    const response = await request(baseURL)
      .get('/get-incomes')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should delete an income', async () => {
    const newIncome = {
      title: 'Salary',
      amount: 3000,
      category: 'Job',
      description: 'Monthly salary',
      date: '2024-04-15'
    };
    const createResponse = await request(baseURL)
      .post('/add-income')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newIncome);   

    expect(createResponse.status).toBe(200);
    expect(createResponse.body.message).toBe('Income Added');

    const createdIncomeId = createResponse.body.income._id;

    const deleteResponse = await request(baseURL)
      .delete(`/delete-income/${createdIncomeId}`)
      .set('Authorization', `Bearer ${authToken}`);
  
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Income Deleted');
  });
});
