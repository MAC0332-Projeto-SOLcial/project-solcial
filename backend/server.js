const express = require('express');
const cors = require('cors');
require('dotenv').config();

const solarApiService = require('./services/solarApiService');
// Import routes
const rootRoutes = require('./routes/root');
const coordinates = require('./routes/coordinates');

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
      solarAnalysis: '/api/solar/analysis'
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

/**
 * POST /api/solar/building-insights
 * Busca informações de insights solares de um edifício
 * Body: { latitude: number, longitude: number, requiredQuality?: string }
 */
app.post('/api/solar/building-insights', async (req, res) => {
  try {
    const { latitude, longitude, requiredQuality } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Latitude e longitude são obrigatórios',
          fields: ['latitude', 'longitude']
        }
      });
    }

    const result = await solarApiService.findClosestBuildingInsights({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      requiredQuality: requiredQuality || 'HIGH'
    });

    if (!result.success) {
      return res.status(result.error?.status || 500).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('❌ Erro no endpoint building-insights:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro interno do servidor',
        details: error.message
      }
    });
  }
});

/**
 * GET /api/solar/building-insights
 * Busca informações de insights solares de um edifício (via query params)
 * Query: ?latitude=number&longitude=number&requiredQuality=string
 */
app.get('/api/solar/building-insights', async (req, res) => {
  try {
    const { latitude, longitude, requiredQuality } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Latitude e longitude são obrigatórios',
          example: '/api/solar/building-insights?latitude=37.4450&longitude=-122.1390&requiredQuality=HIGH'
        }
      });
    }

    const result = await solarApiService.findClosestBuildingInsights({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      requiredQuality: requiredQuality || 'HIGH'
    });

    if (!result.success) {
      return res.status(result.error?.status || 500).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('❌ Erro no endpoint building-insights:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro interno do servidor',
        details: error.message
      }
    });
  }
});

/**
 * POST /api/solar/data-layers
 * Busca dados de camadas solares
 * Body: { latitude: number, longitude: number, radiusMeters?: number, requiredQuality?: string }
 */
app.post('/api/solar/data-layers', async (req, res) => {
  try {
    const { latitude, longitude, radiusMeters, requiredQuality } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Latitude e longitude são obrigatórios',
          fields: ['latitude', 'longitude']
        }
      });
    }

    const result = await solarApiService.getDataLayers({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radiusMeters: radiusMeters ? parseInt(radiusMeters) : 50,
      requiredQuality: requiredQuality || 'HIGH'
    });

    if (!result.success) {
      return res.status(result.error?.status || 500).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('❌ Erro no endpoint data-layers:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro interno do servidor',
        details: error.message
      }
    });
  }
});

/**
 * GET /api/solar/data-layers
 * Busca dados de camadas solares (via query params)
 * Query: ?latitude=number&longitude=number&radiusMeters=number&requiredQuality=string
 */
app.get('/api/solar/data-layers', async (req, res) => {
  try {
    const { latitude, longitude, radiusMeters, requiredQuality } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Latitude e longitude são obrigatórios',
          example: '/api/solar/data-layers?latitude=37.4450&longitude=-122.1390&radiusMeters=50'
        }
      });
    }

    const result = await solarApiService.getDataLayers({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radiusMeters: radiusMeters ? parseInt(radiusMeters) : 50,
      requiredQuality: requiredQuality || 'HIGH'
    });

    if (!result.success) {
      return res.status(result.error?.status || 500).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('❌ Erro no endpoint data-layers:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro interno do servidor',
        details: error.message
      }
    });
  }
});

/**
 * POST /api/solar/analysis
 * Analisa o potencial solar de um local (dados processados e simplificados)
 * Body: { latitude: number, longitude: number }
 */
app.post('/api/solar/analysis', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Latitude e longitude são obrigatórios',
          fields: ['latitude', 'longitude']
        }
      });
    }

    const result = await solarApiService.analyzeSolarPotential(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    if (!result.success) {
      return res.status(result.error?.status || 500).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('❌ Erro no endpoint analysis:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro interno do servidor',
        details: error.message
      }
    });
  }
});

/**
 * GET /api/solar/analysis
 * Analisa o potencial solar de um local (via query params)
 * Query: ?latitude=number&longitude=number
 */
app.get('/api/solar/analysis', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Latitude e longitude são obrigatórios',
          example: '/api/solar/analysis?latitude=37.4450&longitude=-122.1390'
        }
      });
    }

    const result = await solarApiService.analyzeSolarPotential(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    if (!result.success) {
      return res.status(result.error?.status || 500).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('❌ Erro no endpoint analysis:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro interno do servidor',
        details: error.message
      }
    });
  }
});

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
  console.log(`   - GET/POST http://localhost:${PORT}/api/solar/analysis`);
  console.log(`\n📝 Environment: ${process.env.NODE_ENV || 'development'}`);
app.use('/', rootRoutes);
app.use('/coordinates', coordinates);

app.listen(PORT, () => {
  console.log(`🚀 SOLCial API Server running on port ${PORT}`);
})});
