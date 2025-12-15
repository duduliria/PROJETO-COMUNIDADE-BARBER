const express = require("express");
const router = express.Router();
const conexao = require("../configuracao/banco");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM cabeleireiros";

  conexao.query(sql, (erro, resultados) => {
    if (erro) {
      console.error("Erro ao buscar cabeleireiros:", erro);
      return res.status(500).json({ erro: "Erro ao buscar cabeleireiros" });
    }
    res.json(resultados);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM cabeleireiros WHERE id = ?";

  conexao.query(sql, [id], (erro, resultados) => {
    if (erro) {
      console.error("Erro ao buscar cabeleireiro:", erro);
      return res.status(500).json({ erro: "Erro ao buscar cabeleireiro" });
    }

    if (resultados.length === 0) {
      return res.status(404).json({ erro: "Cabeleireiro não encontrado" });
    }

    res.json(resultados[0]);
  });
});

router.post("/", (req, res) => {
  const { nome, especialidade, telefone } = req.body;

  // Validação simples
  if (!nome || !especialidade || !telefone) {
    return res
      .status(400)
      .json({ erro: "Nome, especialidade e telefone são obrigatórios" });
  }

  const sql =
    "INSERT INTO cabeleireiros (nome, especialidade, telefone) VALUES (?, ?, ?)";

  conexao.query(sql, [nome, especialidade, telefone], (erro, resultado) => {
    if (erro) {
      console.error("Erro ao cadastrar cabeleireiro:", erro);
      return res.status(500).json({ erro: "Erro ao cadastrar cabeleireiro" });
    }

    res.status(201).json({
      mensagem: "Cabeleireiro cadastrado com sucesso!",
      id: resultado.insertId,
    });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, especialidade, telefone } = req.body;

  // Validação simples
  if (!nome || !especialidade || !telefone) {
    return res
      .status(400)
      .json({ erro: "Nome, especialidade e telefone são obrigatórios" });
  }

  const sql =
    "UPDATE cabeleireiros SET nome = ?, especialidade = ?, telefone = ? WHERE id = ?";

  conexao.query(sql, [nome, especialidade, telefone, id], (erro, resultado) => {
    if (erro) {
      console.error("Erro ao atualizar cabeleireiro:", erro);
      return res.status(500).json({ erro: "Erro ao atualizar cabeleireiro" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Cabeleireiro não encontrado" });
    }

    res.json({ mensagem: "Cabeleireiro atualizado com sucesso!" });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM cabeleireiros WHERE id = ?";

  conexao.query(sql, [id], (erro, resultado) => {
    if (erro) {
      console.error("Erro ao excluir cabeleireiro:", erro);
      return res.status(500).json({ erro: "Erro ao excluir cabeleireiro" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Cabeleireiro não encontrado" });
    }

    res.json({ mensagem: "Cabeleireiro excluído com sucesso!" });
  });
});

module.exports = router;
