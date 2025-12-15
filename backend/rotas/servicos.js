const express = require("express");
const router = express.Router();
const conexao = require("../configuracao/banco");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM servicos";

  conexao.query(sql, (erro, resultados) => {
    if (erro) {
      console.error("Erro ao buscar serviços:", erro);
      return res.status(500).json({ erro: "Erro ao buscar serviços" });
    }
    res.json(resultados);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM servicos WHERE id = ?";

  conexao.query(sql, [id], (erro, resultados) => {
    if (erro) {
      console.error("Erro ao buscar serviço:", erro);
      return res.status(500).json({ erro: "Erro ao buscar serviço" });
    }

    if (resultados.length === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }

    res.json(resultados[0]);
  });
});

router.post("/", (req, res) => {
  const { nome, preco } = req.body;

  // Validação simples
  if (!nome || !preco) {
    return res.status(400).json({ erro: "Nome e preço são obrigatórios" });
  }

  const sql = "INSERT INTO servicos (nome, preco) VALUES (?, ?)";

  conexao.query(sql, [nome, preco], (erro, resultado) => {
    if (erro) {
      console.error("Erro ao cadastrar serviço:", erro);
      return res.status(500).json({ erro: "Erro ao cadastrar serviço" });
    }

    res.status(201).json({
      mensagem: "Serviço cadastrado com sucesso!",
      id: resultado.insertId,
    });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, preco } = req.body;

  // Validação simples
  if (!nome || !preco) {
    return res.status(400).json({ erro: "Nome e preço são obrigatórios" });
  }

  const sql = "UPDATE servicos SET nome = ?, preco = ? WHERE id = ?";

  conexao.query(sql, [nome, preco, id], (erro, resultado) => {
    if (erro) {
      console.error("Erro ao atualizar serviço:", erro);
      return res.status(500).json({ erro: "Erro ao atualizar serviço" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }

    res.json({ mensagem: "Serviço atualizado com sucesso!" });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM servicos WHERE id = ?";

  conexao.query(sql, [id], (erro, resultado) => {
    if (erro) {
      console.error("Erro ao excluir serviço:", erro);
      return res.status(500).json({ erro: "Erro ao excluir serviço" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }

    res.json({ mensagem: "Serviço excluído com sucesso!" });
  });
});

module.exports = router;
