const express = require('express');
const SolarService = require('../services/solarService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetro "address" é obrigatório'
      });
    }

    const solarService = new SolarService();
    
    if (!solarService.validateAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Endereço inválido'
      });
    }

    const solarData = await solarService.getSolarData(address);
    res.json(solarData);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

router.get('/test', (req, res) => {
  const { address } = req.query;
  
  if (!address) {
    return res.status(400).json({
      success: false,
      error: 'Parâmetro "address" é obrigatório'
    });
  }

  res.json({
    success: true,
    address: address,
    buildingInsights: {
      center: {
        latitude: -23.5505,
        longitude: -46.6333
      },
      roofSegmentStats: [
        {
          pitchDegrees: 30,
          azimuthDegrees: 180,
          stats: {
            areaMeters2: 100,
            sunshineQuantiles: [0.8, 0.9, 0.95],
            groundAreaMeters2: 120
          }
        }
      ],
      buildingStats: {
        areaMeters2: 200,
        groundAreaMeters2: 250,
        maxHeightMeters: 10
      }
    },
    solarIrradiance: {
      maxSunshineHoursPerYear: 3000,
      averageSunshineHoursPerYear: 2500,
      kwhPerSquareMeterPerYear: 1500
    },
    timestamp: new Date().toISOString(),
    note: "Dados simulados para desenvolvimento"
  });
});

module.exports = router;
