-- ========================================
-- SCRIPT DO BANCO DE DADOS - BARBEARIA
-- Execute este script no MySQL para criar as tabelas
-- ========================================

-- Criando o banco de dados
CREATE DATABASE IF NOT EXISTS barbearia;

-- Usando o banco de dados
USE barbearia;

-- ========================================
-- TABELA: CLIENTES
-- ========================================
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco VARCHAR(200),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: CABELEIREIROS
-- ========================================
CREATE TABLE IF NOT EXISTS cabeleireiros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: SERVIÇOS
-- ========================================
CREATE TABLE IF NOT EXISTS servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: AGENDAMENTOS
-- ========================================
CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    cabeleireiro_id INT NOT NULL,
    servico_id INT NOT NULL,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'agendado',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Chaves estrangeiras (relacionamentos)
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (cabeleireiro_id) REFERENCES cabeleireiros(id) ON DELETE CASCADE,
    FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE
);

-- ========================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ========================================

-- Inserindo alguns clientes de exemplo
INSERT INTO clientes (nome, telefone, endereco) VALUES 
('João Silva', '(11) 99999-1111', 'Rua das Flores, 123'),
('Maria Santos', '(11) 99999-2222', 'Av. Brasil, 456'),
('Pedro Oliveira', '(11) 99999-3333', 'Rua do Comércio, 789');

-- Inserindo alguns cabeleireiros de exemplo
INSERT INTO cabeleireiros (nome, especialidade, telefone) VALUES 
('Carlos Barbeiro', 'Cortes masculinos', '(11) 98888-1111'),
('Ana Estilista', 'Coloração e mechas', '(11) 98888-2222'),
('Lucas Hair', 'Barba e bigode', '(11) 98888-3333');

-- Inserindo alguns serviços de exemplo
INSERT INTO servicos (nome, preco) VALUES 
('Corte masculino', 35.00),
('Corte feminino', 50.00),
('Barba', 25.00),
('Corte + Barba', 55.00),
('Hidratação', 40.00),
('Coloração', 80.00);

-- Inserindo alguns agendamentos de exemplo
INSERT INTO agendamentos (cliente_id, cabeleireiro_id, servico_id, data, hora, status) VALUES 
(1, 1, 1, '2025-12-10', '09:00:00', 'agendado'),
(2, 2, 5, '2025-12-10', '10:30:00', 'agendado'),
(3, 3, 3, '2025-12-10', '14:00:00', 'agendado');
