# Design — ejercicio-4-altas · Fase 2 PLAN (sin código de producto)

Documento de diseño del change `ejercicio-4-altas` (Ejercicio 4 del TPI).
Explica **cómo** se implementará el alta de libros y clientes para cumplir la
SPEC (`spec.md` + deltas) y **por qué** se eligen esas decisiones. El plan
ejecutable vive en `tasks.md`. Motivación y alcance: `proposal.md`. Esta fase
solo produce documentos; **no** se escribe código de producto hasta la
autorización explícita del checkpoint «PLAN listo».

Convención de marcadores (igual que el resto de los artefactos): `HECHO
(código)`, `HECHO (consigna)`, `CONFIRMADO (2026-10-19)`, `SUPUESTO`, `PLAN`
(propuesta de este documento) y `DATO_PENDIENTE:`.

## Context

- **Estado verificado del código** (ver §Contexto verificado del `proposal.md`):
  `js/ejercicio3.js` declara los arrays `editoriales` (2), `generos` (2),
  `autores` (3), `clientes` (3, sin `email`) y `libros` (6, sin `precio` ni
  `isbn`; `l6` con `generoId: null`), y contiene `buscarPorId`, `mostrarLibros`,
  `filtrarLibros` con render seguro (`replaceChildren`/`createElement`/
  `textContent`). `js/app.js` es un placeholder (`"use strict";` + comentarios
  con IDs reservados). `libros.html` y `clientes.html` tienen formularios y
  tablas maquetadas con opciones y filas estáticas de ejemplo; ambas enlazan
  solo `js/app.js` (`defer`). `ejercicio3.html` enlaza solo
  `js/ejercicio3.js` (`defer`).
- **Restricciones duras (HECHO consigna):** HTML5 + CSS existente + JS nativo
  (ES5/ES6 sin transpilar); apertura `file://`; cero librerías, frameworks,
  CDNs, npm, bundlers, servidores y `fetch`; no tocar `index.html`,
  `ventas.html`, `historial.html` ni `css/estilos.css`; no alterar IDs
  estables ni estructura semántica; inserción segura (`textContent`/
  `createElement`/`replaceChildren`), prohibido `innerHTML` con datos de
  usuario (R4-10/R4-12).
- **Restricción de arquitectura detectada (HECHO código):** `js/app.js` está
  enlazado por **las cinco páginas** de los Ejercicios 1-2 (`index.html`,
  `libros.html`, `clientes.html`, `ventas.html`, `historial.html`). Por lo
  tanto, el código nuevo debe inicializarse **condicionado a la presencia de
  los formularios/listados de este change**, sin asumir que los arrays
  existen en todas las páginas.
- **Sin test runner (HECHO proyecto):** no hay npm ni framework de pruebas.
  La verificación es manual en navegador por `file://`; **no** se inventan
  frameworks ni pruebas automatizadas. TDD estricto no aplica aquí.
- **Decisiones cerradas en el checkpoint de SPEC (CONFIRMADO 2026-10-19):**
  D1 `js/datos.js` como fuente única; D2 `isbn` en los 6 libros iniciales;
  D3 valores ficticios aceptados; D4 lógica de altas en `js/app.js`.

## Goals / Non-Goals

**Goals**

- Definir la arquitectura de datos compartida (`js/datos.js`) y el contrato de
  carga de scripts por página, sin duplicar arrays (R4-01).
- Definir la organización de `js/app.js` en funciones nombradas con
  responsabilidades reconocibles y eventos `submit` con `preventDefault`
  (R4-08/R4-11).
- Fijar las reglas de validación/normalización de ISBN, precio y email, y su
  correspondencia con los casos límite de la SPEC.
- Diseñar un mecanismo de refresco **genérico y reutilizable** por el
  Ejercicio 5, sin implementar nada de ventas (R4-09).
- Garantizar que las páginas que comparten `js/app.js` (Ejercicios 1-2) sigan
  funcionando sin errores (R4-12).

**Non-Goals**

- Lógica del Ejercicio 5 (venta simulada, renglones, subtotal/total,
  confirmación, `#venta-*`) y del Ejercicio 6 (`localStorage`, README final).
- Edición/eliminación de registros, stock, facturación, `fetch`, ABM de
  editoriales/géneros/autores.
