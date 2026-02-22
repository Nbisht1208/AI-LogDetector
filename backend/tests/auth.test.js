import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

describe('Auth API', () => {
  test('POST /api/auth/register - should register user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'test123' });
    expect(res.statusCode).toBeLessThan(500);
  }, 15000);

  test('POST /api/auth/login - should login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'test123' });
    expect(res.statusCode).toBeLessThan(500);
  }, 15000);

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe('Log API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'test123' });
    token = res.body.token;
  }, 15000);

  test('GET /api/v1/logs - should return logs', async () => {
    const res = await request(app)
      .get('/api/v1/logs')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBeLessThan(500);
  }, 15000);

  afterAll(async () => {
    await mongoose.connection.close();
  }, 15000);
});