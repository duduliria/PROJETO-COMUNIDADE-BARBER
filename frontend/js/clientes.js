// ========================================
// CLIENTES - FUNÇÕES DO FRONTEND
// Arquivo com todas as funções para gerenciar clientes
// ========================================

// ----------------------------------------
// CARREGAR LISTA DE CLIENTES
// ----------------------------------------
async function carregarClientes() {
    try {
        const resposta = await fetch(`${API_URL}/clientes`);
        const clientes = await resposta.json();
        
        const tabela = document.getElementById('tabela-clientes');
        
        // Limpa a tabela
        tabela.innerHTML = '';
        
        // Se não houver clientes
        if (clientes.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">Nenhum cliente cadastrado</td>
                </tr>
            `;
            return;
        }
        
        // Adiciona cada cliente na tabela
        clientes.forEach(cliente => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.endereco || '-'}</td>
                <td class="acoes">
                    <button class="botao-editar" onclick="editarCliente(${cliente.id})">Editar</button>
                    <button class="botao-excluir" onclick="excluirCliente(${cliente.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
        
    } catch (erro) {
        console.error('Erro ao carregar clientes:', erro);
        alert('Erro ao carregar clientes. Verifique se o servidor está rodando.');
    }
}

// ----------------------------------------
// CADASTRAR NOVO CLIENTE
// ----------------------------------------
async function cadastrarCliente(evento) {
    evento.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;
    
    try {
        const resposta = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, telefone, endereco })
        });
        
        const dados = await resposta.json();
        
        if (resposta.ok) {
            alert('Cliente cadastrado com sucesso!');
            window.location.href = 'lista-clientes.html';
        } else {
            alert('Erro: ' + dados.erro);
        }
        
    } catch (erro) {
        console.error('Erro ao cadastrar cliente:', erro);
        alert('Erro ao cadastrar cliente. Verifique se o servidor está rodando.');
    }
}

// ----------------------------------------
// EDITAR CLIENTE - Redireciona para página de edição
// ----------------------------------------
function editarCliente(id) {
    window.location.href = `cadastrar-cliente.html?id=${id}`;
}

// ----------------------------------------
// CARREGAR DADOS DO CLIENTE PARA EDIÇÃO
// ----------------------------------------
async function carregarClienteParaEdicao() {
    // Pega o ID da URL
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');
    
    if (!id) return; // Se não tem ID, é cadastro novo
    
    try {
        const resposta = await fetch(`${API_URL}/clientes/${id}`);
        const cliente = await resposta.json();
        
        if (resposta.ok) {
            // Preenche os campos do formulário
            document.getElementById('nome').value = cliente.nome;
            document.getElementById('telefone').value = cliente.telefone;
            document.getElementById('endereco').value = cliente.endereco || '';
            
            // Muda o título da página
            document.querySelector('h1').textContent = 'Editar Cliente';
            document.querySelector('h2').textContent = 'Editar Cliente';
            document.querySelector('.botao-salvar').textContent = 'Atualizar';
            
            // Guarda o ID para usar na atualização
            document.getElementById('formulario-cliente').dataset.id = id;
        } else {
            alert('Cliente não encontrado');
            window.location.href = 'lista-clientes.html';
        }
        
    } catch (erro) {
        console.error('Erro ao carregar cliente:', erro);
        alert('Erro ao carregar dados do cliente.');
    }
}

// ----------------------------------------
// ATUALIZAR CLIENTE
// ----------------------------------------
async function atualizarCliente(id, dados) {
    try {
        const resposta = await fetch(`${API_URL}/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        const resultado = await resposta.json();
        
        if (resposta.ok) {
            alert('Cliente atualizado com sucesso!');
            window.location.href = 'lista-clientes.html';
        } else {
            alert('Erro: ' + resultado.erro);
        }
        
    } catch (erro) {
        console.error('Erro ao atualizar cliente:', erro);
        alert('Erro ao atualizar cliente.');
    }
}

// ----------------------------------------
// SALVAR CLIENTE (CADASTRAR OU ATUALIZAR)
// ----------------------------------------
async function salvarCliente(evento) {
    evento.preventDefault();
    
    const formulario = document.getElementById('formulario-cliente');
    const id = formulario.dataset.id;
    
    const dados = {
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value
    };
    
    if (id) {
        // Se tem ID, é atualização
        await atualizarCliente(id, dados);
    } else {
        // Se não tem ID, é cadastro novo
        await cadastrarCliente(evento);
    }
}

// ----------------------------------------
// EXCLUIR CLIENTE
// ----------------------------------------
async function excluirCliente(id) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
    }
    
    try {
        const resposta = await fetch(`${API_URL}/clientes/${id}`, {
            method: 'DELETE'
        });
        
        const dados = await resposta.json();
        
        if (resposta.ok) {
            alert('Cliente excluído com sucesso!');
            carregarClientes(); // Recarrega a lista
        } else {
            alert('Erro: ' + dados.erro);
        }
        
    } catch (erro) {
        console.error('Erro ao excluir cliente:', erro);
        alert('Erro ao excluir cliente.');
    }
}

// ----------------------------------------
// INICIALIZAÇÃO
// ----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Se estiver na página de lista
    if (document.getElementById('tabela-clientes')) {
        carregarClientes();
    }
    
    // Se estiver na página de cadastro/edição
    if (document.getElementById('formulario-cliente')) {
        carregarClienteParaEdicao();
        document.getElementById('formulario-cliente').addEventListener('submit', salvarCliente);
    }
});
