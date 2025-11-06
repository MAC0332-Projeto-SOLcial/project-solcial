/**
 * Cliente JavaScript para consumir a API Solar
 * Pode ser usado no frontend (React, Vue, etc.) ou em Node.js
 */

class SolarApiClient {
  /**
   * @param {string} baseUrl - URL base da API (ex: http://localhost:3001)
   */
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  /**
   * Faz uma requisição HTTP
   * @private
   */
  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error(`Erro na requisição para ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Verifica o status da API
   * @returns {Promise<Object>}
   */
  async healthCheck() {
    return this._request('/health');
  }

  /**
   * Busca insights de edificação para um local
   * @param {number} latitude - Latitude do local
   * @param {number} longitude - Longitude do local
   * @param {string} requiredQuality - Qualidade requerida (LOW, MEDIUM, HIGH)
   * @returns {Promise<Object>}
   */
  async getBuildingInsights(latitude, longitude, requiredQuality = 'HIGH') {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      requiredQuality
    });

    return this._request(`/api/solar/building-insights?${params}`);
  }

  /**
   * Busca insights de edificação (via POST)
   * @param {Object} location - Objeto com latitude, longitude e qualidade
   * @returns {Promise<Object>}
   */
  async postBuildingInsights({ latitude, longitude, requiredQuality = 'HIGH' }) {
    return this._request('/api/solar/building-insights', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude, requiredQuality })
    });
  }

  /**
   * Busca camadas de dados solares
   * @param {number} latitude - Latitude do local
   * @param {number} longitude - Longitude do local
   * @param {number} radiusMeters - Raio em metros
   * @param {string} requiredQuality - Qualidade requerida
   * @returns {Promise<Object>}
   */
  async getDataLayers(latitude, longitude, radiusMeters = 50, requiredQuality = 'HIGH') {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radiusMeters: radiusMeters.toString(),
      requiredQuality
    });

    return this._request(`/api/solar/data-layers?${params}`);
  }

  /**
   * Obtém análise solar simplificada de um local
   * @param {number} latitude - Latitude do local
   * @param {number} longitude - Longitude do local
   * @returns {Promise<Object>}
   */
  async analyzeSolarPotential(latitude, longitude) {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString()
    });

    return this._request(`/api/solar/analysis?${params}`);
  }

  /**
   * Obtém análise solar para múltiplos locais
   * @param {Array<{latitude: number, longitude: number}>} locations
   * @returns {Promise<Array<Object>>}
   */
  async analyzeMultipleLocations(locations) {
    const promises = locations.map(loc => 
      this.analyzeSolarPotential(loc.latitude, loc.longitude)
        .catch(error => ({
          success: false,
          error: error.message,
          location: loc
        }))
    );

    return Promise.all(promises);
  }
}

// Exporta para uso em Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SolarApiClient;
}

// Exporta para uso no navegador
if (typeof window !== 'undefined') {
  window.SolarApiClient = SolarApiClient;
}

// ============================================================================
// EXEMPLOS DE USO
// ============================================================================

/**
 * Exemplo 1: Uso básico
 */
async function example1_BasicUsage() {
  const client = new SolarApiClient('http://localhost:3001');

  try {
    // Verifica se a API está online
    const health = await client.healthCheck();
    console.log('API Status:', health);

    // Analisa potencial solar de um local
    const analysis = await client.analyzeSolarPotential(37.4220, -122.0841);
    
    if (analysis.success) {
      console.log('Localização:', analysis.location);
      console.log('Potencial Solar:', analysis.solarPotential);
      console.log('Máximo de painéis:', analysis.solarPotential.maxArrayPanelsCount);
    }
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

/**
 * Exemplo 2: Buscar insights detalhados
 */
async function example2_DetailedInsights() {
  const client = new SolarApiClient('http://localhost:3001');

  try {
    const insights = await client.getBuildingInsights(37.4220, -122.0841, 'HIGH');
    
    if (insights.success) {
      const solar = insights.data.solarPotential;
      
      console.log('📊 Insights Solares Detalhados:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`☀️ Horas de sol/ano: ${solar.maxSunshineHoursPerYear}`);
      console.log(`🔋 Painéis máximos: ${solar.maxArrayPanelsCount}`);
      console.log(`📏 Área disponível: ${solar.maxArrayAreaMeters2} m²`);
      console.log(`🌱 Compensação CO2: ${solar.carbonOffsetFactorKgPerMwh} kg/MWh`);
      
      if (solar.financialAnalyses && solar.financialAnalyses.length > 0) {
        console.log('\n💰 Análise Financeira:');
        solar.financialAnalyses.forEach((analysis, index) => {
          console.log(`\nOpção ${index + 1}:`);
          console.log(`  - Painéis: ${analysis.panelCount || analysis.panelsCount}`);
          console.log(`  - Custo estimado: $${analysis.estimatedCost || 'N/A'}`);
          console.log(`  - Economia anual: $${analysis.annualSavings || 'N/A'}`);
        });
      }
    }
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

/**
 * Exemplo 3: Comparar múltiplos locais
 */
async function example3_CompareLocations() {
  const client = new SolarApiClient('http://localhost:3001');

  const locations = [
    { name: 'Googleplex', latitude: 37.4220, longitude: -122.0841 },
    { name: 'São Paulo', latitude: -23.5505, longitude: -46.6333 },
    { name: 'Nova York', latitude: 40.7128, longitude: -74.0060 }
  ];

  console.log('🌍 Comparando Potencial Solar de Diferentes Locais\n');

  for (const location of locations) {
    try {
      const analysis = await client.analyzeSolarPotential(
        location.latitude,
        location.longitude
      );

      if (analysis.success) {
        console.log(`📍 ${location.name}`);
        console.log(`   Painéis máximos: ${analysis.solarPotential.maxArrayPanelsCount}`);
        console.log(`   Horas de sol/ano: ${analysis.solarPotential.maxSunshineHoursPerYear}`);
        console.log(`   Área disponível: ${analysis.solarPotential.maxArrayAreaMeters2} m²\n`);
      }
    } catch (error) {
      console.log(`📍 ${location.name}: Dados não disponíveis\n`);
    }

    // Delay para não sobrecarregar a API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

/**
 * Exemplo 4: Uso em React Component
 */
const example4_ReactComponent = `
import React, { useState } from 'react';
import SolarApiClient from './solarApiClient';

function SolarAnalysis() {
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const client = new SolarApiClient('http://localhost:3001');

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await client.analyzeSolarPotential(
        parseFloat(location.lat),
        parseFloat(location.lng)
      );

      if (result.success) {
        setAnalysis(result);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solar-analysis">
      <h2>Análise de Potencial Solar</h2>
      
      <div className="input-group">
        <input
          type="number"
          placeholder="Latitude"
          value={location.lat}
          onChange={(e) => setLocation({ ...location, lat: e.target.value })}
        />
        <input
          type="number"
          placeholder="Longitude"
          value={location.lng}
          onChange={(e) => setLocation({ ...location, lng: e.target.value })}
        />
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analisando...' : 'Analisar'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {analysis && (
        <div className="results">
          <h3>Resultados:</h3>
          <p><strong>Endereço:</strong> {analysis.location.address}</p>
          <p><strong>Painéis máximos:</strong> {analysis.solarPotential.maxArrayPanelsCount}</p>
          <p><strong>Área disponível:</strong> {analysis.solarPotential.maxArrayAreaMeters2} m²</p>
          <p><strong>Horas de sol/ano:</strong> {analysis.solarPotential.maxSunshineHoursPerYear}</p>
        </div>
      )}
    </div>
  );
}

