import request from 'supertest';
import { app } from '../src/server';

beforeEach(async () => {
  const { Cost } = await import('../src/models/cost.js');
  await Cost.deleteMany({});
});

describe('POST /api/add', () => {
  it('creates a cost item and returns 201', async () => {
    const body = {
      userid: '123123',
      description: 'milk 9',
      category: 'food',
      sum: 8,
    };

    const res = await request(app).post('/api/add').send(body);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(body);
    expect(res.body).toHaveProperty('_id');
  });
});
