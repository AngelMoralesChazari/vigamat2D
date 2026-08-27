interface UnitsPanelProps {
  forceUnit: 'kN' | 't'
  onForceUnitChange: (unit: 'kN' | 't') => void
}

export function UnitsPanel({ forceUnit, onForceUnitChange }: UnitsPanelProps) {
  const rows: [string, string][] = [
    ['Módulo Elasticidad E', 'MPa (N/mm²)'],
    ['Inercia I', 'm⁴'],
    ['Longitud L', 'm'],
    ['Fuerza / Carga Puntual', forceUnit],
    ['Carga Distribuida', `${forceUnit}/m`],
    ['Momento Nodal', `${forceUnit}·m`],
    ['Rotación θ', 'rad'],
  ]

  return (
    <div className="rounded-lg border border-[#d0d7e2] bg-white p-5 shadow-sm space-y-4">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#0a2540]">
          Unidades del sistema
        </h2>
        <p className="mt-1 text-xs text-[#5a6a7e]">
          Configura las unidades para los diagramas y el reporte:
        </p>
      </div>

      {/* Selector de Unidades Segmentado */}
      <div className="flex rounded bg-[#f1f5f9] p-1">
        <button
          type="button"
          onClick={() => onForceUnitChange('kN')}
          className={`flex-1 rounded py-1.5 text-xs font-bold transition-all ${
            forceUnit === 'kN'
              ? 'bg-[#0a2540] text-white shadow-sm'
              : 'text-[#5a6a7e] hover:text-[#0a2540]'
          }`}
        >
          Kilonewtons (kN)
        </button>
        <button
          type="button"
          onClick={() => onForceUnitChange('t')}
          className={`flex-1 rounded py-1.5 text-xs font-bold transition-all ${
            forceUnit === 't'
              ? 'bg-[#0a2540] text-white shadow-sm'
              : 'text-[#5a6a7e] hover:text-[#0a2540]'
          }`}
        >
          Toneladas (t)
        </button>
      </div>

      <dl className="space-y-2 text-xs">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-2 border-b border-[#eef1f6] pb-1.5 last:border-0 last:pb-0"
          >
            <dt className="text-[#5a6a7e] font-semibold">{label}</dt>
            <dd className="font-mono text-[#0a2540] font-bold">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="text-xs leading-relaxed text-[#5a6a7e] border-t border-[#eef1f6] pt-3">
        Viga Euler-Bernoulli con un grado de libertad rotacional (θ) por nodo. Ideal para vigas continuas e
        hiperestáticas en flexión.
      </p>
    </div>
  )
}
