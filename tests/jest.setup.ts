import { default as connectDB } from '../src/config/database.config';

beforeAll(async () => {
  await connectDB();          // one connection for all tests
});

afterAll(async () => {
  const { default: mongoose } = await import('mongoose');
  await mongoose.disconnect();
});
