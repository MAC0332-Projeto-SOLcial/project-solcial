const { CONSTANTS, SOLAR_CONSTANTS } = require('../../utils/enums');

class SolarMetrics {
    constructor() {

    }

    getYearlyEnergyConsumption(spentEnergyKwh) {
        let monthlyEnergyConsumption = 0.0;

        for (let i = 0; i < spentEnergyKwh.length; i++) {
            monthlyEnergyConsumption = monthlyEnergyConsumption + spentEnergyKwh[i];
        }

        return (monthlyEnergyConsumption / 3) * CONSTANTS.MONTHS;
    }

    getYearlySpentMoney(spentMoney) {
        let spentMoneyMonthly = 0.0;

        for (let i = 0; i < spentMoney.length; i++) {
            spentMoneyMonthly = spentMoneyMonthly + spentMoney[i];
        }

        return (spentMoneyMonthly / 3) * CONSTANTS.MONTHS;
    }

    getEstimatedInvestiment(panelsNumber) {
        return SOLAR_CONSTANTS.PANEL_PRICE_REAIS * panelsNumber;
    }

    getYearlyGeneratedEnergy(panelsList, panelsNumber) {
        let yearlyGeneratedEnergy = 0.0;

        for (let i = 0; i < Math.min(panelsNumber, panelsList.length); i++) {
            yearlyGeneratedEnergy += panelsList[i].yearlyEnergyDcKwh;
        }

        return CONSTANTS.NINETYSIX * yearlyGeneratedEnergy;
    }

    getYearlyFinancialEconomy(yearlyGeneratedEnergy, yearlyEnergyConsumption, yearlySpentMoney) {
        if (yearlyGeneratedEnergy >= yearlyEnergyConsumption) {
            return yearlySpentMoney;
        }

        const yearlyEconomyWithPanels = yearlyGeneratedEnergy * CONSTANTS.ENERGY_COST; 

        return yearlyEconomyWithPanels;
    }

    getYearlySpentWithPanels(yearlyGeneratedEnergy, yearlyEnergyConsumption) {
        if (yearlyGeneratedEnergy >= yearlyEnergyConsumption) {
            return 0;   // 0 ta correto? toda energia gerada pelos paineis cobre os custos anuais da pessoa
        }

        const yearlySpentValue = (yearlyEnergyConsumption - yearlyGeneratedEnergy) * CONSTANTS.ENERGY_COST;
        
        return yearlySpentValue;
    }

    getYearlyCarbonEmissionWithoutPanels(yearlyEnergyConsumption) {
        return yearlyEnergyConsumption * SOLAR_CONSTANTS.CARBON_EMISSIONS;
    }

    getYearlyCarbonEmissionWithPanels(yearlyGeneratedEnergy, yearlyEnergyConsumption) {        
        if (yearlyGeneratedEnergy >= yearlyEnergyConsumption) {
            return 0;
        }

        const totalEnergySpent = yearlyEnergyConsumption - yearlyGeneratedEnergy;

        return totalEnergySpent * SOLAR_CONSTANTS.CARBON_EMISSIONS;
    }
    
    getTimeForinvestmentRecovery(estimatedInvestment, yearlyFinancialEconomy) {
        return estimatedInvestment / yearlyFinancialEconomy;
    }

    getYearlyCarbonEconomy(yearlyCarbonEmissionWithoutPanels, yearlyCarbonEmissionWithPanels) {
        return yearlyCarbonEmissionWithoutPanels - yearlyCarbonEmissionWithPanels;
    }

    getSolarMetrics(solarResponse, panelsNumber, spentEnergyKwh, spentMoney) {
        if (!solarResponse) {
            throw new Error('Não podemos processar os dados solares');
        }

        const yearlyEnergyConsumption = this.getYearlyEnergyConsumption(spentEnergyKwh);

        const yearlySpentMoney = this.getYearlySpentMoney(spentMoney);

        const estimatedInvestment = this.getEstimatedInvestiment(panelsNumber);
       
        const yearlyGeneratedEnergy = this.getYearlyGeneratedEnergy(solarResponse.solarPanels, panelsNumber);
       
        const yearlyFinancialEconomy = this.getYearlyFinancialEconomy(yearlyGeneratedEnergy, yearlyEnergyConsumption, yearlySpentMoney);
        
        const yearlySpentWithPanels = this.getYearlySpentWithPanels(yearlyGeneratedEnergy, yearlyEnergyConsumption);
         
        const yearlyCarbonEmissionWithoutPanels = this.getYearlyCarbonEmissionWithoutPanels(yearlyEnergyConsumption);

        const yearlyCarbonEmissionWithPanels = this.getYearlyCarbonEmissionWithPanels(yearlyGeneratedEnergy, yearlyEnergyConsumption);
    
        const yearlyCarbonEconomy = this.getYearlyCarbonEconomy(yearlyCarbonEmissionWithoutPanels, yearlyCarbonEmissionWithPanels);

        const timeForInvestmentRecovery = this.getTimeForinvestmentRecovery(estimatedInvestment, yearlyFinancialEconomy);
    
        const obtainedData = {
            estimatedInvestment: estimatedInvestment,
            yearlyGeneratedEnergy: yearlyGeneratedEnergy,
            yearlyFinancialEconomy: yearlyFinancialEconomy,
            yearlySpentWithPanels: yearlySpentWithPanels,
            yearlyCarbonEmissionWithoutPanels: yearlyCarbonEmissionWithoutPanels,
            yearlyCarbonEmissionWithPanels: yearlyCarbonEmissionWithPanels,
            yearlyCarbonEconomy: yearlyCarbonEconomy,
            timeForInvestmentRecovery: timeForInvestmentRecovery,
        }

        return obtainedData;
    }
}

module.exports = SolarMetrics;