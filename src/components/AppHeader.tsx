interface AppHeaderProps {
  userEmail: string | null
  onSignOut: () => void
  activeTab: 'input' | 'results'
  setActiveTab: (tab: 'input' | 'results') => void
  hasResult: boolean
  onLoadOneSpan: () => void
  onLoadDefault: () => void
  onLoadContinuous: () => void
  onCalculate: () => void
  calculateDisabled: boolean
}

export function AppHeader({
  userEmail,
  onSignOut,
  activeTab,
  setActiveTab,
  hasResult,
  onLoadOneSpan,
  onLoadDefault,
  onLoadContinuous,
  onCalculate,
  calculateDisabled,
}: AppHeaderProps) {
  return (
    <header className="border-b border-[#0a2540] bg-[#0a2540]">
      <div className="mx-auto flex max-w-[96%] flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white sm:text-3xl"> VIGMAT 2D </h1>
            <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300">UAGro</span>
          </div>

          {/* Selector de Pestañas */}
          <div className="flex gap-1 rounded-lg bg-black/25 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('input')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${activeTab === 'input'
                  ? 'bg-white text-[#0a2540] shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
            >
              Definir estructura
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('results')}
              disabled={!hasResult}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${activeTab === 'results'
                  ? 'bg-white text-[#0a2540] shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
            >
              Resultados
            </button>
          </div>
        </div>

        {/* Sección central/derecha con ejemplos, cálculo y usuario */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Botones de Ejemplo */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onLoadOneSpan}
              className="rounded-md border border-white/30 px-3 py-2 text-xs text-white hover:bg-white/10 transition"
            >
              Viga 1 vano
            </button>
            <button
              type="button"
              onClick={onLoadDefault}
              className="rounded-md border border-white/30 px-3 py-2 text-xs text-white hover:bg-white/10 transition"
            >
              Viga 2 vanos
            </button>
            <button
              type="button"
              onClick={onLoadContinuous}
              className="rounded-md border border-white/30 px-3 py-2 text-xs text-white hover:bg-white/10 transition"
            >
              Viga 3 vanos
            </button>
          </div>

          {/* Botón de Calcular */}
          <button
            type="button"
            onClick={onCalculate}
            disabled={calculateDisabled}
            className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-[#0a2540] hover:bg-[#e8eef5] disabled:cursor-not-allowed disabled:opacity-50 transition"
          >
            Calcular
          </button>

          {/* Información del Usuario y Cerrar Sesión */}
          {userEmail && (
            <div className="flex items-center gap-3 border-l border-white/20 pl-4">
              <div className="hidden text-right lg:block">
                <p className="text-[10px] text-white/50">Usuario activo</p>
                <p className="text-xs font-medium text-white max-w-[150px] truncate" title={userEmail}>
                  {userEmail}
                </p>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="rounded-md bg-red-600/25 px-2.5 py-1.5 text-xs font-medium text-red-200 hover:bg-red-600/45 transition border border-red-500/20"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

