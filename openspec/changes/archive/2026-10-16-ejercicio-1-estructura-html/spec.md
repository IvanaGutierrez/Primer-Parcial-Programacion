# SPEC — Ejercicio 1 · Estructura y pantallas HTML

Change: `ejercicio-1-estructura-html` · Fase 1 — SPEC (sin código de producto).

Fuentes: `Docs/Repaso Primer Parcial.pdf`, págs. 1-2 (Ejercicio 1 · 1.
Estructura y pantallas HTML); `promtUno.md` (R-01 a R-07 textuales,
CA-01 a CA-04). Nada de `tasks.md` en esta fase; PLAN e IMPLEMENTACIÓN
bloqueados hasta aprobación explícita.

## 1. Requisitos (textuales desde `promtUno.md`, líneas 50-62)

### R-01 · Funcional

Las 5 vistas existen y son alcanzables desde `nav` en ≤2 clics: Catálogo,
Libros, Clientes, Ventas, Historial. Cada vista muestra su contenido mínimo
descrito en Incluido con datos estáticos de ejemplo.

Escenarios observables:

- Navegación: desde `index.html`, cada enlace del `nav` lleva a su vista
  (otro HTML o sección con ancla) en 1 clic; desde cualquier vista se vuelve
  a cualquier otra en ≤2 clics.
- Catálogo visible: título de la librería, buscador por título y listado con
  título, ISBN, editorial, género, autores y precio por libro.
- Libros visible: formulario de alta + listado de libros registrados.
- Clientes visible: formulario de alta + listado de clientes registrados.
- Ventas visible: selector de cliente, composición de renglones y resumen.
- Historial visible: listado de ventas + acceso a sus detalles.

### R-02 · Estructura e interfaces

`header/nav/main/footer` semánticos; formularios Libro (título, ISBN,
precio, editorial select, género select con «Sin clasificar», autores
multi), Cliente (nombre completo, email), Venta (select cliente, select
libro, cantidad, tabla renglones, resumen total), Historial (tabla ventas +
zona detalle); todo input con `label for/id`; botones con verbo de acción;
tablas con `thead/th`.

Escenarios observables:

- Cada página/sección contiene `header` (título), `nav` (5 enlaces),
  `main` (contenido) y `footer`.
- Cada `input`/`select` tiene un `label` con `for` igual a su `id`.
- Botones con texto de acción: «Registrar libro», «Registrar cliente»,
  «Buscar por título», «Agregar renglón», «Confirmar venta».
- Toda tabla declara `thead` con `th` por columna (ver columnas en §3).

### R-03 · Datos y estados

Cada listado tiene estado con datos de ejemplo y placeholder de vacío con
`id`; buscador de catálogo con `input + botón Buscar` y zona
`#catalogo-mensaje` para "sin resultados"; zonas `#msg-ok` y `#msg-error`
para operaciones correctas/rechazadas; libro sin género muestra
«Sin clasificar».

Escenarios observables:

- Con datos: cada listado muestra sus 2-3 ejemplos ficticios.
- Lista vacía: existe en el DOM un placeholder con `id` (puede estar oculto)
  con texto tipo «No hay registros».
- Búsqueda sin resultados: `#catalogo-mensaje` informa «Sin resultados para
  …» (texto, no solo color).
- `#msg-ok` y `#msg-error` existen en el DOM para operación correcta y
  rechazada respectivamente.
- Al menos un libro de ejemplo sin género muestra «Sin clasificar».

### R-04 · Calidad

HTML válido sin estilos inline; CSS solo en archivo externo
`css/estilos.css`; ids y clases en español, legibles; foco visible por
teclado sin CSS que lo oculte; imágenes solo si son locales con `alt`
(o ninguna).

Escenarios observables:

- Inspección: ningún elemento usa atributo `style`; un solo `<link>` a
  `css/estilos.css`.
- Tab recorre todos los controles y el foco es visible (sin
  `outline: none`).