export default SolarAnalysis;
`;

/**
 * Exemplo 5: Uso em aplicação Vue.js
 */
const example5_VueComponent = `
<template>
  <div class="solar-analysis">
    <h2>Análise de Potencial Solar</h2>
    
    <div class="input-group">
      <input v-model.number="latitude" type="number" placeholder="Latitude" />
      <input v-model.number="longitude" type="number" placeholder="Longitude" />
      <button @click="analyze" :disabled="loading">
        {{ loading ? 'Analisando...' : 'Analisar' }}
      </button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="analysis" class="results">
      <h3>Resultados:</h3>
      <p><strong>Endereço:</strong> {{ analysis.location.address }}</p>
      <p><strong>Painéis máximos:</strong> {{ analysis.solarPotential.maxArrayPanelsCount }}</p>
      <p><strong>Área disponível:</strong> {{ analysis.solarPotential.maxArrayAreaMeters2 }} m²</p>
      <p><strong>Horas de sol/ano:</strong> {{ analysis.solarPotential.maxSunshineHoursPerYear }}</p>
    </div>
  </div>
</template>

<script>
import SolarApiClient from './solarApiClient';

export default {
  name: 'SolarAnalysis',
  data() {
    return {
      latitude: null,
      longitude: null,
      analysis: null,
      loading: false,
      error: null,
      client: new SolarApiClient('http://localhost:3001')
    };
  },
  methods: {
    async analyze() {
      this.loading = true;
      this.error = null;

      try {
        const result = await this.client.analyzeSolarPotential(
          this.latitude,
          this.longitude
        );

        if (result.success) {
          this.analysis = result;
        } else {
          this.error = result.error.message;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
`;

// Descomente para executar os exemplos
// example1_BasicUsage();
// example2_DetailedInsights();
// example3_CompareLocations();
