const express = require('express');
const EngineerController = require('../controllers/engineerController');

const router = express.Router();
const engineerController = new EngineerController();

// Route to create a new engineer
router.post('/', engineerController.createEngineer.bind(engineerController));

// Route to get all engineers
router.get('/', engineerController.getEngineers.bind(engineerController));

// Route to get an engineer by ID
router.get('/:id', engineerController.getEngineerById.bind(engineerController));

// Route to update an engineer by ID
router.put('/:id', engineerController.updateEngineer.bind(engineerController));

// Route to delete an engineer by ID
router.delete('/:id', engineerController.deleteEngineer.bind(engineerController));

module.exports = router;