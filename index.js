const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com o seu banco do Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Rota de teste para ver se o sistema está online
app.get('/', (req, res) => {
  res.send('AssetFlow API Online 🚀');
});

// Rota para listar ativos de um cliente específico (Multi-tenant)
app.get('/assets', async (req, res) => {
  const schema = req.headers['x-tenant-schema']; // Identifica qual cliente está logado
  try {
    const result = await pool.query(`SELECT * FROM ${schema}.assets`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
