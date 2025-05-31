/**
 * Entry point – sets up routes and starts Express.
 *
 */

const express = require('express');
const morgan  = require('morgan');
const { config } = require('dotenv');

const userRouter  = require('./routes/user.router').default;
const costRouter  = require('./routes/cost.router').default;
const aboutRouter = require('./routes/about.router').default;

const connectDB   = require('./config/database.config').default;
const { errorHandler } = require('./middleware/error.middleware');

// --------------------
// Environment & app
// --------------------
config();
const app = express();

// Root route
app.get('/', (_req, res) => {
  res.send('Welcome to Almog and Maxim Project!');
});

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(errorHandler);

// Routers
app.use('/api/users', userRouter);
app.use('/api/costs', costRouter);
app.use('/api/about', aboutRouter);

const { addCost } = require('./controllers/cost.controller').default;
app.post('/api/add', addCost);
app.get('/api/report', getMonthlyReport);

// ---------------------------
// Start HTTP server & export
// ---------------------------
const PORT = process.env.PORT || 5000;
let server;                 // assigned after DB connects

async function start() {
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// auto-start when called via `node server.js`
if (require.main === module) start();

// expose for tests
module.exports = { app, start, server };
