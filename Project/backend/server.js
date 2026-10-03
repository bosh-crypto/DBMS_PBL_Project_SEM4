// ENTRY POINT: starts Express, connects DB, mounts routes
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');
const routes = require('./src/routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {           // creates tables automatically if missing
  console.log('Database connected & tables ready');
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}).catch(err => console.error('DB connection failed:', err.message));
