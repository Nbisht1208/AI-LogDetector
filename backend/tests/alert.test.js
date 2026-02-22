import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

describe('Alert API', () => {
  test('GET /api/v1/alerts - should return alerts', async () => {
    const res = await request(app)
      .get('/api/v1/alerts');
    expect(res.statusCode).toBeLessThan(500);
  }, 15000);

  test('GET /api/v1/stats - should return stats', async () => {
    const res = await request(app)
      .get('/api/v1/stats');
    expect(res.statusCode).toBeLessThan(500);
  }, 15000);

  afterAll(async () => {
    await mongoose.connection.close();
  }, 15000);
});