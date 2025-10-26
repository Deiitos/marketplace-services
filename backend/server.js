import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ==========================
// 🔹 Conexão com o banco
// ==========================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool
  .connect()
  .then(() => console.log("✅ Conectado ao banco de dados PostgreSQL"))
  .catch((err) => console.error("❌ Erro ao conectar ao banco:", err));

// =========================================================
// 🔹 ROTAS DA API
// =========================================================

// --------------------------
// 🟢 Cadastro de usuário
// --------------------------
app.post("/api/usuarios", async (req, res) => {
  const { nome, email, senha, prestador, especialidade, cidade } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Dados insuficientes para cadastro" });
  }

  try {
    const senhaHash = senha;
    const result = await pool.query(
      `
      INSERT INTO usuarios (nome, email, senhahash, prestador, especialidade, cidade)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [nome, email, senhaHash, prestador, especialidade, cidade]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// --------------------------
// 🟢 Login de usuário
// --------------------------
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 AND senhahash = $2",
      [email, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ message: "Erro interno ao realizar login" });
  }
});

// --------------------------
// 🟢 Listar prestadores
// --------------------------
app.get("/api/prestadores", async (req, res) => {
  const { nome, cidade, especialidade, avaliacao } = req.query;
  try {
    const valorAvaliacao = avaliacao ? Number(avaliacao) : null;
    const result = await pool.query(
      `
      SELECT *
      FROM usuarios
      WHERE prestador = true
        AND ($1::VARCHAR IS NULL OR nome ILIKE '%' || $1::VARCHAR || '%')
        AND ($2::VARCHAR IS NULL OR cidade ILIKE '%' || $2::VARCHAR || '%')
        AND ($3::VARCHAR IS NULL OR especialidade = $3::VARCHAR)
        AND ($4::REAL IS NULL OR COALESCE(avaliacao::REAL, 0) >= $4::REAL)
      ORDER BY COALESCE(avaliacao::REAL, 0) DESC
      `,
      [
        nome && nome.trim() !== "" ? nome : null,
        cidade && cidade.trim() !== "" ? cidade : null,
        especialidade && especialidade.trim() !== "" ? especialidade : null,
        valorAvaliacao
      ]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar prestadores:", error);
    res.status(500).json({ error: "Erro ao buscar prestadores" });
  }
});

// --------------------------
// 🟢 Buscar usuário por ID
// --------------------------
app.get("/api/usuario/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// --------------------------
// 🟢 Atualizar perfil
// --------------------------
app.put("/api/usuario/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, cidade, especialidade, foto, linkedin, instagram, facebook } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE usuarios
      SET 
        nome = $1, 
        descricao = $2, 
        cidade = $3, 
        especialidade = $4, 
        foto = $5,
        linkedin = $6,
        instagram = $7,
        facebook = $8
      WHERE id = $9
      RETURNING *
      `,
      [nome, descricao, cidade, especialidade, foto, linkedin, instagram, facebook, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado para atualizar" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

// --------------------------
// 🟢 Inserir nova avaliação
// --------------------------
app.post("/api/avaliacoes", async (req, res) => {
  const { usuario_id, avaliador_id, nota, comentario } = req.body;

  if (!usuario_id || !avaliador_id || !nota) {
    return res.status(400).json({ error: "Dados insuficientes para avaliação" });
  }

  try {
    // Buscar nome do avaliador
    const usuarioResult = await pool.query(
      "SELECT nome FROM usuarios WHERE id = $1",
      [avaliador_id]
    );
    const nome_avaliador = usuarioResult.rows[0]?.nome || "Anônimo";

    // Inserir avaliação
    const result = await pool.query(
      `
      INSERT INTO avaliacoes (usuario_id, nome_avaliador, nota, comentario, data)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
      `,
      [usuario_id, nome_avaliador, nota, comentario]
    );

    // Recalcular média das avaliações do usuário
    const mediaResult = await pool.query(
      `SELECT COALESCE(ROUND(AVG(nota), 1), 0) AS media_avaliacao FROM avaliacoes WHERE usuario_id = $1`,
      [usuario_id]
    );
    const novaMedia = mediaResult.rows[0].media_avaliacao;

    // Atualizar coluna avaliacao na tabela usuarios
    await pool.query(
      `UPDATE usuarios SET avaliacao = $1 WHERE id = $2`,
      [novaMedia, usuario_id]
    );

    // Retornar avaliação + nova média
    res.status(201).json({ ...result.rows[0], novaMedia });
  } catch (error) {
    console.error("Erro ao salvar avaliação e atualizar média:", error);
    res.status(500).json({ error: "Erro ao salvar avaliação" });
  }
});

// --------------------------
// 🟢 Buscar avaliações de um usuário
// --------------------------
app.get("/api/usuarios/:id/avaliacoes", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT id, usuario_id, nome_avaliador, nota, comentario, data
      FROM avaliacoes
      WHERE usuario_id = $1
      ORDER BY data DESC
      `,
      [id]
    );

    res.json(Array.isArray(result.rows) ? result.rows : []);
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
});

// --------------------------
// 🟢 Buscar média de avaliações
// --------------------------
app.get("/api/usuarios/:id/avaliacoes/media", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT COALESCE(ROUND(AVG(nota), 1), 0) AS media_avaliacao FROM avaliacoes WHERE usuario_id = $1`,
      [id]
    );
    res.json({ media: result.rows[0].media_avaliacao });
  } catch (error) {
    console.error("Erro ao buscar média:", error);
    res.status(500).json({ error: "Erro ao buscar média" });
  }
});

// =========================================================
// 🔹 INICIALIZAÇÃO DO SERVIDOR
// ==========================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
