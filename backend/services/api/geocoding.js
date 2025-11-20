const httpGet = require('./http-get');
require('dotenv').config();

class Geocoding {
    constructor() {
        this.baseUrl = process.env.GOOGLE_GEOCODING_API_URL;
        this.apiKey = process.env.GCLOUD_API_KEY;

        if (!this.apiKey) {
            throw new Error('GCLOUD_API_KEY não configurada');
        }
        if (!this.baseUrl) {
            throw new Error('GOOGLE_GEOCODING_API_URL não configurada');
        }
    }

    /**
     * Busca as coordenadas geográficas de um endereço
     * @param {string} address - Endereço para geocodificar
     * @returns {Promise<Object>} - Resposta da API do Google Maps
     */
    async getCoordinates(address) {
        // Validação dos parâmetros
        if (!address) {
            throw new Error('Endereço é obrigatório');
        }

        const path = '/maps/api/geocode/json';
        
        const params = {
            address: address,
            key: this.apiKey
        };
        
        return await httpGet(this.baseUrl, path, params);
    }
}

module.exports = new Geocoding();
