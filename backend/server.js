import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcrypt"; // para futura criptografia de senha

dotenv.config();
const { Pool } = pkg;

const app = express();

// Permitir requisições do frontend
app.use(cors());
app.use(express.json());

// Conexão com PostgreSQL
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  // ssl: { rejectUnauthorized: false } // necessário se usar Render
});

// ================= Rotas =================

// Rota de teste
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Servidor rodando! Banco ativo em: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no banco de dados");
  }
});

// Rota de cadastro
app.post("/api/cadastro", async (req, res) => {
  const { nome, email, senha, prestador, especialidade } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ error: "Nome, email e senha são obrigatórios" });
  }

  try {
    // Para criptografar no futuro:
    // const hashedPassword = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senhahash, prestador, especialidade) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, prestador, especialidade",
      [nome, email, senha, prestador, especialidade]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

// Rota de login
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const usuario = result.rows[0];

    // Se estiver usando bcrypt no futuro:
    // const match = await bcrypt.compare(senha, usuario.senhahash);
    // if (!match) return res.status(401).json({ error: "Senha incorreta" });

    if (senha !== usuario.senhahash) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    // Retorna dados do usuário (sem senha)
    const { id, nome: nomeUsuario, email: emailUsuario, prestador, especialidade } =
      usuario;
    res.json({ id, nome: nomeUsuario, email: emailUsuario, prestador, especialidade });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no login" });
  }
});

// Porta do Render ou local
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
