import { useState } from 'react'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

export function Login() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validateEmail = (emailStr: string): boolean => {
    return emailStr.toLowerCase().endsWith('@uagro.mx')
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Validar dominio del correo de Google
      if (user.email && !validateEmail(user.email)) {
        setError('Acceso denegado: Debes iniciar sesión con tu correo institucional @uagro.mx.')
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090d16] px-4 py-12 sm:px-6 lg:px-8">
      {/* Fondo con Cuadrícula y Líneas de Estructura de Armadura/Viga */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
          </pattern>
        </defs>
        
        {/* Rellenar con patrón de cuadrícula */}
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Líneas estructurales estilo vector */}
        <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1.5" fill="none">
          {/* Cuerda inferior */}
          <line x1="-10%" y1="60%" x2="110%" y2="60%" />
          {/* Diagonales */}
          <path d="M -10% 60% L 16% 60% L 37% 20% L 58% 60% L 79% 20% L 100% 60% L 110% 60%" />
          {/* Cuerda superior */}
          <line x1="37%" y1="20%" x2="79%" y2="20%" />
        </g>
        
        {/* Nodos (Círculos) */}
        <g fill="#090d16" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="2">
          <circle cx="16%" cy="60%" r="5" />
          <circle cx="37%" cy="20%" r="5" />
          <circle cx="58%" cy="60%" r="5" />
          <circle cx="79%" cy="20%" r="5" />
          <circle cx="100%" cy="60%" r="5" />
        </g>
      </svg>

      {/* Degradados de fondo suaves */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-sm z-10">
        <div className="rounded-3xl border border-white/5 bg-[#0f1524]/60 p-10 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-xl text-center">
          {/* Header */}
          <div>
            {/* Icono con efecto de gradiente/glowing (Span/Support) */}
            <div className="relative mx-auto h-16 w-16 mb-5">
              {/* Glow aura */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 blur-md opacity-80 animate-pulse"></div>
              {/* Actual icon */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white border border-white/20 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12,4 3,18 21,18" />
                  <line x1="1" y1="21" x2="23" y2="21" />
                </svg>
              </div>
            </div>
            {/* Título "Vigas" en gradiente */}
            <h2 className="mt-5 text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
              Vigas
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-200 text-left">
              <div className="flex items-start">
                <svg className="h-4.5 w-4.5 text-red-400 mr-2 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Botón de Autenticación de Google */}
          <div className="mt-8">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="group relative flex w-full justify-center items-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-slate-900 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                // Logo de Google
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.99,2.37 -2.1,3.12v2.6h3.39c1.98,-1.82 3.12,-4.5 3.12,-7.62c0,-0.61 -0.06,-1.2 -0.16,-1.8Z" fill="#4285F4" />
                    <path d="M12,20.6c2.43,0 4.47,-0.81 5.96,-2.2l-3.39,-2.6c-0.94,0.63 -2.15,1.0 -2.57,1.0c-2.47,0 -4.56,-1.67 -5.31,-3.92H3.19v2.68C4.67,18.06 8.08,20.6 12,20.6Z" fill="#34A853" />
                    <path d="M6.69,12.88c-0.19,-0.57 -0.3,-1.18 -0.3,-1.8c0,-0.62 0.11,-1.23 0.3,-1.8V6.6H3.19C2.43,8.12 2,9.82 2,11.6c0,1.78 0.43,3.48 1.19,5L6.69,12.88Z" fill="#FBBC05" />
                    <path d="M12,5.2c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.46,2.5 14.42,1.6 12,1.6C8.08,1.6 4.67,4.14 3.19,7.08l3.5,2.7C7.44,6.87 9.53,5.2 12,5.2Z" fill="#EA4335" />
                  </g>
                </svg>
              )}
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] text-slate-500 font-medium tracking-wide">
        Universidad Autónoma de Guerrero © 2026
        <br />
        <span className="text-slate-600">Desarrollado para Ingeniería Civil</span>
      </div>
    </div>
  )
}
