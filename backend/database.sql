CREATE DATABASE IF NOT EXISTS dsw_equipamentos;

USE dsw_equipamentos;

CREATE TABLE IF NOT EXISTS usuarios_autorizados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    perfil VARCHAR(30) NOT NULL DEFAULT 'usuario',
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    photo_url TEXT,
    token_usado LONGTEXT NOT NULL,
    last_login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    marca VARCHAR(50),
    modelo VARCHAR(50),
    setor VARCHAR(50),
    estado VARCHAR(30)
);

INSERT INTO usuarios_autorizados (nome, email, perfil, ativo) VALUES
('Seu Nome', 'seuemail@exemplo.com', 'admin', 1),
('Professor', 'professor@exemplo.com', 'admin', 1)
ON DUPLICATE KEY UPDATE
    nome = VALUES(nome),
    perfil = VALUES(perfil),
    ativo = VALUES(ativo);

INSERT INTO equipamentos (nome, marca, modelo, setor, estado) VALUES
('Notebook', 'Dell', 'Inspiron', 'TI', 'Bom'),
('Impressora', 'HP', 'LaserJet', 'Financeiro', 'Manutenção'),
('Projetor', 'Epson', 'X39', 'Sala de Aula', 'Bom');