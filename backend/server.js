import express from "express";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// rota de teste
app.get("/", async (req, res) => {
  res.send("API funcionando no Render!");
});

// rota para testar conexão com o banco
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao conectar no banco");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
