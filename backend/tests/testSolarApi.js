/**
 * Script de teste para a integração com Google Solar API
 * Execute com: node tests/testSolarApi.js
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
};

// Coordenadas de exemplo (Googleplex, Mountain View, CA)
const testLocation = {
  latitude: 37.4220,
  longitude: -122.0841,
  name: 'Googleplex, Mountain View'
};

// Coordenadas alternativas (pode usar qualquer local)
const testLocations = [
  { latitude: 37.4220, longitude: -122.0841, name: 'Googleplex, Mountain View, CA' },
  { latitude: -23.5505, longitude: -46.6333, name: 'São Paulo, Brasil' },
  { latitude: 40.7128, longitude: -74.0060, name: 'Nova York, EUA' }
];

/**
 * Testa o health check
 */
async function testHealthCheck() {
  console.log('\n' + '='.repeat(60));
  log.info('Testando Health Check...');
  console.log('='.repeat(60));
  
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    log.success('Health check OK');
    console.log(JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    log.error(`Falha no health check: ${error.message}`);
    return false;
  }
}

/**
 * Testa o endpoint de building insights via GET
 */
async function testBuildingInsightsGET() {
  console.log('\n' + '='.repeat(60));
  log.info(`Testando Building Insights (GET) - ${testLocation.name}`);
  console.log('='.repeat(60));
  
  try {
    const url = `${BASE_URL}/api/solar/building-insights`;
    const params = {
      latitude: testLocation.latitude,
      longitude: testLocation.longitude,
      requiredQuality: 'HIGH'
    };
    
    log.info(`Fazendo requisição para: ${url}`);
    console.log('Parâmetros:', params);
    
    const response = await axios.get(url, { params });
    
    if (response.data.success) {
      log.success('Building Insights obtido com sucesso!');
      
      const data = response.data.data;
      console.log('\nResumo dos dados:');
      console.log('- Nome:', data.name || 'N/A');
      console.log('- Centro:', data.center);
      console.log('- Data da Imagem:', data.imageryDate);
      console.log('- Qualidade:', data.imageryQuality);
      
      if (data.solarPotential) {
        console.log('\nPotencial Solar:');
        console.log('- Máx. Painéis:', data.solarPotential.maxArrayPanelsCount);
        console.log('- Área Máx. (m²):', data.solarPotential.maxArrayAreaMeters2);
        console.log('- Horas de Sol/Ano:', data.solarPotential.maxSunshineHoursPerYear);
        console.log('- Compensação CO2:', data.solarPotential.carbonOffsetFactorKgPerMwh);
      }
      
      return true;
    } else {
      log.error('Resposta indica falha');
      console.log(response.data);
      return false;
    }
  } catch (error) {
    log.error(`Erro ao buscar building insights: ${error.message}`);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados:', error.response.data);
    }
    return false;
  }
}

/**
 * Testa o endpoint de building insights via POST
 */
async function testBuildingInsightsPOST() {
  console.log('\n' + '='.repeat(60));
  log.info(`Testando Building Insights (POST) - ${testLocation.name}`);
  console.log('='.repeat(60));
  
  try {
    const url = `${BASE_URL}/api/solar/building-insights`;
    const body = {
      latitude: testLocation.latitude,
      longitude: testLocation.longitude,
      requiredQuality: 'HIGH'
    };
    
    log.info(`Fazendo requisição POST para: ${url}`);
    console.log('Body:', body);
    
    const response = await axios.post(url, body);
    
    if (response.data.success) {
      log.success('Building Insights (POST) obtido com sucesso!');
      return true;
    } else {
      log.error('Resposta indica falha');
      console.log(response.data);
      return false;
    }
  } catch (error) {
    log.error(`Erro ao buscar building insights (POST): ${error.message}`);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados:', error.response.data);
    }
    return false;
  }
}

/**
 * Testa o endpoint de análise solar
 */
async function testSolarAnalysis() {
  console.log('\n' + '='.repeat(60));
  log.info(`Testando Solar Analysis - ${testLocation.name}`);
  console.log('='.repeat(60));
  
  try {
    const url = `${BASE_URL}/api/solar/analysis`;
    const params = {
      latitude: testLocation.latitude,
      longitude: testLocation.longitude
    };
    
    log.info(`Fazendo requisição para: ${url}`);
    console.log('Parâmetros:', params);
    
    const response = await axios.get(url, { params });
    
    if (response.data.success) {
      log.success('Análise Solar obtida com sucesso!');
      
      const data = response.data;
      console.log('\n📍 Localização:');
      console.log(JSON.stringify(data.location, null, 2));
      
      console.log('\n☀️ Potencial Solar:');
      console.log(JSON.stringify(data.solarPotential, null, 2));
      
      console.log('\n🏢 Estatísticas do Edifício:');
      console.log(JSON.stringify(data.buildingStats, null, 2));
      
      if (data.financialAnalyses && data.financialAnalyses.length > 0) {
        console.log('\n💰 Análises Financeiras Disponíveis:', data.financialAnalyses.length);
      }
      
      if (data.solarPanelConfigs && data.solarPanelConfigs.length > 0) {
        console.log('🔧 Configurações de Painéis Disponíveis:', data.solarPanelConfigs.length);
      }
      
      return true;
    } else {
      log.error('Resposta indica falha');
      console.log(response.data);
      return false;
    }
  } catch (error) {
    log.error(`Erro ao buscar análise solar: ${error.message}`);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados:', error.response.data);
    }
    return false;
  }
}

