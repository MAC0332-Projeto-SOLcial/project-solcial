const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = express.Router();
const  solarApiService   = require('../services/api/solarApiService');

const validatePayload = (payload) => {
  if (!payload?.latitude || !payload?.longitude) {
    throw new Error('Latitude e longitude são obrigatórios');
  }
};

/**
 * @route   GET /apisolar
 * @desc    Busca informações de insights solares de um edifício (via query params)
 * @body    {number} latitude - Latitude do local
 * @body    {number} longitude - Longitude do local
 * @response {object} - Dados de insights solares
 */
router.get('/', async (req, res) => {
  try {
    validatePayload(req.body);

    const { latitude, longitude } = req.body;

    const result = await solarApiService.getSolarPotential(latitude, longitude);

    if (!result.success) {
      throw new Error(result.error?.message || 'Erro ao buscar o potencial solar');
    }

    res.status(200).json(result);

  } catch (error) {
    console.error('Erro no endpoint apisolar:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
