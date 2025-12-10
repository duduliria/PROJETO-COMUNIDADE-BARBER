// ========================================
// AGENDAMENTOS - FUNÇÕES DO FRONTEND
// Arquivo com todas as funções para gerenciar agendamentos
// ========================================

// ----------------------------------------
// CARREGAR LISTA DE AGENDAMENTOS
// ----------------------------------------
async function carregarAgendamentos() {
    try {
        const resposta = await fetch(`${API_URL}/agendamentos`);
        const agendamentos = await resposta.json();
        
        const tabela = document.getElementById('tabela-agendamentos');
        
        // Limpa a tabela
        tabela.innerHTML = '';
        
        // Se não houver agendamentos
        if (agendamentos.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center;">Nenhum agendamento cadastrado</td>
                </tr>
            `;
            return;
        }
        
        // Adiciona cada agendamento na tabela
        agendamentos.forEach(agendamento => {
            const linha = document.createElement('tr');
            
            // Formata a data
            const data = new Date(agendamento.data);
            const dataFormatada = data.toLocaleDateString('pt-BR');
            
            // Formata a hora
            const hora = agendamento.hora.substring(0, 5);
            
            // Define a cor do status
            let corStatus = '';
            switch (agendamento.status) {
                case 'agendado':
                    corStatus = 'status-agendado';
                    break;
                case 'concluido':
                    corStatus = 'status-concluido';
                    break;
                case 'cancelado':
                    corStatus = 'status-cancelado';
                    break;
            }
            
            linha.innerHTML = `
                <td>${agendamento.id}</td>
                <td>${agendamento.cliente_nome || '-'}</td>
                <td>${agendamento.cabeleireiro_nome || '-'}</td>
                <td>${agendamento.servico_nome || '-'}</td>
                <td>${dataFormatada}</td>
                <td>${hora}</td>
                <td><span class="status ${corStatus}">${agendamento.status}</span></td>
                <td class="acoes">
                    <button class="botao-editar" onclick="editarAgendamento(${agendamento.id})">✏️ Editar</button>
                    <button class="botao-excluir" onclick="excluirAgendamento(${agendamento.id})">🗑️ Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
        
    } catch (erro) {
        console.error('Erro ao carregar agendamentos:', erro);
        alert('Erro ao carregar agendamentos. Verifique se o servidor está rodando.');
    }
}

// ----------------------------------------
// CARREGAR OPÇÕES DOS SELECTS (CLIENTES, CABELEIREIROS, SERVIÇOS)
// ----------------------------------------
async function carregarOpcoesSelects() {
    try {
        // Carrega clientes
        const respostaClientes = await fetch(`${API_URL}/clientes`);
        const clientes = await respostaClientes.json();
        const selectCliente = document.getElementById('cliente');
        
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nome;
            selectCliente.appendChild(option);
        });
        
        // Carrega cabeleireiros
        const respostaCabeleireiros = await fetch(`${API_URL}/cabeleireiros`);
        const cabeleireiros = await respostaCabeleireiros.json();
        const selectCabeleireiro = document.getElementById('cabeleireiro');
        
        cabeleireiros.forEach(cabeleireiro => {
            const option = document.createElement('option');
            option.value = cabeleireiro.id;
            option.textContent = cabeleireiro.nome;
            selectCabeleireiro.appendChild(option);
        });
        
        // Carrega serviços
        const respostaServicos = await fetch(`${API_URL}/servicos`);
        const servicos = await respostaServicos.json();
        const selectServico = document.getElementById('servico');
        
        servicos.forEach(servico => {
            const option = document.createElement('option');
            option.value = servico.id;
            option.textContent = `${servico.nome} - R$ ${parseFloat(servico.preco).toFixed(2).replace('.', ',')}`;
            selectServico.appendChild(option);
        });
        
    } catch (erro) {
        console.error('Erro ao carregar opções:', erro);
        alert('Erro ao carregar opções. Verifique se o servidor está rodando.');
    }
}

