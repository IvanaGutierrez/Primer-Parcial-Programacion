# SPEC — Ejercicio 3 · Datos dinámicos, catálogo y filtro

Change: `ejercicio-3-datos-filtro` · Fase 1 SPEC + Fase 2 PLAN + Fase 3/4
IMPLEMENTACIÓN y VERIFICACIÓN (parcial) del Ejercicio 3.

Fuentes: `promtTres.md` (§4 Alcance, §6 R3-01..R3-10, §8 CA3-01..CA3-06) y la
consigna aclarada que incorpora los clientes al modelo de datos; contrato
contrastado con la implementación existente `ejercicio3.html` +
`js/ejercicio3.js` (commit `1d3a60e`, «Implementa catalogo y filtro de libros
ejercicio 3»). Fuente primaria de la consigna: `Docs/Repaso Primer Parcial.pdf`
§«Ejercicio 3», contrastada con `promtTres.md` (ver §7, DEUDA-04 resuelta). Con
autorización explícita de la usuaria se aplicaron los ajustes de DEUDA-01 (el
bloque `<style>` inline se movió a `css/ejercicio3.css`) y DEUDA-02 (se eliminó
el `console.log` de clientes). Ningún criterio de aceptación se declara
cumplido: la verificación manual en navegador sigue **pendiente** para los casos
de §2 aún no reportados (capitalización, espacios exteriores y género nulo); las
observaciones parciales de navegador no cierran la verificación.

Convención: «HECHO (código)» = atribuido al código inspeccionado; «HECHO
(git)» = atribuido al historial; «HECHO (consigna)» = atribuido a
`promtTres.md`; «SUPUESTO» = asunción no bloqueante; «DEUDA» = incumplimiento
identificado en su fase; su estado (resuelta/abierta) se sigue en §7;
`DATO_PENDIENTE:` = información
faltante que no se inventa.

## 1. Requisitos verificables (R3-01..R3-10)

### R3-01 · Datos — inventario con IDs estables (HECHO consigna; HECHO código)

Existen arrays de objetos con `id` estable: **≥6 libros, ≥2 editoriales, ≥2
géneros, ≥3 autores y ≥3 clientes**, todos ficticios; cada libro referencia
`editorialId`, `autorIds[]` y `generoId`; cada cliente tiene `id` y `nombre`.

Escenarios observables:

- Inventario mínimo: hay 6 libros (HECHO código: `l1..l6`), 2 editoriales
  (`ed1`, `ed2`), 2 géneros (`g1`, `g2`), 3 autores (`a1..a3`) y 3 clientes
  (`c1..c3`, HECHO código).
- IDs únicos y legibles: ningún `id` se repite dentro de cada colección; son
  strings cortos y legibles (p. ej. `c1`, `c2`, `c3`).
- Referencias por ID: cada libro declara `editorialId`, `autorIds` (array) y
  `generoId`, sin duplicar los datos de editorial/autor/género. Los clientes
  aportan `id` y `nombre` ficticios sin duplicar datos de otras colecciones.

### R3-02 · Datos/render — género opcional legible (HECHO consigna; HECHO código)

Al menos un libro tiene `generoId` nulo y el catálogo lo muestra de forma
legible.

Escenarios observables:

- Género nulo: el libro `l6` («Vuelo nocturno») tiene `generoId: null` y se
  muestra con el texto «Sin género asignado».
- Sin romper el render: el resto de los datos de ese libro (título, editorial,
  autores) se muestra normalmente.

### R3-03 · Render — catálogo generado desde JavaScript (HECHO consigna)

El catálogo se genera desde JavaScript en `#catalogo-listado`, sin
tarjetas/filas escritas a mano en el HTML.

Escenarios observables:

- `#catalogo-listado` es un `<section>` vacío en `ejercicio3.html` (HECHO
  código) y se rellena con tarjetas `<article class="libro">` generadas por JS.
- Al abrir la página por `file://`, el DOM resultante tiene una tarjeta por
  libro del array.

### R3-04 · Render — resolución de referencias por ID (HECHO consigna)

Las referencias se resuelven por ID (editorial, autores, género) mediante
funciones de búsqueda claras.

Escenarios observables:

