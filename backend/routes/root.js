const express = require('express');
const router = express.Router();

/**
 * @route   GET /
 * @desc    Rota raiz que retorna informações do servidor
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({ 
    message: 'SOLCial API Server is running!',
  });
});

module.exports = router;

