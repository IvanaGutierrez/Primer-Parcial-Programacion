# Proposal — ejercicio-5-ventas

## Why

El Ejercicio 5 del TPI (venta simulada: composición de renglones, cálculos con
dos decimales, precio unitario congelado como valor histórico e historial
inmutable) es la siguiente etapa obligatoria del flujo
SPEC → PLAN → IMPLEMENTACIÓN → VERIFICACIÓN del proyecto.
`ventas.html` y `historial.html` existen como **maquetas estáticas del
Ejercicio 1** (opciones y filas de ejemplo escritas en el HTML, sin lógica),
aunque `js/app.js` ya contiene helpers reutilizables del Ejercicio 4
(`generarId`, `mostrarMensajeOk/Error`, `actualizarSelector`, etc.). El puente
`sessionStorage` entre ambas páginas ya fue **aprobado por el usuario** (el
`localStorage` queda exclusivo del Ejercicio 6). Sin una SPEC previa no hay
base verificable para el PLAN ni para la verificación de los criterios
CA5-01..CA5-05; este change la establece. Al igual que el change del Ejercicio
4, este change es **prospectivo**: la implementación aún no existe y se
realizará solo tras autorización explícita.

## What Changes

- Se crea la SPEC del Ejercicio 5 (este change): `proposal.md`, `spec.md`
  (documento de lectura en español) y los deltas
  `specs/venta-historial/spec.md` (nueva capacidad),
  `specs/datos-catalogo-filtro/spec.md` y `specs/estructura-html/spec.md`
  (requisitos modificados por coherencia con el render dinámico en
  `ventas.html`/`historial.html`). **Sin código de producto en esta fase**
  (Fase 1 — SPEC según la metodología acordada).
- La SPEC formaliza: modelo de la venta
  (`{ id, fecha, clienteId, clienteNombre, renglones: [{ libroId, titulo,
  cantidad, precioUnitario, subtotal }], total }`); selectores
  `#venta-cliente`/`#venta-libro` poblados desde datos locales (reemplazando
  las opciones estáticas, incluidos libros/clientes dados de alta en el
  Ejercicio 4); composición de renglones con libro existente y cantidad
  entera > 0; política única de libro duplicado (**D2 CONFIRMADA 2026-10-19**:
  sumar la cantidad ingresada al renglón existente, recalcular y mostrar
  mensaje informativo); cálculos (subtotal = cantidad × precio unitario, total =
  suma de subtotales) con importes de dos decimales y recálculo al editar;
  bloqueo de la confirmación sin cliente/sin renglones/cantidades inválidas
  con errores como texto cerca del formulario; confirmación con **precio
  unitario copiado al renglón como valor histórico** y datos descriptivos
  autosuficientes (título del libro y nombre del cliente dentro de la venta);
  puente `sessionStorage` (clave, JSON, lectura defensiva y abstracción
  reemplazable por `localStorage` en el Ejercicio 6); historial con listado y
  detalle en `#historial-detalle`; ventas inmutables; cierre con limpieza del
  formulario y mensaje de éxito; DOM seguro y reutilización de helpers de
  `js/app.js` (R5-01..R5-12, CA5-01..CA5-05).
- **Ya aprobadas por el usuario (se documentan, no se preguntan):** el puente
  `sessionStorage` como único mecanismo de persistencia de este change
  (`localStorage` PROHIBIDO, exclusivo del Ejercicio 6) y la adición del id
  `#venta-confirmar` al botón «Confirmar venta» (id nuevo, no altera los
  existentes).
- **Decisiones del checkpoint — CONFIRMADAS 2026-10-19 (D1–D3):** D1
  ubicación de la lógica → **extender `js/app.js`** reutilizando los helpers
  existentes sin duplicarlos (y agregar `js/datos.js` con `defer` antes que
  `app.js` en `ventas.html` e `historial.html`, que hoy no lo enlazan); D2
  política de libro duplicado → **sumar la cantidad ingresada al renglón
  existente**, recalcular subtotal/total y mostrar mensaje informativo (nunca
  un segundo renglón); D3 `id`/`fecha` de la venta → **`id` incremental
  `v1..vn` vía `generarId('v', ventas)`** y **`fecha` almacenada directamente
  como string legible `dd/mm/aaaa hh:mm`** (elección explícita del usuario que
  anula la recomendación previa de almacenamiento ISO con presentación en
  locale; ver §Decisiones y el design §DD-02). Historial de alternativas en
  §Decisiones.
