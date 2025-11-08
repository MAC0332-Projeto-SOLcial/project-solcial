const httpGet = require('./http-get');
require('dotenv').config();

/**
 * Exemplo: Geocoding do Google Maps
 * @param {string} address - Endereço para geocodificar
 * @returns {Promise<Object>} - Resposta da API do Google Maps
 */
async function geocoding(address) {
    const baseUrl = 'https://maps.googleapis.com';
    const path = '/maps/api/geocode/json';
    const apiKey = process.env.GCLOUD_API_KEY;
    
    if (!apiKey) {
        throw new Error('GCLOUD_API_KEY não encontrada nas variáveis de ambiente');
    }
    
    const queryParams = {
        address: address,
        key: apiKey
    };
    
    return await httpGet(baseUrl, path, queryParams);
}

module.exports = { geocoding };
