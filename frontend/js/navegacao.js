function marcarItemMenuAtivo() {
    const itensMenu = document.querySelectorAll('.item-menu');
    const paginaAtual = window.location.pathname.split('/').pop();
    
    itensMenu.forEach(function(item) {
        item.classList.remove('ativo');
    });
    
    itensMenu.forEach(function(item) {
        const linkDoItem = item.getAttribute('href');
        
        if (linkDoItem) {
            const nomeArquivoDoLink = linkDoItem.split('/').pop();
            
            if (paginaAtual === '' || paginaAtual === 'index.html') {
                if (nomeArquivoDoLink === 'index.html') {
                    item.classList.add('ativo');
                }
            } else {
                if (nomeArquivoDoLink === paginaAtual) {
                    item.classList.add('ativo');
                }
            }
        }
    });
}


function marcarBotaoAcaoAtivo(botaoClicado) {
    const botoesAcao = document.querySelectorAll('.botao-acao');
    
    botoesAcao.forEach(function(botao) {
        botao.classList.remove('ativo');
        botao.classList.remove('primario');
    });
    
    botaoClicado.classList.add('ativo');
}

function configurarBotoesAcaoRapida() {
    const botoesAcao = document.querySelectorAll('.botao-acao');
    
    botoesAcao.forEach(function(botao) {
        botao.addEventListener('click', function(evento) {
            marcarBotaoAcaoAtivo(this);
        });
    });
}

function configurarMenuLateral() {
    const itensMenu = document.querySelectorAll('.item-menu');
    
    itensMenu.forEach(function(item) {
        item.addEventListener('click', function(evento) {
            itensMenu.forEach(function(i) {
                i.classList.remove('ativo');
            });
            
            this.classList.add('ativo');
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    configurarMenuLateral();
    configurarBotoesAcaoRapida();
    marcarItemMenuAtivo();
    console.log('Sistema de navegação carregado com sucesso!');
});
