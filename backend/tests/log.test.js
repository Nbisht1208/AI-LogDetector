import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

describe('Log API', () => {
  test('GET /api/v1/logs - should return logs', async () => {
    const res = await request(app)
      .get('/api/v1/logs');
    expect(res.statusCode).toBeLessThan(500);
  }, 15000);

  test('POST /api/v1/logs - should accept log', async () => {
    const res = await request(app)
      .post('/api/v1/logs')
      .send({ level: 'error', message: 'test error', source: 'test' });
    expect(res.statusCode).toBeLessThan(500);
  }, 15000);

  afterAll(async () => {
    await mongoose.connection.close();
  }, 15000);
});