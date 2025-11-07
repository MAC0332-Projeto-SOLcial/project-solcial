const axios = require('axios');

/**
 * Faz uma requisição HTTP GET com query params usando axios
 * @param {string} baseUrl - URL base (ex: 'https://maps.googleapis.com')
 * @param {string} path - Caminho da API (ex: '/maps/api/geocode/json')
 * @param {Object} queryParams - Objeto com os parâmetros de query
 * @returns {Promise<Object>} - Resposta da API parseada como JSON
 */
async function httpGet(baseUrl, path, queryParams = {}) {
  try {
    // Monta a URL completa
    const url = `${baseUrl}${path}`;
    
    // Faz a requisição GET com axios
    const response = await axios.get(url, {
      params: queryParams
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // A requisição foi feita e o servidor respondeu com um status de erro
      throw new Error(`Erro na requisição: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      throw new Error(`Erro na requisição: Sem resposta do servidor`);
    } else {
      // Algo aconteceu na configuração da requisição
      throw new Error(`Erro na requisição: ${error.message}`);
    }
  }
}

module.exports = httpGet;
