const express = require('express');
const router = express.Router();
const geocoding = require('../services/api/geocoding');
const solar = require('../services/api/solarApiService');
const SolarMetrics = require('../services/api/solarMetrics');

const { ERROR_MESSAGES } = require('../utils/enums');

const validatePayload = (payload) => {
    if (!payload?.address) {
        throw new Error(ERROR_MESSAGES.ADDRESS_REQUIRED);
    }

    if (!Array.isArray(payload.energyConsumptionKwh) || payload.energyConsumptionKwh.length === 0) {
        throw new Error(ERROR_MESSAGES.ENERGY_CONSUMPTION_REQUIRED);
    }

    if (!Array.isArray(payload.spentMoney) || payload.spentMoney.length === 0) {
        throw new Error(ERROR_MESSAGES.SPENT_MONEY_REQUIRED);
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
        const address = req.query.address || '';
        let energyConsumptionKwh = [];
        let spentMoney = [];

        let numPanels = parseInt(req.query.numPanels || "1", 10);
        
        try {
            energyConsumptionKwh = req.query.energyConsumptionKwh 
                ? JSON.parse(req.query.energyConsumptionKwh) 
                : [];
        } catch (e) {
            throw new Error(ERROR_MESSAGES.INVALID_ENERGY_CONSUMPTION_KWH);
        }
        
        try {
            spentMoney = req.query.spentMoney 
                ? JSON.parse(req.query.spentMoney) 
                : [];
        } catch (e) {
            throw new Error(ERROR_MESSAGES.INVALID_SPENT_MONEY);
        }
        
        const payload = {
            address: address.trim(),
            energyConsumptionKwh: energyConsumptionKwh,
            spentMoney: spentMoney
        };
        
        validatePayload(payload);

        if (energyConsumptionKwh.length !== spentMoney.length) {
            throw new Error(ERROR_MESSAGES.INVALID_LIST_SIZE);
        }

        const finalAddress = payload.address;
        const geocodingResponse = await geocoding.getCoordinates(finalAddress);

        if (geocodingResponse.status !== "OK" || !geocodingResponse.results?.length) {
            throw new Error(ERROR_MESSAGES.ADRESS_NOT_FOUND);
        }

        const location = geocodingResponse.results[0].geometry.location;
        const formattedAddress = geocodingResponse.results[0].formatted_address;

        const solarResponse = await solar.getSolarPotential(location.lat, location.lng);

        if (!solarResponse.success) {
            throw new Error(ERROR_MESSAGES.SOLAR_FAILED);
        }

        const metrics = new SolarMetrics();
        const solarMetrics = metrics.getSolarMetrics(solarResponse, numPanels, payload.energyConsumptionKwh, payload.spentMoney);

        const responsePayload = {
            formattedAddress: formattedAddress,
            maxPanels: solarResponse.maxArrayPanelsCount,
            solarMetrics: solarMetrics
        }

        res.status(200).json(responsePayload);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;