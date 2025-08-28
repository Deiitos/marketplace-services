const mysql = require('mysql2/promise');

// Configuração do banco MySQL online
const db = mysql.createPool({
  host: 'SEU_HOST_DO_BANCO',      // exemplo: mysql-12345-0.cloud.render.com
  user: 'SEU_USUARIO',            // usuário do banco
  password: 'SUA_SENHA',          // senha do banco
  database: 'marketplace',        // nome do banco
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Criação da tabela users caso não exista
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);
    console.log('Tabela users pronta!');
  } catch (err) {
    console.error('Erro ao criar tabela users:', err);
  }
})();

module.exports = db;