- Cambios en `css/estilos.css`, `index.html`, `ventas.html`, `historial.html`
  ni en los IDs estables.
- Tests automatizados o dependencias de desarrollo (no hay runner en el
  proyecto).

## Decisions

### DD-01 — Fuente única: `js/datos.js` con arrays extendidos y `buscarPorId`

**Decisión (PLAN):** crear `js/datos.js` con los arrays compartidos
`editoriales`, `generos`, `autores`, `libros` y `clientes` (movidos desde
`js/ejercicio3.js`), extendidos según la SPEC: cada libro con `isbn` y
`precio`, cada cliente con `email`, conservando los IDs estables. El archivo
también expone la función pura `buscarPorId(lista, id)` (`Array.prototype.find`),
reutilizada por `js/ejercicio3.js` y `js/app.js`.

Datos iniciales (ejemplos ficticios, D2/D3 confirmados):

- Libros `l1..l6` con ISBN `978-0000000011`, `978-0000000022`,
  `978-0000000033`, `978-0000000044`, `978-0000000055`, `978-0000000066` y
  precios `8999.99`, `12500.50`, `15999.00`, `11750.75`, `13200.25`,
  `9450.00`; `l6` conserva `generoId: null`.
- Clientes `c1..c3` con emails `lucia.perez@correo.ficticio`,
  `mateo.gomez@correo.ficticio`, `sofia.lopez@correo.ficticio`.

**Motivo (R4-01/CA4-01; CONFIRMADO D1/D2/D3):** una sola fuente evita
duplicación y permite que `libros.html`, `clientes.html` y `ejercicio3.html`
consuman exactamente el mismo modelo. Alojar `buscarPorId` en la fuente
compartida evita duplicar la resolución por ID en dos archivos y deja a
`js/ejercicio3.js` con la única responsabilidad de render/filtro del catálogo,
tal como se confirmó en D1.

**Alternativas consideradas:** (a) mantener los arrays en `js/ejercicio3.js` y
enlazarlo desde las otras páginas — **descartada** (arrastra lógica de catálogo
y selects de DOM inadecuada para las páginas de altas; D1 confirmó la
extracción); (b) duplicar `buscarPorId` en cada consumidor — **descartada**
(duplicación evitable y riesgo de divergencia).

**Nota de carga (HECHO técnica):** los `const` de nivel superior de un script
clásico viven en el entorno léxico global y son accesibles por nombre desde
scripts posteriores; **no** se acceden como `window.libros`. El orden de
carga es, por tanto, parte del contrato (DD-02).

### DD-02 — Orden de carga con `defer`: datos primero

**Decisión (PLAN):**

- `libros.html` y `clientes.html`: `<script src="js/datos.js" defer>` **antes**
  de `<script src="js/app.js" defer>`.
- `ejercicio3.html`: `<script src="js/datos.js" defer>` **antes** de
  `<script src="js/ejercicio3.js" defer>`.
- `index.html`, `ventas.html` y `historial.html` **no** cargan `js/datos.js`
  (no lo necesitan y no se modifican).

**Motivo (R4-01/R4-12):** con `defer`, los scripts se ejecutan en orden de
documento y antes de `DOMContentLoaded`; garantiza que los arrays existan
cuando `app.js`/`ejercicio3.js` los consuman, sin `fetch` ni esperas.

**Alternativa considerada:** cargar `datos.js` sin `defer` antes del cierre de
`<body>` — **descartada** por inconsistencia con el patrón existente
(`defer` en todas las páginas).

### DD-03 — `js/app.js` con guardas por página (archivo compartido)

**Decisión (PLAN):** toda la lógica del Ejercicio 4 se escribe en
`js/app.js`, pero la inicialización usa guardas que detectan la página antes
de tocar datos:

```js
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("form-libro") && typeof libros !== "undefined") {
        inicializarLibros();
    }
    if (document.getElementById("form-cliente") && typeof clientes !== "undefined") {
        inicializarClientes();
    }
});
```

`inicializarLibros()` puebla los selectores, renderiza el listado, limpia los
mensajes de ejemplo y registra los eventos; `inicializarClientes()` hace lo
análogo. Ninguna función que lea `libros`/`clientes` se ejecuta fuera de estas
ramas.

