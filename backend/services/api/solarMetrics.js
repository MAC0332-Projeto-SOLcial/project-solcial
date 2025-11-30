const { CONSTANTS, SOLAR_CONSTANTS } = require('../../utils/enums');

class SolarMetrics {
    constructor() {

    }

    /**
     * 
     * @param {*} spentEnergyKwh 
     * @returns {double} Recebe o array de consumo de energia (3 meses) e retorna o consumo de energia anual aproximado, em kWh
     */
    getYearlyEnergyConsumption(spentEnergyKwh) {
        let monthlyEnergyConsumption = 0.0;

        for (let i = 0; i < spentEnergyKwh.length; i++) {
            monthlyEnergyConsumption = monthlyEnergyConsumption + spentEnergyKwh[i];
        }

        return (monthlyEnergyConsumption / 3) * CONSTANTS.MONTHS;
    }

    /**
     * 
     * @param {*} spentMoney 
     * @returns {double} Recebe o array de gasto com energia (3 meses) e retorna o gasto anual aproximado com energia
     */
    getYearlySpentMoney(spentMoney) {
        let spentMoneyMonthly = 0.0;

        for (let i = 0; i < spentMoney.length; i++) {
            spentMoneyMonthly = spentMoneyMonthly + spentMoney[i];
        }

        return (spentMoneyMonthly / 3) * CONSTANTS.MONTHS;
    }

    /**
     * 
     * @param {*} panelsNumber 
     * @returns {double} Investimento estimado em reais
     */
    getEstimatedInvestiment(panelsNumber) {
        return SOLAR_CONSTANTS.PANEL_PRICE_REAIS * panelsNumber;
    }

    /**
     * 
     * @param {*} panelsList 
     * @param {*} panelsNumber 
     * @returns {double} Recebe o array de paineis e retorna a energia gerada anualmente, em kWh, pelos N paineis
     */
    getYearlyGeneratedEnergy(panelsList, panelsNumber) {
        let yearlyGeneratedEnergy = 0.0;

        for (let i = 0; i < Math.min(panelsNumber, panelsList.length); i++) {
            yearlyGeneratedEnergy += panelsList[i].yearlyEnergyDcKwh;
        }

        return CONSTANTS.NINETYSIX * yearlyGeneratedEnergy;
    }

    /**
     * 
     * @param {*} yearlyGeneratedEnergy 
     * @param {*} yearlyEnergyConsumption 
     * @param {*} yearlySpentMoney 
     * @returns {double} Economia financeira anual, em reais, com uso dos paineis
     */
    getYearlyFinancialEconomy(yearlyGeneratedEnergy, yearlyEnergyConsumption, yearlySpentMoney) {
        if (yearlyGeneratedEnergy >= yearlyEnergyConsumption) {
            return yearlySpentMoney;
        }

        const yearlyEconomyWithPanels = yearlyGeneratedEnergy * CONSTANTS.ENERGY_COST; 

        return yearlyEconomyWithPanels;
    }

    /**
     * 
     * @param {*} yearlyGeneratedEnergy 
     * @param {*} yearlyEnergyConsumption 
     * @returns {double} Valor gasto, anualmente, com uso paineis
     */
    getYearlySpentWithPanels(yearlyGeneratedEnergy, yearlyEnergyConsumption) {
        if (yearlyGeneratedEnergy >= yearlyEnergyConsumption) {
            return 0.0;   // 0 ta correto? toda energia gerada pelos paineis cobre os custos anuais da pessoa
        }

        const yearlySpentValue = (yearlyEnergyConsumption - yearlyGeneratedEnergy) * CONSTANTS.ENERGY_COST;
        
        return yearlySpentValue;
    }

    /**
     * 
     * @param {*} yearlyEnergyConsumption 
     * @returns {double} Emissão de carbono aproximada anualmente, sem uso de paineis
     */
    getYearlyCarbonEmissionWithoutPanels(yearlyEnergyConsumption) {
        return yearlyEnergyConsumption * SOLAR_CONSTANTS.CARBON_EMISSIONS;
    }

