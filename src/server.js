/**
 * Entry point – sets up routes and starts Express.
 *
 */

const express = require('express');
const morgan  = require('morgan');
const { config } = require('dotenv');

const userRouter  = require('./src/routes/user.router');
const costRouter  = require('./src/routes/cost.router');
const aboutRouter = require('./src/routes/about.router');

const connectDB   = require('./src/config/database.config');
const { errorHandler } = require('./src/middleware/error.middleware');

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
