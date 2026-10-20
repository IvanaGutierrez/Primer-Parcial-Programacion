# Proposal — ejercicio-4-altas

## Why

El Ejercicio 4 del TPI (alta de libros y clientes con validación, selectores
poblados desde datos locales y actualización sin recarga) es la siguiente etapa
obligatoria del flujo SPEC → PLAN → IMPLEMENTACIÓN → VERIFICACIÓN del proyecto.
`libros.html` y `clientes.html` ya tienen los formularios y listados maquetados
(HECHO Ejercicio 1), pero sus opciones y filas son estáticas, `js/app.js` es un
placeholder sin comportamiento, y el modelo de datos del Ejercicio 3
(`js/ejercicio3.js`) carece de los campos que la consigna exige para el alta
(`precio` en libros y `email` en clientes). Sin una SPEC previa no hay base
verificable para el PLAN ni para la verificación de los criterios
CA4-01..CA4-05; este change la establece. A diferencia del change retrospectivo
del Ejercicio 3, este change es **prospectivo**: la implementación aún no existe
y se realizará solo tras autorización explícita.

## What Changes

- Se crea la SPEC del Ejercicio 4 (este change): `proposal.md`, `spec.md`
  (documento de lectura en español) y los deltas `specs/altas-validacion/spec.md`
  y `specs/datos-catalogo-filtro/spec.md`. **Sin código de producto en esta
  fase** (Fase 1 — SPEC según la metodología acordada).
- La SPEC formaliza: modelo de datos extendido (libros con `precio`, clientes
  con `email`, conservando los IDs estables del Ejercicio 3); fuente única de
   datos compartida (nuevo `js/datos.js`, **D1 — CONFIRMADO 2026-10-19**);
   población de selectores de editorial, género (con opción
  obligatoria «Sin clasificar») y autores múltiples desde datos locales;
  reglas de validación del alta de libro (título/ISBN no vacíos, ISBN único
  normalizado sin espacios ni guiones, precio numérico > 0, relaciones
  existentes, ≥1 autor, género opcional validado) y del alta de cliente
  (nombre/email no vacíos, formato de email válido, email único normalizado
  case-insensitive con `trim()`); control del envío con `preventDefault()`;
  errores cerca del formulario como texto explícito; alta solo si todas las
  comprobaciones pasan; actualización del listado y de las opciones
  relacionadas sin recargar la página; inserción segura (`textContent`/
  `createElement`, prohibido `innerHTML` con datos de usuario) y funciones
  nombradas con responsabilidades reconocibles (R4-01..R4-12, CA4-01..CA4-05).
- Se documenta la **decisión D1 (CONFIRMADA el 2026-10-19)** sobre la
  extracción de los arrays de `js/ejercicio3.js` a `js/datos.js` (con los
  campos nuevos `isbn`/`precio`/`email`, D2 y D3 también confirmados) y el
  impacto asociado en `ejercicio3.html`, que pasa a enlazar también
  `js/datos.js` y a conservar solo la lógica de render/filtro. Sin duplicación
  de arrays entre archivos.
- Excluido explícitamente (fuera de este change y de R4): lógica de los
  Ejercicios 5 (venta simulada, renglones, subtotales/totales, confirmación de
  venta) y 6 (`localStorage`, casos manuales, README final); edición y
  eliminación de registros; stock, cobros y facturación; `fetch` de datos y
  ABM de editoriales, géneros o autores; librerías, frameworks,
  preprocesadores, CDNs, servidores, npm, bundlers y base de datos; la
  estructura semántica y `css/estilos.css` de los Ejercicios 1 y 2 y los IDs
  estables del DOM.
- No se agregan funcionalidades, dependencias ni refactorizaciones ajenas a
  esta entrega. **NO** se generan `tasks.md` ni `design.md` en esta fase:
  pertenecen a la Fase 2 — PLAN.

## Capabilities

### New Capabilities

- `altas-validacion`: alta de libros y clientes con validación completa,
  selectores de editorial/género/autores poblados desde datos locales,
  control del envío con `preventDefault()`, errores cerca del formulario,
  actualización dinámica de listados y opciones relacionadas sin recarga,
  inserción segura en el DOM y organización en funciones nombradas
  (requisitos R4-02..R4-12; criterios CA4-01..CA4-05).

