import { supabase } from './supabase'
import { TABLA as tableName } from './config'
const columnas = 'id, nombre, area, estado, responsable, tags, created_at'

function validarTabla() {
  if (!tableName || tableName === 'CAMBIA_POR_EL_NOMBRE_REAL_DE_TU_TABLA') {
    throw new Error('Configura VITE_SUPABASE_TABLE en el archivo .env con el nombre real de tu tabla.')
  }
}

export async function obtenerRegistros() {
  validarTabla()
  const { data, error } = await supabase
    .from(tableName)
    .select(columnas)
    .order('id', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function crearTarea({ nombre, area, estado, responsable, tags }) {
  validarTabla()
  const { data, error } = await supabase
    .from(tableName)
    .insert({ nombre, area, estado, responsable, tags })
    .select(columnas)
    .single()
  if (error) throw error
  return data
}

export async function actualizarTarea(id, cambios) {
  validarTabla()
  const { data, error } = await supabase
    .from(tableName)
    .update(cambios)
    .eq('id', id)
    .select(columnas)
    .single()
  if (error) throw error
  return data
}
