const axios = require('axios');

/**
 * Serviço para integração com Google Solar API
 * @see https://developers.google.com/maps/documentation/solar
 */
class SolarApiService {
  constructor() {
    this.apiKey = process.env.GOOGLE_SOLAR_API_KEY;
    this.baseUrl = process.env.GOOGLE_SOLAR_API_URL || 'https://solar.googleapis.com/v1';
    
    if (!this.apiKey) {
      console.warn('⚠️ GOOGLE_SOLAR_API_KEY não configurada no .env');
    }
  }

  /**
   * Busca informações de insights solares para um local específico
   * @param {Object} params - Parâmetros da requisição
   * @param {number} params.latitude - Latitude do local
   * @param {number} params.longitude - Longitude do local
   * @param {string} params.requiredQuality - Qualidade requerida (LOW, MEDIUM, HIGH)
   * @returns {Promise<Object>} Dados de insights solares
   */
  async findClosestBuildingInsights({ latitude, longitude, requiredQuality = 'HIGH' }) {
    try {
      // Validação dos parâmetros
      if (!latitude || !longitude) {
        throw new Error('Latitude e longitude são obrigatórios');
      }

      if (!this.apiKey) {
        throw new Error('Google Solar API Key não configurada');
      }

      // Validação da qualidade
      const validQualities = ['LOW', 'MEDIUM', 'HIGH'];
      if (!validQualities.includes(requiredQuality.toUpperCase())) {
        throw new Error(`Qualidade inválida. Use: ${validQualities.join(', ')}`);
      }

      const url = `${this.baseUrl}/buildingInsights:findClosest`;
      
      const params = {
        'location.latitude': latitude,
        'location.longitude': longitude,
        requiredQuality: requiredQuality.toUpperCase(),
        key: this.apiKey
      };

      console.log(`🌞 Buscando insights solares para: lat=${latitude}, lng=${longitude}`);
      const response = await axios.get(url, { params });

      const insights = response.data;
      
      // Processa e estrutura os dados de forma mais amigável
      const analysis = {
        success: true,
        location: {
          latitude,
          longitude,
          address: insights.name || 'Endereço não disponível'
        },
        solarPotential: {
          maxArrayPanelsCount: insights.solarPotential?.maxArrayPanelsCount || 0,
          maxArrayAreaMeters2: insights.solarPotential?.maxArrayAreaMeters2 || 0,
          maxSunshineHoursPerYear: insights.solarPotential?.maxSunshineHoursPerYear || 0,
          carbonOffsetFactorKgPerMwh: insights.solarPotential?.carbonOffsetFactorKgPerMwh || 0
        },
        financialAnalyses: insights.solarPotential?.financialAnalyses || [],
        roofSegmentStats: insights.solarPotential?.roofSegmentStats || [],
        solarPanelConfigs: insights.solarPotential?.solarPanelConfigs || [],
        buildingStats: {
          areaMeters2: insights.boundingBox?.sw && insights.boundingBox?.ne ? 
            this.calculateArea(insights.boundingBox) : 0,
          center: insights.center,
          imageryDate: insights.imageryDate,
          imageryQuality: insights.imageryQuality
        },
        timestamp: new Date().toISOString()
      };

      return analysis;

    } catch (error) {
      console.error('❌ Erro ao analisar potencial solar:', error.message);
      return {
        success: false,
        error: {
          message: error.message,
          type: 'analysis_error'
        }
      };
    }
  }

    

  /**
   * Busca dados de camadas de dados solares (Data Layers)
   * @param {Object} params - Parâmetros da requisição
   * @param {number} params.latitude - Latitude do local
   * @param {number} params.longitude - Longitude do local
   * @param {number} params.radiusMeters - Raio em metros
   * @param {string} params.requiredQuality - Qualidade requerida
   * @returns {Promise<Object>} Dados de camadas solares
   */
  async getDataLayers({ latitude, longitude, radiusMeters = 50, requiredQuality = 'HIGH' }) {
    try {
      if (!latitude || !longitude) {
        throw new Error('Latitude e longitude são obrigatórios');
      }

      if (!this.apiKey) {
        throw new Error('Google Solar API Key não configurada');
      }

      const url = `${this.baseUrl}/dataLayers:get`;
      
      const params = {
        'location.latitude': latitude,
        'location.longitude': longitude,
        radiusMeters,
        requiredQuality: requiredQuality.toUpperCase(),
        key: this.apiKey
      };

      console.log(`🌞 Buscando camadas de dados solares para: lat=${latitude}, lng=${longitude}`);
      
      const response = await axios.get(url, { params });

      const insights = response.data;
      
      // Processa e estrutura os dados de forma mais amigável
      const analysis = {
        success: true,
        location: {
          latitude,
          longitude,
          address: insights.name || 'Endereço não disponível'
        },
        solarPotential: {
          maxArrayPanelsCount: insights.solarPotential?.maxArrayPanelsCount || 0,
          maxArrayAreaMeters2: insights.solarPotential?.maxArrayAreaMeters2 || 0,
          maxSunshineHoursPerYear: insights.solarPotential?.maxSunshineHoursPerYear || 0,
          carbonOffsetFactorKgPerMwh: insights.solarPotential?.carbonOffsetFactorKgPerMwh || 0
        },
        financialAnalyses: insights.solarPotential?.financialAnalyses || [],
        roofSegmentStats: insights.solarPotential?.roofSegmentStats || [],
        solarPanelConfigs: insights.solarPotential?.solarPanelConfigs || [],
        buildingStats: {
          areaMeters2: insights.boundingBox?.sw && insights.boundingBox?.ne ? 
            this.calculateArea(insights.boundingBox) : 0,
          center: insights.center,
          imageryDate: insights.imageryDate,
          imageryQuality: insights.imageryQuality
        },
        timestamp: new Date().toISOString()
      };

      return analysis;

    } catch (error) {
      console.error('❌ Erro ao buscar camadas de dados:', error.message);
      
      if (error.response) {
        return {
          success: false,
          error: {
            message: error.response.data?.error?.message || 'Erro na API Solar',
            status: error.response.status,
            code: error.response.data?.error?.code
          }
        };
      }

      return {
        success: false,
        error: {
          message: error.message,
          type: 'internal_error'
        }
      };
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