### Modified Capabilities

- `datos-catalogo-filtro`: se MODIFICAN dos requisitos de la spec existente.
  (1) «Datos con IDs estables»: el modelo se extiende con `precio` en cada
  libro y `email` en cada cliente (conservando los IDs estables), y el modelo
  pasa a vivir en una única fuente compartida (`js/datos.js`, D1 confirmado
  el 2026-10-19) sin duplicación entre archivos. (2) «Integridad de los Ejercicios
  1 y 2 e IDs estables»: se aclara que el Ejercicio 4 MAY reemplazar el
  contenido estático de ejemplo (opciones de selectores y filas de `tbody`)
  de `libros.html` y `clientes.html` por render dinámico y agregar referencias
  a scripts locales, sin alterar la estructura semántica ni los IDs estables,
  y sin tocar `index.html`, `ventas.html`, `historial.html` ni
  `css/estilos.css`.

## Impact

- **Archivos de producto afectados en fases posteriores (no en esta fase):**
  - `js/datos.js` (nuevo — D1 confirmado 2026-10-19): arrays compartidos con
    los campos extendidos (`isbn`/`precio` en libros y `email` en clientes,
    D2/D3 confirmados).
  - `js/ejercicio3.js`: pierde los arrays (extraídos a `js/datos.js`) y
    conserva solo render/filtro (impacto de D1, confirmado).
  - `ejercicio3.html`: enlaza también `js/datos.js` antes que
    `js/ejercicio3.js` (impacto de D1, confirmado).
  - `libros.html` y `clientes.html`: se reemplazan las opciones estáticas de
    los selectores y las filas de ejemplo del `tbody` por render dinámico, y
    se agregan referencias a los scripts locales; los IDs estables
    (`#form-libro`, `#libro-titulo`, `#libro-isbn`, `#libro-precio`,
    `#libro-editorial`, `#libro-genero`, `#libro-autores`, `#libros-listado`,
    `#libros-vacio`, `#form-cliente`, `#cliente-nombre`, `#cliente-email`,
    `#clientes-listado`, `#clientes-vacio`, `#msg-ok`, `#msg-error`) no se
    alteran.
  - Lógica de altas: vive en `js/app.js` (**D4 confirmado 2026-10-19**; ya
    enlazado por ambas páginas como placeholder reservado con IDs), con su
    organización detallada en `design.md` (Fase 2).
- **Archivos NO afectados:** `index.html`, `ventas.html`, `historial.html`,
  `css/estilos.css` (Ejercicios 1 y 2 intactos).
- Sin dependencias nuevas: HTML5 + CSS existente + JS nativo (ES5/ES6 sin
  transpilar) + apertura `file://`. Prohibidos librerías, frameworks, CDNs,
  npm/bundlers, servidores y `fetch`.

## Contexto verificado

Inspección de la rama `feature/ejercicio-4` (sin commits pendientes de este
cambio; `prompCuatro.md` figura como archivo no trackeado, es la consigna de
referencia):

- **Fuente de requisitos:** `prompCuatro.md` (§3 estado previo, §4 alcance,
  §6 R4-01..R4-12 con casos límite, §8 CA4-01..CA4-05, §7 fases con checkpoint
  Continuar/Ajustar/Parar). La fuente primaria declarada allí es
  `Docs/Repaso Primer Parcial.pdf` §«Ejercicio 4 — Alta de libros y clientes»
  (p.4); **este modelo no pudo leer el PDF** (formato no soportado por la
  herramienta de lectura), por lo que la SPEC se apoya en `prompCuatro.md`,
  que declara haber contrastado esa página.
