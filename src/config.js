// Configuración de Supabase. La publishable key es pública por diseño (nunca uses una service_role aquí).
// Si defines las variables VITE_* en .env, tienen prioridad sobre estos valores.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kayjxexnuchehjkvtupz.supabase.co'
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_MokUOZG5MZb9avErAPDhMA_ImvQFb8C'
export const TABLA = import.meta.env.VITE_SUPABASE_TABLE || 'tareas'