- Excluido explícitamente (fuera de este change y de R5): `localStorage` y
  persistencia entre sesiones (Ejercicio 6); edición y eliminación de ventas;
  stock, descuentos, impuestos, facturación y vuelto; modificación del
  catálogo desde la pantalla de venta; `fetch`; ABM de editoriales, géneros o
  autores; librerías, frameworks, transpiladores, CDNs, servidores, npm y
  base de datos; README y casos manuales (Ejercicio 6); modificar los
  Ejercicios 1–4 y sus IDs estables.
- No se agregan funcionalidades, dependencias ni refactorizaciones ajenas a
  esta entrega. **NO** se generan `tasks.md` ni `design.md` en esta fase:
  pertenecen a la Fase 2 — PLAN.

### Criterios de aceptación y cobertura de requisitos (CA5-01..CA5-05)

| CA | Grupo (pts) | Requisitos cubiertos |
| --- | --- | --- |
| CA5-01 | Composición y validaciones (8) | R5-01, R5-02, R5-03, R5-06, R5-07 |
| CA5-02 | Cálculos (5) | R5-04, R5-05 |
| CA5-03 | Confirmación e historial inmutable (7) | R5-08, R5-09, R5-10, R5-11 |
| CA5-04 | Cierre y calidad de código | R5-12 |
| CA5-05 | Integridad y compatibilidad | R5-12 |

(Fuente: `promptCinco.md` §8; el detalle de cada R está en `spec.md` §1.)

## Capabilities

### New Capabilities

- `venta-historial`: composición, cálculo y confirmación de la venta simulada
  en `ventas.html` e historial inmutable con detalle en `historial.html`,
  puente `sessionStorage`, precio histórico congelado, datos descriptivos
  autosuficientes, cierre con limpieza y mensajes, e inserción segura con
  reutilización de helpers (requisitos R5-01..R5-12; criterios
  CA5-01..CA5-05).

### Modified Capabilities

- `datos-catalogo-filtro`: se MODIFICA un requisito de la spec existente.
  «Integridad de los Ejercicios 1 y 2 e IDs estables» dice hoy que
  `ventas.html` e `historial.html` SHALL quedar intactos (verificado en
  `openspec/specs/datos-catalogo-filtro/spec.md`), lo que contradice el
  Ejercicio 5, que debe reemplazar en ambas páginas las opciones y filas
  estáticas por render dinámico, enlazar `js/datos.js` y agregar el id
  `#venta-confirmar`. El delta aclara que `index.html` y `css/estilos.css`
  siguen intactos, que en `ventas.html`/`historial.html` MAYE se reemplaza el
  contenido estático de ejemplo por render dinámico y se agregan referencias
  de scripts locales y el id nuevo, sin remover ni renombrar ningún id
  estable, y que `localStorage` sigue prohibido.
- `estructura-html`: se MODIFICA un requisito de la spec existente.
  «Vistas navegables del Ejercicio 1» exige hoy que las 5 vistas muestren
  «datos estáticos de ejemplo ficticios» (verificado), condición ya incumplida
  en `libros.html`/`clientes.html` desde el Ejercicio 4 y que el Ejercicio 5
  extiende a `ventas.html`/`historial.html`. El delta conserva la
  navegabilidad y la semántica, y establece que el contenido estático es el
  estado base del Ejercicio 1, reemplazable por render dinámico en etapas
  posteriores sin tocar estructura ni ids.

### Capacidades NO modificadas (y por qué)

- `altas-validacion`: su requisito «Integridad del alcance y apertura file://»
  («no hay lógica de ventas en el código agregado») se refiere al código
  agregado por la capacidad de altas del Ejercicio 4; el Ejercicio 5 agrega
  una capacidad nueva y no altera el comportamiento de `libros.html` ni
  `clientes.html`. Sin delta (decisión documentada, revisable en el
  checkpoint).
