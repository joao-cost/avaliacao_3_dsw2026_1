# Avaliação Final - Desenvolvimento Software Web (DSW) 2026/1

Este repositório contém o projeto da Avaliação Final da disciplina. Trata-se de um sistema de controle de equipamentos (CRUD completo) protegido com autenticação via Google (Firebase), validado tanto no frontend quanto no backend.

---

## 👥 Integrantes do Grupo
*Insira aqui os nomes dos integrantes do grupo (máximo 3 pessoas):*
1. **[Nome do Integrante 1]** - [RGA/Matrícula]
2. **[Nome do Integrante 2]** - [RGA/Matrícula]
3. **[Nome do Integrante 3]** - [RGA/Matrícula]

---

## 📂 Estrutura do Repositório

```text
├── backend/          # API desenvolvida em Node/Express usando Bun
│   ├── src/          # Código-fonte do backend (controllers, middlewares, config, rotas)
│   ├── .env.example  # Exemplo de configuração das variáveis de ambiente do backend
│   └── package.json  # Dependências e scripts do backend
├── frontend/         # Interface SPA da aplicação
│   ├── index.html    # Estrutura da página
│   ├── script.js     # Lógica de integração com Firebase e consumo da API
│   ├── style.css     # Estilização
│   └── firebase-config.example.js  # Modelo para configuração das credenciais do Firebase Web
├── dump.sql          # Estrutura do banco de dados MySQL e dados iniciais
└── .env.example      # Modelo global de variáveis de ambiente
```

---

## ⚙️ Configuração Local

Para rodar a aplicação localmente sem expor dados confidenciais (chaves de API e credenciais do Firebase Admin) no GitHub, o projeto foi configurado para carregar todas as variáveis a partir de arquivos locais ignorados pelo Git (`.env` e `firebase-config.local.js`).

### 1. Banco de Dados (MySQL)
1. Importe o arquivo `dump.sql` no seu servidor de banco de dados MySQL para criar o banco de dados `dsw_equipamentos` e as tabelas necessárias.
2. Certifique-se de que o seu servidor MySQL esteja rodando (geralmente na porta `3306`).

### 2. Configurando as Variáveis de Ambiente
1. Entre na pasta `backend/`.
2. Duplique o arquivo `.env.example` e renomeie-o para `.env`.
3. Preencha as credenciais do seu banco de dados MySQL e insira as credenciais do Firebase (tanto do Firebase Admin para o backend quanto do Firebase Web para o frontend).
   - O campo `FIREBASE_PRIVATE_KEY` deve conter a chave privada entre aspas duplas, com os caracteres de quebra de linha `\n` mantidos para o parser Javascript formatá-la corretamente.
   - Os campos `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, etc. devem conter as credenciais do Firebase Web de sua aplicação. O frontend carregará essas chaves dinamicamente do backend, eliminando a necessidade de arquivos de configuração locais no frontend.

---

## 🚀 Como Executar

### Executando o Backend
O backend utiliza o runtime **Bun** para excelente performance e inicialização rápida.
1. Navegue até a pasta `backend/`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   bun install
   ```
3. Inicie o servidor em modo de desenvolvimento (com auto-reload):
   ```bash
   bun dev
   ```
   *O servidor rodará em `http://localhost:3000`.*

### Executando o Frontend
O frontend é um cliente estático simples.
1. Abra o arquivo `frontend/index.html` diretamente no seu navegador, ou utilize qualquer servidor de arquivos estáticos local (como o Live Server do VS Code).
2. Faça login com o Google para gerar o ID Token, validar com o backend e liberar o CRUD de equipamentos.