- **`js/ejercicio3.js` inspeccionado (hecho):** arrays con IDs estables —
  `editoriales`: `ed1` «Editorial Planeta», `ed2` «Penguin Random House»;
  `generos`: `g1` «Novela», `g2` «Fantasía»; `autores`: `a1` «Antoine de
  Saint-Exupéry», `a2` «J. K. Rowling», `a3` «Gabriel García Márquez»;
  `clientes`: `c1` «Lucía Pérez», `c2` «Mateo Gómez», `c3` «Sofía López»
  (**sin `email`**); `libros`: `l1` «El principito» (`ed1`, `["a1"]`, `g1`),
  `l2` «Harry Potter y la piedra filosofal» (`ed2`, `["a2"]`, `g2`), `l3`
  «Cien años de soledad» (`ed1`, `["a3"]`, `g1`), `l4` «Harry Potter y la
  cámara secreta» (`ed2`, `["a2"]`, `g2`), `l5` «El amor en los tiempos del
  cólera» (`ed1`, `["a3"]`, `g1`), `l6` «Vuelo nocturno» (`ed2`, `["a1"]`,
  **`generoId: null`**) (**sin `precio`** y **sin `isbn`** — el campo ISBN no
  existe hoy en el modelo; ver D2). Lógica existente: `buscarPorId`,
  `mostrarLibros` (render con `replaceChildren`/`createElement`/`textContent`),
  `filtrarLibros` (evento `input`).
- **`js/app.js` inspeccionado (hecho):** placeholder con `"use strict";` y
  comentarios que reservan IDs (incluye `#form-libro`, `#libros-listado`,
  `#form-cliente`, `#clientes-listado`, `#msg-ok`, `#msg-error` y los de
  ventas/historial), sin comportamiento — coincide con lo declarado en
  `prompCuatro.md` §3.
- **`libros.html` inspeccionado (hecho):** existen todos los IDs estables
  declarados: `#form-libro`, `#libro-titulo`, `#libro-isbn`, `#libro-precio`,
  `#libro-editorial`, `#libro-genero`, `#libro-autores` (`select multiple`),
  `#msg-ok`, `#msg-error`, `#libros-listado` (con columnas Título, ISBN,
  Editorial, Género, Autores, Precio), `#libros-vacio`. Las opciones de
  editorial/género/autores y las 2 filas del `tbody` son **estáticas de
  ejemplo** (valores `sur`/`norte`/`este`, `novela`/`cuento`/`sin-clasificar`,
  ISBNs `978-0000000011` y `978-0000000022`), a reemplazar por render
  dinámico.
- **`clientes.html` inspeccionado (hecho):** existen todos los IDs estables
  declarados: `#form-cliente`, `#cliente-nombre`, `#cliente-email`, `#msg-ok`,
  `#msg-error`, `#clientes-listado`, `#clientes-vacio`. Las 2 filas del
  `tbody` son estáticas de ejemplo («Ana Pérez (ejemplo)» /
  ana.perez.ejemplo@correo.ficticio y «Luis Gómez (ejemplo)» /
  luis.gomez.ejemplo@correo.ficticio), a reemplazar por render dinámico.
- **`ejercicio3.html` inspeccionado (hecho):** página standalone que enlaza
  `css/estilos.css`, `css/ejercicio3.css` y `js/ejercicio3.js` (con `defer`);
  expone `#buscador-titulo`, `#catalogo-mensaje` y `#catalogo-listado`
  (sección vacía). Es la consumidora actual de los arrays: extraerlos a un
  archivo compartido la impacta (ver D1).
- **Spec principal existente leída (hecho):**
  `openspec/specs/datos-catalogo-filtro/spec.md` (propósito + 9 requisitos de
  R3). Dos requisitos quedan en tensión con el alcance del Ejercicio 4 y se
  proponen MODIFICADOS en el delta: «Datos con IDs estables» (el modelo no
  tiene hoy `precio`/`email`) e «Integridad de los Ejercicios 1 y 2 e IDs
  estables» (prohíbe modificar `libros.html`/`clientes.html`, pero el
  Ejercicio 4 debe reemplazar su contenido estático de ejemplo — se aclara el
  alcance de la prohibición, sin tocar estructura semántica ni IDs).
- **Discrepancia menor detectada en la consigna:** el caso límite de email
  duplicado de `prompCuatro.md` §6 usa como ejemplo
  `  ana.perez.ejemplo@correo.ficticio `, que pertenece a la **fila estática**
  de `clientes.html` («Ana Pérez»), no al array `clientes` (Lucía Pérez,
  Mateo Gómez, Sofía López). Tras el render dinámico ese email dejará de
  existir salvo que se asigne a un cliente del array; la regla (único
  normalizado) es lo verificable, y el ejemplo se hará con los emails
  resultantes del modelo extendido.

