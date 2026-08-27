import { useState } from 'react'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

export function Login() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validateEmail = (emailStr: string): boolean => {
    return emailStr.toLowerCase().endsWith('@uagro.mx')
  }

  const handleGoogleAuth = async () => {
    setError(null)
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Validar dominio del correo de Google
      if (user.email && !validateEmail(user.email)) {
        setError('Acceso denegado: Tu cuenta de Google no pertenece al dominio @uagro.mx')
        await signOut(auth)
      }
    } catch (err: any) {
      console.error(err)
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Error al iniciar sesión con Google.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      {/* Círculos de fondo decorativos con gradiente */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl"></div>
      <div className="absolute -bottom-45 -right-40 h-[30rem] w-[30rem] rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div className="w-full max-w-md z-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md text-center">
          {/* Header */}
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
              VIGMAT 2D
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Plataforma de análisis de vigas matriciales.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Inicia sesión con tu cuenta institucional para acceder.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-200 text-left">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Google Login Button */}
          <div className="mt-8">
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-5 py-3.5 text-base font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 transition shadow-lg"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.83 21.56,11.4 21.35,11.1z" fill="#4285F4" />
                    <path d="M12,20.6c2.43,0 4.47,-0.8 5.96,-2.2l-3.3,-2.58c-0.92,0.62 -2.1,0.98 -3.5,0.98 -2.34,0 -4.32,-1.58 -5.03,-3.7H2.7v2.66C4.18,18.7 7.82,20.6 12,20.6z" fill="#34A853" />
                    <path d="M6.97,13.1c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7s0.1,-1.16 0.28,-1.7V7.04H2.7C2.06,8.32 1.7,9.76 1.7,11.4s0.36,3.08 1,4.36L6.97,13.1z" fill="#FBBC05" />
                    <path d="M12,5.2c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,2.44 14.43,1.7 12,1.7 7.82,1.7 4.18,3.6 2.7,6.54l3.27,2.66C6.68,6.48 8.66,5.2 12,5.2z" fill="#EA4335" />
                  </g>
                </svg>
              )}
              {loading ? 'Accediendo...' : 'Iniciar Sesión'}
            </button>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            
          </div>
        </div>
      </div>
    </div>
  )
}
