import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
};

// Helper to detect missing configuration early (both server and client side)
function validateFirebaseConfig(config) {
  const missing = Object.entries(config).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length > 0) {
    const message = `Firebase client config missing: ${missing.join(', ')}`;
    // eslint-disable-next-line no-console
    console.error(message);
    return { ok: false, missing };
  }
  if (!config.apiKey.startsWith('AIza')) {
    // eslint-disable-next-line no-console
    console.error('Firebase apiKey format unexpected (should start with AIza).');
    return { ok: false, missing: ['apiKey-format'] };
  }
  return { ok: true, missing: [] };
}

// Always validate (server & client) so SSR/static build logs issues too
const validation = validateFirebaseConfig(firebaseConfig);
if (!validation.ok) {
  // Optionally throw in development to make failures obvious
  if (process.env.NODE_ENV === 'development') {
    throw new Error(`Firebase configuration incomplete. Missing: ${validation.missing.join(', ')}`);
  }
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
