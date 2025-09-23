const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'metricsdb',
  port: process.env.DB_PORT || 5432,
});

// inserir dado bruto
router.post('/data', async (req, res) => {
  const { value, source } = req.body;
  try {
    await pool.query(
      'INSERT INTO raw_data(value, source) VALUES($1,$2)',
      [value, source || 'web']
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// retornar métricas já processadas
router.get('/metrics', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM metrics ORDER BY computed_at DESC LIMIT 100');
    res.json({ rows: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// disparar análise (chama o serviço Python)
router.post('/analyze', async (req, res) => {
  try {
    const resp = await axios.post(`http://python-engine:5000/analyze`);
    res.json(resp.data);
  } catch (err) {
    console.error('erro chamando python-engine', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
