# Proposal — ejercicio-3-datos-filtro

## Why

El Ejercicio 3 del TPI (datos dinámicos en JavaScript: modelo de datos con IDs
estables, generación del catálogo y filtro parcial por título) **ya fue
implementado directamente** en `ejercicio3.html` + `js/ejercicio3.js` y
commiteado (`1d3a60e`, «Implementa catalogo y filtro de libros ejercicio 3»)
**sin un change de OpenSpec asociado**: no existe spec archivada para el
Ejercicio 3 (solo hay `estructura-html` y `estilos-css` de los Ejercicios 1 y 2).
Este change es **retrospectivo**: formaliza en SPEC un contrato verificable
(R3-01..R3-10, CA3-01..CA3-06) de la implementación existente, para habilitar el
PLAN, la verificación y el cierre de la Fase 3-4. Sin SPEC no hay base para
verificar ni archivar el Ejercicio 3.

## What Changes

- Se crea la SPEC del Ejercicio 3 (este change): `proposal.md`, `spec.md`
  (documento de lectura) y el delta `specs/datos-catalogo-filtro/spec.md`.
  Sin código de producto en esta fase.
- La SPEC formaliza: modelo de datos en arrays de objetos con `id` estable
  (≥6 libros, ≥2 editoriales, ≥2 géneros, ≥3 autores y ≥3 clientes, todos
  ficticios); resolución de referencias por
  ID; render dinámico del catálogo en `#catalogo-listado`; género opcional
  (`generoId: null` → «Sin género asignado»); filtro por `substring`,
  case-insensitive y con `trim()`; mensaje claro en `#catalogo-mensaje`; evento
  `input` con catálogo completo al abrir; funciones nombradas e inserción
  segura (`textContent`/`createElement`/`replaceChildren`, sin `innerHTML`).
- Se documenta la **decisión de ubicación** (ya confirmada): el catálogo vive en
  la página standalone `ejercicio3.html` + `js/ejercicio3.js`, **no** se integra
  en `index.html`.
- Excluido explícitamente (fuera de este change y de R3): lógica de los
  Ejercicios 4, 5 y 6 (validaciones, alta de libros/clientes/ventas, totales,
  confirmación de venta, detalle de historial, `localStorage`, README de pruebas
  y documentación final); editar/eliminar registros, stock, cobros y
  facturación; librerías, frameworks, preprocesadores, CDNs, servidores, npm,
  bundlers y `fetch`. **NO** se modifican los Ejercicios 1 y 2
  (`index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`,
  `js/app.js`, `css/estilos.css`) ni los IDs estables del DOM.
- No se agregan funcionalidades, dependencias ni refactorizaciones ajenas a
  esta entrega.

## Capabilities

### New Capabilities

- `datos-catalogo-filtro`: generación dinámica del catálogo de libros desde
  JavaScript (modelo de datos con IDs estables, resolución de referencias por
  ID, género opcional), filtro parcial por título (substring, case-insensitive,
  `trim`) y mensajes de estado, en la página standalone del Ejercicio 3
  (requisitos R3-01..R3-10; criterios CA3-01..CA3-06).

### Modified Capabilities

- (ninguna — este change solo introduce una capability nueva; no cambia
  requisitos de `estructura-html` ni de `estilos-css`).

## Impact

- La SPEC/PLAN no tocan código de producto: crean solo documentos dentro de
  `openspec/changes/ejercicio-3-datos-filtro/`. Con autorización explícita, la
  Fase 3 aplicó los ajustes de DEUDA-01 y DEUDA-02: se modificaron
  `ejercicio3.html` y `js/ejercicio3.js` y se creó `css/ejercicio3.css`, sin
  tocar los Ejercicios 1 y 2 ni `css/estilos.css`.
- La implementación ya existía (verificada en `ejercicio3.html` y
  `js/ejercicio3.js`); este change la describe y, tras la aprobación, alinea
  DEUDA-01/DEUDA-02 y confirma DEUDA-04. ISBN/precio (**DEUDA-03**) queda como
  deuda **abierta**.
- Sin dependencias nuevas: HTML5 + CSS existente + JS nativo (ES5/ES6 sin
  transpilar) + apertura `file://`. Prohibidos librerías, frameworks, CDNs,
  npm/bundlers, servidor y `fetch`.

## Contexto verificado

- Fuente de requisitos: `promtTres.md` (secciones 4, 6, 8; R3-01..R3-10 y
  CA3-01..CA3-06). Fuente primaria de la consigna:
  `Docs/Repaso Primer Parcial.pdf`, sección «Ejercicio 3», contrastada con
  `promtTres.md` (DEUDA-04 resuelta).
