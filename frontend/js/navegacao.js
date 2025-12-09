function marcarItemMenuAtivo() {
    // Pega todos os itens do menu lateral
    const itensMenu = document.querySelectorAll('.item-menu');
    
    // Pega a página atual baseada no nome do arquivo
    const paginaAtual = window.location.pathname.split('/').pop();
    
    // Primeiro, remove a classe 'ativo' de TODOS os itens
    itensMenu.forEach(function(item) {
        item.classList.remove('ativo');
    });
    
    
    // Agora percorre para marcar apenas o item correto
    itensMenu.forEach(function(item) {
        // Pega o link do item (atributo href)
        const linkDoItem = item.getAttribute('href');
        
        if (linkDoItem) {
            // Pega apenas o nome do arquivo do link (última parte após a última barra)
            const nomeArquivoDoLink = linkDoItem.split('/').pop();
            
            // Caso especial: se estamos na página principal (index.html ou vazio)
            if (paginaAtual === '' || paginaAtual === 'index.html') {
                // Marca apenas o item que aponta para index.html
                if (nomeArquivoDoLink === 'index.html') {
                    item.classList.add('ativo');
                }
            } else {
                // Para outras páginas, compara o nome exato do arquivo
                if (nomeArquivoDoLink === paginaAtual) {
                    item.classList.add('ativo');
                }
            }
        }
    });
}


function marcarBotaoAcaoAtivo(botaoClicado) {
    // Pega todos os botões de ação
    const botoesAcao = document.querySelectorAll('.botao-acao');
    
    // Remove a classe 'ativo' de todos os botões
    botoesAcao.forEach(function(botao) {
        botao.classList.remove('ativo');
        // Remove também a classe 'primario' para padronizar
        botao.classList.remove('primario');
    });
    
    // Adiciona a classe 'ativo' no botão clicado
    botaoClicado.classList.add('ativo');
}

// ----------------------------------------
// FUNÇÃO PARA ADICIONAR EVENTOS DE CLIQUE
// ----------------------------------------

function configurarBotoesAcaoRapida() {
    // Pega todos os botões de ação rápida
    const botoesAcao = document.querySelectorAll('.botao-acao');
    
    // Adiciona evento de clique em cada botão
    botoesAcao.forEach(function(botao) {
        botao.addEventListener('click', function(evento) {
            // Marca o botão como ativo
            marcarBotaoAcaoAtivo(this);
            
            // Pequeno atraso para mostrar o feedback visual antes de navegar
            // O navegador vai seguir o link normalmente após isso
        });
    });
}

// ----------------------------------------
// FUNÇÃO PARA ADICIONAR EVENTOS NO MENU
// ----------------------------------------

function configurarMenuLateral() {
    // Pega todos os itens do menu
    const itensMenu = document.querySelectorAll('.item-menu');
    
    // Adiciona evento de clique em cada item
    itensMenu.forEach(function(item) {
        item.addEventListener('click', function(evento) {
            // Remove classe ativo de todos
            itensMenu.forEach(function(i) {
                i.classList.remove('ativo');
            });
            
            // Adiciona classe ativo no item clicado
            this.classList.add('ativo');
        });
    });
}

// ----------------------------------------
// INICIALIZAÇÃO QUANDO A PÁGINA CARREGA
// ----------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    // Configura o menu lateral
    configurarMenuLateral();
    
    // Configura os botões de ação rápida
    configurarBotoesAcaoRapida();
    
    // Marca o item do menu correspondente à página atual
    marcarItemMenuAtivo();
    
    // Mensagem no console para debug
    console.log('Sistema de navegação carregado com sucesso!');
});
