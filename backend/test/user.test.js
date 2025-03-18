const request = require('supertest');
const baseURL = 'https://financeme-project-1.onrender.com/api/v1';
const uniqueEmail = `${Date.now()}@example.com`;

describe('User API Endpoints', () => {
  it('should register a new user', async () => {
    const newUser = {
      email: uniqueEmail,
      password: 'Finance1.'
    };
    const response = await request(baseURL)
      .post('/signup')
      .send(newUser);
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', newUser.email);
    expect(response.body).toHaveProperty('token');
  });

  it('should return an error if email or password is missing', async () => {
    const User = {
      email: '',
      password: 'Finance1.'
    };
    const response = await request(baseURL)
      .post('/signup')
      .send(User);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'All fields must be filled');
  });

  it('should return an error if email is not valid', async () => {
    const User = {
      email: 'invalid_email',
      password: 'Finance1.'
    };
    const response = await request(baseURL)
      .post('/signup')
      .send(User);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email not valid');
  });

  it('should return an error if password is not strong enough', async () => {
    const User = {
      email: 'finance@gmail.com',
      password: 'weak'
    };
    const response = await request(baseURL)
      .post('/signup')
      .send(User);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Password not strong enough');
  });
  
  it('should return an error if trying to register with existing email', async () => {
    const existingUser = {
      email: 'finance@gmail.com',
      password: 'Finance1.'
    };

    const response = await request(baseURL)
      .post('/signup')
      .send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should login an existing user', async () => {
    const userData = {
      email: 'finance@gmail.com',
      password: 'Finance1.'
    };

    const response = await request(baseURL)
      .post('/login')
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', userData.email);
    expect(response.body).toHaveProperty('token');
  });

  it('should return an error if email or password is missing', async () => {
    const userData = {
      email: 'finance@gmail.com',
      password: ''
    };

    const response = await request(baseURL)
      .post('/login')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'All fields must be filled');
  });

  it('should return an error if email is incorrect', async () => {
    const userData = {
      email: 'financeaaaa@gmail.com',
      password: 'Finance1.'
    };

    const response = await request(baseURL)
      .post('/login')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Incorrect email');
  });

  it('should return an error if password is incorrect', async () => {
    const userData = {
      email: 'finance@gmail.com',
      password: 'Finance13213.'
    };

    const response = await request(baseURL)
      .post('/login')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Incorrect password');
  });

});
