import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BACKEND_URL = isLocalhost 
  ? 'http://localhost:3000' 
  : '';

const API = `${BACKEND_URL}/equipamentos`;
const AUTH_API = `${BACKEND_URL}/auth/session`;
const CONFIG_API = `${BACKEND_URL}/auth/config`;

let firebaseConfig = null;
let isConfigInvalid = true;
let app = null;
let auth = null;
let provider = null;

async function inicializarFirebase() {
  try {
    const resposta = await fetch(CONFIG_API);
    if (!resposta.ok) {
      throw new Error(`Erro HTTP ao obter config: ${resposta.status}`);
    }
    firebaseConfig = await resposta.json();
    isConfigInvalid = !firebaseConfig?.apiKey || firebaseConfig.apiKey === 'COLOQUE_SUA_CHAVE_AQUI';

    if (isConfigInvalid) {
      console.warn('[AUTH] Firebase config ausente ou inválida no backend .env.');
      mostrarAvisoConfig();
      return;
    }

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
    logAuth('Firebase inicializado do backend.');

    onAuthStateChanged(auth, async (loggedUser) => {
      logAuth('onAuthStateChanged disparado', { logado: Boolean(loggedUser), email: loggedUser?.email });
      usuarioAtual = loggedUser;

      if (loggedUser) {
        idTokenAtual = await loggedUser.getIdToken();
        logAuth('Token renovado pelo state listener', { tamanho: idTokenAtual?.length || 0 });
        localStorage.setItem('firebaseIdToken', idTokenAtual);
        atualizarInterfaceAutenticacao(loggedUser);
        await validarSessaoSalva();
        return;
      }

      await validarSessaoSalva();
    });
  } catch (erro) {
    console.error('[AUTH] Falha ao obter configuração do Firebase:', erro);
    mostrarAvisoConfig();
  }
}

function mostrarAvisoConfig() {
  const statusEl = document.getElementById('auth-status');
  if (statusEl) {
    statusEl.innerHTML = '<span style="color: #ff4a4a; font-weight: bold;">Configuração do Firebase ausente/inválida!</span><br><small style="color: #ccc;">Defina as variáveis no arquivo <code>backend/.env</code> e reinicie o backend.</small>';
  }
}

const form = document.getElementById('form-equipamento');
const crudArea = document.getElementById('crud-area');
const inputId = document.getElementById('equipamento-id');
const inputNome = document.getElementById('nome');
const inputMarca = document.getElementById('marca');
const inputModelo = document.getElementById('modelo');
const inputSetor = document.getElementById('setor');
const inputEstado = document.getElementById('estado');
const tituloForm = document.getElementById('titulo-form');
const btnCancelar = document.getElementById('btn-cancelar');
const btnGoogle = document.getElementById('btn-google');
const btnLogout = document.getElementById('btn-logout');
const panelLogin = document.getElementById('panel-login');
const panelLogged = document.getElementById('panel-logged');
const authName = document.getElementById('auth-name');
const authEmail = document.getElementById('auth-email');
const authPhoto = document.getElementById('auth-photo');
const authToken = document.getElementById('auth-token');
const tbody = document.querySelector('#tabela-equipamentos tbody');

let idTokenAtual = localStorage.getItem('firebaseIdToken') || '';
let usuarioAtual = null;

function logAuth(...mensagens) {
  console.log('[AUTH]', ...mensagens);
}

function atualizarInterfaceAutenticacao(loggedUser) {
  const autenticado = Boolean(loggedUser && idTokenAtual);

  crudArea.classList.toggle('hidden', !autenticado);
  panelLogin.classList.toggle('hidden', autenticado);
  panelLogged.classList.toggle('hidden', !autenticado);

  if (!loggedUser) {
    authPhoto.removeAttribute('src');
    authToken.textContent = '';
    authName.textContent = '';
    authEmail.textContent = '';
    return;
  }

  authName.textContent = loggedUser.displayName || 'Usuário';
  authEmail.textContent = loggedUser.email || '';
  authToken.textContent = idTokenAtual || '';

  if (loggedUser.photoURL) {
    authPhoto.src = loggedUser.photoURL;
  } else {
    authPhoto.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'; // Fallback
  }
}