**Motivo (R4-12/CA4-05):** `js/app.js` se carga en las cinco páginas de los
Ejercicios 1-2; sin guardas, una referencia a un array inexistente lanzaría
`ReferenceError` (modo estricto) en `index.html`, `ventas.html` o
`historial.html`. La comprobación de elemento **y** de `typeof` es defensiva:
la página de altas siempre cumple ambas, y cualquier página sin `datos.js`
queda fuera.

**Alternativa considerada:** crear un script separado solo para las páginas de
altas — **descartada** por D4 confirmado (la lógica vive en `app.js`) y por
evitar un archivo adicional.

### DD-04 — Organización de `js/app.js` en funciones nombradas

**Decisión (PLAN):** funciones con responsabilidades reconocibles (R4-11):

| Función | Responsabilidad |
| --- | --- |
| `inicializarLibros()` | Orquesta la página de libros: selectores, listado, mensajes y eventos. |
| `inicializarClientes()` | Orquesta la página de clientes: listado, mensajes y eventos. |
| `poblarSelectorEditorial()` | Genera las opciones de `#libro-editorial` desde `editoriales` (value = `id`). |
| `poblarSelectorGenero()` | Genera las opciones de `#libro-genero` desde `generos` + «Sin clasificar» con `value=""`. |
| `poblarSelectorAutores()` | Genera las opciones de `#libro-autores` (`select multiple`) desde `autores`. |
| `renderizarListadoLibros()` | Reemplaza las filas de `#libros-listado` con el render dinámico del array. |
| `renderizarListadoClientes()` | Reemplaza las filas de `#clientes-listado` con el render dinámico del array. |
| `validarLibro(datos)` | Devuelve `{ valido, errores }` tras todas las comprobaciones de R4-04/R4-05. |
| `validarCliente(datos)` | Devuelve `{ valido, errores }` tras las comprobaciones de R4-06/R4-07. |
| `normalizarIsbn(texto)` | Quita espacios y guiones y pasa a minúsculas para comparar. |
| `normalizarEmail(texto)` | Aplica `trim()` + minúsculas para comparar. |
| `agregarLibro(datos)` | Genera `id` único y hace `push` del libro validado en `libros`. |
| `agregarCliente(datos)` | Genera `id` único y hace `push` del cliente validado en `clientes`. |
| `manejarEnvioLibro(evento)` | `preventDefault()`, lee el formulario, valida, agrega o muestra errores, refresca y hace `reset`. |
| `manejarEnvioCliente(evento)` | Ídem para el formulario de clientes. |
| `mostrarMensajeOk(texto)` | Escribe el texto en `#msg-ok` y lo hace visible; oculta `#msg-error`. |
| `mostrarMensajeError(texto)` | Escribe el texto en `#msg-error` y lo hace visible; oculta `#msg-ok`. |
| `limpiarMensajes()` | Vacía y oculta ambos mensajes (también al cargar la página). |
| `refrescarListados()` | Refresca el listado de la página y las opciones relacionadas registradas (genérico). |
| `actualizarSelector(elemento, items, etiqueta)` | Reconstruye un `<select>` desde datos; reutilizable por el Ejercicio 5. |
| `refrescarOpcionesRelacionadas()` | Hook genérico: hoy sin selectores dependientes en estas páginas. |
| `generarId(prefijo, lista)` | Devuelve un `id` único (`l7`, `c4`, …) sin colisionar. |

Eventos (PLAN): `DOMContentLoaded` para inicializar (ver DD-03) y `submit` en
`#form-libro`/`#form-cliente` con `event.preventDefault()` como primera
sentencia de los manejadores.

**Motivo (R4-11/CA4-04):** la consigna exige funciones reconocibles (validar,
agregar, refrescar) activadas por eventos; separar orquestación, render,
validación y persistencia en memoria facilita la verificación y la reutilización
del Ejercicio 5 sin reescribir.

**Alternativa considerada:** un único manejador monolítico — **descartada**
(incumple R4-11 y dificulta el cierre verificable por tarea).

### DD-05 — Validación y normalización como funciones puras que acumulan errores

**Decisión (PLAN):**

