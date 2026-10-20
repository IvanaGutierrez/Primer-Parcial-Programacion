# TASKS — ejercicio-5-ventas · Fase 2 PLAN (sin código de producto)

> Este archivo es SOLO plan. La Fase 3 (implementación) se ejecutará únicamente con autorización
> explícita en el checkpoint «PLAN listo». Cada `- [ ]` se marcará `- [x]` **solo** con su control
> de cierre efectivamente ejecutado.
> **Sin test runner:** el proyecto es JS nativo abierto por `file://`, sin npm ni framework de
> pruebas. Las comprobaciones de cierre son **verificación manual en navegador** (doble clic) e
> inspección estática con `rg` (ripgrep; si no está instalado, `Select-String`/búsqueda equivalente);
> no se inventan frameworks ni pruebas automatizadas. TDD estricto no aplica aquí.
> Método de verificación en navegador recomendado (exitoso en el Ejercicio 4): **Edge headless vía
> CDP sobre Node WebSocket nativo** (sin Playwright ni instalaciones) o DevTools manual sobre
> `file://`.
> Archivos de producto que la Fase 3 podrá tocar: `js/app.js`, `ventas.html` y `historial.html`.
> PROHIBIDO editar `index.html`, `ejercicio3.html`, `libros.html`, `clientes.html`, `css/estilos.css`,
> `js/datos.js` y `js/ejercicio3.js` (CA5-05). PROHIBIDO `localStorage` (exclusivo del Ej 6), `fetch`,
> librerías/CDN/npm, `innerHTML` con datos (R5-12) y tocar los IDs estables. El botón «Confirmar
> venta» solo recibe el id nuevo `#venta-confirmar` (type `button` intacto).
> **Orden de ejecución:** T1 → T3 → T2 → T4 → T5 → T6. T3 (cálculos) va antes que T2 porque el
> render de renglones consume `formatearImporte`/`recalcularResumen`; su observación con renglones
> se completa en T2 y T6 (mismo criterio que 5.1–5.2 antes de T3/T4 en el Ejercicio 4).

## T1 — Carga de datos, selectores y estado base (R5-01 → CA5-01)

- [x] 1.1 En `ventas.html`: agregar `<script src="js/datos.js" defer></script>` **antes** de
  `<script src="js/app.js" defer></script>`; retirar las opciones estáticas de `#venta-cliente`
  (`value="ana"`, `value="luis"`) y de `#venta-libro` (`value="jardin"`, `value="manual"`) dejando los
  `<select>` vacíos; agregar `id="venta-confirmar"` al botón «Confirmar venta» (conservando
  `type="button"`). En `historial.html`: agregar `js/datos.js` con `defer` antes de `js/app.js` (sin
  otros cambios aún). Resultado esperado: ambas páginas cargan la fuente de datos antes que `app.js`,
  sin opciones de ejemplo y con el id nuevo en el botón. Cubre R5-01 (CA5-01/CA5-05). Archivos:
  `ventas.html`, `historial.html`. Sin dependencias. Cierre: inspección — sin opciones de ejemplo; orden de scripts `js/datos.js` → `js/app.js`
  (ambos `defer`) en las 2 páginas; `id="venta-confirmar"` presente 1 vez; IDs estables presentes.

- [x] 1.2 En `js/app.js`: implementar `inicializarVentas()` con guarda de página
  (`document.getElementById("form-venta") && typeof libros !== "undefined" && typeof clientes !== "undefined"`
  registrada en el hook `DOMContentLoaded`), `poblarSelectorVentaCliente()` y `poblarSelectorVentaLibro()` usando
  `actualizarSelector(...)` (`value` = `id`, texto = `nombre`/`titulo`), declarar `renglonesVentaActual = []`,
  limpiar/ocultar con `limpiarMensajes()` los textos de ejemplo, registrar `noValidate = true` en `#form-venta`.
  Cubre R5-01 (CA5-01/CA5-05). Archivo: `js/app.js`. Depende de 1.1. Cierre: node --check OK, sin innerHTML con datos.

