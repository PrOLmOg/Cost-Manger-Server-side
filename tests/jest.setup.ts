import { default as connectDB } from '../src/config/database.config';

/* Single DB connection for the whole Jest run */
beforeAll(async () => {
  await connectDB();          // one connection for all tests
});

afterAll(async () => {
  const { default: mongoose } = await import('mongoose');
  await mongoose.disconnect();
});
