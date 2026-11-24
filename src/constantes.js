export const ESTADOS = ['pendiente', 'en_progreso', 'en_revision', 'completada']

export const etiquetaEstado = estado =>
  String(estado ?? '—').replaceAll('_', ' ').replace(/^./, c => c.toUpperCase())

export const claseEstado = estado => String(estado).replaceAll('_', '-')
