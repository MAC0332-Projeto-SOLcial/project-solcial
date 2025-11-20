const express = require('express');
const router = express.Router();
const geocoding = require('../services/api/geocoding');

const validatePayload = (payload) => {
  if (!payload?.address) {
    throw new Error("O campo 'address' é obrigatório");
  }
};

/**
 * @route   GET /coordinates
 * @desc    Recebe um endereco e retorna as coordenadas geograficas
 * @body    {string} address - O endereco a ser convertido para coordenadas
 * @response {object} - As coordenadas geograficas do endereco
 */
router.get('/', async (req, res) => {
  try {
    validatePayload(req.body);

    const { address } = req.body;
    const geocodingResponse = await geocoding.getCoordinates(address);
    const location = geocodingResponse.results[0].geometry.location;
    const formattedAddress = geocodingResponse.results[0].formatted_address;

    const coordinates = {
      formattedAddress,
      latitude: location.lat,
      longitude: location.lng
    };

    res.status(200).json(coordinates);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

