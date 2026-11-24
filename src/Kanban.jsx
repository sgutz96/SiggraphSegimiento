import React, { useMemo } from 'react'
import { claseEstado, etiquetaEstado } from './constantes'

export default function Kanban({ registros }) {
  const columnas = useMemo(() => {
    const mapa = new Map()
    registros.forEach(r => {
      const area = r.area || 'Sin área'
      if (!mapa.has(area)) mapa.set(area, [])
      mapa.get(area).push(r)
    })
    return [...mapa.entries()].sort((a, b) => a[0].localeCompare(b[0], 'es'))
  }, [registros])

  if (columnas.length === 0) return <p className="notice">No hay tareas para mostrar.</p>

  return (
    <section className="board">
      {columnas.map(([area, tareas]) => (
        <div className="column" key={area}>
          <div className="column-head">
            <h3>{area}</h3>
            <span>{tareas.length}</span>
          </div>
          <div className="cards">
            {tareas.map(t => (
              <article className="card" key={t.id}>
                <div className="card-top">
                  <span className="id">#{t.id}</span>
                  <span className={`status ${claseEstado(t.estado)}`}>{etiquetaEstado(t.estado)}</span>
                </div>
                <p className="card-owner">{t.responsable || 'Sin responsable'}</p>
                <div className="tags">{(t.tags ?? []).map(tag => <span key={tag}>{tag}</span>)}</div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
