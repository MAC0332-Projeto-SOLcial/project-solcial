// Mock do httpGet antes de importar o serviço
jest.mock('../http-get');
const httpGet = require('../http-get');

describe('SolarApiService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
    // Restaura o process.env original
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restaura o process.env original após todos os testes
    process.env = originalEnv;
  });

  describe('construtor', () => {
    it('deve inicializar com variáveis de ambiente configuradas', () => {
      // Arrange
      process.env.GCLOUD_API_KEY = 'test-api-key';
      process.env.GOOGLE_SOLAR_API_URL = 'https://solar.googleapis.com';

      // Act
      jest.isolateModules(() => {
        const service = require('../solarApiService');
        
        // Assert
        expect(service.apiKey).toBe('test-api-key');
        expect(service.baseUrl).toBe('https://solar.googleapis.com');
      });
    });

    it('deve lançar erro quando GCLOUD_API_KEY não está configurada', () => {
      // Arrange
      delete process.env.GCLOUD_API_KEY;
      process.env.GOOGLE_SOLAR_API_URL = 'https://solar.googleapis.com';

      // Act & Assert
      jest.isolateModules(() => {
        delete process.env.GCLOUD_API_KEY;
        expect(() => {
          require('../solarApiService');
        }).toThrow('GCLOUD_API_KEY não configurada');
      });
    });

    it('deve lançar erro quando GOOGLE_SOLAR_API_URL não está configurada', () => {
      // Arrange
      process.env.GCLOUD_API_KEY = 'test-api-key';
      delete process.env.GOOGLE_SOLAR_API_URL;

      // Act & Assert
      jest.isolateModules(() => {
        delete process.env.GOOGLE_SOLAR_API_URL;
        expect(() => {
          require('../solarApiService');
        }).toThrow('GOOGLE_SOLAR_API_URL não configurada');
      });
    });
  });

  describe('getSolarPotential', () => {
    let service;

    beforeEach(() => {
      process.env.GCLOUD_API_KEY = 'test-api-key';
      process.env.GOOGLE_SOLAR_API_URL = 'https://solar.googleapis.com';
      jest.isolateModules(() => {
        service = require('../solarApiService');
      });
    });

    describe('sucesso', () => {
      it('deve retornar dados de potencial solar quando a API responde com sucesso', async () => {
        // Arrange
        const latitude = -23.5505;
        const longitude = -46.6333;
        const mockResponse = {
          solarPotential: {
            maxArrayPanelsCount: 100,
            solarPanelConfigs: [
              {
                panelsCount: 50,
                yearlyEnergyDcKwh: 10000
              }
            ],
            maxSunshineHoursPerYear: 2500,
            carbonOffsetFactorKgPerMwh: 0.5
          }
        };

        httpGet.mockResolvedValue(mockResponse);

        // Act
        const result = await service.getSolarPotential(latitude, longitude);

        // Assert
        expect(result.success).toBe(true);
        expect(result.maxArrayPanelsCount).toBe(100);
        
        expect(result.carbonOffsetFactorKgPerMwh).toBe(0.5);
        expect(httpGet).toHaveBeenCalledTimes(1);
        expect(httpGet).toHaveBeenCalledWith(
          'https://solar.googleapis.com',
          '/buildingInsights:findClosest',
          {
            'location.latitude': latitude,
            'location.longitude': longitude,
            requiredQuality: 'HIGH',
            key: 'test-api-key'
          }
        );
      });

      it('deve retornar valores padrão quando campos estão ausentes na resposta', async () => {
        // Arrange
        const latitude = -23.5505;
        const longitude = -46.6333;
        const mockResponse = {
          solarPotential: {}
        };

        httpGet.mockResolvedValue(mockResponse);

        // Act
        const result = await service.getSolarPotential(latitude, longitude);

        // Assert
        expect(result.success).toBe(true);
        expect(result.maxArrayPanelsCount).toBe(0);
        //expect(result.solarPanelConfigs).toEqual([]);
        expect(result.maxSunshineHoursPerYear).toBe(0);
        expect(result.carbonOffsetFactorKgPerMwh).toBe(0);
      });

      it('deve chamar httpGet com os parâmetros corretos', async () => {
        // Arrange
        const latitude = -23.5505;
        const longitude = -46.6333;
        const mockResponse = {
          solarPotential: {
            maxArrayPanelsCount: 50
          }
        };

        httpGet.mockResolvedValue(mockResponse);

        // Act
        await service.getSolarPotential(latitude, longitude);

        // Assert
        expect(httpGet).toHaveBeenCalledWith(
          'https://solar.googleapis.com',
          '/buildingInsights:findClosest',
          {
            'location.latitude': latitude,
            'location.longitude': longitude,
            requiredQuality: 'HIGH',
            key: 'test-api-key'
          }
        );
      });
    });

    describe('erros', () => {
      it('deve retornar erro quando latitude não é fornecida', async () => {
        // Arrange
        const longitude = -46.6333;

        // Act
        const result = await service.getSolarPotential(null, longitude);

        // Assert
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Latitude e longitude são obrigatórios');
        expect(result.error.type).toBe('internal_error');
        expect(httpGet).not.toHaveBeenCalled();
      });

      it('deve retornar erro quando longitude não é fornecida', async () => {
        // Arrange
        const latitude = -23.5505;

        // Act
        const result = await service.getSolarPotential(latitude, null);

        // Assert
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Latitude e longitude são obrigatórios');
        expect(result.error.type).toBe('internal_error');
        expect(httpGet).not.toHaveBeenCalled();
      });

      it('deve retornar erro quando latitude e longitude não são fornecidas', async () => {
        // Act
        const result = await service.getSolarPotential(null, null);

        // Assert
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Latitude e longitude são obrigatórios');
        expect(httpGet).not.toHaveBeenCalled();
      });

      it('deve retornar erro quando a resposta não contém solarPotential', async () => {
        // Arrange
        const latitude = -23.5505;
        const longitude = -46.6333;
        const mockResponse = {};

        httpGet.mockResolvedValue(mockResponse);

        // Act
        const result = await service.getSolarPotential(latitude, longitude);

        // Assert
        expect(result.success).toBe(false);
        expect(result.error.message).toBe('Não foi possível obter os dados do potencial solar');
        expect(result.error.type).toBe('internal_error');
      });

      it('deve retornar erro quando httpGet lança uma exceção', async () => {
        // Arrange
        const latitude = -23.5505;
        const longitude = -46.6333;
        const errorMessage = 'Erro na requisição: 500 - Internal Server Error';

        httpGet.mockRejectedValue(new Error(errorMessage));

        // Act
        const result = await service.getSolarPotential(latitude, longitude);

        // Assert
        expect(result.success).toBe(false);
        expect(result.error.message).toBe(errorMessage);
        expect(result.error.type).toBe('internal_error');
      });
    });
  });
});
