import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from '../../dsw2026-1-3f2df-firebase-adminsdk-fbsvc-0aef5ffad8.json' with { type: 'json' };

const firebaseAdminApp = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert(serviceAccount) });

export const firebaseAuth = getAuth(firebaseAdminApp);