const httpGet = require('./http-get');

/**
 * Serviço para integração com Google Solar API
 * @see https://developers.google.com/maps/documentation/solar
 */
class SolarApiService {
  constructor() {
    this.apiKey = process.env.GCLOUD_API_KEY;
    this.baseUrl = process.env.GOOGLE_SOLAR_API_URL;
    
    if (!this.apiKey) {
      throw new Error('GCLOUD_API_KEY não configurada');
    }
    if (!this.baseUrl) {
      throw new Error('GOOGLE_SOLAR_API_URL não configurada');
    }
  }

  /**
   * Busca informações de insights solares para um local específico
   * @param {number} latitude - Latitude do local
   * @param {number} longitude - Longitude do local
   * @returns {Promise<Object>} Dados de insights solares
   */
  async getSolarPotential(latitude, longitude) {
    try {
      // Validação dos parâmetros
      if (!latitude || !longitude) {
        throw new Error('Latitude e longitude são obrigatórios');
      }

      const path = '/buildingInsights:findClosest';
      
      const params = {
        'location.latitude': latitude,
        'location.longitude': longitude,
        requiredQuality: 'HIGH',
        key: this.apiKey
      };

      const response = await httpGet(this.baseUrl, path, params);

      const solarPotential = response.solarPotential;

      if (!solarPotential) {
        throw new Error('Não foi possível obter os dados do potencial solar');
      }

      // Processa e estrutura os dados de forma mais amigável
      return {
        success: true,
        maxArrayPanelsCount: solarPotential.maxArrayPanelsCount || 0,
        solarPanels: solarPotential.solarPanels || [],
        maxSunshineHoursPerYear: solarPotential.maxSunshineHoursPerYear || 0,
        carbonOffsetFactorKgPerMwh: solarPotential.carbonOffsetFactorKgPerMwh || 0,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          type: 'internal_error'
        }
      }
    }
  }

  /**
   * Calcula a área aproximada de um bounding box
   * @param {Object} boundingBox - Bounding box com sw e ne
   * @returns {number} Área em metros quadrados
   */
  calculateArea(boundingBox) {
    // Cálculo simplificado - para precisão, usar bibliotecas geoespaciais
    const { sw, ne } = boundingBox;
    if (!sw || !ne) return 0;
    
    const latDiff = Math.abs(ne.latitude - sw.latitude);
    const lngDiff = Math.abs(ne.longitude - sw.longitude);
    
    // Aproximação: 111000 metros por grau
    return latDiff * lngDiff * 111000 * 111000;
  }
}

module.exports = new SolarApiService();
