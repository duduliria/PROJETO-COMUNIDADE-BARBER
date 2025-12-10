// ========================================
// SERVIÇOS - FUNÇÕES DO FRONTEND
// Arquivo com todas as funções para gerenciar serviços
// ========================================

// ----------------------------------------
// CARREGAR LISTA DE SERVIÇOS
// ----------------------------------------
async function carregarServicos() {
    try {
        const resposta = await fetch(`${API_URL}/servicos`);
        const servicos = await resposta.json();
        
        const tabela = document.getElementById('tabela-servicos');
        
        // Limpa a tabela
        tabela.innerHTML = '';
        
        // Se não houver serviços
        if (servicos.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center;">Nenhum serviço cadastrado</td>
                </tr>
            `;
            return;
        }
        
        // Adiciona cada serviço na tabela
        servicos.forEach(servico => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${servico.id}</td>
                <td>${servico.nome}</td>
                <td>R$ ${parseFloat(servico.preco).toFixed(2).replace('.', ',')}</td>
                <td class="acoes">
                    <button class="botao-editar" onclick="editarServico(${servico.id})">✏️ Editar</button>
                    <button class="botao-excluir" onclick="excluirServico(${servico.id})">🗑️ Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
        
    } catch (erro) {
        console.error('Erro ao carregar serviços:', erro);
        alert('Erro ao carregar serviços. Verifique se o servidor está rodando.');
    }
}

// ----------------------------------------
// CADASTRAR NOVO SERVIÇO
// ----------------------------------------
async function cadastrarServico(evento) {
    evento.preventDefault();
    
    const nome = document.getElementById('nome-servico').value;
    const precoTexto = document.getElementById('preco').value;
    
    // Converte o preço para número (aceita vírgula ou ponto)
    const preco = parseFloat(precoTexto.replace(',', '.'));
    
    if (isNaN(preco)) {
        alert('Por favor, insira um preço válido');
        return;
    }
    
    try {
        const resposta = await fetch(`${API_URL}/servicos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, preco })
        });
        
        const dados = await resposta.json();
        
        if (resposta.ok) {
            alert('Serviço cadastrado com sucesso!');
            window.location.href = 'lista-servicos.html';
        } else {
            alert('Erro: ' + dados.erro);
        }
        
    } catch (erro) {
        console.error('Erro ao cadastrar serviço:', erro);
        alert('Erro ao cadastrar serviço. Verifique se o servidor está rodando.');
    }
}

// ----------------------------------------
// EDITAR SERVIÇO - Redireciona para página de edição
// ----------------------------------------
function editarServico(id) {
    window.location.href = `cadastrar-servico.html?id=${id}`;
}

// ----------------------------------------
// CARREGAR DADOS DO SERVIÇO PARA EDIÇÃO
// ----------------------------------------
async function carregarServicoParaEdicao() {
    // Pega o ID da URL
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');
    
    if (!id) return; // Se não tem ID, é cadastro novo
    
    try {
        const resposta = await fetch(`${API_URL}/servicos/${id}`);
        const servico = await resposta.json();
        
        if (resposta.ok) {
            // Preenche os campos do formulário
            document.getElementById('nome-servico').value = servico.nome;
            document.getElementById('preco').value = parseFloat(servico.preco).toFixed(2).replace('.', ',');
            
            // Muda o título da página
            document.querySelector('h1').textContent = 'Editar Serviço';
            document.querySelector('h2').textContent = 'Editar Serviço';
            document.querySelector('.botao-salvar').textContent = 'Atualizar';
            
            // Guarda o ID para usar na atualização
            document.getElementById('formulario-servico').dataset.id = id;
        } else {
            alert('Serviço não encontrado');
            window.location.href = 'lista-servicos.html';
        }
        
    } catch (erro) {
        console.error('Erro ao carregar serviço:', erro);
        alert('Erro ao carregar dados do serviço.');
    }
}

// ----------------------------------------
// ATUALIZAR SERVIÇO
// ----------------------------------------
async function atualizarServico(id, dados) {
    try {
        const resposta = await fetch(`${API_URL}/servicos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        const resultado = await resposta.json();
        
        if (resposta.ok) {
            alert('Serviço atualizado com sucesso!');
            window.location.href = 'lista-servicos.html';
        } else {
            alert('Erro: ' + resultado.erro);
        }
        
    } catch (erro) {
        console.error('Erro ao atualizar serviço:', erro);
        alert('Erro ao atualizar serviço.');
    }
}

// ----------------------------------------
// SALVAR SERVIÇO (CADASTRAR OU ATUALIZAR)
// ----------------------------------------
async function salvarServico(evento) {
    evento.preventDefault();
    
    const formulario = document.getElementById('formulario-servico');
    const id = formulario.dataset.id;
    
    const nome = document.getElementById('nome-servico').value;
    const precoTexto = document.getElementById('preco').value;
    const preco = parseFloat(precoTexto.replace(',', '.'));
    
    if (isNaN(preco)) {
        alert('Por favor, insira um preço válido');
        return;
    }
    
    const dados = { nome, preco };
    
    if (id) {
        // Se tem ID, é atualização
        await atualizarServico(id, dados);
    } else {
        // Se não tem ID, é cadastro novo
        await cadastrarServico(evento);
    }
}

// ----------------------------------------
// EXCLUIR SERVIÇO
// ----------------------------------------
async function excluirServico(id) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) {
        return;
    }
    
    try {
        const resposta = await fetch(`${API_URL}/servicos/${id}`, {
            method: 'DELETE'
        });
        
        const dados = await resposta.json();
        
        if (resposta.ok) {
            alert('Serviço excluído com sucesso!');
            carregarServicos(); // Recarrega a lista
        } else {
            alert('Erro: ' + dados.erro);
        }
        
    } catch (erro) {
        console.error('Erro ao excluir serviço:', erro);
        alert('Erro ao excluir serviço.');
    }
}

// ----------------------------------------
// INICIALIZAÇÃO
// ----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Se estiver na página de lista
    if (document.getElementById('tabela-servicos')) {
        carregarServicos();
    }
    
    // Se estiver na página de cadastro/edição
    if (document.getElementById('formulario-servico')) {
        carregarServicoParaEdicao();
        document.getElementById('formulario-servico').addEventListener('submit', salvarServico);
    }
});
