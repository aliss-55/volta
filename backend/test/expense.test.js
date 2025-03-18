const request = require('supertest');
const Expense = require('../models/ExpenseModel');

const baseURL = 'https://financeme-project-1.onrender.com/api/v1';

describe('Transactions API Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    const loginResponse = await request(baseURL)
      .post('/login')
      .send({
        email: 'finance@gmail.com',
        password: 'Finance1.'
      });

    authToken = loginResponse.body.token;
  });

  it('should add a new expense', async () => {
    const newExpense = {
      title: 'Rent',
      amount: 1200,
      category: 'Housing',
      description: 'Monthly rent payment',
      date: '2024-04-30'
    };

    const response = await request(baseURL)
      .post('/add-expense')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newExpense);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Expense Added');
  });

  it('should return an error if any required field is missing', async () => {
    const incompleteExpense = {
      amount: 1200,
      category: 'Housing',
      description: 'Monthly rent payment',
      date: '2024-04-30'
    };

    const response = await request(baseURL)
      .post('/add-expense')
      .set('Authorization', `Bearer ${authToken}`)
      .send(incompleteExpense);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('All fields are required!');
  });

  it('should return an error if amount is not a positive number', async () => {
    const invalidExpense = {
      title: 'Rent',
      amount: -1200,
      category: 'Housing',
      description: 'Monthly rent payment',
      date: '2024-04-30'
    };

    const response = await request(baseURL)
      .post('/add-expense')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidExpense);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Amount must be a positive number!');
  });

  it('should return an error if amount is not a number', async () => {
    const invalidExpense = {
      title: 'Rent',
      amount: 'asdasd',
      category: 'Housing',
      description: 'Monthly rent payment',
      date: '2024-04-30'
    };

    const response = await request(baseURL)
      .post('/add-expense')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidExpense);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Amount must be a positive number!');
  });

  it('should get all expenses', async () => {
    const response = await request(baseURL)
      .get('/get-expenses')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should delete an expense', async () => {
    const newExpense = {
      title: 'Rent',
      amount: 1200,
      category: 'Housing',
      description: 'Monthly rent payment',
      date: '2024-04-30'
    };

    const createResponse = await request(baseURL)
      .post('/add-expense')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newExpense);

    expect(createResponse.status).toBe(200);
    expect(createResponse.body.message).toBe('Expense Added');

    const createdExpenseId = createResponse.body.expense._id;

    const deleteResponse = await request(baseURL)
      .delete(`/delete-expense/${createdExpenseId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Expense Deleted');
  });
});
