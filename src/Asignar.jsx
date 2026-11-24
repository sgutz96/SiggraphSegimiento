import React, { useMemo, useState } from 'react'
import { ESTADOS, claseEstado, etiquetaEstado } from './constantes'
import { actualizarTarea, crearTarea } from './services'

const vacio = { nombre: '', area: '', estado: 'pendiente', responsable: '', tags: '' }

export default function Asignar({ registros, onCambio }) {
  const [form, setForm] = useState(vacio)
  const [mensaje, setMensaje] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const areas = useMemo(() => [...new Set(registros.map(r => r.area).filter(Boolean))], [registros])
  const responsables = useMemo(() => [...new Set(registros.map(r => r.responsable).filter(Boolean))], [registros])

  const campo = k => e => setForm({ ...form, [k]: e.target.value })

  async function enviar(e) {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)
    try {
      const nueva = await crearTarea({
        nombre: form.nombre.trim(),
        area: form.area.trim(),
        estado: form.estado,
        responsable: form.responsable.trim(),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      })
      onCambio(nueva)
      setForm(vacio)
      setMensaje({ ok: true, texto: `Tarea #${nueva.id} creada.` })
    } catch (err) {
      setMensaje({ ok: false, texto: err.message || 'No se pudo crear la tarea.' })
    } finally {
      setGuardando(false)
    }
  }

  async function cambiar(id, cambios) {
    setMensaje(null)
    try {
      onCambio(await actualizarTarea(id, cambios))
    } catch (err) {
      setMensaje({ ok: false, texto: err.message || 'No se pudo actualizar la tarea.' })
    }
  }

  return (
    <>
      <form className="form" onSubmit={enviar}>
        <h2>Nueva tarea</h2>
        <div className="form-grid">
          <label>Nombre
            <input value={form.nombre} onChange={campo('nombre')} required />
          </label>
          <label>Área
            <input list="lista-areas" value={form.area} onChange={campo('area')} required />
            <datalist id="lista-areas">{areas.map(a => <option key={a} value={a} />)}</datalist>
          </label>
          <label>Responsable
            <input list="lista-resp" value={form.responsable} onChange={campo('responsable')} required />
            <datalist id="lista-resp">{responsables.map(a => <option key={a} value={a} />)}</datalist>
          </label>
          <label>Estado
            <select value={form.estado} onChange={campo('estado')}>
              {ESTADOS.map(s => <option key={s} value={s}>{etiquetaEstado(s)}</option>)}
            </select>
          </label>
          <label>Tags (separados por coma)
            <input value={form.tags} onChange={campo('tags')} placeholder="urgente, diseño" />
          </label>
        </div>
        <button type="submit" disabled={guardando}>{guardando ? 'Guardando...' : 'Crear tarea'}</button>
      </form>

      {mensaje && <p className={mensaje.ok ? 'msg-ok' : 'msg-error'}>{mensaje.texto}</p>}

      <h2 className="section-title">Reasignar tareas existentes</h2>
      <section className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Nombre</th><th>Área</th><th>Responsable</th><th>Estado</th></tr></thead>
          <tbody>
            {registros.map(r => (
              <tr key={r.id}>
                <td className="id">#{r.id}</td>
                <td className="nombre">{r.nombre || '—'}</td>
                <td>{r.area || '—'}</td>
                <td>
                  <input
                    className="inline"
                    list="lista-resp"
                    defaultValue={r.responsable ?? ''}
                    onBlur={e => {
                      const v = e.target.value.trim()
                      if (v !== (r.responsable ?? '')) cambiar(r.id, { responsable: v })
                    }}
                  />
                </td>
                <td>
                  <select
                    className={`inline status ${claseEstado(r.estado)}`}
                    value={r.estado ?? ''}
                    onChange={e => cambiar(r.id, { estado: e.target.value })}
                  >
                    {ESTADOS.map(s => <option key={s} value={s}>{etiquetaEstado(s)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {registros.length === 0 && <tr><td colSpan="5" className="empty">No hay tareas.</td></tr>}
          </tbody>
        </table>
      </section>
    </>
  )
}
