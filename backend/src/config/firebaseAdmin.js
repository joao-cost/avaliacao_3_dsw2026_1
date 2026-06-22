import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

async function obterServiceAccount() {
  // 1. Tenta carregar a partir das variáveis de ambiente individuais
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n'),
    };
  }

  // 2. Fallback: tenta carregar a partir do JSON inteiro em uma única string no .env
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (erro) {
      console.error('[FIREBASE] Erro ao fazer parse de FIREBASE_SERVICE_ACCOUNT_JSON:', erro.message);
    }
  }

  // 3. Fallback legada: tenta ler o arquivo físico se FIREBASE_SERVICE_ACCOUNT_FILE estiver definido
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
  if (filePath) {
    try {
      const absolutePath = resolve(process.cwd(), filePath);
      const conteudo = await readFile(absolutePath, 'utf8');
      return JSON.parse(conteudo);
    } catch (erro) {
      console.warn(`[FIREBASE] Não foi possível ler o arquivo serviceAccount especificado em FIREBASE_SERVICE_ACCOUNT_FILE: ${erro.message}`);
    }
  }

  throw new Error(
    'Configuração do Firebase Admin ausente. Defina as variáveis (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) no arquivo .env.'
  );
}

const serviceAccount = await obterServiceAccount();

const firebaseAdminApp = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert(serviceAccount) });

export const firebaseAuth = getAuth(firebaseAdminApp);