- `validarLibro(datos)` devuelve `{ valido: false, errores: [...] }` con
  **todas** las comprobaciones fallidas nombradas en español, o
  `{ valido: true, errores: [] }`. Comprobaciones (R4-04/R4-05):
  1. Título: `trim()` no vacío.
  2. ISBN: `trim()` no vacío; su forma `normalizarIsbn` no coincide con la de
     ningún libro ya registrado (inicial o dado de alta).
  3. Precio: valor no vacío, convertido con `Number(...)`, finito y `> 0`
     (`Number.isNaN` descarta entradas no numéricas/limpiadas por el navegador).
  4. Editorial: el `value` seleccionado existe en `editoriales`
     (`buscarPorId`).
  5. Autores: al menos uno seleccionado y cada `id` existe en `autores`.
  6. Género: `""` («Sin clasificar») ⇒ `generoId: null`; un valor no vacío
     debe existir en `generos`.
- `normalizarIsbn(texto)` = `String(texto).replace(/[\s\u2013-]/g, "").toLowerCase()`
  (quita espacios, guion ASCII y guion tipográfico; no valida dígito de
  control).
- `validarCliente(datos)` (R4-06/R4-07): nombre con `trim()` no vacío; email
  con `trim()` no vacío y formato válido mediante
  `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (JS, no solo `type="email"`); email
  `normalizarEmail` inexistente entre los clientes ya registrados.
- `normalizarEmail(texto)` = `String(texto).trim().toLowerCase()`; el valor
  almacenado y mostrado es el ingresado con `trim()`, no la clave de
  comparación.
- Mensajes: se muestran **todos** los errores encontrados, unidos en una sola
  línea de texto en `#msg-error` (p. ej. «Revisá: el ISBN ya existe; el precio
  debe ser mayor que cero.»), sin depender del color.

**Motivo (R4-04..R4-08):** la consigna pide rechazo explícito por cada regla y
que la autoridad sea JS, no los atributos nativos. Acumular errores permite
informar todo lo fallido en un único envío sin mutar el estado.

**Alternativas consideradas:** (a) detenerse en el primer error — **descartada**
(menos clara para el usuario, más reintentos); (b) validar solo con atributos
HTML (`required`, `type`, `min`) — **descartada** porque no cubre duplicados,
normalización ni el caso `precio = 0` y no cumple R4-04..R4-07.

### DD-06 — Alta, refresco genérico y mensajes

**Decisión (PLAN):** flujo único para ambos formularios:

1. `event.preventDefault()`.
2. Leer valores del formulario (`trim()` donde corresponde).
3. `validarLibro`/`validarCliente`.
4. Si hay errores: `mostrarMensajeError(...)` y **no** se muta ningún array ni
   el DOM del listado.
5. Si todo pasa: `agregarLibro`/`agregarCliente` (`generarId` + `push`).
6. `refrescarListados()` (listado de la página + `refrescarOpcionesRelacionadas()`).
7. `mostrarMensajeOk(...)`.
8. `formulario.reset()` y foco en el primer campo.

`refrescarListados()` es page-agnostic: renderiza `#libros-listado` si existe y
`#clientes-listado` si existe, y llama al hook genérico
`refrescarOpcionesRelacionadas()`. Hoy ese hook no hace nada porque ninguna
página del Ejercicio 4 tiene selectores que consuman libros/clientes; el
Ejercicio 5 podrá registrar `#venta-libro`/`#venta-cliente` reutilizando
`actualizarSelector(...)`, **sin** agregar ahora lógica de ventas.

`generarId(prefijo, lista)` calcula el siguiente sufijo numérico libre
(revisando colisiones), de modo que altas sucesivas produzcan `l7`, `l8`, … y
`c4`, `c5`, … sin depender del largo del array.

Mensajes: `#msg-ok`/`#msg-error` existen después del `<form>` en ambas páginas
(HECHO código), por lo que el texto queda «cerca del formulario». Al
inicializar cada página se limpian y se ocultan con el atributo `hidden` (el
texto de ejemplo «(ejemplo)» no debe verse como estado real); `mostrarMensajeOk`/
`mostrarMensajeError` alternan la visibilidad y vacían el mensaje opuesto.

**Motivo (R4-08/R4-09/CA4-03):** el alta condicional exige que nada cambie si
una comprobación falla, y el refresco debe ser un mecanismo único reutilizable
(no lógica de ventas adelantada).

