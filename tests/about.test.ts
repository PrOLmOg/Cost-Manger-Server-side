import request from 'supertest';
import { app } from '../src/server';   // no need to import server

describe('GET /api/about', () => {
  it('should return 200 and an array of team members', async () => {
    const res = await request(app).get('/api/about');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((m: any) => {
      expect(m).toHaveProperty('first_name');
      expect(m).toHaveProperty('last_name');
    });
  });
});

// optional: close DB connection after all tests
afterAll(async () => {
  const { default: mongoose } = await import('mongoose');
  await mongoose.disconnect();
});
