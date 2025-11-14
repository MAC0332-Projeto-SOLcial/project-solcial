const express = require('express');
const cors = require('cors');
require('dotenv').config();


// Import routes
const rootRoutes = require('./routes/root');
const coordinates = require('./routes/coordinates');
const apisolar = require('./routes/apisolar');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'SOLCial API Server is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      solarBuildingInsights: '/api/solar/building-insights',
      solarDataLayers: '/api/solar/data-layers',
      
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

app.use('/', rootRoutes);
app.use('/coordinates', coordinates);
app.use('/', apisolar);
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
  console.error('❌ Erro não tratado:', error);
  res.status(500).json({
    success: false,
    error: {
      message: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }
  });
});




app.listen(PORT, () => {
  console.log(`🚀 SOLCial API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🌞 Solar API endpoints:`);
  console.log(`   - GET/POST http://localhost:${PORT}/api/solar/building-insights`);
  console.log(`   - GET/POST http://localhost:${PORT}/api/solar/data-layers`);
  
  console.log(`\n📝 Environment: ${process.env.NODE_ENV || 'development'}`);


app.listen(PORT, () => {
  console.log(`🚀 SOLCial API Server running on port ${PORT}`);
})});
