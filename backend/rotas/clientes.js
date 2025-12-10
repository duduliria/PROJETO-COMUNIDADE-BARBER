// ========================================
// ROTAS DE CLIENTES - CRUD COMPLETO
// ========================================

const express = require("express");
const router = express.Router();
const conexao = require("../configuracao/banco");

// ----------------------------------------
// LISTAR TODOS OS CLIENTES (GET)
// Rota: GET /clientes
// ----------------------------------------
router.get("/", (req, res) => {
  const sql = "SELECT * FROM clientes";

  conexao.query(sql, (erro, resultados) => {
    if (erro) {
      console.error("Erro ao buscar clientes:", erro);
      return res.status(500).json({ erro: "Erro ao buscar clientes" });
    }
    res.json(resultados);
  });
});

// ----------------------------------------
// BUSCAR UM CLIENTE POR ID (GET)
// Rota: GET /clientes/:id
// ----------------------------------------
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM clientes WHERE id = ?";

  conexao.query(sql, [id], (erro, resultados) => {
    if (erro) {
      console.error("Erro ao buscar cliente:", erro);
      return res.status(500).json({ erro: "Erro ao buscar cliente" });
    }

    if (resultados.length === 0) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }

    res.json(resultados[0]);
  });
});

// ----------------------------------------
// CADASTRAR NOVO CLIENTE (POST)
// Rota: POST /clientes
// ----------------------------------------
router.post("/", (req, res) => {
  const { nome, telefone, endereco } = req.body;

  // Validação simples
  if (!nome || !telefone) {
    return res.status(400).json({ erro: "Nome e telefone são obrigatórios" });
  }

  const sql =
    "INSERT INTO clientes (nome, telefone, endereco) VALUES (?, ?, ?)";

  conexao.query(sql, [nome, telefone, endereco], (erro, resultado) => {
    if (erro) {
      console.error("Erro ao cadastrar cliente:", erro);
      return res.status(500).json({ erro: "Erro ao cadastrar cliente" });
    }

    res.status(201).json({
      mensagem: "Cliente cadastrado com sucesso!",
      id: resultado.insertId,
    });
  });
});

// ----------------------------------------
// ATUALIZAR CLIENTE (PUT)
// Rota: PUT /clientes/:id
// ----------------------------------------
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, telefone, endereco } = req.body;

  // Validação simples
  if (!nome || !telefone) {
    return res.status(400).json({ erro: "Nome e telefone são obrigatórios" });
  }

  const sql =
    "UPDATE clientes SET nome = ?, telefone = ?, endereco = ? WHERE id = ?";

  conexao.query(sql, [nome, telefone, endereco, id], (erro, resultado) => {
    if (erro) {
      console.error("Erro ao atualizar cliente:", erro);
      return res.status(500).json({ erro: "Erro ao atualizar cliente" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }

    res.json({ mensagem: "Cliente atualizado com sucesso!" });
  });
});

// ----------------------------------------
// EXCLUIR CLIENTE (DELETE)
// Rota: DELETE /clientes/:id
// ----------------------------------------
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM clientes WHERE id = ?";

  conexao.query(sql, [id], (erro, resultado) => {
    if (erro) {
      console.error("Erro ao excluir cliente:", erro);
      return res.status(500).json({ erro: "Erro ao excluir cliente" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }

    res.json({ mensagem: "Cliente excluído com sucesso!" });
  });
});

module.exports = router;