- Existe una función nombrada de búsqueda por `id` (HECHO código:
  `buscarPorId(lista, id)` con `Array.prototype.find`).
- El render usa esa función para resolver editorial, cada autor y el género de
  cada libro.

### R3-05 · Filtro — parcial, case-insensitive y con `trim()` (HECHO consigna)

El filtro es parcial (substring), case-insensitive y aplica `trim()` al texto de
búsqueda.

Escenarios observables:

- Substring: buscar una parte del título devuelve los libros cuyo título la
  contiene (HECHO código: `.includes(busqueda)`).
- Case-insensitive: `PRINCIPITO` y `principito` devuelven los mismos resultados
  (HECHO código: `.toLowerCase()`).
- `trim()`: `"  harry  "` devuelve lo mismo que `"harry"` (HECHO código:
  `.trim()`).
- Búsqueda vacía o solo espacios: se muestran **todos** los libros (no se filtra
  por cadena vacía).

### R3-06 · Estados — mensaje claro sin coincidencias (HECHO consigna; HECHO código)

Si no hay coincidencias, se muestra un mensaje claro en `#catalogo-mensaje`
(texto explícito, no solo color).

Escenarios observables:

- Búsqueda `zzz` (sin coincidencias): `#catalogo-mensaje` muestra «No se
  encontraron libros con ese título.» y no se agregan tarjetas.
- `#catalogo-mensaje` es un `<p aria-live="polite">` (HECHO código), por lo que
  el mensaje se comunica además a lectores de pantalla.

### R3-07 · Interacción — evento y estado inicial (HECHO consigna; HECHO código)

El filtrado se dispara por un evento del buscador (`input`/`submit`), y el
catálogo completo se muestra al abrir la página.

Escenarios observables:

- Evento: `#buscador-titulo` escucha `input` y re-ejecuta el filtro (HECHO
  código: `buscador.addEventListener("input", filtrarLibros)`).
- Estado inicial: al cargar, se invoca el render con todos los libros (HECHO
  código: `mostrarLibros(libros)` al final del script).

### R3-08 · Código — funciones reconocibles e inserción segura (HECHO consigna; HECHO código)

El código está en funciones reconocibles (buscar por id, renderizar, filtrar) y
usa `textContent` para insertar datos (sin `innerHTML`).

Escenarios observables:

- Funciones nombradas (HECHO código): `buscarPorId`, `mostrarLibros`,
  `filtrarLibros`.
- Inserción segura (HECHO código): `replaceChildren()`, `createElement()` y
  `textContent`; no hay `innerHTML` con datos de la lista.

### R3-09 · Integridad — no alterar Ejercicios 1 y 2 ni IDs estables (HECHO git)

No se modifican los Ejercicios 1 y 2 ni los IDs estables existentes.

Escenarios observables:

- HECHO git: el commit `1d3a60e` agregó solo `ejercicio3.html` +
  `js/ejercicio3.js` (2 archivos, 213 inserciones) y no tocó archivos de los
  Ejercicios 1 y 2.
- IDs estables conservados en `ejercicio3.html`: `#catalogo-listado`
  (`<section>`), `#catalogo-mensaje` (`<p>`) y `#buscador-titulo` (`<input>`).
  Los IDs de `index.html` no se alteran.

### R3-10 · Compatibilidad — apertura `file://` (HECHO consigna)

La página abre por `file://` sin servidor, npm ni dependencias externas.

Escenarios observables:

- Abrir `ejercicio3.html` por doble clic funciona sin servidor ni conexión.
- No hay recursos externos: `ejercicio3.html` enlaza solo hojas locales
  (`css/estilos.css` y `css/ejercicio3.css`) y `js/ejercicio3.js` (local); sin
  CDN, `npm`, bundler ni `fetch`, y sin `<style>`/`style=` inline (DEUDA-01
  resuelta).

## 2. Casos límite (consigna §6 «Verificación observable»)

| Caso | Resultado exigido |
| --- | --- |
| Búsqueda vacía o solo espacios | Muestra **todos** los libros (R3-05). |
| Distinta capitalización (`PRINCIPITO` vs `principito`) | Mismos resultados (R3-05). |
| Espacios exteriores (`"  harry  "`) | Mismos resultados que `"harry"` (R3-05). |
| Sin coincidencias (`zzz`) | Mensaje claro en `#catalogo-mensaje` (R3-06). |
| Libro con `generoId: null` | «Sin género asignado» sin romper el render (R3-02). |

