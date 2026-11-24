import React, { useCallback, useEffect, useState } from 'react'
import { obtenerRegistros } from './services'
import TablaGeneral from './TablaGeneral'
import Kanban from './Kanban'
import Asignar from './Asignar'
import Ornamento from './Ornamento'

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
        <Ornamento />
        <div className="brand">
          <img className="emblema" src="/emblema.png" alt="Logo de SIGGRAPH San Buena" width="96" height="96" />
          <div className="titulo">
            <div>
              <h1>Seguimiento de tareas</h1>
              <p className="sub">SIGGRAPH San Buena</p>
              <p className="sub suave">Tareas del capítulo por área, responsable y estado.</p>
            </div>
          </div>
        </div>
        <button className="refresh" onClick={cargarDatos}>Actualizar</button>
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
          {pantalla === 'kanban' && <Kanban registros={registros} onCambio={aplicarCambio} />}
          {pantalla === 'asignar' && <Asignar registros={registros} onCambio={aplicarCambio} />}
        </>
      )}
      <footer>SIGGRAPH San Buena</footer>
    </main>
  )
}
