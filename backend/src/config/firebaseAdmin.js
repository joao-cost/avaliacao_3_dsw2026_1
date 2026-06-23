import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function obterServiceAccount() {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n'),
    };
  }

  throw new Error(
    'Configuração do Firebase Admin ausente. Defina as variáveis (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) no arquivo .env.'
  );
}

const serviceAccount = obterServiceAccount();

const firebaseAdminApp = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert(serviceAccount) });

export const firebaseAuth = getAuth(firebaseAdminApp);