## 3. Modelo de datos (HECHO código — `js/ejercicio3.js`)

- `editoriales`: `[{ id: "ed1", nombre: "Editorial Planeta" },
  { id: "ed2", nombre: "Penguin Random House" }]`.
- `generos`: `[{ id: "g1", nombre: "Novela" },
  { id: "g2", nombre: "Fantasía" }]`.
- `autores`: `[{ id: "a1", nombre: "Antoine de Saint-Exupéry" },
  { id: "a2", nombre: "J. K. Rowling" },
  { id: "a3", nombre: "Gabriel García Márquez" }]`.
- `clientes`: `[{ id: "c1", nombre: "Lucía Pérez" },
  { id: "c2", nombre: "Mateo Gómez" },
  { id: "c3", nombre: "Sofía López" }]` (HECHO código).
- `libros` (6): `l1` El principito (`ed1`, `["a1"]`, `g1`), `l2` Harry Potter y
  la piedra filosofal (`ed2`, `["a2"]`, `g2`), `l3` Cien años de soledad
  (`ed1`, `["a3"]`, `g1`), `l4` Harry Potter y la cámara secreta (`ed2`,
  `["a2"]`, `g2`), `l5` El amor en los tiempos del cólera (`ed1`, `["a3"]`,
  `g1`), `l6` Vuelo nocturno (`ed2`, `["a1"]`, `null`).
- Nota: el array `clientes` pertenece al modelo de datos de R3-01. El
  `console.log("Clientes cargados", ...)` que estaba al final del archivo fue
  **eliminado** (ver §7, DEUDA-02 resuelta); el array se conserva.

## 4. Estructura del render (HECHO código)

- Por cada libro: `<article class="libro">` con `<h3>` (título) y `<p>` para
  editorial (`Editorial: …`), autores (`Autor(es): …`, nombres unidos por
  `", "`) y género (`Género: …` o `Género: Sin género asignado`).
- Contador de estado en `#catalogo-mensaje`: «Libros encontrados: N»; sin
  coincidencias: «No se encontraron libros con ese título.».
- `#catalogo-listado` se limpia con `replaceChildren()` antes de cada render.
- No se muestran ISBN ni precio en el render actual (ver §7 DEUDA-03).

## 5. Contrato de filtro (HECHO consigna; HECHO código)

- Texto de búsqueda: `buscador.value.trim().toLowerCase()`.
- Coincidencia: `libro.titulo.toLowerCase().includes(busqueda)`.
- Disparador: evento `input` sobre `#buscador-titulo` (no hay `<form>` ni
  `submit`).
- Estado inicial: `mostrarLibros(libros)` con el array completo.

## 6. Criterios de aceptación (CA3-01..CA3-06)

- **CA3-01 (Modelo de datos — datos):** ≥6 libros, ≥2 editoriales, ≥2 géneros,
  ≥3 autores y ≥3 clientes con `id` estable; cada libro referencia editorial,
  autores y género por ID (cubre R3-01).
- **CA3-02 (Género opcional — datos/render):** un libro sin género
  (`generoId: null`) se muestra correctamente con texto legible (cubre R3-02).
- **CA3-03 (Catálogo dinámico — render):** el catálogo se construye desde
  JavaScript en `#catalogo-listado`, sin listado escrito a mano (cubre
  R3-03/R3-04).
- **CA3-04 (Filtro — interacción):** el filtro por título es parcial,
  case-insensitive y con `trim`; sin coincidencias muestra mensaje claro (cubre
  R3-05/R3-06/R3-07).
- **CA3-05 (Calidad de código — código):** código en funciones reconocibles,
  activado por evento, con inserción segura vía `textContent` (sin `innerHTML`)
  (cubre R3-08).
- **CA3-06 (Integridad y compatibilidad):** no se alteran Ejercicios 1 y 2 ni
  IDs estables; la página abre por `file://` sin dependencias (cubre
  R3-09/R3-10).

Ningún criterio se declara cumplido en esta fase SPEC: la verificación es manual
por navegador en la Fase 3-4.