- `estilos-css`: su requisito «Ids estables del Ejercicio 1 intactos» pide
  conservar sin renombres los 44 ids existentes; `#venta-confirmar` es un id
  **nuevo** que no quita ni renombra ninguno de los 44, y este change no toca
  `css/estilos.css`. Sin delta.

## Impact

- **Archivos de producto afectados en fases posteriores (no en esta fase):**
  - `ventas.html`: `js/datos.js` aún no está enlazado (VERIFICADO — solo
    enlaza `js/app.js` con `defer`); se agrega su referencia antes que
    `app.js`; las opciones estáticas de `#venta-cliente` («ana», «luis») y
    `#venta-libro` («jardin», «manual») y las 2 filas estáticas del `tbody`
    de `#venta-renglones` se reemplazan por render dinámico; el botón
    «Confirmar venta» (VERIFICADO: sin `id`) recibe el id nuevo
    `#venta-confirmar`; textos de ejemplo de `#venta-renglones-vacio`,
    `#venta-resumen`, `#msg-ok` y `#msg-error` pasan a estado inicial
    controlado por JS. IDs estables existentes que NO se alteran:
    `#titulo-ventas`, `#form-venta`, `#venta-cliente`, `#venta-libro`,
    `#venta-cantidad`, `#venta-renglones`, `#venta-renglones-vacio`,
    `#titulo-resumen`, `#venta-resumen`, `#msg-ok`, `#msg-error`.
  - `historial.html`: idem — solo enlaza `js/app.js` hoy (VERIFICADO); se
    agrega `js/datos.js`; las 2 filas estáticas de `#historial-listado` y el
    contenido de ejemplo de `#historial-detalle` se reemplazan por render
    dinámico; textos de `#historial-vacio`, `#msg-ok` y `#msg-error` pasan a
    estado inicial controlado por JS. IDs estables que NO se alteran:
    `#titulo-historial`, `#historial-listado`, `#historial-vacio`,
    `#titulo-detalle`, `#historial-detalle`, `#msg-ok`, `#msg-error`.
  - Lógica de ventas/historial: **D1 CONFIRMADA (2026-10-19): se extiende
    `js/app.js`** (ya enlazado por las 5 páginas con guardas `typeof`/DOMContent
    por página, patrón DD-03 del Ejercicio 4, y consistente con la elección del
    usuario en el Ejercicio 4), reutilizando los helpers existentes
    (`generarId`, `mostrarMensajeOk/Error`, `limpiarMensajes`,
    `actualizarSelector`, `normalizarIsbn/Email`, guardas DD-03) **sin
    duplicarlos**; la inicialización se gatea con `inicializarVentas()` (si
    existe `#form-venta`) e `inicializarHistorial()` (si existe
    `#historial-listado`). No se crea `js/ventas.js`. La organización interna
    se detalla en `design.md` (Fase 2).
  - Almacenamiento de sesión: `sessionStorage` con clave fijada en este
    change y aprobada `libreria-ventas`, valor JSON del
    array de ventas, escritura al confirmar y lectura defensiva
    (`try/catch` → `[]`); acceso concentrado en una abstracción
    (`obtenerVentas()`/`guardarVentas(ventas)`) para que el
    Ejercicio 6 añada/reemplace `localStorage` sin reescribir la
    presentación. **`localStorage` NO se usa en este change.**
- **Archivos NO afectados:** `index.html`, `ejercicio3.html`,
  `libros.html`, `clientes.html`, `css/estilos.css`, `js/datos.js` (se
  consume, no se modifica) y los Ejercicios 1–4 con sus ids estables.
- Sin dependencias nuevas: HTML5 + CSS existente + JS nativo (ES5/ES6 sin
  transpilar) + apertura `file://`. Prohibidos librerías, frameworks, CDNs,
  npm/bundlers, servidores y `fetch`.

## Contexto verificado

Inspección de la rama actual (árbol limpio salvo `promptCinco.md` y este
change sin trackear):

