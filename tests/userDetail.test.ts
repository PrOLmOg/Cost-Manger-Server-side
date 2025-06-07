import request from 'supertest';
import { app } from '../src/server';

/* Seed two expenses for the target user */
beforeAll(async () => {
  const { Cost } = await import('../src/models/cost.js');
  await Cost.deleteMany({});
  await Cost.create([
    { userid: '123123', description: 'milk 9', category: 'food',  sum: 8  },
    { userid: '123123', description: 'gym',    category: 'sport', sum: 200 },
  ]);
});

/* -------------------------------------------------------------- */
/*  /api/users/:id should return total = 208 (8 + 200)            */
/* -------------------------------------------------------------- */
describe('GET /api/users/:id', () => {
  it('returns 200 and correct total', async () => {
    const res = await request(app).get('/api/users/123123');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(208); // 8 + 200
  });
});
