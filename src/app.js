const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const courtRoutes = require('./routes/courtRoutes');
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.json({ message: 'Courtline Backend API is running.' });
});
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', courtRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;