- Si hay imágenes: `src` local + `alt` descriptivo; supuesto Etapa 1:
  ninguna imagen (`DATO_PENDIENTE: confirmar cero imágenes`).

### R-05 · Compatibilidad

`index.html` abre por doble clic/file:// sin npm ni servidor; sin
desplazamiento horizontal total a 320 px y 1280 px (tablas con contenedor
de scroll propio si exceden).

Escenarios observables:

- Doble clic en `index.html` → la maqueta carga sin errores, sin consola
  de red (sin fetch/CDN).
- A 320 px y 1280 px: la página no genera scroll horizontal total; las
  tablas que exceden desplazan dentro de su propio contenedor.

### R-06 · Convenciones

Archivos: `index.html` (+ `libros.html`, `clientes.html`, `ventas.html`,
`historial.html` o secciones `#catalogo`, `#libros`, etc.); carpetas
`css/`, `js/` (js solo placeholder), `assets/` si hay imágenes; nombres en
minúsculas sin espacios.

Escenarios observables:

- Según la decisión abierta (§6): o bien 5 archivos HTML, o bien un solo
  `index.html` con secciones `#catalogo`, `#libros`, `#clientes`,
  `#ventas`, `#historial`.
- `css/estilos.css` existe; `js/` contiene solo placeholder con `id`
  reservados; todo nombre en minúsculas sin espacios.

### R-07 · Preparación futura

Todos los listados, formularios, mensajes y tablas llevan `id` estable
documentado en SPEC para que Ej. 3-5 los reutilice; no se implementa
comportamiento futuro, solo se reserva el hook.

Escenarios observables:

- Cada elemento del mapa de `id` (§3) existe en el DOM con el `id` exacto.
- Ningún `id` tiene lógica asociada (placeholder); el JS futuro de los
  Ej. 3-5 los reutiliza sin renombrar.

## 2. Casos límite (visibles en DOM, estáticos u ocultos)

| Caso | Representación exigida |
| --- | --- |
| Libro sin género | Celda/columna con texto «Sin clasificar» (R-03; PDF pág. 2). |
| Lista vacía | Placeholder con `id` y texto «No hay registros» (uno por listado). |
| Búsqueda sin resultados | `#catalogo-mensaje` con texto «Sin resultados…». |
| Operación correcta | `#msg-ok` con texto de éxito (p. ej. «Libro registrado (ejemplo)»). |
| Operación rechazada | `#msg-error` con texto de error (p. ej. «No se pudo registrar (ejemplo)»). |

## 3. Estructura propuesta

### Mapa de páginas/secciones y `nav`

`nav` con 5 enlaces: Catálogo · Libros · Clientes · Ventas · Historial.
Opción A (recomendada): `index.html` (Catálogo) + `libros.html` +
`clientes.html` + `ventas.html` + `historial.html`. Opción B: un solo
`index.html` con secciones `#catalogo`, `#libros`, `#clientes`, `#ventas`,
`#historial`. Decisión pendiente de confirmación (§6, `proposal.md`).

### Formularios (campos + `id`)

- `#form-libro`: `#libro-titulo` (texto), `#libro-isbn` (texto),
  `#libro-precio` (numérico), `#libro-editorial` (`select`), `#libro-genero`
  (`select` con opción «Sin clasificar»), `#libro-autores` (selección
  múltiple); botón «Registrar libro»; `#msg-ok`, `#msg-error` asociados.
- `#form-cliente`: `#cliente-nombre` (nombre completo),
  `#cliente-email` (email); botón «Registrar cliente»; `#msg-ok`,
  `#msg-error` asociados.
- Venta: `#venta-cliente` (`select` cliente), `#venta-libro` (`select`
  libro), `#venta-cantidad` (cantidad), botón «Agregar renglón»,
  `#venta-renglones` (tabla de renglones), `#venta-resumen` (total),
  botón «Confirmar venta».
