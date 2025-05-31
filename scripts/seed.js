/**
 * Seed script – wipes users & costs then inserts the single spec user.
 * Usage:  npm run seed
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import 'dotenv/config.js';
import mongoose from 'mongoose';
import { User } from '../src/models/user.js';
import { Cost } from '../src/models/cost.js';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // 1. Clear existing data
    await Promise.all([User.deleteMany({}), Cost.deleteMany({})]);

    // 2. Insert the mandatory user
    await User.create({
      id: '123123',
      first_name: 'mosh',
      last_name: 'israeli',
      birthday: new Date('1990-06-01'),
      marital_status: 'single',
    });

    console.log('✅ Database seeded with user 123123');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
