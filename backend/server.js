const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'SOLCial API Server is running!',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/solar', require('./routes/solar'));

app.listen(PORT, () => {
  console.log(`🚀 SOLCial API Server running on port ${PORT}`);
});