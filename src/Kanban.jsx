import React, { useMemo, useState } from 'react'
import { ESTADOS, claseEstado, etiquetaEstado } from './constantes'
import { actualizarTarea } from './services'

// Matriz: una fila por área y una columna por estado. Las tareas se arrastran entre columnas.
export default function Kanban({ registros, onCambio }) {
  const [arrastrando, setArrastrando] = useState(null) // tarea que se está moviendo
  const [sobre, setSobre] = useState('')               // celda bajo el cursor: "area|estado"
  const [error, setError] = useState('')

  const areas = useMemo(() => {
    const mapa = new Map()
    registros.forEach(r => {
      const area = r.area || 'Sin área'
      if (!mapa.has(area)) mapa.set(area, [])
      mapa.get(area).push(r)
    })
    return [...mapa.entries()].sort((a, b) => a[0].localeCompare(b[0], 'es'))
  }, [registros])

  const totales = useMemo(
    () => ESTADOS.map(e => registros.filter(r => (ESTADOS.includes(r.estado) ? r.estado : 'pendiente') === e).length),
    [registros]
  )

  if (areas.length === 0) return <p className="notice">No hay tareas para mostrar.</p>

  const estadoDe = t => (ESTADOS.includes(t.estado) ? t.estado : 'pendiente')
  const areaDe = t => t.area || 'Sin área'

  async function mover(tarea, estado) {
    if (estadoDe(tarea) === estado && tarea.estado === estado) return
    setError('')
    onCambio({ ...tarea, estado }) // se actualiza al instante
    try {
      onCambio(await actualizarTarea(tarea.id, { estado }))
    } catch (err) {
      onCambio(tarea) // se revierte si falla
      setError(err.message || 'No se pudo mover la tarea.')
    }
  }

  const puedeSoltar = (area, estado) =>
    arrastrando && areaDe(arrastrando) === area && estadoDe(arrastrando) !== estado

  return (
    <>
      {error && <p className="msg-error">{error}</p>}
      <p className="ayuda">Arrastra una tarjeta a otra columna de su misma área para cambiar el estado.</p>
      <section className="matriz-wrap">
        <div className="matriz">
          <div className="m-esquina">Área</div>
          {ESTADOS.map((e, i) => (
            <div className="m-head" key={e}>
              <span className={`status ${claseEstado(e)}`}>{etiquetaEstado(e)}</span>
              <span className="m-total">{totales[i]}</span>
            </div>
          ))}

          {areas.map(([area, tareas]) => (
            <React.Fragment key={area}>
              <div className="m-area">
                <h3>{area}</h3>
                <span>{tareas.length}</span>
              </div>
              {ESTADOS.map(estado => {
                const clave = `${area}|${estado}`
                const enCelda = tareas.filter(t => estadoDe(t) === estado)
                const valida = puedeSoltar(area, estado)
                return (
                  <div
                    key={clave}
                    className={`m-cell ${valida ? 'valida' : ''} ${valida && sobre === clave ? 'sobre' : ''}`}
                    onDragOver={e => { if (valida) { e.preventDefault(); e.dataTransfer.dropEffect = 'move' } }}
                    onDragEnter={() => valida && setSobre(clave)}
                    onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setSobre('') }}
                    onDrop={e => {
                      e.preventDefault()
                      setSobre('')
                      if (valida) mover(arrastrando, estado)
                      setArrastrando(null)
                    }}
                  >
                    {enCelda.map(t => (
                      <article
                        key={t.id}
                        className={`card ${arrastrando?.id === t.id ? 'arrastrando' : ''}`}
                        draggable
                        onDragStart={e => { setArrastrando(t); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(t.id)) }}
                        onDragEnd={() => { setArrastrando(null); setSobre('') }}
                      >
                        <div className="card-top">
                          <span className="id">#{t.id}</span>
                          <select
                            className={`inline status ${claseEstado(estadoDe(t))}`}
                            value={estadoDe(t)}
                            aria-label={`Estado de la tarea ${t.id}`}
                            onChange={e => mover(t, e.target.value)}
                          >
                            {ESTADOS.map(s => <option key={s} value={s}>{etiquetaEstado(s)}</option>)}
                          </select>
                        </div>
                        <p className="card-name">{t.nombre || 'Sin nombre'}</p>
                        <p className="card-owner">{t.responsable || 'Sin responsable'}</p>
                        <div className="tags">{(t.tags ?? []).map(tag => <span key={tag}>{tag}</span>)}</div>
                      </article>
                    ))}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </section>
    </>
  )
}
