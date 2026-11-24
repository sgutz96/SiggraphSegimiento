# Supabase + React: gestión de tareas

Proyecto con Vite, React y Supabase sobre la tabla `tareas` (`id`, `area`, `estado`, `responsable`, `tags`, `created_at`). Incluye tres pantallas: tabla general, kanban por área y asignación de tareas.

## 1. Configuración

La conexión (URL, publishable key y tabla `tareas`) está en `src/config.js`, así que el proyecto funciona aunque no exista el archivo `.env`. Si defines variables `VITE_*` en `.env`, tienen prioridad. La publishable key puede usarse en el frontend; nunca pongas una `service_role` aquí.

## 2. Instalar y ejecutar

Necesitas Node.js instalado. Desde una terminal, dentro de esta carpeta:

```bash
npm install
npm run dev
```

Abre la dirección local que indique Vite (normalmente http://localhost:5173).

Para generar la versión de producción:

```bash
npm run build
```

## 3. Permisos (RLS)

La pantalla de asignación crea y actualiza filas, así que además de `SELECT` la tabla necesita políticas `INSERT` y `UPDATE` para el rol `anon` (si no hay autenticación):

```sql
create policy "Leer tareas" on public.tareas for select to anon using (true);
create policy "Crear tareas" on public.tareas for insert to anon with check (true);
create policy "Actualizar tareas" on public.tareas for update to anon using (true) with check (true);
```

No uses estas políticas abiertas si la información es privada; en ese caso añade autenticación.

Los estados esperados son `pendiente`, `en_progreso`, `en_revision` y `completada`. Si tu tabla usa otros valores, ajústalos en `src/constantes.js`.

## Estructura

- `src/config.js`: URL, key y nombre de la tabla.
- `src/supabase.js`: conexión.
- `src/services.js`: consultar, crear y actualizar tareas.
- `src/constantes.js`: estados y etiquetas.
- `src/App.jsx`: carga de datos y navegación entre pantallas.
- `src/TablaGeneral.jsx`: tabla con búsqueda y filtro por estado.
- `src/Kanban.jsx`: columnas agrupadas por área.
- `src/Asignar.jsx`: formulario de nueva tarea y reasignación de responsable y estado.
- `src/styles.css`: estilos.
- `.env`: configuración local.
