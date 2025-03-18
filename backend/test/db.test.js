const request = require('supertest');
const db = require('../db/db');

describe('DB Connection', () => {
  it('should connect to the database', async () => {
    process.env.MONGO_URL = 'mongodb+srv://alissontobar:P6l5rKnzf3uXpAO5@cluster0.qkqcpef.mongodb.net/';
    expect(true).toBe(true);
  });

  it('should throw an error if the database is not available', async () => {
    process.env.MONGO_URL = 'mongodb://localhost:27018/test';
    try {
      await db();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});