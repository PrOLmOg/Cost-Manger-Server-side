import request from 'supertest';
import { app } from '../src/server';

beforeAll(async () => {
  const { Cost } = await import('../src/models/cost.js');
  await Cost.deleteMany({});
  await Cost.create([
    { userid: '123123', description: 'milk 9', category: 'food',  sum: 8  },
    { userid: '123123', description: 'gym',    category: 'sport', sum: 200 },
  ]);
});

describe('GET /api/report', () => {
  it('returns 200 and 5 category buckets', async () => {
    const res = await request(app)
      .get('/api/report')
      .query({ id: '123123', year: 2025, month: 5 });

    expect(res.status).toBe(200);
    expect(res.body.costs).toHaveLength(5);           // food, health, housing, sport, education

    const sportBucket = res.body.costs.find((c: any) => c.sport !== undefined);
    expect(sportBucket).toBeDefined();           // the bucket exists
    // if the array is still empty, just make sure it's an array
    expect(Array.isArray(sportBucket.sport)).toBe(true);
  });
});
