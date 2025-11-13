const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = express.Router();
const app = express();
const  solarApiService   = require('../services/api/solarApiService');
// Import routes

router.get('/teste', async (req, res) => {
   res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * GET /api/solar/building-insights
 * Busca informações de insights solares de um edifício (via query params)
 * Query: ?latitude=number&longitude=number&requiredQuality=string
 */
router.get('/api/solar/building-insights', async (req, res) => {
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
 * GET /api/solar/data-layers
 * Busca dados de camadas solares (via query params)
 * Query: ?latitude=number&longitude=number&radiusMeters=number&requiredQuality=string
 */
router.get(' ', async (req, res) => {
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

module.exports = router;