- Catálogo: `#buscador-titulo` (`input`) + botón «Buscar por título»,
  `#catalogo-listado`, `#catalogo-mensaje`.

### Tablas (columnas)

- Catálogo (`#catalogo-listado`): título, ISBN, editorial, género, autores,
  precio.
- Libros (`#libros-listado`): título, ISBN, editorial, género, autores,
  precio.
- Clientes (`#clientes-listado`): nombre completo, email.
- Venta (`#venta-renglones`): libro, cantidad, precio unitario, subtotal;
  `#venta-resumen`: total.
- Historial (`#historial-listado`): id, fecha, cliente, total; zona
  `#historial-detalle` para renglones de la venta seleccionada.

### Mapa completo de `id` estables (R-07)

`#catalogo-listado`, `#catalogo-mensaje`, `#buscador-titulo`,
`#form-libro`, `#libros-listado`, `#form-cliente`, `#clientes-listado`,
`#venta-cliente`, `#venta-libro`, `#venta-cantidad`, `#venta-renglones`,
`#venta-resumen`, `#historial-listado`, `#historial-detalle`, `#msg-ok`,
`#msg-error`. En español, legibles (R-04).

## 4. Estados en DOM

Vacío (placeholder con `id` por listado), sin resultados
(`#catalogo-mensaje`), ok (`#msg-ok`), error (`#msg-error`). Todos
presentes en el DOM en Etapa 1 como estáticos u ocultos; el JS de los
Ej. 3-5 los activará sin cambiar `id`.

## 5. Convenciones de archivos

Minúsculas sin espacios; `css/estilos.css` (único CSS, externo);
`js/` solo placeholder; `assets/` solo si hay imágenes locales con `alt`
(supuesto: ninguna en Etapa 1). Sin `style` inline, sin frameworks, sin CDN.

## 6. Datos de ejemplo (ficticios — no reales)

2-3 libros (uno con género, uno «Sin clasificar»; con título, ISBN,
editorial, género, autores, precio), 2 clientes (nombre completo, email),
1-2 renglones de venta (libro, cantidad, precio unitario, subtotal) y 1-2
ventas en historial (id, fecha, cliente, total). Todos rotulados como
«ejemplo ficticio». Valores concretos: `DATO_PENDIENTE` (placeholders al
implementar; no inventar datos reales).

## 7. Criterios de aceptación (desde `promtUno.md`, líneas 114-117)

- CA-01 — Las 5 vistas cargan desde `nav` con datos de ejemplo y cubren
  R-01 (verificado por navegación manual).
- CA-02 — Estructura semántica, labels, botones descriptivos y `th`
  presentes en todas las vistas y cubren R-02/R-06 (verificado por
  inspección HTML).
- CA-03 — Casos límite visibles: «Sin clasificar», lista vacía, sin
  resultados, ok/error presentes en DOM y cubren R-03 (verificado por
  inspección).
- CA-04 — Apertura file:// sin errores, 320/1280 sin scroll total, Tab con
  foco visible y cubre R-04/R-05 (verificado manualmente).

## 8. Hechos vs. supuestos vs. propuestas

- Hechos (atribuidos al PDF págs. 1-2): alcance del Ejercicio 1, 5 vistas y
  sus contenidos, semántica, etiquetas, botones descriptivos, `thead/th`,
  mensajes, datos estáticos en Etapa 1, stack nativo sin librerías/CDN/API.
- Supuestos: nombre «Librería Ejemplo»; cero imágenes; ejemplos con valores
  genéricos ficticios.
- Propuestas: opción multipágina recomendada (§6 de `proposal.md`).
- `DATO_PENDIENTE:` nombre comercial; cero imágenes; valores de ejemplo;
  decisión multipágina vs. secciones (bloquea PLAN, no SPEC).
- Ninguna validación ejecutada en esta fase: ningún criterio se declara
  aprobado; la verificación manual corresponde a la Fase 3.
