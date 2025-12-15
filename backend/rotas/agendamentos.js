const express = require("express");
const router = express.Router();
const conexao = require("../configuracao/banco");

router.get("/", (req, res) => {
  const sql = `
        SELECT 
            agendamentos.id,
            agendamentos.data,
            agendamentos.hora,
            agendamentos.status,
            clientes.nome AS cliente_nome,
            cabeleireiros.nome AS cabeleireiro_nome,
            servicos.nome AS servico_nome,
            servicos.preco AS servico_preco
        FROM agendamentos
        LEFT JOIN clientes ON agendamentos.cliente_id = clientes.id
        LEFT JOIN cabeleireiros ON agendamentos.cabeleireiro_id = cabeleireiros.id
        LEFT JOIN servicos ON agendamentos.servico_id = servicos.id
        ORDER BY agendamentos.data DESC, agendamentos.hora ASC
    `;

  conexao.query(sql, (erro, resultados) => {
    if (erro) {
      console.error("Erro ao buscar agendamentos:", erro);
      return res.status(500).json({ erro: "Erro ao buscar agendamentos" });
    }
    res.json(resultados);
  });
});


router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
        SELECT 
            agendamentos.*,
            clientes.nome AS cliente_nome,
            cabeleireiros.nome AS cabeleireiro_nome,
            servicos.nome AS servico_nome,
            servicos.preco AS servico_preco
        FROM agendamentos
        LEFT JOIN clientes ON agendamentos.cliente_id = clientes.id
        LEFT JOIN cabeleireiros ON agendamentos.cabeleireiro_id = cabeleireiros.id
        LEFT JOIN servicos ON agendamentos.servico_id = servicos.id
        WHERE agendamentos.id = ?
    `;

  conexao.query(sql, [id], (erro, resultados) => {
    if (erro) {
      console.error("Erro ao buscar agendamento:", erro);
      return res.status(500).json({ erro: "Erro ao buscar agendamento" });
    }

    if (resultados.length === 0) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }

    res.json(resultados[0]);
  });
});

router.post("/", (req, res) => {
  const { cliente_id, cabeleireiro_id, servico_id, data, hora, status } =
    req.body;

  // Validação simples
  if (!cliente_id || !cabeleireiro_id || !servico_id || !data || !hora) {
    return res.status(400).json({
      erro: "Cliente, cabeleireiro, serviço, data e hora são obrigatórios",
    });
  }

  // Verifica se já existe agendamento no mesmo dia e horário para o mesmo cabeleireiro
  const sqlVerifica = `
    SELECT id FROM agendamentos 
    WHERE cabeleireiro_id = ? AND data = ? AND hora = ? AND status != 'cancelado'
  `;

  conexao.query(sqlVerifica, [cabeleireiro_id, data, hora], (erroVerifica, resultadosVerifica) => {
    if (erroVerifica) {
      console.error("Erro ao verificar disponibilidade:", erroVerifica);
      return res.status(500).json({ erro: "Erro ao verificar disponibilidade" });
    }

    // Se já existe agendamento, retorna erro
    if (resultadosVerifica.length > 0) {
      return res.status(400).json({
        erro: "Já existe um agendamento para este cabeleireiro neste dia e horário",
      });
    }

    // Status padrão é 'agendado' se não for informado
    const statusFinal = status || "agendado";

    const sql = `
      INSERT INTO agendamentos (cliente_id, cabeleireiro_id, servico_id, data, hora, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    conexao.query(
      sql,
      [cliente_id, cabeleireiro_id, servico_id, data, hora, statusFinal],
      (erro, resultado) => {
        if (erro) {
          console.error("Erro ao cadastrar agendamento:", erro);
          return res.status(500).json({ erro: "Erro ao cadastrar agendamento" });
        }

        res.status(201).json({
          mensagem: "Agendamento cadastrado com sucesso!",
          id: resultado.insertId,
        });
      }
    );
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { cliente_id, cabeleireiro_id, servico_id, data, hora, status } =
    req.body;

  // Validação simples
  if (!cliente_id || !cabeleireiro_id || !servico_id || !data || !hora) {
    return res.status(400).json({
      erro: "Cliente, cabeleireiro, serviço, data e hora são obrigatórios",
    });
  }

  // Verifica se já existe outro agendamento no mesmo dia e horário (exceto o atual)
  const sqlVerifica = `
    SELECT id FROM agendamentos 
    WHERE cabeleireiro_id = ? AND data = ? AND hora = ? AND id != ? AND status != 'cancelado'
  `;

  conexao.query(sqlVerifica, [cabeleireiro_id, data, hora, id], (erroVerifica, resultadosVerifica) => {
    if (erroVerifica) {
      console.error("Erro ao verificar disponibilidade:", erroVerifica);
      return res.status(500).json({ erro: "Erro ao verificar disponibilidade" });
    }

    // Se já existe outro agendamento, retorna erro
    if (resultadosVerifica.length > 0) {
      return res.status(400).json({
        erro: "Já existe um agendamento para este cabeleireiro neste dia e horário",
      });
    }

    const statusFinal = status || "agendado";

    const sql = `
      UPDATE agendamentos 
      SET cliente_id = ?, cabeleireiro_id = ?, servico_id = ?, data = ?, hora = ?, status = ? 
      WHERE id = ?
    `;

    conexao.query(
      sql,
      [cliente_id, cabeleireiro_id, servico_id, data, hora, statusFinal, id],
      (erro, resultado) => {
        if (erro) {
          console.error("Erro ao atualizar agendamento:", erro);
          return res.status(500).json({ erro: "Erro ao atualizar agendamento" });
        }

        if (resultado.affectedRows === 0) {
          return res.status(404).json({ erro: "Agendamento não encontrado" });
        }

        res.json({ mensagem: "Agendamento atualizado com sucesso!" });
      }
    );
  });
});


router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM agendamentos WHERE id = ?";

  conexao.query(sql, [id], (erro, resultado) => {
    if (erro) {
      console.error("Erro ao excluir agendamento:", erro);
      return res.status(500).json({ erro: "Erro ao excluir agendamento" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }

    res.json({ mensagem: "Agendamento excluído com sucesso!" });
  });
});

module.exports = router;
