// ========================================
// SERVIDOR PRINCIPAL - BARBEARIA
// ========================================

const express = require("express");
const cors = require("cors");

// Importando as rotas
const rotasClientes = require("./rotas/clientes");
const rotasCabeleireiros = require("./rotas/cabeleireiros");
const rotasServicos = require("./rotas/servicos");
const rotasAgendamentos = require("./rotas/agendamentos");

// Criando o servidor
const app = express();

// Middlewares
app.use(cors()); // Permite requisições de outros domínios
app.use(express.json()); // Permite receber JSON no body das requisições

// ========================================
// CONFIGURAÇÃO DAS ROTAS
// ========================================

app.use("/clientes", rotasClientes); // Rotas de clientes
app.use("/cabeleireiros", rotasCabeleireiros); // Rotas de cabeleireiros
app.use("/servicos", rotasServicos); // Rotas de serviços
app.use("/agendamentos", rotasAgendamentos); // Rotas de agendamentos

// Rota inicial para testar se o servidor está funcionando
app.get("/", (req, res) => {
  res.json({
    mensagem: "API da Barbearia funcionando!",
    rotas: {
      clientes: "/clientes",
      cabeleireiros: "/cabeleireiros",
      servicos: "/servicos",
      agendamentos: "/agendamentos",
    },
  });
});

// Iniciando o servidor
const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
  console.log(`Acesse: http://localhost:${PORTA}`);
});
