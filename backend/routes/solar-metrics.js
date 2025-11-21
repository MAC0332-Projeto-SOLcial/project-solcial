const express = require('express');
const router = express.Router();
const geocoding = require('../services/api/geocoding');
const solar = require('../services/api/solarApiService');

const validatePayload = (payload) => {
    if (!payload?.address) {
        throw new Error("O campo 'address' é obrigatório");
    }
};

/**
 * @route   GET /solar-metrics
 * @desc    Recebe um endereco e retorna dados solares
 * @body    {string} address - O endereco a ser convertido para coordenadas
 * @response {object} - Dados de insights solares
 */
router.get('/', async (req, res) => {
    try {
        validatePayload(req.body);
        
        const { address } = req.body;
        const geocodingResponse = await geocoding.getCoordinates(address);

        if (geocodingResponse.status !== "OK") {
            throw new Error(geocodingResponse.error?.message);
        }

        const location = geocodingResponse.results[0].geometry.location;
        const formattedAddress = geocodingResponse.results[0].formatted_address;

        const solarResponse = await solar.getSolarPotential(location.lat, location.lng);
        
        if (!solarResponse.success) {
            throw new Error(solarResponse.error?.message);
        }

        responsePayload = {
            formattedAddress: formattedAddress,
            solar: solarResponse
        };

        res.status(200).json(responsePayload);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;