    /**
     * 
     * @param {*} yearlyGeneratedEnergy 
     * @param {*} yearlyEnergyConsumption 
     * @returns {double} Emissão de carbono aproximada anualmente, com uso de paineis
     */
    getYearlyCarbonEmissionWithPanels(yearlyGeneratedEnergy, yearlyEnergyConsumption) {        
        if (yearlyGeneratedEnergy >= yearlyEnergyConsumption) {
            return 0;
        }

        const totalEnergySpent = yearlyEnergyConsumption - yearlyGeneratedEnergy;

        return totalEnergySpent * SOLAR_CONSTANTS.CARBON_EMISSIONS;
    }
    
    /**
     * 
     * @param {*} estimatedInvestment 
     * @param {*} yearlyFinancialEconomy 
     * @returns {double} Tempo para recuperar investimento financeiro
     */
    getTimeForinvestmentRecovery(estimatedInvestment, yearlyFinancialEconomy) {
        return estimatedInvestment / yearlyFinancialEconomy;
    }

    /**
     * 
     * @param {*} yearlyCarbonEmissionWithoutPanels 
     * @param {*} yearlyCarbonEmissionWithPanels 
     * @returns {double} Economia na emissão de carbono anual
     */
    getYearlyCarbonEconomy(yearlyCarbonEmissionWithoutPanels, yearlyCarbonEmissionWithPanels) {
        return yearlyCarbonEmissionWithoutPanels - yearlyCarbonEmissionWithPanels;
    }

    /**
     * 
     * @param {*} yearlyFinancialEconomy 
     * @returns {array double} Lista com dinheiro economizado ao longo de 10 anos
     */
    getSavedMoneyTenYears(yearlyFinancialEconomy) {
        const years = 10;
        const savings = [];

        let accumulatedSavings = 0;

        for (let i = 1; i <= years; i++) {
            accumulatedSavings += yearlyFinancialEconomy;
            savings.push(accumulatedSavings);
        }

        return savings;
    }

    /**
     * 
     * @param {*} yearlyCarbonEmissionWithoutPanels 
     * @param {*} yearlyCarbonEmissionWithPanels 
     * @returns {array* double} Listas com a emissão acumulada de carbono ao longo de 10 anos, em todos cenários
     */
    getCarbonImpactTenYears(yearlyCarbonEmissionWithoutPanels, yearlyCarbonEmissionWithPanels) {
        const years = [];
        const carbonWithoutPanels = [];
        const carbonWithPanels = [];
        const carbonSavings = [];
        const carbonSavingsNegative = [];

        let accWithout = 0;
        let accWith = 0;
        let accSavings = 0;

        for (let year = 1; year <= 10; year++) {
            accWithout += yearlyCarbonEmissionWithoutPanels;
            accWith += yearlyCarbonEmissionWithPanels;
            accSavings += (yearlyCarbonEmissionWithoutPanels - yearlyCarbonEmissionWithPanels);

            years.push(year);
            carbonWithoutPanels.push(accWithout);
            carbonWithPanels.push(accWith);
            carbonSavings.push(accSavings);
            carbonSavingsNegative.push(-accSavings);
        }

        return {
            years,
            carbonWithoutPanels,
            carbonWithPanels,
            carbonSavings,
            carbonSavingsNegative
        };
    }

    getSolarMetrics(solarResponse, panelsNumber, spentEnergyKwh, spentMoney) {
        if (!solarResponse) {
            throw new Error('Não podemos processar os dados solares');
        }

        // Valores brutos
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

        // Arrays
        const savedMoneyTenYears = this.getSavedMoneyTenYears(yearlyFinancialEconomy);
        
        const carbonImpactTenYears = this.getCarbonImpactTenYears(yearlyCarbonEmissionWithoutPanels, yearlyCarbonEmissionWithPanels);
    
        const obtainedData = {
            estimatedInvestment: estimatedInvestment,
            yearlyGeneratedEnergy: yearlyGeneratedEnergy,
            yearlyFinancialEconomy: yearlyFinancialEconomy,
            yearlySpentWithPanels: yearlySpentWithPanels,
            yearlyCarbonEmissionWithoutPanels: yearlyCarbonEmissionWithoutPanels,
            yearlyCarbonEmissionWithPanels: yearlyCarbonEmissionWithPanels,
            yearlyCarbonEconomy: yearlyCarbonEconomy,
            timeForInvestmentRecovery: timeForInvestmentRecovery,
            savedMoneyTenYears: savedMoneyTenYears,
            carbonImpactTenYears: carbonImpactTenYears,
        }

        return obtainedData;
    }
}

module.exports = SolarMetrics;