## Restricciones técnicas

- Esta fase (SPEC) se limita a `openspec/changes/ejercicio-4-altas/`: solo se
  crean documentos. **NO** se escribe ni modifica código de producto hasta
  aprobación explícita en el checkpoint.
- JS nativo (ES5/ES6 sin transpilar), sin librerías/frameworks/CDN, sin npm ni
  servidor; apertura por `file://` (R4-12/CA4-05).
- Inserción segura de texto: `textContent`/`createElement`; **prohibido
  `innerHTML`** con datos de usuario (R4-10/CA4-04).
- No se alteran los IDs estables listados en §3 de `prompCuatro.md` ni la
  estructura semántica y `css/estilos.css` de los Ejercicios 1 y 2
  (R4-12/CA4-05); los cambios de contenido en `libros.html`/`clientes.html`
  se limitan al reemplazo del material estático de ejemplo.
- No se duplican los arrays de datos entre archivos (R4-01): la fuente única
  compartida es `js/datos.js` (D1, **confirmado el 2026-10-19** en el
  checkpoint de SPEC).
- El checkpoint de SPEC se cerró con «Continuar a PLAN» el 2026-10-19 (D1–D4
  confirmadas); los artefactos de Fase 2 (`design.md`, `tasks.md`) se generan
  en esa fase. La verificación manual en navegador (Fase 4) sigue pendiente y
  ningún CA se declara cumplido aún.

## Supuestos, información pendiente y decisiones

### Decisiones del checkpoint — todas resueltas el 2026-10-19 (D1–D4 CONFIRMADAS)

Historial: originalmente D1–D4 figuraban como pendientes de confirmación en
el checkpoint de SPEC. Se conserva abajo el texto de cada propuesta y se
añade la **Resolución** adoptada (fecha: 2026-10-19), sin borrar el
historial de la decisión.

- **D1 — Fuente única de datos (`js/datos.js`) e impacto en `ejercicio3.html`:
  CONFIRMADO (fecha: 2026-10-19)** (antes: PENDIENTE DE CONFIRMACIÓN).
  Propuesta original (historial): extraer los arrays de
  `js/ejercicio3.js` a un nuevo `js/datos.js` que los carga `libros.html` y
  `clientes.html` (además de `ejercicio3.html`); `js/ejercicio3.js` conserva
  solo render/filtro y `ejercicio3.html` enlaza ambos scripts. Ventaja: una
  sola fuente compartida (R4-01), sin duplicación. Alternativa: mantener los
  arrays en `js/ejercicio3.js` y enlazarlo desde las otras páginas (arrastra
  la lógica de catálogo/filtro y sus selects de DOM, inadecuada para
  `libros.html`/`clientes.html`).
  **Resolución (2026-10-19):** confirmada tal como se propuso; la alternativa
  queda descartada. La SPEC, el delta `datos-catalogo-filtro` y el
  `design.md` reflejan la decisión cerrada.
- **D2 — `isbn` en los 6 libros iniciales: CONFIRMADO (fecha: 2026-10-19)**
  (antes: PENDIENTE DE CONFIRMACIÓN; recomendado: sí). Propuesta original
  (historial): el modelo actual de `js/ejercicio3.js` no tiene campo `isbn`
  (verificado), pero la tabla `#libros-listado` tiene columna ISBN y el
  caso límite de la consigna («`978-0000000011` vs `978000000011` → rechazado
  como duplicado») presupone ISBNs en el conjunto local. Se recomienda agregar
  `isbn` a los 6 libros iniciales (p. ej. `978-0000000011`..`978-0000000066`)
  además del `precio` que la consigna exige. `prompCuatro.md` §4 solo exige
  `precio`/`email`; por eso no se normatizaba sin confirmación.
  **Resolución (2026-10-19):** confirmado — se agrega `isbn` a los 6 libros
  iniciales (`978-0000000011`, `978-0000000022`, `978-0000000033`,
  `978-0000000044`, `978-0000000055`, `978-0000000066` para `l1..l6`,
  conservando los IDs estables) además de `precio`.
