const { geocoding } = require('../geocoding');
const httpGet = require('../http-get');

// Mock do httpGet
jest.mock('../http-get');

describe('geocoding', () => {
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

  describe('sucesso', () => {
    it('deve retornar dados de geocoding quando a API responde com sucesso', async () => {
      // Arrange
      const mockAddress = 'rua do matao 1010';
      const mockApiKey = 'test-api-key';
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

      process.env.GCLOUD_API_KEY = mockApiKey;
      httpGet.mockResolvedValue(mockResponse);

      // Act
      const result = await geocoding(mockAddress);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(httpGet).toHaveBeenCalledTimes(1);
      expect(httpGet).toHaveBeenCalledWith(
        'https://maps.googleapis.com',
        '/maps/api/geocode/json',
        {
          address: mockAddress,
          key: mockApiKey
        }
      );
    });

    it('deve chamar httpGet com os parâmetros corretos', async () => {
      // Arrange
      const mockAddress = 'São Paulo, SP';
      const mockApiKey = 'test-key-123';
      const mockResponse = { status: 'OK', results: [] };

      process.env.GCLOUD_API_KEY = mockApiKey;
      httpGet.mockResolvedValue(mockResponse);

      // Act
      await geocoding(mockAddress);

      // Assert
      expect(httpGet).toHaveBeenCalledWith(
        'https://maps.googleapis.com',
        '/maps/api/geocode/json',
        {
          address: mockAddress,
          key: mockApiKey
        }
      );
    });
  });

  describe('erros', () => {
    it('deve lançar erro quando GCLOUD_API_KEY não está definida', async () => {
      // Arrange
      delete process.env.GCLOUD_API_KEY;
      const mockAddress = 'rua do matao 1010';

      // Act & Assert
      await expect(geocoding(mockAddress)).rejects.toThrow(
        'GCLOUD_API_KEY não encontrada nas variáveis de ambiente'
      );
      expect(httpGet).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando GCLOUD_API_KEY está vazia', async () => {
      // Arrange
      process.env.GCLOUD_API_KEY = '';
      const mockAddress = 'rua do matao 1010';

      // Act & Assert
      await expect(geocoding(mockAddress)).rejects.toThrow(
        'GCLOUD_API_KEY não encontrada nas variáveis de ambiente'
      );
      expect(httpGet).not.toHaveBeenCalled();
    });
  });
});