async function obterDadosAutenticados(url, options = {}) {
  logAuth('Chamando API protegida', { url, method: options.method || 'GET' });

  if (!idTokenAtual) {
    logAuth('Sem token em memória ao chamar API protegida');
    throw new Error('Faça login para acessar esta área');
  }

  const resposta = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idTokenAtual}`,
      ...(options.headers || {}),
    },
  });

  logAuth('Resposta da API protegida', { url, status: resposta.status });

  if (resposta.status === 401 || resposta.status === 403) {
    logAuth('Sessão rejeitada pelo backend', { status: resposta.status });
    localStorage.removeItem('firebaseIdToken');
    idTokenAtual = '';
    usuarioAtual = null;
    atualizarInterfaceAutenticacao(null);
    throw new Error('Sessão inválida ou usuário não autorizado');
  }

  return resposta;
}

function criarCelula(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

function criarBotao(rotulo, classe, id) {
  const botao = document.createElement('button');
  botao.textContent = rotulo;
  botao.className = classe;
  botao.dataset.id = id;
  return botao;
}

async function listarProdutos() {
  logAuth('Iniciando listagem de equipamentos');
  const resposta = await obterDadosAutenticados(API);
  const equipamentos = await resposta.json();

  logAuth('Equipamentos recebidos', equipamentos.length);

  tbody.replaceChildren();
  equipamentos.forEach((equipamento) => {
    const tr = document.createElement('tr');
    tr.append(
      criarCelula(equipamento.id),
      criarCelula(equipamento.nome),
      criarCelula(equipamento.marca),
      criarCelula(equipamento.modelo),
      criarCelula(equipamento.setor),
      criarCelula(equipamento.estado),
    );

    const tdAcoes = document.createElement('td');
    tdAcoes.append(
      criarBotao('Editar', 'btn-editar', equipamento.id),
      criarBotao('Excluir', 'btn-excluir', equipamento.id),
    );
    tr.append(tdAcoes);

    tbody.append(tr);
  });
}

async function validarSessaoSalva() {
  logAuth('Validando sessão salva', { temToken: Boolean(idTokenAtual) });

  if (isConfigInvalid || !idTokenAtual) {
    atualizarInterfaceAutenticacao(null);
    return;
  }

  try {
    const resposta = await fetch(AUTH_API, {
      headers: {
        Authorization: `Bearer ${idTokenAtual}`,
      },
    });

    logAuth('Resposta da validação de sessão', { status: resposta.status });

    if (!resposta.ok) {
      throw new Error('Sessão salva inválida');
    }

    const dados = await resposta.json();
    logAuth('Sessão aprovada pelo backend', dados.user);
    usuarioAtual = dados.user;
    atualizarInterfaceAutenticacao({
      displayName: dados.user?.nome || dados.user?.displayName || 'Usuário autenticado',
      email: dados.user?.email || '',
      photoURL: dados.foto || dados.user?.picture || dados.user?.photoURL || '',
    });
    if (dados.tokenUsado) {
      logAuth('Token retornado pelo backend', `${dados.tokenUsado.slice(0, 28)}...`);
      authToken.textContent = `${dados.tokenUsado.slice(0, 28)}...`;
    }
    authStatus.textContent = 'Sessão revalidada com sucesso';
    await listarProdutos();
  } catch {
    localStorage.removeItem('firebaseIdToken');
    idTokenAtual = '';
    usuarioAtual = null;
    atualizarInterfaceAutenticacao(null);
  }
}

async function salvarProduto(evento) {
  evento.preventDefault();

  const dados = {
    nome: inputNome.value,
    marca: inputMarca.value,
    modelo: inputModelo.value,
    setor: inputSetor.value,
    estado: inputEstado.value,
  };

  const id = inputId.value;

  if (id) {
    await obterDadosAutenticados(`${API}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  } else {
    await obterDadosAutenticados(API, {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  resetarFormulario();
  listarProdutos();
}

async function editarProduto(id) {
  const resposta = await obterDadosAutenticados(`${API}/${id}`);
  const equipamento = await resposta.json();

  inputId.value = equipamento.id;
  inputNome.value = equipamento.nome;
  inputMarca.value = equipamento.marca;
  inputModelo.value = equipamento.modelo;
  inputSetor.value = equipamento.setor;
  inputEstado.value = equipamento.estado;
  if (tituloForm) tituloForm.textContent = 'Editar Equipamento';
  btnCancelar.hidden = false;
}

async function excluirProduto(id) {
  if (!confirm('Deseja excluir este equipamento?')) return;

  await obterDadosAutenticados(`${API}/${id}`, { method: 'DELETE' });
  listarProdutos();
}

function resetarFormulario() {
  form.reset();
  inputId.value = '';
  if (tituloForm) tituloForm.textContent = 'Cadastrar Equipamento';
  btnCancelar.hidden = true;
}

form.addEventListener('submit', salvarProduto);
btnCancelar.addEventListener('click', resetarFormulario);
btnGoogle.addEventListener('click', async () => {
  if (isConfigInvalid || !auth || !provider) {
    alert('Erro: O Firebase não foi configurado no backend. Por favor, edite o arquivo ".env" na pasta "backend" e insira sua FIREBASE_API_KEY real obtida no Console do Firebase.');
    return;
  }
  try {
    logAuth('Iniciando signInWithPopup');
    const resultado = await signInWithPopup(auth, provider);
    logAuth('Popup concluído', { email: resultado.user?.email });
    const credencial = await resultado.user.getIdToken();

    logAuth('ID token obtido', { tamanho: credencial?.length || 0 });

    localStorage.setItem('firebaseIdToken', credencial);
    idTokenAtual = credencial;
    usuarioAtual = resultado.user;

    atualizarInterfaceAutenticacao({
      ...resultado.user,
      photoURL: resultado.user.photoURL || resultado.user.providerData?.[0]?.photoURL || '',
    });

    const validacao = await fetch(AUTH_API, {
      headers: {
        Authorization: `Bearer ${idTokenAtual}`,
      },
    });

    logAuth('Resposta inicial da validação pós-login', { status: validacao.status });

    if (!validacao.ok) {
      const erro = await validacao.json().catch(() => ({}));
      logAuth('Backend recusou o usuário', erro);
      throw new Error(erro.erro || 'Usuário autenticado, mas não liberado no banco');
    }

    authStatus.textContent = 'Login validado com sucesso';
    logAuth('Login validado com sucesso, carregando CRUD');
    await listarProdutos();
  } catch (error) {
    logAuth('Falha no login Google', error);
    localStorage.removeItem('firebaseIdToken');
    idTokenAtual = '';
    usuarioAtual = null;
    atualizarInterfaceAutenticacao(null);
    authStatus.textContent = error.message || 'Falha ao autenticar';
  }
});

btnLogout.addEventListener('click', async () => {
  if (auth) {
    await signOut(auth);
  }
  localStorage.removeItem('firebaseIdToken');
  idTokenAtual = '';
  usuarioAtual = null;
  resetarFormulario();
  tbody.replaceChildren();
  atualizarInterfaceAutenticacao(null);
});

tbody.addEventListener('click', (evento) => {
  const id = evento.target.dataset.id;
  if (!id) return;

  if (evento.target.classList.contains('btn-editar')) {
    editarProduto(id);
  } else if (evento.target.classList.contains('btn-excluir')) {
    excluirProduto(id);
  }
});

logAuth('Aplicação carregada, tentando obter configs e revalidar sessão inicial');
inicializarFirebase().then(() => {
  validarSessaoSalva();
});
