const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'SOLCial API Server is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      solar: '/api/solar'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Solar API endpoint (placeholder)
app.get('/api/solar', (req, res) => {
  res.json({
    message: 'Solar API endpoint - ready for Google Solar API integration',
    status: 'development'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SOLCial API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🌞 Solar API: http://localhost:${PORT}/api/solar`);
});