**Alternativa considerada:** recargar la página tras el alta — **descartada**
(prohibido por R4-09 y perdería el estado del formulario).

### DD-07 — Render dinámico seguro y estado vacío

**Decisión (PLAN):**

- `renderizarListadoLibros()` limpia el `<tbody>` de `#libros-listado` con
  `replaceChildren()` y crea una `<tr>` por libro con `<td>` construidos con
  `createElement` + `textContent`; resuelve editorial, autores y género con
  `buscarPorId`; muestra autores unidos por `", "`; muestra `precio.toFixed(2)`;
  si `generoId` es `null`/falsy muestra «Sin clasificar».
- `renderizarListadoClientes()` ídem con nombre y email.
- `#libros-vacio`/`#clientes-vacio`: se ocultan cuando el listado tiene filas y
  se muestran (con texto sin «(ejemplo)») cuando no las tiene.
- Las opciones de los selectores se construyen con `createElement("option")`,
  `value` y `textContent`, y se reemplazan con `replaceChildren()`.

**Motivo (R4-03/R4-09/R4-10/CA4-01/CA4-04):** el render debe ser dinámico,
seguro (los datos se insertan como texto) y legible para el género ausente.

**Alternativa considerada:** `innerHTML` con plantillas — **descartada** por
R4-10 y por riesgo de inyección con títulos/emails ingresados.

### DD-08 — Cambios mínimos en HTML y validación nativa desactivada en JS

**Decisión (PLAN):**

- `libros.html`: agregar `js/datos.js` antes de `js/app.js`; retirar las
  opciones estáticas de `#libro-editorial`, `#libro-genero`, `#libro-autores`
  y las dos filas estáticas del `<tbody>` de `#libros-listado`; conservar
  tabla, columnas, formulario e IDs.
- `clientes.html`: agregar `js/datos.js` antes de `js/app.js`; retirar las dos
  filas estáticas del `<tbody>` de `#clientes-listado`; conservar formulario e
  IDs.
- `ejercicio3.html`: agregar `js/datos.js` antes de `js/ejercicio3.js`; sin
  otros cambios.
- En los manejadores de envío, desactivar la validación nativa del navegador
  (`formulario.noValidate = true`) para que el `submit` llegue siempre al
  código JS y los errores se comuniquen en `#msg-error` (texto), no en el
  globo nativo. Los atributos `required`/`type`/`min` se conservan como
  documentación y mejora progresiva.

**Motivo (R4-04/R4-06/R4-08, delta `datos-catalogo-filtro`):** el delta permite
reemplazar el contenido estático de ejemplo y agregar scripts locales en esas
dos páginas; la validación nativa bloquearía el evento `submit` antes de que
JS pueda mostrar los mensajes exigidos (p. ej. email `sin-arroba` o campos
vacíos). Desactivarla en JS centraliza la autoridad y evita depender de la
interfaz del navegador.

**Alternativa considerada:** agregar `novalidate` en el HTML — equivalente,
**descartada** por mantener el cambio HTML al mínimo y la decisión en un solo
lugar (`app.js`).

## Data flow

**Carga inicial (libros.html):** `datos.js` → `app.js` (ambos `defer`) →
`DOMContentLoaded` → guarda de página → `poblarSelectorEditorial`/
`poblarSelectorGenero`/`poblarSelectorAutores` → `renderizarListadoLibros` →
`limpiarMensajes` → registro de `submit`.

**Alta de libro:** `submit` → `preventDefault` → leer campos →
`validarLibro` → si falla: `mostrarMensajeError` (sin mutaciones) → si pasa:
`agregarLibro` (`generarId` + `push`) → `refrescarListados` →
`mostrarMensajeOk` → `reset`.

**Alta de cliente:** idéntico con `validarCliente`/`agregarCliente`.

**Correspondencia de casos límite con funciones:**