- **Git (hecho):** rama actual **`feature/ejercicio-5`**, HEAD `7b3e178`
  (merge del commit `a5abe82` del Ejercicio 4). Discrepancia con
  `promptCinco.md` §3, que declara rama `feature/ejercicio-4` / `a5abe82`:
  el texto está desactualizado; la rama de trabajo del Ejercicio 5 **ya
  existe** (`feature/ejercicio-5`), no hace falta crearla.
- **Fuente de requisitos:** `promptCinco.md` (§3 contexto, §4 alcance
  incluido/excluido, §6 R5-01..R5-12 con «Verificación observable», §8
  CA5-01..CA5-05, §7 fases con checkpoint Continuar/Ajustar/Parar). La fuente
  primaria declarada allí es `Docs/Repaso Primer Parcial.pdf`, sección
  «Ejercicio 5 — Venta simulada e historial» (p.5 de 7); **este modelo no
  pudo leer el PDF** (el formato no está soportado por la herramienta de
  lectura de esta sesión), por lo que la SPEC se apoya en `promptCinco.md`,
  que declara haber contrastado esa página (mismo caso que en el Ejercicio 4).
- **`js/datos.js` inspeccionado (hecho):** fuente única de datos —
  `editoriales`: `ed1` «Editorial Planeta», `ed2` «Penguin Random House»;
  `generos`: `g1` «Novela», `g2` «Fantasía»; `autores`: `a1` «Antoine de
  Saint-Exupéry», `a2` «J. K. Rowling», `a3` «Gabriel García Márquez»;
  `clientes`: `c1` «Lucía Pérez», `c2` «Mateo Gómez», `c3` «Sofía López»,
  **con `email`**; `libros`: `l1..l6` **con `isbn` y `precio`** (`l6`
  «Vuelo nocturno» con **`generoId: null`**); función
  `buscarPorId(lista, id)` (devuelve el elemento o `undefined`). Coincide
  con `promptCinco.md` §3.
- **`js/app.js` inspeccionado (hecho):** helpers reutilizables verificados
  con sus firmas exactas — `generarId(prefijo, lista)` (devuelve string
  `prefijo+n` sin colisionar con `lista`), `mostrarMensajeOk(texto)` y
  `mostrarMensajeError(texto)` (escriben en `#msg-ok`/`#msg-error` con
  guardas y alternancia), `limpiarMensajes()` (vacía/oculta ambos),
  `actualizarSelector(elemento, items, etiqueta)` (reconstruye un `<select>`
  con `replaceChildren`, guarda `elemento` nulo; `etiqueta` es
  `item => texto`), `renderizarListadoLibros()` y
  `renderizarListadoClientes()` (render de `tbody` con
  `replaceChildren`/`createElement`/`textContent`, guardan si la tabla no
  existe y alternan `#libros-vacio`/`#clientes-vacio`),
  `normalizarIsbn(texto)` y `normalizarEmail(texto)`,
  `refrescarListados()` + hook vacío `refrescarOpcionesRelacionadas()` (con
  comentario que reserva `actualizarSelector(...)` para los selectores del
  Ejercicio 5), `validarLibro/validarCliente(datos)` →
  `{ valido, errores }`, `manejarEnvioLibro/Cliente(evento)` con
  `preventDefault()` y `formulario.noValidate = true` (validación en JS como
  autoridad, patrón DD-08), y el hook `DOMContentLoaded` con guardas
  `document.getElementById(...) && typeof <array> !== "undefined"` (patrón
  DD-03 compartido por las 5 páginas). `buscarPorId` vive en `js/datos.js`,
  no en `app.js`. Coincide con `promptCinco.md` §3.