## T3 — Cálculos: importes con dos decimales y resumen (R5-04/R5-05 → CA5-02)

- [x] 3.1 Implementar en `js/app.js` `redondear2(numero)` (`Math.round(numero * 100) / 100`) y
  `formatearImporte(numero)` (`redondear2(numero).toFixed(2)`). Cubre R5-04 (CA5-02). Archivo: `js/app.js`.
  Depende de T1. Cierre: `node --check js/app.js` OK; helpers implementados y reutilizados.

- [x] 3.2 Implementar `recalcularResumen()`: suma los subtotales de `renglonesVentaActual` con `redondear2`
  y escribe el total en `#venta-resumen` con `formatearImporte` (`Total: X.XX.`); sin renglones muestra
  `Total: 0.00.`. Cubre R5-04/R5-05 (CA5-02). Archivo: `js/app.js`. Depende de 3.1. Cierre: implementado
  y usado por render.

## T2 — Composición de renglones: agregar, duplicados, editar, quitar (R5-02/R5-03/R5-06 → CA5-01)

- [x] 2.1 En `ventas.html` retirar las 2 filas estáticas del `<tbody>` de `#venta-renglones`; en
  `js/app.js` implementar `renderizarRenglones()` usando `replaceChildren()`, `createElement`/`textContent`,
  alternando `#venta-renglones-vacio` e invocando `recalcularResumen()`. Invocado desde `inicializarVentas`.
  Cubre R5-02/R5-06 (CA5-01/CA5-04). Archivos: `ventas.html`, `js/app.js`. Depende de T1 y T3.
  Cierre: `<tbody>` vacío en HTML fuente, sin innerHTML con datos.

- [x] 2.2 Implementar `agregarRenglon(evento)` y registrar `submit` de `#form-venta` con `preventDefault()`:
  leer `#venta-libro` y `#venta-cantidad`; validar libro existente (`buscarPorId`) y cantidad entera > 0
  (sin vacío/0/neg/decimal); si falla → `mostrarMensajeError` sin mutar; si pasa → push con
  `precioUnitario` copiado del catálogo y `subtotal` calculado → `renderizarRenglones()` + `recalcularResumen()`.
  `noValidate` en `#form-venta`. Cubre R5-02/R5-06 (CA5-01). Archivo: `js/app.js`. Depende de 2.1 y T3.
  Cierre: validación y render implementados.

- [x] 2.3 Implementar política D2 en `agregarRenglon`: si libro ya existe en `renglonesVentaActual`,
  SUMAR cantidad ingresada al renglón existente, recalcular subtotal y total, re-renderizar y mostrar
  `mostrarMensajeOk` «Libro ya presente: cantidad actualizada a N.». Un solo renglón por libro.
  Cubre R5-03 (CA5-01). Archivo: `js/app.js`. Depende de 2.2. Cierre: lógica implementada.

- [x] 2.4 Implementar `actualizarCantidadRenglon(libroId, textoCantidad)` con evento `change` en input
  de cada fila: misma validación entera > 0; válida → actualiza cantidad/subtotal/total;
  inválida → `mostrarMensajeError` y re-render restaura valor guardado. Cubre R5-06/R5-04/R5-05
  (CA5-01/CA5-02). Archivo: `js/app.js`. Depende de 2.2 y T3. Cierre: implementado.

- [x] 2.5 Implementar `quitarRenglon(libroId)` con botón «Quitar» por fila: filtra, re-renderiza y
  recalcula; último renglón → `#venta-renglones-vacio` visible y `Total: 0.00.`. Cubre R5-06/R5-05
  (CA5-01/CA5-02). Archivo: `js/app.js`. Depende de 2.1. Cierre: implementado.

