import request from 'supertest';
import { app } from '../src/server';

/* Clear Cost collection before every test run */
beforeEach(async () => {
  const { Cost } = await import('../src/models/cost.js');
  await Cost.deleteMany({});
});

/* -------------------------------------------------------------- */
/*  POST /api/add should create a new cost document               */
/* -------------------------------------------------------------- */
describe('POST /api/add', () => {
  it('creates a cost item and returns 201', async () => {
    // body matches schema, userid is required
    const body = {
      userid: '123123',
      description: 'milk 9',
      category: 'food',
      sum: 8,
    };

    
    /* Act */
    const res = await request(app).post('/api/add').send(body);

    /* Assert */
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(body); // shallow match
    expect(res.body).toHaveProperty('_id'); // shallow match
  });
});
