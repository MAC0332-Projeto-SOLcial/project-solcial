const httpGet = require('../http-get');

// Mock do httpGet
jest.mock('../http-get');

// Mock do dotenv para evitar que carregue variáveis do arquivo .env
jest.mock('dotenv', () => ({
  config: jest.fn(() => ({})),
}));

describe('Geocoding', () => {
  const originalEnv = process.env;
  let geocoding;

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

  describe('sucesso', () => {
    beforeEach(() => {
      process.env.GCLOUD_API_KEY = 'test-api-key';
      process.env.GOOGLE_GEOCODING_API_URL = 'https://maps.googleapis.com';
      jest.isolateModules(() => {
        geocoding = require('../geocoding');
      });
    });

    it('deve retornar dados de geocoding quando a API responde com sucesso', async () => {
      // Arrange
      const mockAddress = 'rua do matao 1010';
      const mockResponse = {
        results: [
          {
            formatted_address: 'Rua do Matão, 1010, São Paulo - SP, Brasil',
            geometry: {
              location: {
                lat: -23.5505,
                lng: -46.6333
              }
            }
          }
        ],
        status: 'OK'
      };

      httpGet.mockResolvedValue(mockResponse);

      // Act
      const result = await geocoding.getCoordinates(mockAddress);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(httpGet).toHaveBeenCalledTimes(1);
      expect(httpGet).toHaveBeenCalledWith(
        'https://maps.googleapis.com',
        '/maps/api/geocode/json',
        {
          address: mockAddress,
          key: 'test-api-key'
        }
      );
    });

    it('deve chamar httpGet com os parâmetros corretos', async () => {
      // Arrange
      const mockAddress = 'São Paulo, SP';
      const mockResponse = { status: 'OK', results: [] };

      httpGet.mockResolvedValue(mockResponse);

      // Act
      await geocoding.getCoordinates(mockAddress);

      // Assert
      expect(httpGet).toHaveBeenCalledWith(
        'https://maps.googleapis.com',
        '/maps/api/geocode/json',
        {
          address: mockAddress,
          key: 'test-api-key'
        }
      );
    });

    it('deve lançar erro quando endereço não é fornecido', async () => {
      // Act & Assert
      await expect(geocoding.getCoordinates(null)).rejects.toThrow(
        'Endereço é obrigatório'
      );
      expect(httpGet).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando endereço está vazio', async () => {
      // Act & Assert
      await expect(geocoding.getCoordinates('')).rejects.toThrow(
        'Endereço é obrigatório'
      );
      expect(httpGet).not.toHaveBeenCalled();
    });
  });

  describe('erros de inicialização', () => {
    it('deve lançar erro quando GCLOUD_API_KEY não está definida', () => {
      // Arrange
      delete process.env.GCLOUD_API_KEY;
      process.env.GOOGLE_GEOCODING_API_URL = 'https://maps.googleapis.com';

      // Act & Assert
      jest.isolateModules(() => {
        delete process.env.GCLOUD_API_KEY;
        expect(() => {
          require('../geocoding');
        }).toThrow('GCLOUD_API_KEY não configurada');
      });
    });

    it('deve lançar erro quando GOOGLE_GEOCODING_API_URL não está definida', () => {
      // Arrange
      process.env.GCLOUD_API_KEY = 'test-api-key';
      delete process.env.GOOGLE_GEOCODING_API_URL;

      // Act & Assert
      jest.isolateModules(() => {
        delete process.env.GOOGLE_GEOCODING_API_URL;
        expect(() => {
          require('../geocoding');
        }).toThrow('GOOGLE_GEOCODING_API_URL não configurada');
      });
    });

    it('deve lançar erro quando ambas as variáveis não estão definidas', () => {
      // Arrange
      delete process.env.GCLOUD_API_KEY;
      delete process.env.GOOGLE_GEOCODING_API_URL;

      // Act & Assert
      jest.isolateModules(() => {
        delete process.env.GCLOUD_API_KEY;
        delete process.env.GOOGLE_GEOCODING_API_URL;
        expect(() => {
          require('../geocoding');
        }).toThrow('GCLOUD_API_KEY não configurada');
      });
    });
  });
});