- **`ventas.html` inspeccionado (hecho):** enlaza solo `css/estilos.css` y
  `js/app.js` (`defer`) — **no enlaza `js/datos.js`**. Existen todos los ids
  estables declarados: `#form-venta` (`action="#" method="post"`), selector
  `#venta-cliente` con 2 opciones estáticas (`value="ana"` «Ana Pérez
  (ejemplo)», `value="luis"` «Luis Gómez (ejemplo)»), selector `#venta-libro`
  con 2 opciones estáticas (`value="jardin"`, `value="manual"`), input
  `#venta-cantidad` (`type="number" min="1" value="1" required`, sin
  `step`), botón «Agregar renglón» (`type="submit"`), tabla
  `#venta-renglones` (columnas **Libro | Cantidad | Precio unitario |
  Subtotal**, `tbody` con 2 filas estáticas: 2×250.00=500.00 y
  1×180.50=180.50), `#venta-renglones-vacio`, `#venta-resumen`
  («Total: 680.50 (ejemplo).»), botón «Confirmar venta» `type="button"` **sin
  `id`** (recibirá `#venta-confirmar`), `#msg-ok` y `#msg-error` con textos
  de ejemplo. Coincide con `promptCinco.md` §3.
- **`historial.html` inspeccionado (hecho):** enlaza solo `js/app.js`
  (`defer`) — **no enlaza `js/datos.js`**. Existen todos los ids estables:
  `#historial-listado` (columnas **Id | Fecha | Cliente | Total | Detalle**,
  `tbody` con 2 filas estáticas de ejemplo y enlaces
  `href="#historial-detalle"` «Ver detalle de la venta 1/2»),
  `#historial-vacio`, `#titulo-detalle`, `#historial-detalle` (div con
  contenido de ejemplo), `#msg-ok`, `#msg-error`. Observación menor: la spec
  `estructura-html` lista para esta tabla solo «id, fecha, cliente, total»
  (la columna «Detalle» existe desde el Ejercicio 1; discrepancia preexistente
  que este change no provoca ni modifica).
- **Specs vigentes leídas (hecho):** `openspec/specs/` contiene
  `estructura-html` (7 requisitos), `estilos-css` (6), `datos-catalogo-filtro`
  (10) y `altas-validacion` (10). Tensiones detectadas con el alcance del
  Ejercicio 5: (1) `datos-catalogo-filtro` → «Integridad de los Ejercicios 1
  y 2 e IDs estables» prohíbe modificar `ventas.html`/`historial.html` (delta
  MODIFIED); (2) `estructura-html` → «Vistas navegables del Ejercicio 1»
  exige «datos estáticos de ejemplo ficticios» en las 5 vistas (delta
  MODIFIED). `altas-validacion` y `estilos-css` no requieren delta (ver
  §Capabilities).
- **Style reference (hecho):** `openspec/changes/archive/2026-10-19-ejercicio-4-altas/`
  (proposal/spec/deltas en español, misma estructura) y los 4 deltas
  archivados de los Ejercicios 1–4.

## Restricciones técnicas

- Esta fase (SPEC) se limita a `openspec/changes/ejercicio-5-ventas/`: solo se
  crean documentos. **NO** se escribe ni modifica código de producto hasta
  aprobación explícita en el checkpoint; **NO** se generan `tasks.md` ni
  `design.md` (Fase 2 — PLAN).
- JS nativo (ES5/ES6 sin transpilar), sin librerías/frameworks/CDN, sin npm
  ni servidor; apertura por `file://` (R5-12/CA5-05).
- Inserción segura de texto: `textContent`/`createElement`/`replaceChildren`;
  **prohibido `innerHTML` con datos** (R5-12/CA5-04).
- No se alteran los ids estables listados en `promptCinco.md` §3 ni la
  estructura semántica y `css/estilos.css` de los Ejercicios 1–4
  (R5-12/CA5-05); los cambios de contenido en `ventas.html`/`historial.html`
  se limitan al reemplazo del material estático de ejemplo, la referencia a
  `js/datos.js` y el id nuevo `#venta-confirmar`.
- `sessionStorage` solo como puente de sesión aprobado; **`localStorage`
  prohibido** en este change (exclusivo del Ejercicio 6, anti-confusión
  explícita de `promptCinco.md` §9).
- No se hace commit ni push salvo pedido explícito.

## Supuestos, información pendiente y decisiones

### Decisiones ya aprobadas (documentadas, no se preguntan)