## T4 — Confirmación de la venta y puente de sesión (R5-07/R5-08/R5-09/R5-12 → CA5-01/CA5-03/CA5-04)

- [x] 4.1 Implementar `validarVentaActual()` → `{ valido, errores }` acumulando bloqueos: sin cliente
  seleccionado (o inexistente), sin renglones, y cantidades inválidas. Registrar `click` de `#venta-confirmar`;
  si no válido → `mostrarMensajeError` con todos los errores unidos, sin registrar. Cubre R5-07 (CA5-01).
  Archivo: `js/app.js`. Depende de T2. Cierre: validación y bloqueo implementados.

- [x] 4.2 Implementar registro de venta válida: `crearFechaLegible()` → `dd/mm/aaaa hh:mm`; construir venta
  con `id = generarId("v", obtenerVentas())` (lista del puente), `fecha`, `clienteId`/`clienteNombre`
  vía `buscarPorId`, **copia** de renglones (`libroId`, `titulo`, `cantidad`, `precioUnitario`,
  `subtotal` — congelado) y `total` con `redondear2`. Implementar `obtenerVentas()` (lectura defensiva
  `try/catch` + `Array.isArray` → `[]`) y `guardarVentas(lista)` (escritura `try/catch` a `sessionStorage`
  clave `libreria-ventas`, JSON completo; **`localStorage` prohibido**); `lista.push(venta)` +
  `guardarVentas(lista)`. Cubre R5-08/R5-09/R5-10 (CA5-03). Archivo: `js/app.js`. Depende de 4.1 y T1.
  Cierre: implementación completa, sin localStorage.

- [x] 4.3 Implementar cierre exitoso: `mostrarMensajeOk` con id y total (tras `limpiarMensajes`) y
  `resetearFormularioVenta()` → `#form-venta.reset()`, cantidad vuelve a `1`, `renglonesVentaActual = []`,
  `renderizarRenglones()`, `recalcularResumen()`. Sin recarga. Cubre R5-12/R5-07 (CA5-04/CA5-01).
  Archivo: `js/app.js`. Depende de 4.2 y T2. Cierre: implementado.

## T5 — Historial: listado, detalle e inmutabilidad (R5-10/R5-11 → CA5-03)

- [x] 5.1 En `historial.html`: retirar las 2 filas estáticas del `<tbody>` de `#historial-listado` y
  el contenido de ejemplo de `#historial-detalle`; dejar la tabla e IDs intactos. Cubre R5-10/R5-11
  (CA5-03/CA5-05). Archivo: `historial.html`. Depende de 1.1. Cierre: `<tbody>` vacío, `#historial-detalle`
  vacío en fuente.

- [x] 5.2 En `js/app.js`: implementar `inicializarHistorial()` con guarda (`document.getElementById("historial-listado")`)
  → `limpiarMensajes()` y `renderizarHistorial(obtenerVentas())`; `renderizarHistorial(ventas)` limpia
  `<tbody>` con `replaceChildren()`, crea fila por venta (`id`, `fecha` tal cual guardada, `clienteNombre`,
  `total` con `formatearImporte`, celda Detalle con `<a>` que hace `preventDefault()` → `verDetalleVenta(id)`);
  sin ventas → filas `0` y `#historial-vacio` visible. Cubre R5-10 (CA5-03). Archivo: `js/app.js`.
  Depende de 4.2 y 5.1. Cierre: implementado.

- [x] 5.3 Implementar `verDetalleVenta(id)`: busca la venta **solo** en lista leída del puente y renderiza
  en `#historial-detalle` cabecera (`id`, `fecha`, cliente, total) y por cada renglón `titulo`, `cantidad`,
  `precioUnitario` y `subtotal` (con `formatearImporte`), usando `createElement`/`textContent` — **sin**
  `buscarPorId(libros, …)` ni lectura de precios del catálogo. Inmutabilidad R5-11: sin controles
  de edición/eliminación. Cubre R5-08/R5-09/R5-11 (CA5-03). Archivo: `js/app.js`. Depende de 5.2.
  Cierre: implementado, sin localStorage/innerHTML con datos.

