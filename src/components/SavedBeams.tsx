import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { StructureModel } from '../types/structure'
import type { User } from 'firebase/auth'

interface SavedBeamsProps {
  user: User
  currentStructure: StructureModel
  onLoadBeam: (beam: StructureModel) => void
}

interface SavedBeamDoc {
  id: string
  name: string
  userId: string
  createdAt: any
  structure: StructureModel
}

export function SavedBeams({ user, currentStructure, onLoadBeam }: SavedBeamsProps) {
  const [beams, setBeams] = useState<SavedBeamDoc[]>([])
  const [newBeamName, setNewBeamName] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar vigas en tiempo real
  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'beams'),
      where('userId', '==', user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const beamsList: SavedBeamDoc[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        beamsList.push({
          id: doc.id,
          name: data.name || 'Sin nombre',
          userId: data.userId,
          createdAt: data.createdAt,
          structure: data.structure as StructureModel
        })
      })

      // Ordenar localmente por fecha de creación (descendente) para evitar requerir un índice compuesto en Firestore
      beamsList.sort((a, b) => {
        const tA = a.createdAt?.seconds || 0
        const tB = b.createdAt?.seconds || 0
        return tB - tA
      })

      setBeams(beamsList)
      setLoading(false)
    }, (err) => {
      console.error('Error al escuchar vigas:', err)
      setError('No se pudieron cargar las vigas guardadas. Verifica la base de datos.')
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const handleSaveBeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const name = newBeamName.trim()
    if (!name) return

    setSaving(true)
    try {
      await addDoc(collection(db, 'beams'), {
        userId: user.uid,
        name: name,
        createdAt: new Date(),
        structure: currentStructure
      })
      setNewBeamName('')
    } catch (err: any) {
      console.error('Error al guardar viga:', err)
      setError('Error al guardar la viga. Asegúrate de tener conexión y la base de datos configurada.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteBeam = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que al borrar también se intente cargar la viga
    setError(null)
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta viga guardada?')) return

    try {
      await deleteDoc(doc(db, 'beams', id))
    } catch (err) {
      console.error('Error al eliminar viga:', err)
      setError('No se pudo eliminar la viga guardada.')
    }
  }

  return (
    <div className="rounded-xl border border-[#d0d7e2] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#0a2540] flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Guardar y Cargar Vigas
      </h2>
      <p className="mt-1 text-xs text-[#5a6a7e]">
        Tus datos se guardan de forma segura en tu cuenta de Firebase.
      </p>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-800 border border-red-200">
          {error}
        </div>
      )}

      {/* Formulario de guardado */}
      <form onSubmit={handleSaveBeam} className="mt-4 flex gap-2">
        <input
          type="text"
          required
          value={newBeamName}
          onChange={(e) => setNewBeamName(e.target.value)}
          placeholder="Nombre de la viga..."
          className="flex-1 rounded-lg border border-[#c1cbd7] bg-white px-3 py-1.5 text-xs text-[#0a2540] placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={saving || !newBeamName.trim()}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-40 transition shrink-0"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>

      {/* Lista de vigas */}
      <div className="mt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5a6a7e]">Vigas guardadas ({beams.length})</h3>
        
        {loading ? (
          <p className="mt-2 text-xs text-center text-slate-400 py-3">Cargando tus vigas...</p>
        ) : beams.length === 0 ? (
          <p className="mt-2 text-xs text-center text-slate-400 py-3">No tienes vigas guardadas.</p>
        ) : (
          <div className="mt-2 max-h-48 overflow-y-auto space-y-1 pr-1 border border-slate-100 rounded-lg p-1">
            {beams.map((beam) => (
              <div
                key={beam.id}
                onClick={() => onLoadBeam(beam.structure)}
                className="group flex items-center justify-between rounded-md p-2 hover:bg-blue-50/50 cursor-pointer border border-transparent hover:border-blue-100 transition text-left"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs font-medium text-[#0a2540] truncate">{beam.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {beam.createdAt ? new Date(beam.createdAt.seconds * 1000).toLocaleDateString() : 'Recién guardada'}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteBeam(beam.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-600 text-slate-400 p-1 rounded hover:bg-red-50 transition shrink-0"
                  title="Eliminar viga"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
