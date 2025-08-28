const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Rota raiz de teste
app.get('/', (req, res) => {
  res.send('Backend online e funcionando!');
});

// Cadastro
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  try {
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    res.json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: "Usuário já existe" });
    } else {
      console.error(err);
      res.status(500).json({ message: "Erro no servidor" });
    }
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      res.json({ message: "Login bem-sucedido!" });
    } else {
      res.status(401).json({ message: "Usuário ou senha incorretos" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
