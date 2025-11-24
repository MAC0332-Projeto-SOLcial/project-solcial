// utils/enums.js
module.exports = {
  ERROR_MESSAGES: {
    ADDRESS_REQUIRED: "O campo 'address' é obrigatório",
    ENERGY_CONSUMPTION_REQUIRED: "O campo 'spentEnergyKwh' deve ser uma lista com 3 valores",
    SPENT_MONEY_REQUIRED: "O campo 'spentMoney' deve ser uma lista com 3 valores",
    GEOCODING_FAILED: "Falha ao buscar coordenadas",
    SOLAR_FAILED: "Falha ao obter dados solares"
  },
  
  SOLAR_CONSTANTS: {
    DEFAULT_PANEL_WATTS: 400,
    PANEL_PRICE_REAIS: 700,
    CARBON_EMISSIONS: 0.0385, // kgCO2 / kWh
  },

  CONSTANTS: {
    ONE: 1,
    FOUR: 4,
    NINETYSIX: 0.96,
    ENERGY_COST: 0.70, // R$0,64 - R$0,72 por kWh
    MONTHS: 12,
  }
};