| Caso límite (SPEC §2) | Función / comportamiento |
| --- | --- |
| ISBN duplicado normalizado (`978-0000000011` vs `978000000011`) | `normalizarIsbn` + comparación en `validarLibro` → error, sin alta. |
| Precio `0`, negativo, vacío o no numérico | `validarLibro` (`Number`, finito, `> 0`) → error, sin alta. |
| Libro sin autores | `validarLibro` (≥1 `id` seleccionado) → error. |
| Autor/editorial/género inexistente | `buscarPorId` en `validarLibro` → error. |
| Género «Sin clasificar» | `poblarSelectorGenero` (`value=""`) → `validarLibro` asigna `generoId: null` → `renderizarListadoLibros` muestra «Sin clasificar». |
| Email inválido (`sin-arroba`) | `validarCliente` (regex JS) → error. |
| Email duplicado con mayúsculas/espacios | `normalizarEmail` + comparación en `validarCliente` → error. |
| Alta válida de libro/cliente | `agregar*` + `refrescarListados` → fila nueva sin recarga. |
| Texto con marcas HTML (`<b>`) | Render con `textContent` → se muestra literal. |

## Risks / Trade-offs

- **[`js/app.js` compartido por cinco páginas] → Mitigación:** guardas
  `DOMContentLoaded` + existencia de formulario + `typeof` de arrays (DD-03);
  tarea de verificación de integridad (T6) confirma que `index.html`,
  `ventas.html` e `historial.html` no lanzan errores.
- **[Validación nativa bloquea el `submit` y omite mensajes JS] → Mitigación:**
  `formulario.noValidate = true` en los manejadores (DD-08); los mensajes se
  muestran siempre en `#msg-error`.
- **[Impacto de D1 en el Ejercicio 3] → Mitigación:** tarea T1 incluye
  verificación de regresión del catálogo/filtro (6 tarjetas, filtros, género
  nulo) tras mover los arrays.
- **[Mensajes de ejemplo visibles como estado real] → Mitigación:**
  `limpiarMensajes()` en la inicialización y ocultamiento con `hidden`.
- **[Sin test runner: cierres no automatizables] → Mitigación:** cada tarea
  define una comprobación observable en navegador; el registro pasa/falla se
  asienta en `tasks.md`; no se marca un checkbox sin control ejecutado.
- **[Riesgo de adelantar Ejercicio 5] → Mitigación:** `refrescarListados` y
  `actualizarSelector` son genéricos y no contienen lógica de ventas; los IDs
  `#venta-*` quedan intactos y sin cablear.
- **[`file://` sin `fetch`] → Mitigación:** los datos viven en un script local
  cargado antes del consumidor; cero recursos externos.
- **[`DATO_PENDIENTE:` PDF de la consigna ilegible en la sesión de SPEC] →
  Aceptado:** los requisitos se tomaron de `prompCuatro.md`, que declara haber
  contrastado la página 4; no bloquea el PLAN.

## Migration Plan

El cambio es **aditivo sobre datos en memoria**; no hay migración de datos ni
de esquema, ni despliegue.

1. **T1** — Crear `js/datos.js` (arrays extendidos + `buscarPorId`), vaciar
   `js/ejercicio3.js` de datos y enlazar `datos.js` en `ejercicio3.html`;
   verificar regresión del catálogo.
2. **T2** — Enlazar `datos.js` y poblar selectores en `libros.html`, retirando
   opciones estáticas.
3. **T3** — Render del listado de libros + validación/alta de libro.
4. **T4** — Render del listado de clientes + validación/alta de cliente.
5. **T5** — Infraestructura compartida de mensajes y refresco genérico, con su
   verificación integrada.
6. **T6** — Verificación manual integral por `file://` (checklist de casos
   límite, pasa/falla) e integridad de Ejercicios 1-2/IDs.

**Rollback:** al no haber migraciones, revertir es `git checkout -- <archivo>`
(o `git revert` del commit de implementación) sobre `js/datos.js`,
`js/ejercicio3.js`, `js/app.js`, `ejercicio3.html`, `libros.html` y
`clientes.html`. `css/estilos.css` y las páginas de los Ejercicios 1-2 que no
se tocan no requieren rollback. Esta fase de PLAN no modifica producto.

## Open Questions

- Ninguna incógnita que cambie la SPEC, el enfoque o el desglose de tareas; las
  decisiones D1–D4 quedaron cerradas en el checkpoint (2026-10-19).
- Persiste como `DATO_PENDIENTE:` no bloqueante la lectura directa del PDF de
  la consigna (ver `proposal.md` §Información pendiente); la SPEC se apoya en
  `prompCuatro.md`.
