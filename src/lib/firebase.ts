import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
  deleteUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  Firestore,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with the exact firestoreDatabaseId from firebase-applet-config.json
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Enable local persistence so authenticated sessions persist across page refreshes
try {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Graceful fallback in private browsing or restricted iframe
  });
} catch (_) {}

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Operation Types for error tracing & security diagnostics
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Robust contextual error handler for Firestore operations
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('[Firestore Error]:', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Diagnostic test connection to Cloud Firestore
 */
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Conexão com Cloud Firestore estabelecida com sucesso.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] O cliente Firestore está offline ou sem conexão.');
    } else {
      console.info('[Firebase] Teste de conectividade concluído.');
    }
    return false;
  }
}

/**
 * Ensures a user profile exists in Firestore upon login
 */
async function ensureUserProfileInFirestore(user: User): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      const initialProfile = {
        id: user.uid,
        name: (user.displayName || user.email?.split('@')[0] || 'Usuário').slice(0, 100),
        email: (user.email || 'usuario@nutrilense.app').slice(0, 150),
        dietaryRestrictions: [],
        targetCalories: 2000,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, initialProfile);
      console.log(`[Firebase Auth] Perfil inicial do usuário criado no Firestore: ${user.uid}`);
    }
  } catch (err) {
    // If permissions prevent immediate write or offline, log warning without breaking auth
    console.warn('[Firebase Auth] Sincronização preliminar do perfil ignorada ou diferida:', err);
  }
}

/**
 * Autentica o usuário via Google Popup e sincroniza seu perfil com o Cloud Firestore
 */
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Asynchronously guarantee/sync base user profile in Firestore
    await ensureUserProfileInFirestore(user);
    
    return user;
  } catch (error: any) {
    // Handle typical popup closed or blocked errors with friendly messages
    if (error?.code === 'auth/popup-closed-by-user') {
      console.warn('[Firebase Auth] O popup de login do Google foi fechado antes de concluir.');
    } else if (error?.code === 'auth/cancelled-popup-request') {
      console.warn('[Firebase Auth] Solicitação de popup cancelada.');
    } else {
      console.error('[Firebase Auth] Erro ao autenticar com Google:', error);
    }
    throw error;
  }
}

/**
 * Alias de loginWithGoogle para conveniência
 */
export const signInWithGoogle = loginWithGoogle;

/**
 * Desconecta o usuário do Firebase Auth
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    console.log('[Firebase Auth] Usuário desconectado com sucesso.');
  } catch (error) {
    console.error('[Firebase Auth] Erro ao desconectar:', error);
    throw error;
  }
}

/**
 * Alias de logoutUser
 */
export const signOutUser = logoutUser;

/**
 * Retorna o usuário autenticado atualmente no Firebase
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Exclui a conta do usuário e seus dados associados
 */
async function deleteAccount(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    // Delete user document in Firestore
    await deleteDoc(doc(db, 'users', user.uid));
    
    // Delete user from Auth
    await deleteUser(user);
    
    console.log('[Firebase Auth] Conta do usuário excluída com sucesso.');
  } catch (error) {
    console.error('[Firebase Auth] Erro ao excluir conta:', error);
    throw error;
  }
}

export { firebaseConfig, onAuthStateChanged, deleteAccount };
export default app;
