const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const rootRoutes = require('./routes/root');
const coordinates = require('./routes/coordinates');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', rootRoutes);
app.use('/coordinates', coordinates);

app.listen(PORT, () => {
  console.log(`🚀 SOLCial API Server running on port ${PORT}`);
});
