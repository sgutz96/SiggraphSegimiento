# Supabase + React: gestión de tareas

Proyecto con Vite, React y Supabase sobre la tabla `tareas` (`id`, `nombre`, `area`, `estado`, `responsable`, `tags`, `created_at`). Incluye tres pantallas: tabla general, kanban por área y asignación de tareas.

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

Los estados esperados son `pendiente`, `en_progreso`, `en_revision` y `completada` (esta última se muestra como "Aprobada"). Si tu tabla usa otros valores, ajústalos en `src/constantes.js`.

## Identidad visual

La interfaz sigue la identidad de SIGGRAPH San Buena: fondo oscuro, naranja para títulos y etiquetas, verde azulado para datos y líneas, magenta para la franja lateral y los detalles.

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#161618` | Fondo de la página |
| `--block` | `#111111` | Paneles, tabla y columnas |
| `--orange` | `#F27D16` | Títulos, etiquetas, botón principal |
| `--teal` | `#2BB1A4` | IDs, tags, foco, líneas decorativas |
| `--magenta` | `#BF1B58` | Franja lateral, contadores, doble contorno |
| `--peach` | `#FFD3B6` | Estado completada |
| `--navy` | `#051234` | Círculo del logo |

Tipografías (Google Fonts): Bungee para títulos y Montserrat para etiquetas y datos. Los tokens están al inicio de `src/styles.css`.

Archivos de marca en `public/`: `logo.png` (logo completo), `emblema.png` (colibrí en círculo, usado en el encabezado) y `favicon.png`.

## Estructura

- `src/config.js`: URL, key y nombre de la tabla.
- `src/supabase.js`: conexión.
- `src/services.js`: consultar, crear y actualizar tareas.
- `src/constantes.js`: estados y etiquetas.
- `src/App.jsx`: carga de datos y navegación entre pantallas.
- `src/TablaGeneral.jsx`: tabla con búsqueda y filtro por estado.
- `src/Kanban.jsx`: matriz con una fila por área y una columna por estado; las tarjetas se arrastran para cambiar el estado.
- `src/Asignar.jsx`: formulario de nueva tarea (con nombre) y reasignación de responsable y estado.
- `src/Ornamento.jsx`: cruces y barra decorativa del encabezado.
- `src/styles.css`: estilos y tokens de la identidad visual.
- `public/`: logo, emblema y favicon.
- `.env`: configuración local.