## T6 — Verificación manual integral por `file://` (todos los CA)

- [x] 6.1 Ejecutar la checklist de casos límite en navegador (método recomendado: Edge headless vía
  CDP con Node WebSocket nativo — como en el Ejercicio 4, sin Playwright ni instalaciones — o DevTools
  manual; siempre **misma pestaña** para `ventas.html` → `historial.html` por el `nav`) y registrar
  pasa/falla por caso: (1) venta válida `2 × 1500` + `1 × 2000` → subtotales `3000.00` y `2000.00`,
  total `5000.00` (precios ficticios autorizados: usar copia de prueba ajustando precios en
  `js/datos.js` y revertir con `git checkout -- js/datos.js`, o verificar la misma aritmética con los
  precios reales del catálogo); (2) cantidad `0`, negativa o decimal → rechazada con mensaje, sin fila
  nueva ni cambio de cantidad; (3) confirmar sin cliente y sin renglones → no registra, `#msg-error`
  con texto; (4) mismo libro dos veces → un solo renglón con cantidad sumada, subtotal/total
  recalculados y mensaje informativo; (5) **caso guiado de precio histórico**: confirmar una venta →
  cambiar el `precio` de un libro en `js/datos.js` (copia de prueba) → recargar `historial.html` →
  precio unitario, subtotales y total **conservan** los valores confirmados → revertir el cambio;
  (6) tras confirmar → `#form-venta` limpio, mensaje de éxito visible y la venta en el historial;
  (7) título o cliente con marcas HTML (`<b>…</b>`) → se muestra literal (`textContent`); (8) 0
  errores de consola en todas las interacciones (incluye abrir las 6 páginas). Resultado esperado:
  todos los escenarios observables de `spec.md` §2 verificados. Cubre R5-01..R5-12 (CA5-01..CA5-04).
  Archivos: ninguno (si algo falla, el fix vuelve a `js/app.js`/HTML y se repite el caso afectado).
  Depende de T5. Cierre: registro pasa/falla por caso en evidencia, sin declarar aprobado ningún caso
  sin control ejecutado.

- [x] 6.2 Verificar integridad y compatibilidad: `git status --short` muestra como modificados de
  producto **solo** `js/app.js`, `ventas.html` e `historial.html` (más `openspec/` y `promptCinco.md`
  sin trackear); intactos `index.html`, `ejercicio3.html`, `libros.html`, `clientes.html`,
  `css/estilos.css`, `js/datos.js`, `js/ejercicio3.js`; los IDs estables de la SPEC siguen presentes
  con su nombre exacto en ambas páginas y `#venta-confirmar` existe como id nuevo sin renombrar
  nada; en `js/app.js` y los HTML: `rg "localStorage|fetch|http|innerHTML" js/ ventas.html historial.html`
  sin coincidencias de alcance (salvo menciones de comentario si las hubiera — verificar que no hay
  uso real); `sessionStorage` solo con la clave `libreria-ventas` vía `obtenerVentas`/`guardarVentas`;
  las 5 vistas + `ejercicio3.html` abren por doble clic sin servidor y con 0 errores de consola
  (regresión Ej1–4: catálogo/filtro, altas de libros y clientes intactas). Resultado esperado:
  R5-12/CA5-05 cumplidos. Cubre R5-12 (CA5-05/CA5-04). Archivos: ninguno (verificación). Depende de
  6.1. Cierre: comandos de inspección ejecutados y apertura directa confirmada, con registro
  pasa/falla.

### Evidencia de cierre — T6.1 (2026-10-20, Edge headless vía CDP, `file://`, misma pestaña)

