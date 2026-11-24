import React, { useMemo, useState } from 'react'
import { claseEstado, etiquetaEstado } from './constantes'

export default function TablaGeneral({ registros }) {
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const estados = useMemo(
    () => [...new Set(registros.map(r => r.estado).filter(Boolean))],
    [registros]
  )

  const filtrados = useMemo(() => registros.filter(r => {
    const texto = `${r.id} ${r.area ?? ''} ${r.responsable ?? ''} ${(r.tags ?? []).join(' ')}`.toLowerCase()
    const coincideTexto = texto.includes(busqueda.toLowerCase())
    const coincideEstado = filtroEstado === 'todos' || r.estado === filtroEstado
    return coincideTexto && coincideEstado
  }), [registros, busqueda, filtroEstado])

  return (
    <>
      <section className="toolbar">
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por área, responsable, tag o ID..."
          aria-label="Buscar registros"
        />
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="todos">Todos los estados</option>
          {estados.map(e => <option key={e} value={e}>{etiquetaEstado(e)}</option>)}
        </select>
        <span className="count">{filtrados.length} registros</span>
      </section>

      <section className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Área</th><th>Estado</th><th>Responsable</th><th>Tags</th><th>Creado</th></tr>
          </thead>
          <tbody>
            {filtrados.map(r => (
              <tr key={r.id}>
                <td className="id">#{r.id}</td>
                <td>{r.area || '—'}</td>
                <td><span className={`status ${claseEstado(r.estado)}`}>{etiquetaEstado(r.estado)}</span></td>
                <td>{r.responsable || '—'}</td>
                <td><div className="tags">{(r.tags ?? []).map(t => <span key={t}>{t}</span>)}</div></td>
                <td>{r.created_at ? new Date(r.created_at).toLocaleString('es-CO') : '—'}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr><td colSpan="6" className="empty">No hay registros que coincidan con la búsqueda.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  )
}
