class EngineerService {
    constructor(EngineerModel) {
        this.EngineerModel = EngineerModel;
    }

    async createEngineer(engineerData) {
        const engineer = new this.EngineerModel(engineerData);
        return await engineer.save();
    }

    async getEngineers() {
        return await this.EngineerModel.find();
    }

    async getEngineerById(engineerId) {
        return await this.EngineerModel.findById(engineerId);
    }

    async updateEngineer(engineerId, engineerData) {
        return await this.EngineerModel.findByIdAndUpdate(engineerId, engineerData, { new: true });
    }

    async deleteEngineer(engineerId) {
        return await this.EngineerModel.findByIdAndDelete(engineerId);
    }
}

module.exports = EngineerService;