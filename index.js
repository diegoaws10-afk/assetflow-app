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
// Rota para cadastrar um novo ativo (A-001) 
app.post('/assets', async (req, res) => {
  const schema = req.headers['x-tenant-schema'];
  const { name, type, tag } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO ${schema}.assets (name, type, tag, status) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, type, tag, 'available']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
