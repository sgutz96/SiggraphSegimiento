import React, { useCallback, useEffect, useState } from 'react'
import { obtenerRegistros } from './services'
import TablaGeneral from './TablaGeneral'
import Kanban from './Kanban'
import Asignar from './Asignar'

const PANTALLAS = [
  { id: 'tabla', nombre: 'Tabla general' },
  { id: 'kanban', nombre: 'Kanban por área' },
  { id: 'asignar', nombre: 'Asignar tareas' },
]

export default function App() {
  const [registros, setRegistros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [pantalla, setPantalla] = useState('tabla')

  const cargarDatos = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      setRegistros(await obtenerRegistros())
    } catch (e) {
      setError(e.message || 'No fue posible consultar Supabase.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargarDatos() }, [cargarDatos])

  const aplicarCambio = useCallback(fila => {
    setRegistros(prev => prev.some(r => r.id === fila.id)
      ? prev.map(r => (r.id === fila.id ? fila : r))
      : [...prev, fila])
  }, [])

  return (
    <main className="page">
      <header className="top">
        <div>
          <p className="eyebrow">SUPABASE · GESTIÓN DE TAREAS</p>
          <h1>Tareas del proyecto</h1>
          <p className="sub">Datos consultados directamente desde tu tabla.</p>
        </div>
        <button className="refresh" onClick={cargarDatos}>↻ Actualizar</button>
      </header>

      <nav className="tabs">
        {PANTALLAS.map(p => (
          <button
            key={p.id}
            className={`tab ${pantalla === p.id ? 'active' : ''}`}
            onClick={() => setPantalla(p.id)}
          >
            {p.nombre}
          </button>
        ))}
      </nav>

      {cargando && <p className="notice">Cargando registros...</p>}
      {!cargando && error && (
        <div className="error">
          <strong>No se pudieron cargar los datos.</strong>
          <p>{error}</p>
          <p>Verifica el nombre de la tabla y que exista una política RLS que permita SELECT al rol utilizado.</p>
          <button onClick={cargarDatos}>Reintentar</button>
        </div>
      )}
      {!cargando && !error && (
        <>
          {pantalla === 'tabla' && <TablaGeneral registros={registros} />}
          {pantalla === 'kanban' && <Kanban registros={registros} />}
          {pantalla === 'asignar' && <Asignar registros={registros} onCambio={aplicarCambio} />}
        </>
      )}
      <footer>Conectado mediante Supabase JavaScript Client</footer>
    </main>
  )
}
