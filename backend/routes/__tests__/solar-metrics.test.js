const { ERROR_MESSAGES } = require('../../utils/enums');

const request = require('supertest');
const express = require('express');
const cors = require('cors');

jest.mock('dotenv', () => ({
  config: jest.fn(() => ({})),
}));

process.env.GCLOUD_API_KEY = 'test-api-key';
process.env.GOOGLE_GEOCODING_API_URL = 'https://maps.googleapis.com';
process.env.GOOGLE_SOLAR_API_URL = 'https://solar.googleapis.com';

jest.mock('../../services/api/geocoding');
jest.mock('../../services/api/solarApiService');
jest.mock('../../services/api/solarMetrics');

const geocoding = require('../../services/api/geocoding');
const solar = require('../../services/api/solarApiService');
const SolarMetrics = require('../../services/api/solarMetrics');

const solarMetricsRouter = require('../solar-metrics');

describe('GET /solar-metrics', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/solar-metrics', solarMetricsRouter);
    
    jest.clearAllMocks();
  });

  describe('sucesso', () => {
    it('deve retornar dados de métricas solares quando todas as chamadas são bem-sucedidas', async () => {
      // Arrange
      const address = 'Rua do Matão, 1010, São Paulo';
      const energyConsumptionKwh = [100, 120, 110];
      const spentMoney = [200, 240, 220];

      const mockGeocodingResponse = {
        status: 'OK',
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
        ]
      };

      const mockSolarResponse = {
        success: true,
        maxArrayPanelsCount: 100,
        solarPanels: [
          {
            panelsCount: 50,
            yearlyEnergyDcKwh: 10000
          }
        ],
        maxSunshineHoursPerYear: 2500,
        carbonOffsetFactorKgPerMwh: 0.5
      };

      const mockSolarMetrics = {
        estimatedInvestment: 700,
        yearlyGeneratedEnergy: 9600,
        yearlyFinancialEconomy: 6720,
        yearlySpentWithPanels: 0,
        yearlyCarbonEmissionWithoutPanels: 4.62,
        yearlyCarbonEmissionWithPanels: 0,
        yearlyCarbonEconomy: 4.62,
        timeForInvestmentRecovery: 0.104,
        savedMoneyTenYears: [6720, 13440, 20160, 26880, 33600, 40320, 47040, 53760, 60480, 67200],
        carbonImpactTenYears: {
          years: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          carbonWithoutPanels: [4.62, 9.24, 13.86, 18.48, 23.1, 27.72, 32.34, 36.96, 41.58, 46.2],
          carbonWithPanels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          carbonSavings: [4.62, 9.24, 13.86, 18.48, 23.1, 27.72, 32.34, 36.96, 41.58, 46.2]
        }
      };

      geocoding.getCoordinates.mockResolvedValue(mockGeocodingResponse);
      solar.getSolarPotential.mockResolvedValue(mockSolarResponse);
      
      const mockSolarMetricsInstance = {
        getSolarMetrics: jest.fn().mockReturnValue(mockSolarMetrics)
      };
      SolarMetrics.mockImplementation(() => mockSolarMetricsInstance);

      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .query({
          address,
          energyConsumptionKwh: JSON.stringify(energyConsumptionKwh),
          spentMoney: JSON.stringify(spentMoney)
        })
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        formattedAddress: mockGeocodingResponse.results[0].formatted_address,
        maxPanels: mockSolarResponse.maxArrayPanelsCount,
        solarMetrics: mockSolarMetrics
      });

      expect(geocoding.getCoordinates).toHaveBeenCalledTimes(1);
      expect(geocoding.getCoordinates).toHaveBeenCalledWith(address);

      expect(solar.getSolarPotential).toHaveBeenCalledTimes(1);
      expect(solar.getSolarPotential).toHaveBeenCalledWith(
        mockGeocodingResponse.results[0].geometry.location.lat,
        mockGeocodingResponse.results[0].geometry.location.lng
      );

      expect(mockSolarMetricsInstance.getSolarMetrics).toHaveBeenCalledTimes(1);
      expect(mockSolarMetricsInstance.getSolarMetrics).toHaveBeenCalledWith(
        mockSolarResponse,
        1,
        energyConsumptionKwh,
        spentMoney
      );
    });
  });

  describe('validação de payload', () => {
    it('deve retornar 400 quando o address não é fornecido', async () => {
      // Arrange
      const energyConsumptionKwh = [100, 120, 110];
      const spentMoney = [200, 240, 220];

      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .query({
          energyConsumptionKwh: JSON.stringify(energyConsumptionKwh),
          spentMoney: JSON.stringify(spentMoney)
        })
        .expect(400);

      // Assert
      expect(response.body.error).toBe(ERROR_MESSAGES.ADDRESS_REQUIRED);
      expect(geocoding.getCoordinates).not.toHaveBeenCalled();
      expect(solar.getSolarPotential).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando energyConsumptionKwh não é fornecido', async () => {
      // Arrange
      const address = 'Rua do Matão, 1010';
      const spentMoney = [200, 240, 220];

      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .query({
          address,
          spentMoney: JSON.stringify(spentMoney)
        })
        .expect(400);


      // Assert
      expect(response.body.error).toBe(ERROR_MESSAGES.ENERGY_CONSUMPTION_REQUIRED);
      expect(geocoding.getCoordinates).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando energyConsumptionKwh não é um array', async () => {
      // Arrange
      const address = 'Rua do Matão, 1010';
      const spentMoney = [200, 240, 220];

      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .query({
          address,
          energyConsumptionKwh: 'not-an-array',
          spentMoney: JSON.stringify(spentMoney)
        })
        .expect(400);

      // Assert
      expect(response.body.error).toBe(ERROR_MESSAGES.INVALID_ENERGY_CONSUMPTION_KWH);
    });

    it('deve retornar 400 quando energyConsumptionKwh é um array vazio', async () => {
      // Arrange
      const address = 'Rua do Matão, 1010';
      const spentMoney = [200, 240, 220];

      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .query({
          address,
          energyConsumptionKwh: JSON.stringify([]),
          spentMoney: JSON.stringify(spentMoney)
        })
        .expect(400);

      // Assert
      expect(response.body.error).toBe(ERROR_MESSAGES.ENERGY_CONSUMPTION_REQUIRED);
    });

    it('deve retornar 400 quando spentMoney não é fornecido', async () => {
      // Arrange
      const address = 'Rua do Matão, 1010';
      const energyConsumptionKwh = [100, 120, 110];

      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .query({
          address,
          energyConsumptionKwh: JSON.stringify(energyConsumptionKwh)
        })
        .expect(400);

      // Assert
      expect(response.body.error).toBe(ERROR_MESSAGES.SPENT_MONEY_REQUIRED);
      expect(geocoding.getCoordinates).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando spentMoney não é um array', async () => {
      // Arrange
      const address = 'Rua do Matão, 1010';
      const energyConsumptionKwh = [100, 120, 110];

      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .query({
          address,
          energyConsumptionKwh: JSON.stringify(energyConsumptionKwh),
          spentMoney: 'not-an-array'
        })
        .expect(400);

      // Assert
      expect(response.body.error).toBe(ERROR_MESSAGES.INVALID_SPENT_MONEY);
    });

    it('deve retornar 400 quando spentMoney é um array vazio', async () => {
      // Arrange
      const address = 'Rua do Matão, 1010';
      const energyConsumptionKwh = [100, 120, 110];

      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .query({
          address,
          energyConsumptionKwh: JSON.stringify(energyConsumptionKwh),
          spentMoney: JSON.stringify([])
        })
        .expect(400);

      // Assert
      expect(response.body.error).toBe(ERROR_MESSAGES.SPENT_MONEY_REQUIRED);
    });

    it('deve retornar 400 quando o body está vazio', async () => {
      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .send({})
        .expect(400);

      // Assert
      expect(response.body.error).toBe("O campo 'address' é obrigatório");
    });
  });

  describe('erros de geocoding', () => {
    it('deve retornar 400 quando geocoding retorna status diferente de OK', async () => {
      // Arrange
      const address = 'Endereço inválido';
      const energyConsumptionKwh = [100, 120, 110];
      const spentMoney = [200, 240, 220];

      const mockGeocodingResponse = {
        status: 'ZERO_RESULTS',
        results: [],
        error_message: 'Nenhum resultado encontrado'
      };

      geocoding.getCoordinates.mockResolvedValue(mockGeocodingResponse);

      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .send({
          address,
          energyConsumptionKwh,
          spentMoney
        })
        .expect(400);

      // Assert
      expect(response.body.error).toBeDefined();
      expect(solar.getSolarPotential).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando geocoding lança uma exceção', async () => {
      // Arrange
      const address = 'Endereço inválido';
      const energyConsumptionKwh = [100, 120, 110];
      const spentMoney = [200, 240, 220];

      const errorMessage = 'Erro ao buscar coordenadas';
      geocoding.getCoordinates.mockRejectedValue(new Error(errorMessage));

      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .query({
          address,
          energyConsumptionKwh: JSON.stringify(energyConsumptionKwh),
          spentMoney: JSON.stringify(spentMoney)
        })
        .expect(400);

      // Assert
      expect(response.body.error).toBe(errorMessage);
      expect(solar.getSolarPotential).not.toHaveBeenCalled();
    });
  });

  describe('erros de solar API', () => {
    it('deve retornar 400 quando solar API retorna success: false', async () => {
      // Arrange
      const address = 'Rua do Matão, 1010';
      const energyConsumptionKwh = [100, 120, 110];
      const spentMoney = [200, 240, 220];

      const mockGeocodingResponse = {
        status: 'OK',
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
        ]
      };

      const mockSolarResponse = {
        success: false,
        error: {
          message: 'Não foi possível obter os dados do potencial solar',
          type: 'internal_error'
        }
      };

      geocoding.getCoordinates.mockResolvedValue(mockGeocodingResponse);
      solar.getSolarPotential.mockResolvedValue(mockSolarResponse);

      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .query({
          address,
          energyConsumptionKwh: JSON.stringify(energyConsumptionKwh),
          spentMoney: JSON.stringify(spentMoney)
        })
        .expect(400);

      // Assert
      expect(response.body.error).toBe(ERROR_MESSAGES.SOLAR_FAILED);
      expect(geocoding.getCoordinates).toHaveBeenCalledTimes(1);
      expect(solar.getSolarPotential).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 400 quando solar API lança uma exceção', async () => {
      // Arrange
      const address = 'Rua do Matão, 1010';
      const energyConsumptionKwh = [100, 120, 110];
      const spentMoney = [200, 240, 220];

      const mockGeocodingResponse = {
        status: 'OK',
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
        ]
      };

      const errorMessage = 'Erro ao buscar potencial solar';
      geocoding.getCoordinates.mockResolvedValue(mockGeocodingResponse);
      solar.getSolarPotential.mockRejectedValue(new Error(errorMessage));

      // Act
      const response = await request(app)
        .get('/solar-metrics')
        .query({
          address,
          energyConsumptionKwh: JSON.stringify(energyConsumptionKwh),
          spentMoney: JSON.stringify(spentMoney)
        })
        .expect(400);

      // Assert
      expect(response.body.error).toBe(errorMessage);
      expect(geocoding.getCoordinates).toHaveBeenCalledTimes(1);
      expect(solar.getSolarPotential).toHaveBeenCalledTimes(1);
    });
  });
});