- **D3 — Valores ficticios de los campos nuevos (menor): CONFIRMADO (fecha:
  2026-10-19).** Propuesta original (historial): el modelo extendido necesita
  valores de ejemplo: `precio` para los 6 libros iniciales y `email` para los
  3 clientes iniciales (p. ej. `lucia.perez@correo.ficticio`,
  `mateo.gomez@correo.ficticio`, `sofia.lopez@correo.ficticio`). Son datos
  ficticios propuestos, ajustables en PLAN sin impacto en requisitos.
  **Resolución (2026-10-19):** aceptados valores ficticios; se fijan en PLAN
  los precios `8999.99`, `12500.50`, `15999.00`, `11750.75`, `13200.25` y
  `9450.00` para `l1..l6` y los emails `lucia.perez@correo.ficticio`,
  `mateo.gomez@correo.ficticio`, `sofia.lopez@correo.ficticio` para
  `c1..c3`, todos marcados en el código como ejemplos ficticios.
- **D4 — Ubicación de la lógica de altas (menor): CONFIRMADO (fecha:
  2026-10-19).** Propuesta original (historial): `js/app.js` ya es el
  placeholder enlazado por `libros.html` y `clientes.html` con IDs
  reservados; la lógica puede vivir allí o en un script local adicional. No
  afecta requisitos observables; se decidía en `design.md` (Fase 2).
  **Resolución (2026-10-19):** la lógica de altas vive en `js/app.js`; la
  organización interna (funciones nombradas, guardas por página, eventos) se
  detalla en `design.md`.

### Supuestos

- SUPUESTO: los datos ficticios actuales del Ejercicio 3 (editoriales,
  géneros, autores, clientes y los 6 títulos) se aceptan como datos de
  ejemplo válidos, y los IDs (`ed*`, `g*`, `a*`, `c1..c3`, `l1..l6`) se
  conservan sin cambios al moverlos al archivo compartido.
- SUPUESTO: «errores cerca del formulario» (R4-08) se cumple con texto
  explícito visible junto al `<form>` (usando `#msg-error` o un contenedor de
  errores próximo), sin depender solo del color; el éxito se comunica en
  `#msg-ok`.
- SUPUESTO: «opciones relacionadas» (R4-09) significa toda página o selector
  que consuma el array actualizado; en las páginas del Ejercicio 4 el
  observable concreto es el listado correspondiente, y el mecanismo de
  refresco debe ser genérico para que el Ejercicio 5 reutilice selectores de
  `#venta-cliente`/`#venta-libro` (estos selectores NO se implementan ahora).
- SUPUESTO: la normalización de ISBN «sin espacios ni guiones» se aplica
  quitando todos los espacios y guiones (`-` y `–`) y comparando
  case-insensitive; no se valida dígito de control (R4-04).
- SUPUESTO: el formato de email válido se comprueba con una expresión o
  condición razonable (algo@algo.algo) en JS; la validación nativa
  `type="email"` del navegador no es la única comprobación (R4-06).

### Información pendiente

- `DATO_PENDIENTE: la lectura de Docs/Repaso Primer Parcial.pdf (página 4)
  no pudo realizarse con la herramienta disponible en esta sesión; la SPEC se
  basa en prompCuatro.md, que declara haberla contrastado.` Si el usuario
  desea, puede pegar el texto del PDF para verificación cruzada antes de la
  implementación.

## Estado de los artefactos

- Fase 1 — SPEC: completada y validada (`openspec validate --strict`); el
  checkpoint de SPEC se cerró el 2026-10-19 con la confirmación de D1–D4.
- Fase 2 — PLAN: ejecutada el 2026-10-19; `design.md` y `tasks.md` generados.
- Fase 3 — IMPLEMENTACIÓN: **no iniciada**; requiere autorización explícita
  en el checkpoint «PLAN listo».
- Fase 4 — VERIFICACIÓN: pendiente; será manual en navegador por `file://`
  (el proyecto no tiene test runner ni npm). Ningún CA se declara cumplido
  todavía.
