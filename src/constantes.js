export const ESTADOS = ['pendiente', 'en_progreso', 'en_revision', 'completada']

const ETIQUETAS = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  en_revision: 'En revisión',
  completada: 'Aprobada',
}

export const etiquetaEstado = estado =>
  ETIQUETAS[estado] ?? String(estado ?? '—').replaceAll('_', ' ').replace(/^./, c => c.toUpperCase())

export const claseEstado = estado => String(estado).replaceAll('_', '-')
