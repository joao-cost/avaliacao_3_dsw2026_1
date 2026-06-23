# Relatório de Implementação e Implantação - DSW 2026/1

Este documento apresenta a estrutura do projeto da **Avaliação Final de Desenvolvimento Software Web (DSW)**, detalhando as decisões de arquitetura de deploy, justificativa do uso de IA no processo, segurança e instrução de execução.

---

## 👥 Integrantes do Grupo
* **Joao Vitor de Souza Costa**
* **Inglid Pablina de A. Sandeski**
* **Fellipe Tomasella**

---

## 📂 Estrutura de Pastas

A estrutura organizacional do projeto é apresentada a seguir:

```text
├── .env.example
├── .gitignore
├── README.md
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── database.sql
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── config/
│       │   ├── database.js
│       │   └── firebaseAdmin.js
│       ├── controllers/
│       │   └── equipamentosController.js
│       ├── middleware/
│       │   └── authMiddleware.js
│       └── routes/
│           ├── authRoutes.js
│           └── equipamentosRoutes.js
└── frontend/
    ├── index.html
    ├── script.js
    └── style.css
```

---

## 🎨 1. Sobre a Refatoração do Frontend
A interface do frontend foi levemente refatorada para obter uma usabilidade melhor, mais responsiva e no padrão Dark Mode. As modificações foram apenas estéticas.
* Toda a lógica de interação (login via popup do Google no Firebase, captura de tokens de sessão e requisições HTTP do CRUD) foi mantida exatamente igual à especificação inicial do sistema.

---

## 🚀 2. Arquitetura do Deploy e Justificativa do Uso de IA
Originalmente, a equipe cogitou subir a aplicação de forma fracionada (um container Nginx para rodar o frontend estático e outro container Bun para o backend). 

No entanto, **utilizando Inteligência Artificial para analisar a infraestrutura da VPS**, identificamos restrições cruciais:
* O **Docker Swarm** (utilizado no servidor) não aceita compilação de código local no momento do deploy de stacks (ignora a diretiva `build`).
* Gerenciar dois containers separados para uma aplicação CRUD acadêmica de pequeno porte adicionava complexidade desnecessária na rede e nas portas.

A IA sugeriu o melhor caminho de arquitetura: **remover o Nginx** e fazer com que o próprio backend desenvolvido em **Bun/Express sirva os arquivos estáticos do frontend** (HTML/JS/CSS). Isso nos permitiu unificar tudo em **uma única imagem Docker**, simplificando drasticamente o deploy.

### Roteamento com Traefik:
O Traefik da VPS escuta a rede overlay externa **`HDSwarmNet`**. Ao receber requisições para o domínio `crud-equipamentos.hyperdynamis.com`, ele resolve automaticamente o certificado SSL (HTTPS) pelo resolvedor **`letsencryptresolver`** da VPS e direciona as requisições diretamente para a porta `3000` do nosso container único do Bun.

---

## 💾 3. Banco de Dados na VPS
Para manter a persistência isolada e seguir as boas práticas de microsserviços, o banco de dados MySQL não faz parte desta stack de aplicação. Ele roda de forma independente em outro container na VPS, e o nosso container Bun se conecta a ele de forma transparente utilizando a rede overlay comum e apontando para o host de rede interna `mysql` na porta `3306`.

---

## 🔒 4. Variáveis de Ambiente e Remoção de Credenciais (.env)
Durante a fase inicial de desenvolvimento, o **GitHub emitiu alertas de segurança** detectando credenciais do Firebase expostas no código. 

Para eliminar qualquer vulnerabilidade de vazamento de chaves e garantir o funcionamento seguro em produção:
1. **Remoção de Arquivos Sensíveis**: Todos os arquivos `.env` e arquivos físicos de chaves do Firebase foram completamente removidos do Git e inseridos no `.gitignore`.
2. **Injeção via VPS (Portainer)**: No ambiente de produção, as variáveis confidenciais (credenciais do Firebase Admin, chaves de API Web e credenciais do MySQL) são injetadas diretamente na interface do Portainer, salvando-as de forma segura na memória do container.
3. **Ofuscação e Carregamento Dinâmico**: Para ocultar as chaves no frontend, o JavaScript não possui dados estáticos. Ao carregar a página, ele consome a rota `/auth/config` do backend. O backend lê as variáveis seguras configuradas na VPS e as devolve dinamicamente para iniciar o Firebase no cliente.

---

## 🛠️ 5. Como Executar Localmente

### 1. Requisitos
* Runtime **Bun** instalado.
* Banco de dados MySQL rodando localmente.

### 2. Configuração
1. Na raiz do projeto (ou dentro da pasta `/backend`), crie um arquivo `.env` baseado nas credenciais do seu projeto do Firebase e banco local.
2. Importe o arquivo `backend/database.sql` no seu MySQL local para criar a estrutura.

### 3. Execução
1. Entre na pasta `/backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   bun install
   ```
3. Rode o servidor de desenvolvimento:
   ```bash
   bun run dev
   ```
4. O Bun servirá o frontend e a API juntos. Basta acessar **`http://localhost:3000`** no seu navegador (ou continuar rodando a pasta `frontend` pelo Live Server do VS Code, apontando as chamadas para o backend local).
