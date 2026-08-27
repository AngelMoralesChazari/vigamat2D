import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Configuración de Firebase utilizando variables de entorno de Vite
// Las variables se definen en un archivo .env en la raíz del proyecto
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB0z6DBLBQvIeI5fP-dGJEGwdt1bvWNWik',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vigas-uagro.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vigas-uagro',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'vigas-uagro.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '151475808024',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:151475808024:web:087e0e38ae78b459e1e06d'
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Obtener servicios
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// Configurar Google Auth Provider para solicitar la selección de cuenta
googleProvider.setCustomParameters({
  prompt: 'select_account'
})