- **Puente `sessionStorage` — APROBADO por el usuario (previo a este
  change):** las ventas confirmadas en `ventas.html` quedan disponibles en
  `historial.html` al navegar en la misma pestaña; clave propuesta
  `libreria-ventas` (detalle menor, ajustable en PLAN), valor en JSON,
  lectura defensiva con `try/catch` (JSON ausente/inválido → `[]`), acceso
  concentrado en una abstracción para que el Ejercicio 6 cambie el storage
  sin tocar la presentación. `localStorage` queda exclusivo del Ejercicio 6.
- **`#venta-confirmar` — id nuevo aprobado:** el botón «Confirmar venta»
  (hoy sin `id`, VERIFICADO) recibe el id `#venta-confirmar` para enlazarlo
  con JS; no altera ningún id existente.

### Decisiones del checkpoint — CONFIRMADAS 2026-10-19 (D1–D3)

Se conserva abajo el enunciado original con sus alternativas (historial de la
decisión); el encabezado de cada una queda marcado como confirmado.

- **D1 — Archivo de lógica de ventas/historial: CONFIRMADA 2026-10-19
  (opción A: extender `js/app.js`).** Toda la lógica de ventas e historial se
  agrega a `js/app.js`, que ya está enlazado por las cinco páginas con guardas
  por página (`DOMContentLoaded` + `getElementById` + `typeof`, patrón DD-03
  verificado), consistente con la elección del usuario en el Ejercicio 4 (D4
  allí confirmada: la lógica de altas vive en `app.js`) y sin archivos nuevos.
  Inicialización gateada: `inicializarVentas()` cuando existe `#form-venta`;
  `inicializarHistorial()` cuando existe `#historial-listado`. Además, y como
  parte de esta confirmación, **`ventas.html` e `historial.html` DEBEN agregar
  `<script defer src="js/datos.js">` antes de `js/app.js`** (VERIFICADO: hoy
  ninguna de las dos lo enlaza), de modo que ambas páginas tengan la fuente de
  datos disponible y las guardas `typeof` funcionen de forma uniforme. En todo
  caso se reutilizan los helpers de `app.js` **sin duplicarlos**. Opción B
  (descartada): crear `js/ventas.js` cargado solo por las dos páginas.
  No afecta requisitos observables; la organización interna se detalla en
  `design.md` (Fase 2).
- **D2 — Política de libro duplicado: CONFIRMADA 2026-10-19 (opción A: sumar
  la cantidad).** Al agregar un libro que ya tiene renglón en la venta se
  **SUMA** la cantidad ingresada a la del renglón existente, se recalculan
  subtotal (de ese renglón) y total, y se muestra un mensaje informativo
  (p. ej. «Libro ya presente: cantidad actualizada a N»). **No se crea nunca
  un segundo renglón para el mismo libro en la misma venta.** Ventaja
  (historial de la decisión): conserva el aporte del usuario, es determinista
  y satisface «modificar la cantidad del existente» de R5-03. Opciones B
  (reemplazar la cantidad) y C (informar sin modificar) descartadas.
- **D3 — Formato de `id` y `fecha` de la venta (menor): CONFIRMADA 2026-10-19
  con elección explícita del usuario sobre la fecha.** `id` incremental
  `v1..vn` generado con el helper existente `generarId("v", ventas)`
  (consistente con el patrón `ed*`/`c*`/`l*` del Ejercicio 4, único mientras
  no haya colisiones). `fecha` se **ALMACENA DIRECTAMENTE como string legible
  `dd/mm/aaaa hh:mm`** (p. ej. `19/10/2026 15:30`): el usuario eligió el
  formato legible para el valor guardado, **lo que anula la recomendación
  previa de este documento de almacenar ISO 8601 y formatear solo al
  mostrar**. Consecuencias documentadas: el listado y el detalle muestran la
  fecha tal cual se guardó (sin transformación), y el orden del historial es
  el orden de inserción del array (no un orden lexicográfico de fechas) —
  aceptable para este change; ver `design.md` §DD-02 y §Risks. Alternativa
  histórica (descartada): id numérico secuencial (`1`, `2`, …) como en la
  maqueta estática y/o fecha ISO con presentación locale.

### Supuestos

