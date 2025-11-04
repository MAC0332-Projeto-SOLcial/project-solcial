class EngineerController {
    constructor(engineerService) {
        this.engineerService = engineerService;
    }

    async createEngineer(req, res) {
        try {
            const engineerData = req.body;
            const newEngineer = await this.engineerService.createEngineer(engineerData);
            res.status(201).json(newEngineer);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getEngineers(req, res) {
        try {
            const engineers = await this.engineerService.getEngineers();
            res.status(200).json(engineers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getEngineerById(req, res) {
        try {
            const engineerId = req.params.id;
            const engineer = await this.engineerService.getEngineerById(engineerId);
            if (!engineer) {
                return res.status(404).json({ message: 'Engineer not found' });
            }
            res.status(200).json(engineer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateEngineer(req, res) {
        try {
            const engineerId = req.params.id;
            const engineerData = req.body;
            const updatedEngineer = await this.engineerService.updateEngineer(engineerId, engineerData);
            if (!updatedEngineer) {
                return res.status(404).json({ message: 'Engineer not found' });
            }
            res.status(200).json(updatedEngineer);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteEngineer(req, res) {
        try {
            const engineerId = req.params.id;
            const deletedEngineer = await this.engineerService.deleteEngineer(engineerId);
            if (!deletedEngineer) {
                return res.status(404).json({ message: 'Engineer not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = EngineerController;