Harness local `_verify_ej5.js` (sin Playwright): **19/19 chequeos PASS**.

| Caso | Resultado | Evidencia breve |
| --- | --- | --- |
| 1 | PASA | Precios reales (equivalente autorizado): `2 × 8999.99 = 17999.98`, `1 × 12500.50 = 12500.50`, `Total: 30500.48.` |
| 2 | PASA | Cantidad `0`, `-1`, `1.5` y vacía → mensaje «la cantidad debe ser un entero mayor que cero», 2 filas y cantidad `2` sin cambios |
| 3 | PASA | Sin cliente y sin renglones → no escribe `libreria-ventas` (null), `#msg-error` = «Revisá: seleccione un cliente; agregue al menos un renglón.» |
| 4 | PASA | l1 agregado 2 y luego 3 → 1 renglón con cantidad `5`, subtotal `44999.95`, total `57500.45`, mensaje «Libro ya presente: cantidad actualizada a 5.» |
| 5 | PASA | Venta v1 confirmada con `precioUnitario` 8999.99/12500.50 → copia de prueba `precio: 1.00` en `js/datos.js` → historial/detalle conservan `8999.99`, `44999.95`, `12500.50`, `57500.45` → revertido (`git checkout` equivalente; `git diff` de `js/datos.js` vacío) |
| 6 | PASA | Tras confirmar: 0 renglones, `Total: 0.00.`, cantidad `1`, `#msg-ok` «Venta registrada: v1 — total 57500.45.»; v1 visible en `historial.html` al navegar por el `nav` |
| 7 | PASA | Título `<b>Título Prueba</b>` y cliente `<i>Cliente Prueba</i>` se muestran literales; 0 nodos `b`/`i` en listado y detalle |
| 8 | PASA | 0 errores de consola en todas las interacciones y en las 6 páginas abiertas por `file://` |

### Evidencia de cierre — T6.2 (2026-10-20)

- `git status --short`: productos modificados **solo** `js/app.js`, `ventas.html`, `historial.html`; `js/datos.js`, `index.html`, `ejercicio3.html`, `libros.html`, `clientes.html`, `css/estilos.css`, `js/ejercicio3.js` sin cambios. Untracked: `openspec/changes/ejercicio-5-ventas/`, `promptCinco.md`, harness `_verify_ej5.js`.
- IDs estables exactos presentes 1 vez en cada página (11 existentes en `ventas.html` + `#venta-confirmar`; 7 en `historial.html`).
- `Select-String "localStorage|fetch|http|innerHTML"` en `js/`, `ventas.html`, `historial.html`: **0 coincidencias**.
- `sessionStorage`: solo en `js/app.js` (`CLAVE_VENTAS = "libreria-ventas"` y sus usos dentro de `obtenerVentas`/`guardarVentas`).
- Las 6 páginas abren por `file://` sin servidor con **0 errores de consola**; regresión Ej1–Ej4 verificada (nav 5 enlaces, catálogo 6 artículos, libros 6 filas, clientes 3 filas).
- `node --check js/app.js` OK.

## Workflow follow-up

- Marcar cada `- [ ]` como `- [x]` **solo** cuando su control de cierre se haya ejecutado
  efectivamente; no marcar tareas por inferencia.
- La verificación manual en navegador (Fase 4) confirma CA5-01..CA5-05 antes del cierre; no hay tests
  automatizados porque el proyecto no tiene runner (TDD estricto no aplica).
- Si un caso de la checklist falla, corregir en `js/app.js`/HTML y repetir la verificación afectada;
  registrar el resultado final.
- Archivado (`openspec archive`) **solo** con aprobación explícita del usuario, dejando constancia en
  el historial.
- **No** hacer commits ni push sin pedido explícito.
- No ampliar el alcance: nada de Ejercicio 6 (`localStorage` real, README, casos manuales), edición o
  eliminación de ventas, puente de catálogo, `fetch` ni librerías.
