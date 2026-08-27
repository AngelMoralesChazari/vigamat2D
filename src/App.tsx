import { useMemo, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from './lib/firebase'
import { Login } from './components/Login'
import { SavedBeams } from './components/SavedBeams'
import { AnalysisSteps } from './components/AnalysisSteps'
import { AppHeader } from './components/AppHeader'
import { BeamDiagram } from './components/BeamDiagram'
import { DownloadReport } from './components/DownloadReport'
import { StructureInput } from './components/StructureInput'
import { UnitsPanel } from './components/UnitsPanel'
import { SummaryCard } from './components/ui/Cards'
import { continuousBeamExample, defaultStructure, oneSpanExample } from './data/examples'
import { analyzeStructure, validateStructure } from './lib/structuralAnalysis'
import type { AnalysisResult, StructureModel } from './types/structure'
import { setForceUnit } from './data/units'

type Tab = 'input' | 'results'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  
  const [model, setModel] = useState<StructureModel>(defaultStructure)
  const [forceUnit, setForceUnitState] = useState<'kN' | 't'>('kN')
  
  const [activeTab, setActiveTab] = useState<Tab>('input')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  // Escuchar estado de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Doble validación del correo por seguridad en el cliente
      if (currentUser && currentUser.email && !currentUser.email.toLowerCase().endsWith('@uagro.mx')) {
        signOut(auth)
        setUser(null)
      } else {
        setUser(currentUser)
      }
      setLoadingAuth(false)
    })
    return () => unsubscribe()
  }, [])

  const validationError = useMemo(() => validateStructure(model), [model])

  const runAnalysis = () => {
    const validation = validateStructure(model)
    if (validation) {
      setError(validation)
      setResult(null)
      return
    }

    try {
      const analysis = analyzeStructure(model)
      setResult(analysis)
      setError(null)
      setActiveTab('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido en el análisis.')
      setResult(null)
    }
  }

  const loadExample = (example: StructureModel) => {
    setModel(example)
    setError(null)
    setResult(null)
    setActiveTab('input')
  }

  const loadSavedBeam = (savedModel: StructureModel) => {
    setModel(savedModel)
    setError(null)
    setResult(null)
    setActiveTab('input')
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  // Pantalla de carga mientras se verifica la sesión
  if (loadingAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-sm font-medium text-slate-300">Cargando VIGMAT 2D...</p>
      </div>
    )
  }

  // Si no está autenticado, mostrar pantalla de inicio de sesión
  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#0a2540]">
      <AppHeader
        userEmail={user.email}
        onSignOut={handleSignOut}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasResult={!!result}
        onLoadOneSpan={() => loadExample(oneSpanExample)}
        onLoadDefault={() => loadExample(defaultStructure)}
        onLoadContinuous={() => loadExample(continuousBeamExample)}
        onCalculate={runAnalysis}
        calculateDisabled={!!validationError}
      />

      <main className="mx-auto max-w-[96%] px-4 py-6 sm:px-6 lg:px-8">

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {validationError && activeTab === 'input' && (
          <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {validationError}
          </div>
        )}

        {activeTab === 'input' ? (
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Lado Izquierdo: Formularios de Edición e Integración de Vigas Guardadas */}
            <div className="lg:col-span-4 order-2 lg:order-1 space-y-5">
              <StructureInput model={model} onChange={setModel} />
              
              <UnitsPanel forceUnit={forceUnit} onForceUnitChange={(u) => {
                setForceUnit(u)
                setForceUnitState(u)
              }} />

              {/* Panel de vigas guardadas en la base de datos */}
              <SavedBeams 
                user={user} 
                currentStructure={model} 
                onLoadBeam={loadSavedBeam} 
              />
            </div>

            {/* Lado Derecho: Diagrama de la Viga */}
            <div className="lg:col-span-8 order-1 lg:order-2 lg:sticky lg:top-5">
              <BeamDiagram model={model} />
            </div>
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Cabecera de Resultados con Botón de Descarga */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#d0d7e2] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0a2540]">Resultados del Análisis</h2>
                <p className="mt-0.5 text-xs text-[#5a6a7e]">
                  Viga resuelta mediante el método de rigidez matricial.
                </p>
              </div>
              <DownloadReport model={model} result={result} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                label="G.L. libres"
                value={result.freeDofIndices.length}
                detail={result.freeDofIndices.map((i) => result.dofLabels[i]).join(', ')}
              />
              <SummaryCard
                label="G.L. restringidos"
                value={result.restrainedDofIndices.length}
                detail={result.restrainedDofIndices.map((i) => result.dofLabels[i]).join(', ') || '—'}
              />
              <SummaryCard label="Elementos" value={result.elementForces.length} detail="Vigas analizadas" />
              <SummaryCard label="Estado" value="✓" detail="Sistema resuelto" accent />
            </div>
            <BeamDiagram model={model} scale={42} heightClass="h-52" />
            <AnalysisSteps result={result} model={model} />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#d0d7e2] bg-white p-12 text-center text-[#5a6a7e]">
            Define la estructura y presiona <strong className="text-[#0a2540]">Calcular</strong> para ver los pasos del análisis.
          </div>
        )}
      </main>
    </div>
  )
}

export default App

