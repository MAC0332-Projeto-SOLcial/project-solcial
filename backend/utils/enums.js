// utils/enums.js
module.exports = {
  ERROR_MESSAGES: {
    ADDRESS_REQUIRED: "O campo 'address' é obrigatório",
    ENERGY_CONSUMPTION_REQUIRED: "O campo 'spentEnergyKwh' deve ser uma lista com 3 valores",
    SPENT_MONEY_REQUIRED: "O campo 'spentMoney' deve ser uma lista com 3 valores",
    GEOCODING_FAILED: "Falha ao buscar coordenadas",
    SOLAR_FAILED: "Falha ao obter dados solares",
    ADRESS_NOT_FOUND: "Endereço não encontrado",
    INVALID_ENERGY_CONSUMPTION_KWH: "Formato inválido para energyConsumptionKwh",
    INVALID_SPENT_MONEY: "Formato inválido para spentMoney",
    INVALID_LIST_SIZE: "As listas de consumo e gasto devem ter o mesmo tamanho.",
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
