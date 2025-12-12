
async function carregarCabeleireiros() {
    try {
        const resposta = await fetch(`${API_URL}/cabeleireiros`);
        const cabeleireiros = await resposta.json();
        
        const tabela = document.getElementById('tabela-cabeleireiros');
        
        // Limpa a tabela
        tabela.innerHTML = '';
        
        // Se não houver cabeleireiros
        if (cabeleireiros.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">Nenhum cabeleireiro cadastrado</td>
                </tr>
            `;
            return;
        }
        
        // Adiciona cada cabeleireiro na tabela
        cabeleireiros.forEach(cabeleireiro => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${cabeleireiro.id}</td>
                <td>${cabeleireiro.nome}</td>
                <td>${cabeleireiro.especialidade}</td>
                <td>${cabeleireiro.telefone}</td>
                <td class="acoes">
                    <button class="botao-editar" onclick="editarCabeleireiro(${cabeleireiro.id})">Editar</button>
                    <button class="botao-excluir" onclick="excluirCabeleireiro(${cabeleireiro.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
        
    } catch (erro) {
        console.error('Erro ao carregar cabeleireiros:', erro);
        alert('Erro ao carregar cabeleireiros. Verifique se o servidor está rodando.');
    }
}

// ----------------------------------------
// CADASTRAR NOVO CABELEIREIRO
// ----------------------------------------
async function cadastrarCabeleireiro(evento) {
    evento.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const especialidade = document.getElementById('especialidade').value;
    const telefone = document.getElementById('telefone').value;
    
    try {
        const resposta = await fetch(`${API_URL}/cabeleireiros`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, especialidade, telefone })
        });
        
        const dados = await resposta.json();
        
        if (resposta.ok) {
            alert('Cabeleireiro cadastrado com sucesso!');
            window.location.href = 'lista-cabeleireiros.html';
        } else {
            alert('Erro: ' + dados.erro);
        }
        
    } catch (erro) {
        console.error('Erro ao cadastrar cabeleireiro:', erro);
        alert('Erro ao cadastrar cabeleireiro. Verifique se o servidor está rodando.');
    }
}

// ----------------------------------------
// EDITAR CABELEIREIRO - Redireciona para página de edição
// ----------------------------------------
function editarCabeleireiro(id) {
    window.location.href = `cadastrar-cabeleireiro.html?id=${id}`;
}

// ----------------------------------------
// CARREGAR DADOS DO CABELEIREIRO PARA EDIÇÃO
// ----------------------------------------
async function carregarCabeleireiroParaEdicao() {
    // Pega o ID da URL
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');
    
    if (!id) return; // Se não tem ID, é cadastro novo
    
    try {
        const resposta = await fetch(`${API_URL}/cabeleireiros/${id}`);
        const cabeleireiro = await resposta.json();
        
        if (resposta.ok) {
            // Preenche os campos do formulário
            document.getElementById('nome').value = cabeleireiro.nome;
            document.getElementById('especialidade').value = cabeleireiro.especialidade;
            document.getElementById('telefone').value = cabeleireiro.telefone;
            
            // Muda o título da página
            document.querySelector('h1').textContent = 'Editar Cabeleireiro';
            document.querySelector('h2').textContent = 'Editar Cabeleireiro';
            document.querySelector('.botao-salvar').textContent = 'Atualizar';
            
            // Guarda o ID para usar na atualização
            document.getElementById('formulario-cabeleireiro').dataset.id = id;
        } else {
            alert('Cabeleireiro não encontrado');
            window.location.href = 'lista-cabeleireiros.html';
        }
        
    } catch (erro) {
        console.error('Erro ao carregar cabeleireiro:', erro);
        alert('Erro ao carregar dados do cabeleireiro.');
    }
}

// ----------------------------------------
// ATUALIZAR CABELEIREIRO
// ----------------------------------------
async function atualizarCabeleireiro(id, dados) {
    try {
        const resposta = await fetch(`${API_URL}/cabeleireiros/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        const resultado = await resposta.json();
        
        if (resposta.ok) {
            alert('Cabeleireiro atualizado com sucesso!');
            window.location.href = 'lista-cabeleireiros.html';
        } else {
            alert('Erro: ' + resultado.erro);
        }
        
    } catch (erro) {
        console.error('Erro ao atualizar cabeleireiro:', erro);
        alert('Erro ao atualizar cabeleireiro.');
    }
}

// ----------------------------------------
// SALVAR CABELEIREIRO (CADASTRAR OU ATUALIZAR)
// ----------------------------------------
async function salvarCabeleireiro(evento) {
    evento.preventDefault();
    
    const formulario = document.getElementById('formulario-cabeleireiro');
    const id = formulario.dataset.id;
    
    const dados = {
        nome: document.getElementById('nome').value,
        especialidade: document.getElementById('especialidade').value,
        telefone: document.getElementById('telefone').value
    };
    
    if (id) {
        // Se tem ID, é atualização
        await atualizarCabeleireiro(id, dados);
    } else {
        // Se não tem ID, é cadastro novo
        await cadastrarCabeleireiro(evento);
    }
}

// ----------------------------------------
// EXCLUIR CABELEIREIRO
// ----------------------------------------
async function excluirCabeleireiro(id) {
    if (!confirm('Tem certeza que deseja excluir este cabeleireiro?')) {
        return;
    }
    
    try {
        const resposta = await fetch(`${API_URL}/cabeleireiros/${id}`, {
            method: 'DELETE'
        });
        
        const dados = await resposta.json();
        
        if (resposta.ok) {
            alert('Cabeleireiro excluído com sucesso!');
            carregarCabeleireiros(); // Recarrega a lista
        } else {
            alert('Erro: ' + dados.erro);
        }
        
    } catch (erro) {
        console.error('Erro ao excluir cabeleireiro:', erro);
        alert('Erro ao excluir cabeleireiro.');
    }
}

// ----------------------------------------
// INICIALIZAÇÃO
// ----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Se estiver na página de lista
    if (document.getElementById('tabela-cabeleireiros')) {
        carregarCabeleireiros();
    }
    
    // Se estiver na página de cadastro/edição
    if (document.getElementById('formulario-cabeleireiro')) {
        carregarCabeleireiroParaEdicao();
        document.getElementById('formulario-cabeleireiro').addEventListener('submit', salvarCabeleireiro);
    }
});
