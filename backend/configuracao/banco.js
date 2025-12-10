const mysql = require("mysql2");

// Criando a conexão com o banco de dados
const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "barbearia",
});

// Testando a conexão
conexao.connect((erro) => {
  if (erro) {
    console.error("Erro ao conectar no banco de dados:", erro);
    return;
  }
  console.log("Conectado ao banco de dados MySQL!");
});

module.exports = conexao;