- **Implementación existente inspeccionada (hecho):** `ejercicio3.html` tenía
  `<head>` con `<link>` a `css/estilos.css` **y un bloque `<style>` propio**;
  ese bloque se movió a `css/ejercicio3.css` (DEUDA-01 resuelta). El `body`
  expone `#buscador-titulo` (`input type=search`),
  `#catalogo-mensaje` (`<p aria-live="polite">`) y `#catalogo-listado`
  (`<section>` vacía), y carga `js/ejercicio3.js` con `defer`.
- **`js/ejercicio3.js` inspeccionado (hecho):** define `editoriales` (2),
  `generos` (2), `autores` (3), `libros` (6, uno con `generoId: null`) y
  `clientes` (3, ahora parte del modelo de datos de R3-01 según la consigna
  aclarada); usa funciones nombradas
  `buscarPorId`, `mostrarLibros`, `filtrarLibros`; render con
  `replaceChildren`, `createElement`, `textContent` (sin `innerHTML`); filtro
  con `.trim().toLowerCase()` + `.includes()`; evento `input`; catálogo
  completo al cargar (llamada final `mostrarLibros(libros)`).
- **R3-09 verificado por git (hecho):** el commit `1d3a60e` agregó SOLO
  `ejercicio3.html` + `js/ejercicio3.js` (2 archivos, 213 inserciones); no tocó
  los Ejercicios 1 ni 2.
- **Decisión de ubicación (confirmada por el usuario):** catálogo en
  `ejercicio3.html` + `js/ejercicio3.js`; NO se integra en `index.html`. Motivo:
  el `#catalogo-listado` de `index.html` (Ej.1) es una `<table>` con filas
  `<tbody>` escritas a mano y `js/app.js` es placeholder; hacerlo dinámico
  obligaría a borrar filas o cablear `js/app.js`, violando R3-09/CA3-06.

## Restricciones técnicas

- La SPEC/PLAN se limitan a `openspec/changes/ejercicio-3-datos-filtro/`. La
  Fase 3 (autorizada) editó solo el código del Ejercicio 3 (`ejercicio3.html`,
  `js/ejercicio3.js`) y creó `css/ejercicio3.css`; **NO** se edita `index.html`,
  `js/app.js` ni `css/estilos.css` (Ej.1/Ej.2).
- JS nativo (ES5/ES6 sin transpilar), sin librerías/frameworks/CDN, sin npm ni
  servidor; apertura por `file://`.
- Inserción segura de texto: `textContent`/`createElement`/`replaceChildren`;
  **prohibido `innerHTML`** con datos de la lista (R3-08).
- No se alteran los IDs estables (`#catalogo-listado`, `#catalogo-mensaje`,
  `#buscador-titulo` y los del Ej.1) ni los Ejercicios 1 y 2 (R3-09).
- Los artefactos de Fase 2 (`design.md`, `tasks.md`) son documentos; la
  verificación manual en navegador (Fase 4) sigue **pendiente** para los casos de
  la checklist §2 aún no reportados (capitalización, espacios exteriores, género
  nulo) y ningún CA se declara cumplido.

## Deudas de cumplimiento

### Resueltas

- **DEUDA-01 — Estilos inline: RESUELTA.** El bloque `<style>` de
  `ejercicio3.html` se movió a `css/ejercicio3.css` (hoja local del Ej.3),
  enlazada con `<link rel="stylesheet">`, sin editar `css/estilos.css` (Ej.2)
  (opción D7, aprobada por la usuaria). `ejercicio3.html` quedó sin `<style>` ni
  `style=`.
- **DEUDA-02 — `console.log` de clientes: RESUELTA.** Se eliminó
  `console.log("Clientes cargados:", clientes.length)` de `js/ejercicio3.js`; el
  array `clientes` (3) se conserva porque es parte del modelo de datos de R3-01.
- **DEUDA-04 — Validación contra el PDF: RESUELTA.** Se extrajo y leyó la
  consigna real de `Docs/Repaso Primer Parcial.pdf` §«Ejercicio 3» (p.3) y
  coincide con `promtTres.md`; no requiere cambios de requisitos.

### Abiertas

- **DEUDA-03 — ISBN y precio: ABIERTA.** El render muestra
  título/editorial/autores/género, pero **no** ISBN ni precio (la tabla de
  `index.html` sí los tiene; R3-01 y la consigna del PDF §«Ejercicio 3» no los
  exigen). Falta confirmar si la cátedra los pide.

## Supuestos y datos pendientes

- Supuesto: los datos ficticios del código (Planeta, Penguin Random House,
  Novela, Fantasía, Saint-Exupéry, Rowling, García Márquez, los 6 títulos y los
  3 clientes) se aceptan como datos de ejemplo válidos del Ejercicio 3.
- Supuesto: el mensaje sin coincidencias
  «No se encontraron libros con ese título.» cumple «mensaje claro» (R3-06).
- `DATO_PENDIENTE: confirmar con la cátedra si exige ISBN/precio en el catálogo
  del Ejercicio 3; la consigna del PDF §«Ejercicio 3» no los menciona (ver
  DEUDA-03).`