/**
 * Testa o endpoint de data layers
 */
async function testDataLayers() {
  console.log('\n' + '='.repeat(60));
  log.info(`Testando Data Layers - ${testLocation.name}`);
  console.log('='.repeat(60));
  
  try {
    const url = `${BASE_URL}/api/solar/data-layers`;
    const params = {
      latitude: testLocation.latitude,
      longitude: testLocation.longitude,
      radiusMeters: 50,
      requiredQuality: 'HIGH'
    };
    
    log.info(`Fazendo requisição para: ${url}`);
    console.log('Parâmetros:', params);
    
    const response = await axios.get(url, { params });
    
    if (response.data.success) {
      log.success('Data Layers obtidas com sucesso!');
      console.log('\nResumo:');
      console.log(JSON.stringify(response.data.requestInfo, null, 2));
      return true;
    } else {
      log.error('Resposta indica falha');
      console.log(response.data);
      return false;
    }
  } catch (error) {
    log.error(`Erro ao buscar data layers: ${error.message}`);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados:', error.response.data);
    }
    return false;
  }
}

/**
 * Testa validação de parâmetros
 */
async function testValidation() {
  console.log('\n' + '='.repeat(60));
  log.info('Testando Validação de Parâmetros');
  console.log('='.repeat(60));
  
  try {
    // Tenta fazer requisição sem latitude/longitude
    const url = `${BASE_URL}/api/solar/analysis`;
    const response = await axios.get(url);
    
    log.error('Validação falhou - deveria retornar erro 400');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      log.success('Validação funcionando corretamente (erro 400 esperado)');
      console.log('Mensagem:', error.response.data.error.message);
      return true;
    } else {
      log.error(`Erro inesperado: ${error.message}`);
      return false;
    }
  }
}

/**
 * Testa múltiplas localizações
 */
async function testMultipleLocations() {
  console.log('\n' + '='.repeat(60));
  log.info('Testando Múltiplas Localizações');
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const location of testLocations) {
    console.log(`\n📍 Testando: ${location.name}`);
    
    try {
      const response = await axios.get(`${BASE_URL}/api/solar/analysis`, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      });
      
      if (response.data.success) {
        log.success(`${location.name}: OK`);
        results.push({ location: location.name, success: true });
      } else {
        log.warning(`${location.name}: Dados não disponíveis`);
        results.push({ location: location.name, success: false });
      }
    } catch (error) {
      log.error(`${location.name}: Erro - ${error.message}`);
      results.push({ location: location.name, success: false, error: error.message });
    }
    
    // Pequeno delay entre requisições
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Resumo dos Testes:');
  results.forEach(r => {
    console.log(`  - ${r.location}: ${r.success ? '✓' : '✗'}`);
  });
  
  return results;
}

/**
 * Executa todos os testes
 */
async function runAllTests() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         🧪 TESTES DA INTEGRAÇÃO GOOGLE SOLAR API          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const results = {
    healthCheck: false,
    buildingInsightsGET: false,
    buildingInsightsPOST: false,
    solarAnalysis: false,
    dataLayers: false,
    validation: false
  };
  
  // Verifica se o servidor está rodando
  results.healthCheck = await testHealthCheck();
  
  if (!results.healthCheck) {
    log.error('\nServidor não está respondendo! Certifique-se de que o servidor está rodando.');
    log.info('Execute: npm start');
    return;
  }
  
  // Executa os testes
  results.buildingInsightsGET = await testBuildingInsightsGET();
  results.buildingInsightsPOST = await testBuildingInsightsPOST();
  results.solarAnalysis = await testSolarAnalysis();
  results.dataLayers = await testDataLayers();
  results.validation = await testValidation();
  
  // Testa múltiplas localizações (opcional)
  // await testMultipleLocations();
  
  // Resumo final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DOS TESTES');
  console.log('='.repeat(60));
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? `${colors.green}✓ PASSOU${colors.reset}` : `${colors.red}✗ FALHOU${colors.reset}`;
    console.log(`${test.padEnd(30)}: ${status}`);
  });
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r).length;
  
  console.log('\n' + '='.repeat(60));
  console.log(`Resultado: ${passedTests}/${totalTests} testes passaram`);
  console.log('='.repeat(60) + '\n');
}

// Executa os testes
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = {
  testHealthCheck,
  testBuildingInsightsGET,
  testBuildingInsightsPOST,
  testSolarAnalysis,
  testDataLayers,
  testValidation,
  testMultipleLocations
};