// ----------------------------------------
// CADASTRAR NOVO AGENDAMENTO
// ----------------------------------------
async function cadastrarAgendamento(evento) {
    evento.preventDefault();
    
    const cliente_id = document.getElementById('cliente').value;
    const cabeleireiro_id = document.getElementById('cabeleireiro').value;
    const servico_id = document.getElementById('servico').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const status = document.getElementById('status').value;
    
    try {
        const resposta = await fetch(`${API_URL}/agendamentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cliente_id, cabeleireiro_id, servico_id, data, hora, status })
        });
        
        const dados = await resposta.json();
        
        if (resposta.ok) {
            alert('Agendamento cadastrado com sucesso!');
            window.location.href = 'lista-agendamentos.html';
        } else {
            alert('Erro: ' + dados.erro);
        }
        
    } catch (erro) {
        console.error('Erro ao cadastrar agendamento:', erro);
        alert('Erro ao cadastrar agendamento. Verifique se o servidor está rodando.');
    }
}

// ----------------------------------------
// EDITAR AGENDAMENTO - Redireciona para página de edição
// ----------------------------------------
function editarAgendamento(id) {
    window.location.href = `novo-agendamento.html?id=${id}`;
}

// ----------------------------------------
// CARREGAR DADOS DO AGENDAMENTO PARA EDIÇÃO
// ----------------------------------------
async function carregarAgendamentoParaEdicao() {
    // Pega o ID da URL
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');
    
    if (!id) return; // Se não tem ID, é cadastro novo
    
    try {
        const resposta = await fetch(`${API_URL}/agendamentos/${id}`);
        const agendamento = await resposta.json();
        
        if (resposta.ok) {
            // Aguarda um pouco para garantir que os selects foram carregados
            setTimeout(() => {
                // Preenche os campos do formulário
                document.getElementById('cliente').value = agendamento.cliente_id;
                document.getElementById('cabeleireiro').value = agendamento.cabeleireiro_id;
                document.getElementById('servico').value = agendamento.servico_id;
                
                // Formata a data para o input date (YYYY-MM-DD)
                const data = new Date(agendamento.data);
                const dataFormatada = data.toISOString().split('T')[0];
                document.getElementById('data').value = dataFormatada;
                
                // Formata a hora
                document.getElementById('hora').value = agendamento.hora.substring(0, 5);
                document.getElementById('status').value = agendamento.status;
            }, 500);
            
            // Muda o título da página
            document.querySelector('h1').textContent = '📝 Editar Agendamento';
            document.querySelector('.botao-salvar').textContent = 'Atualizar';
            
            // Guarda o ID para usar na atualização
            document.getElementById('formulario-agendamento').dataset.id = id;
        } else {
            alert('Agendamento não encontrado');
            window.location.href = 'lista-agendamentos.html';
        }
        
    } catch (erro) {
        console.error('Erro ao carregar agendamento:', erro);
        alert('Erro ao carregar dados do agendamento.');
    }
}

// ----------------------------------------
// ATUALIZAR AGENDAMENTO
// ----------------------------------------
async function atualizarAgendamento(id, dados) {
    try {
        const resposta = await fetch(`${API_URL}/agendamentos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        const resultado = await resposta.json();
        
        if (resposta.ok) {
            alert('Agendamento atualizado com sucesso!');
            window.location.href = 'lista-agendamentos.html';
        } else {
            alert('Erro: ' + resultado.erro);
        }
        
    } catch (erro) {
        console.error('Erro ao atualizar agendamento:', erro);
        alert('Erro ao atualizar agendamento.');
    }
}

// ----------------------------------------
// SALVAR AGENDAMENTO (CADASTRAR OU ATUALIZAR)
// ----------------------------------------
async function salvarAgendamento(evento) {
    evento.preventDefault();
    
    const formulario = document.getElementById('formulario-agendamento');
    const id = formulario.dataset.id;
    
    const dados = {
        cliente_id: document.getElementById('cliente').value,
        cabeleireiro_id: document.getElementById('cabeleireiro').value,
        servico_id: document.getElementById('servico').value,
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        status: document.getElementById('status').value
    };
    
    if (id) {
        // Se tem ID, é atualização
        await atualizarAgendamento(id, dados);
    } else {
        // Se não tem ID, é cadastro novo
        await cadastrarAgendamento(evento);
    }
}

// ----------------------------------------
// EXCLUIR AGENDAMENTO
// ----------------------------------------
async function excluirAgendamento(id) {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) {
        return;
    }
    
    try {
        const resposta = await fetch(`${API_URL}/agendamentos/${id}`, {
            method: 'DELETE'
        });
        
        const dados = await resposta.json();
        
        if (resposta.ok) {
            alert('Agendamento excluído com sucesso!');
            carregarAgendamentos(); // Recarrega a lista
        } else {
            alert('Erro: ' + dados.erro);
        }
        
    } catch (erro) {
        console.error('Erro ao excluir agendamento:', erro);
        alert('Erro ao excluir agendamento.');
    }
}

// ----------------------------------------
// INICIALIZAÇÃO
// ----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Se estiver na página de lista
    if (document.getElementById('tabela-agendamentos')) {
        carregarAgendamentos();
    }
    
    // Se estiver na página de cadastro/edição
    if (document.getElementById('formulario-agendamento')) {
        carregarOpcoesSelects();
        carregarAgendamentoParaEdicao();
        document.getElementById('formulario-agendamento').addEventListener('submit', salvarAgendamento);
    }
});