- SUPUESTO: los datos ficticios actuales (`js/datos.js`) y los libros/clientes
  dados de alta en el Ejercicio 4 son el contenido de los selectores
  `#venta-cliente`/`#venta-libro`; los ids `l1..l6`/`c1..c3` y los altas
  posteriores (`l7+`/`c4+`) conviven sin cambios de modelo.
- SUPUESTO: «errores cerca del formulario» (R5-07) se cumple con texto
  explícito visible junto al `<form>` o en `#msg-error` próximo (mismo
  criterio que R4-08), sin depender solo del color; el éxito se comunica en
  `#msg-ok`.
- SUPUESTO: «dos decimales» (R5-04/R5-05) es una regla de **presentación**
  (`toFixed(2)` en los textos mostrados); los valores almacenados en la venta
  son números, y el redondeo no altera la igualdad «total = suma de
  subtotales» en los escenarios de la consigna.
- SUPUESTO: «cantidades inválidas» (R5-07) incluye vacío, cero, negativa y
  decimal; la comprobación se hace en JavaScript como autoridad (patrón
  DD-08 del Ejercicio 4), pese a los atributos nativos `min="1" required` de
  `#venta-cantidad` (VERIFICADO).
- SUPUESTO: las ventas se leen en `historial.html` desde `sessionStorage` en
  cada carga de página; una pestaña nueva o el cierre de la pestaña vacía el
  puente (comportamiento esperado de `sessionStorage`, propio del alcance
  mínimo aprobado; la persistencia entre sesiones es del Ejercicio 6).
- SUPUESTO: la inmutabilidad (R5-11) significa **ausencia de controles** de
  edición/eliminación en la interfaz y de escritura sobre ventas ya
  confirmadas; el borrado manual desde DevTools queda fuera de lo exigido.
- ~~SUPUESTO: la clave `sessionStorage` propuesta (`libreria-ventas`) y los
  nombres de la abstracción (`obtenerVentas`/`guardarVentas`) son detalles
  menores ajustables en `design.md`/PLAN sin impacto en requisitos
  observables.~~ **Resuelto en PLAN (2026-10-19):** clave `libreria-ventas` y
  abstracción `obtenerVentas`/`guardarVentas` fijadas en `design.md` §DD-06.

### Información pendiente

- `DATO_PENDIENTE: la lectura de Docs/Repaso Primer Parcial.pdf (página 5,
  «Ejercicio 5 — Venta simulada e historial») no pudo realizarse en esta
  sesión (el modelo no soporta entrada PDF); la SPEC se basa en
  promptCinco.md, que declara haber contrastado esa página.` Disponible el
  pegado del texto para verificación cruzada.
- D1–D3 **confirmadas el 2026-10-19** (ver §Decisiones); no quedan decisiones
  abiertas de SPEC.

## Estado de los artefactos

- Fase 1 — SPEC: **completa** (`proposal.md`, `spec.md` y los 3 deltas en
  `specs/`); `openspec validate "ejercicio-5-ventas" --strict` **pasó** al
  cerrar la fase; checkpoint respondido: «SPEC lista → Continuar a PLAN», con
  D1–D3 **confirmadas el 2026-10-19** (ver §Decisiones).
- Fase 2 — PLAN: **completa** (2026-10-19): `design.md` (decisiones DD-01..DD-08,
  con la resolución de D3 — `fecha` legible almacenada directamente — y la
  observación sobre altas del Ej4) y `tasks.md` (T1..T6) generados; validación
  `--strict` ejecutada al cerrar esta fase. Checkpoint «PLAN listo. ¿Autorizar
  IMPLEMENTACIÓN, Ajustar PLAN o Parar?» **pendiente de respuesta del usuario**.
- Fase 3 — IMPLEMENTACIÓN: **no iniciada**; requiere autorización explícita.
- Fase 4 — VERIFICACIÓN: pendiente; será manual en navegador por `file://`
  (el proyecto no tiene test runner ni npm; método recomendado: Edge headless
  vía CDP con Node WebSocket nativo, como en el Ejercicio 4). Ningún CA se
  declara cumplido todavía.
