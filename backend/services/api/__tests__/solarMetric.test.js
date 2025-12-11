const { ERROR_MESSAGES } = require('../../../utils/enums');

const request = require('supertest');
const express = require('express');
const solarMetricsRouter = require('../../../routes/solar-metrics');
const app = express();
app.use(express.json());
app.use('/solar-metrics', solarMetricsRouter);

jest.mock('../../../services/api/geocoding', () => ({
  getCoordinates: jest.fn().mockResolvedValue({
    status: "OK",
    results: [{
      geometry: { location: { lat: -23.5, lng: -46.6 } },
      formatted_address: "Rua Exemplo, 123"
    }]
  })
}));

jest.mock('../../../services/api/solarApiService', () => ({
  getSolarPotential: jest.fn().mockResolvedValue({
    success: true,
    maxArrayPanelsCount: 10
  })
}));

jest.mock('../../../services/api/solarMetrics', () => {
  return jest.fn().mockImplementation(() => ({
    getSolarMetrics: jest.fn().mockReturnValue({ payback: 5 })
  }));
});



describe('GET /solar-metrics', () => {
  it('deve retornar erro se o payload estiver vazio', async () => {
    const res = await request(app).get('/solar-metrics').query({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('deve retornar erro se faltar address', async () => {
    const res = await request(app).get('/solar-metrics').query({
      energyConsumptionKwh: JSON.stringify([100]),
      spentMoney: JSON.stringify([200])
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(ERROR_MESSAGES.ADDRESS_REQUIRED);
  });

  it('deve retornar erro se faltar energyConsumptionKwh', async () => {
    const res = await request(app).get('/solar-metrics').query({
      address: 'Rua Exemplo, 123',
      spentMoney: JSON.stringify([200])
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(ERROR_MESSAGES.ENERGY_CONSUMPTION_REQUIRED);
  });

  it('deve retornar erro se faltar spentMoney', async () => {
    const res = await request(app).get('/solar-metrics').query({
      address: 'Rua Exemplo, 123',
      energyConsumptionKwh: JSON.stringify([100])
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(ERROR_MESSAGES.SPENT_MONEY_REQUIRED);
  });

  it('deve retornar dados de métricas solares em caso de sucesso', async () => {
    const res = await request(app).get('/solar-metrics').query({
      address: 'Rua Exemplo, 123',
      energyConsumptionKwh: JSON.stringify([100]),
      spentMoney: JSON.stringify([200])
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.formattedAddress).toBeDefined();
    expect(res.body.maxPanels).toBeDefined();
    expect(res.body.solarMetrics).toBeDefined();
  });
});