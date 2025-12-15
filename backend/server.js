const express = require("express");
const cors = require("cors");

const rotasClientes = require("./rotas/clientes");
const rotasCabeleireiros = require("./rotas/cabeleireiros");
const rotasServicos = require("./rotas/servicos");
const rotasAgendamentos = require("./rotas/agendamentos");

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use("/clientes", rotasClientes);
app.use("/cabeleireiros", rotasCabeleireiros);
app.use("/servicos", rotasServicos);
app.use("/agendamentos", rotasAgendamentos);

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
