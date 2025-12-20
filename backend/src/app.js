const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { sequelize } = require('./models');
const { createAdminUser } = require('./utils/seed');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use( (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Sync database
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
    createAdminUser();
  })
  .catch(err => console.error('Database sync error:', err));

module.exports = app;