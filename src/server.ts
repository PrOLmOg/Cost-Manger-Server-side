import express, { json } from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import userRouter from './routes/user.router';
import costRouter from './routes/cost.router';
import aboutRouter from './routes/about.router';
import connectDB from './config/database.config';
import { errorHandler } from './middleware/error.middleware';
import { getAbout } from './controllers/about.controller';
import costController from './controllers/cost.controller';
const { getMonthlyReport, addCost } = costController;

// Load environment variables
config();

// --------------------
// Express app instance
// --------------------
export const app = express();

// Root route
app.get('/', (_req, res) => {
  res.send('Welcome to Almog and Maxim Project!');
});

// Middleware
app.use(json());
app.use(morgan('dev'));
app.use(errorHandler);

// Routers
app.use('/api/users', userRouter);
app.use('/api/costs', costRouter);
app.use('/api/about', aboutRouter);

// Additional explicit routes (per instructor requirements)
app.get('/api/about/', getAbout);
app.get('/api/report/', getMonthlyReport);
app.post('/api/add/', addCost);

// ---------------------------
// Start HTTP server & export
// ---------------------------
const PORT = process.env.PORT || 5000;
export let server: any; // will be assigned after DB connects

const start = async () => {
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Only start automatically when this file is run directly
if (require.main === module) {
  start();
}