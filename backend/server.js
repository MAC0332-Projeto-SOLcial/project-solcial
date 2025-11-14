const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const rootRoutes = require('./routes/root');
const coordinates = require('./routes/coordinates');
const apisolar = require('./routes/apisolar');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', rootRoutes);
app.use('/coordinates', coordinates);
app.use('/apisolar', apisolar);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint não encontrado',
      path: req.path,
      method: req.method
    }
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({
    success: false,
    error: {
      message: 'Erro interno do servidor',
      details: error.message
    }
  });
});




app.listen(PORT, () => {
  console.log(`🚀 SOLCial API Server running on port ${PORT}`);
  console.log(`🌞 Solar API endpoints:`);
  console.log(`   - GET http://localhost:${PORT}/apisolar`);
  console.log(`   - GET http://localhost:${PORT}/coordinates`);
});
