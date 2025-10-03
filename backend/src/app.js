require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dbConfig = require('./config/db');
const engineerRoutes = require('./routes/engineerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database connection
dbConfig();

// Routes
app.use('/api/engineers', engineerRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;