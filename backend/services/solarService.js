const axios = require('axios');

class SolarService {
  constructor() {
    this.apiKey = process.env.GOOGLE_SOLAR_API_KEY;
    this.baseUrl = 'https://solar.googleapis.com/v1';
    
    if (!this.apiKey) {
      throw new Error('GOOGLE_SOLAR_API_KEY não encontrada nas variáveis de ambiente');
    }
  }

  async getSolarData(address) {
    try {
      const buildingInsights = await this.getBuildingInsights(address);
      const solarData = await this.getSolarIrradiance(address);
      
      return {
        success: true,
        address: address,
        buildingInsights: buildingInsights,
        solarIrradiance: solarData,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      throw new Error(`Falha ao obter dados solares: ${error.message}`);
    }
  }

  async getBuildingInsights(address) {
    try {
      const url = `${this.baseUrl}/buildingInsights:findClosest`;
      const params = {
        location: {
          address: address
        }
      };

      const response = await axios.post(url, params, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          key: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSolarIrradiance(address) {
    try {
      const url = `${this.baseUrl}/solarIrradiance:get`;
      const params = {
        location: {
          address: address
        }
      };

      const response = await axios.post(url, params, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          key: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  validateAddress(address) {
    if (!address || typeof address !== 'string') {
      return false;
    }
    
    const addressRegex = /^[a-zA-Z0-9\s,.-áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]+$/;
    return addressRegex.test(address.trim()) && address.trim().length > 5;
  }
}

module.exports = SolarService;