## 7. Deudas de cumplimiento y datos pendientes

### Deudas resueltas

- **DEUDA-01 — Estilos inline: RESUELTA.** El bloque `<style>` de
  `ejercicio3.html` se movió a una hoja local nueva `css/ejercicio3.css`,
  enlazada con `<link rel="stylesheet">`, sin editar `css/estilos.css` (Ej.2)
  (opción D7, aprobada por la usuaria). `ejercicio3.html` quedó sin `<style>` ni
  `style=`, con la presentación preservada.
- **DEUDA-02 — `console.log` de clientes: RESUELTA.** Se eliminó
  `console.log("Clientes cargados:", clientes.length)` de `js/ejercicio3.js`;
  el array `clientes` se conserva porque es parte del modelo de datos de R3-01.
- **DEUDA-04 — Validación contra el PDF: RESUELTA.** Se extrajo y leyó la
  consigna real de `Docs/Repaso Primer Parcial.pdf` §«Ejercicio 3» (p.3) y
  coincide con `promtTres.md`: mínimos 6/2/2/3/3; cada libro con editorial
  existente y ≥1 autor existente; género opcional que debe existir si se asigna;
  catálogo generado por JS; filtro parcial, case-insensitive y con `trim`;
  búsqueda vacía → todo el catálogo; sin coincidencias → mensaje claro; eventos y
  funciones con responsabilidades reconocibles; datos de usuario insertados como
  texto; sin `fetch`; sin ABM de editoriales/géneros/autores. No requiere cambios
  de requisitos.

### Deudas abiertas

- **DEUDA-03 — ISBN y precio ausentes (ABIERTA):** el render actual muestra
  título/editorial/autores/género, pero **no** ISBN ni precio; la tabla de
  `index.html` sí los tiene y R3-01 no los exige; la consigna del PDF §«Ejercicio
  3» tampoco los menciona. Falta confirmar si la cátedra los pide.

### Supuestos y datos pendientes

- SUPUESTO: los datos ficticios del código (editoriales, géneros, autores,
  clientes y los 6 títulos) se aceptan como ejemplos válidos del Ejercicio 3.
- SUPUESTO: el mensaje «No se encontraron libros con ese título.» cumple
  «mensaje claro» (R3-06).
- `DATO_PENDIENTE: confirmar con la cátedra si exige ISBN/precio en el catálogo
  del Ejercicio 3; la consigna del PDF §«Ejercicio 3» no los menciona (ver
  DEUDA-03).`

## 8. Hechos vs. supuestos vs. propuestas

- Hechos (código inspeccionado): modelo de datos (incluido `clientes`),
  funciones `buscarPorId` / `mostrarLibros` / `filtrarLibros`,
  `replaceChildren`/`createElement`/`textContent`, filtro
  `trim`+`toLowerCase`+`includes`, evento `input`, render inicial completo, IDs
  `#catalogo-listado` / `#catalogo-mensaje` / `#buscador-titulo`; ausencia de
  ISBN/precio. (El bloque `<style>` inline y el `console.log` final de clientes
  ya no están: DEUDA-01 y DEUDA-02 resueltas.)
- Hechos (git): `1d3a60e` agregó solo `ejercicio3.html` + `js/ejercicio3.js`;
  los ajustes de DEUDA-01/DEUDA-02 modificaron `ejercicio3.html` y
  `js/ejercicio3.js` y agregaron `css/ejercicio3.css`, sin tocar Ej.1/Ej.2.
- Hechos (consigna): R3-01..R3-10, CA3-01..CA3-06 y los casos límite de §2;
  consigna contrastada contra `Docs/Repaso Primer Parcial.pdf` (DEUDA-04).
- Supuestos: datos ficticios válidos; mensaje sin coincidencias suficiente.
- Deudas resueltas: DEUDA-01, DEUDA-02, DEUDA-04. Deuda abierta: DEUDA-03 (§7).
- `DATO_PENDIENTE:` ISBN/precio (DEUDA-03).
- Verificación: ningún criterio de aceptación se declara cumplido; la
  verificación manual en navegador sigue **pendiente** para los casos de §2 no
  reportados (capitalización, espacios exteriores, género nulo).
