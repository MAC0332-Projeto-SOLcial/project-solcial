const https = require('https');

/**
 * Faz uma requisição HTTP GET com query params
 * @param {string} baseUrl - URL base (ex: 'maps.googleapis.com')
 * @param {string} path - Caminho da API (ex: '/maps/api/geocode/json')
 * @param {Object} queryParams - Objeto com os parâmetros de query
 * @returns {Promise<Object>} - Resposta da API parseada como JSON
 */
function httpGet(baseUrl, path, queryParams = {}) {
  return new Promise((resolve, reject) => {
    // Constrói a query string a partir do objeto de parâmetros
    const queryString = Object.keys(queryParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');
    
    // Monta a URL completa
    const url = `${path}?${queryString}`;
    
    const options = {
      hostname: baseUrl,
      path: url,
      method: 'GET'
    };

    const req = https.get(options, (res) => {
      let data = '';

      // Acumula os dados recebidos
      res.on('data', (chunk) => {
        data += chunk;
      });

      // Quando termina de receber os dados
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Erro ao parsear resposta: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Erro na requisição: ${error.message}`));
    });

    req.end();
  });
}

module.exports = httpGet;
