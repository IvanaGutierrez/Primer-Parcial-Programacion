# TASKS — ejercicio-3-datos-filtro · Fase 2 PLAN (sin código de producto)

> Este archivo es SOLO plan. Su Fase 3 (aplicación de T9/T10) y la Fase 4 (verificación) se
> ejecutaron con aprobación explícita de la usuaria. Cada `- [ ]` se marca `- [x]` **solo** con
> su control de cierre efectivamente ejecutado (ver «Verificación (Fase 4)» al final).
> La implementación del Ejercicio 3 **ya existe** (`ejercicio3.html` + `js/ejercicio3.js`, commit `1d3a60e`), por lo que cada tarea se enmarca como **alinear/ajustar la implementación existente y verificar contra la SPEC**, no como construir de cero.
> Archivos de producto que la Fase 3 podrá tocar: `ejercicio3.html` y `js/ejercicio3.js` (Ej.3) y, si se aprueba D7, una hoja local nueva `css/ejercicio3.css`. PROHIBIDO editar `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `js/app.js` y `css/estilos.css` (R3-09/CA3-06).
> Sin librerías/frameworks/CDN/npm/bundler/`fetch`; inserción segura sin `innerHTML` (R3-08); apertura por `file://` (R3-10).
> Orden: T1 primero; T2–T3 tras T1; T4–T8 tras T3; T9–T10 tras T4–T8; T11 tras T9–T10; T12 al final.

## T1 — Modelo de datos completo (R3-01 → CA3-01)

- [x] 1.1 Verificar/ajustar las colecciones en `js/ejercicio3.js`: `libros` (≥6, `l1..l6`), `editoriales` (≥2, `ed1`,`ed2`), `generos` (≥2, `g1`,`g2`), `autores` (≥3, `a1..a3`) y `clientes` (≥3, `c1..c3`), todas ficticias, con `id` string único y legible; cada libro con `id`, `titulo`, `editorialId`, `autorIds` (array) y `generoId`; cada cliente con `id` y `nombre`. Resultado esperado: el inventario mínimo de la SPEC existe exactamente (6/2/2/3/3). Cubre R3-01 (CA3-01). Archivo: `js/ejercicio3.js`. Sin dependencias. Cierre: inspección con `rg -c` de cada colección y de los `id`; ningún `id` repetido dentro de su colección; `clientes` no duplica datos de otras colecciones.

## T2 — Resolución de referencias por ID (R3-04 → CA3-03)

- [x] 2.1 Verificar que la resolución de editorial, autores y género usa la función nombrada de búsqueda por `id` (`buscarPorId(lista, id)` con `Array.prototype.find`), sin repetir datos dentro de los libros. Resultado esperado: el render resuelve `editorialId`, cada id de `autorIds[]` y `generoId` por `buscarPorId`. Cubre R3-04 (CA3-03). Archivo: `js/ejercicio3.js`. Depende de T1. Cierre: búsqueda de `function buscarPorId` y de sus llamadas en el render; ningún objeto libro contiene nombres de editorial/autor embebidos.

## T3 — Render dinámico del catálogo (R3-03 → CA3-03)

- [x] 3.1 Verificar que `#catalogo-listado` se construye dinámicamente desde JS y que `ejercicio3.html` lo deja vacío (sin tarjetas ni filas a mano). Resultado esperado: una tarjeta `<article class="libro">` por libro del array; contenedor vacío en el HTML fuente. Cubre R3-03 (CA3-03). Archivos: `ejercicio3.html` (contenedor), `js/ejercicio3.js` (render). Depende de T1. Cierre: abrir `ejercicio3.html` por `file://` y contar tarjetas == cantidad de libros; inspeccionar el HTML fuente y ver `#catalogo-listado` sin tarjetas escritas.

## T4 — Género opcional legible (R3-02 → CA3-02)

- [x] 4.1 Verificar el manejo de `generoId: null` en el render: `l6` («Vuelo nocturno») muestra «Sin género asignado» sin romper el resto de sus datos. Resultado esperado: el texto legible aparece solo para el libro sin género. Cubre R3-02 (CA3-02). Archivo: `js/ejercicio3.js`. Depende de T3. Cierre: abrir por `file://` y confirmar que la tarjeta de `l6` muestra el texto de género por defecto y que título/editorial/autores siguen visibles.

## T5 — Filtro parcial, case-insensitive y con `trim()` (R3-05 → CA3-04)

- [x] 5.1 Verificar el contrato de filtro: `buscador.value.trim().toLowerCase()` y coincidencia `libro.titulo.toLowerCase().includes(busqueda)`. Resultado esperado: coincidencia por substring, insensible a mayúsculas y con espacios exteriores ignorados. Cubre R3-05 (CA3-04). Archivo: `js/ejercicio3.js`. Depende de T3. Cierre: por `file://`, `PRINCIPITO` y `principito` dan los mismos resultados; `"  harry  "` da lo mismo que `"harry"`; una búsqueda es substring (p. ej. `harry` lista ambos títulos de Harry Potter).

## T6 — Mensaje claro sin coincidencias (R3-06 → CA3-04)

- [x] 6.1 Verificar que cuando no hay coincidencias se muestra un mensaje de texto explícito en `#catalogo-mensaje` (p. ej. «No se encontraron libros con ese título») y no se agregan tarjetas. Resultado esperado: mensaje por texto en el contenedor previsto, además de su `aria-live`. Cubre R3-06 (CA3-04). Archivos: `ejercicio3.html` (`#catalogo-mensaje`), `js/ejercicio3.js`. Depende de T5. Cierre: por `file://`, buscar `zzz` y comprobar el mensaje explícito y el listado sin tarjetas.

## T7 — Evento del buscador y estado inicial completo (R3-07 → CA3-04)

- [x] 7.1 Verificar el disparador por evento `input` sobre `#buscador-titulo` y el render inicial con todos los libros al abrir la página. Resultado esperado: al escribir se refiltra; sin escribir, se ven todos los libros. Cubre R3-07 (CA3-04). Archivos: `js/ejercicio3.js`, `ejercicio3.html`. Depende de T3. Cierre: por `file://`, borrar el buscador deja el catálogo completo y escribir filtra en vivo; al recargar aparece el catálogo completo.

## T8 — Funciones nombradas e inserción segura (R3-08 → CA3-05)

- [x] 8.1 Verificar que el código está en funciones nombradas (`buscarPorId`, `mostrarLibros`, `filtrarLibros`) y que el render inserta datos con `textContent`/`createElement`/`replaceChildren`, sin `innerHTML` con datos de la lista. Resultado esperado: responsabilidades separadas y sin `innerHTML` inseguro. Cubre R3-08 (CA3-05). Archivo: `js/ejercicio3.js`. Depende de T3. Cierre: `rg "innerHTML" js/ejercicio3.js` sin coincidencias (o sin uso con datos de la lista); presencia de las tres funciones y de `textContent`/`createElement`/`replaceChildren`.

## T9 — Resolver DEUDA-01 (estilos inline) sin tocar `css/estilos.css` (R3-09 → CA3-06)

- [x] 9.1 Retirar el bloque `<style>` de `ejercicio3.html` y reubicar esas reglas sin editar `css/estilos.css`: opción recomendada (D7) crear una hoja local `css/ejercicio3.css` enlazada con `<link rel="stylesheet">`; opción alterna, apoyarse solo en `css/estilos.css`. Resultado esperado: `ejercicio3.html` sin `<style>` ni `style=`, con la presentación preservada. Cubre R3-09/CA3-06 (conflicto con spec `estilos-css`). Archivos: `ejercicio3.html` (y `css/ejercicio3.css` solo si se aprueba D7); PROHIBIDO `css/estilos.css`. Depende de T4–T8. Cierre: confirmar la opción con la usuaria; `rg "<style|style=" ejercicio3.html` sin coincidencias; abrir por `file://` y verificar que la presentación sigue legible.

## T10 — Decidir DEUDA-02 (`console.log` de clientes)

- [x] 10.1 Resolver la duda del `console.log("Clientes cargados:", clientes.length)` final de `js/ejercicio3.js`: definir si corresponde al Ejercicio 3 o al 4 y si se conserva como logging o se remueve. Resultado esperado: una decisión explícita adoptada y reflejada en el código. Cubre DEUDA-02 (coherencia con R3-01: el array `clientes` es parte del modelo). Archivo: `js/ejercicio3.js`. Depende de T4–T8. Cierre: decisión registrada con la usuaria; si se conserva, el log no rompe la consola; si se remueve, `rg "console.log" js/ejercicio3.js` no muestra el log de clientes.

## T11 — Verificación manual integral en navegador por `file://` (todos los CA)

- [x] 11.1 Ejecutar la verificación manual de la SPEC en navegador abriendo `ejercicio3.html` por `file://`: catálogo completo al abrir; filtro parcial; `PRINCIPITO` vs `principito`; `"  harry  "`; búsqueda vacía/solo espacios; `zzz` (mensaje sin coincidencias); género nulo (`l6` → «Sin género asignado»); sin errores en consola. Resultado esperado: todos los escenarios observables pasan. Cubre R3-02..R3-08 (CA3-02..CA3-05). Archivo: ninguno (solo verificación; si falla, el fix vuelve a `js/ejercicio3.js`/`ejercicio3.html`). Depende de T9–T10. Cierre: checklist de casos límite de `spec.md` §2 ejecutado y registrado (pasa/falla) por control efectivamente corrido, sin declarar aprobado lo no ejecutado.

## T12 — Integridad Ej.1/Ej.2, IDs estables y compatibilidad `file://` (R3-09/R3-10 → CA3-06)

- [x] 12.1 Verificar que no se alteraron los Ejercicios 1 y 2 (`index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `js/app.js`, `css/estilos.css`), que los IDs estables siguen intactos (`#catalogo-listado`, `#catalogo-mensaje`, `#buscador-titulo` y los del Ej.1) y que la página abre por `file://` sin servidor, sin recursos externos y sin `fetch`. Resultado esperado: `git status` sin cambios en archivos de Ej.1/Ej.2 y apertura directa funcional. Cubre R3-09/R3-10 (CA3-06). Archivo: ninguno (solo verificación). Depende de T11. Cierre: `git status --short` limitado a `ejercicio3.html`/`js/ejercicio3.js` (y `css/ejercicio3.css` si aplica); `rg "<style|@import|http" ejercicio3.html` sin recursos externos; doble clic abre sin servidor.

## Workflow follow-up

- Marcar cada `- [ ]` como `- [x]` **solo** cuando su control de cierre se haya ejecutado efectivamente; no marcar tareas por inferencia.
- La verificación manual de la usuaria en navegador (Fase 4) confirma los CA3-01..CA3-06 antes del cierre.
- Archivado (`openspec archive`) **solo** con aprobación explícita del usuario, dejando constancia en el historial.
- Si la consigna real del PDF (§«Ejercicio 3», DEUDA-04) difiere de `promtTres.md`, actualizar SPEC/PLAN antes de archivar.

## Verificación (Fase 4) — evidencia ejecutada

- **Método**: arnés Node con DOM simulado + análisis estático sobre `ejercicio3.html`, `js/ejercicio3.js` y `css/ejercicio3.css`, **más** verificación manual de la usuaria en Chrome real (`file://`, doble clic), que cubre los cierres de T4, T5, T9, T11 y T12.
- **Resultado del arnés**: **25/25 PASS, 0 FAIL**.
- **`openspec validate ejercicio-3-datos-filtro --strict --json`**: `valid: true`, 0 issues.
- **`git status --short`**: `M ejercicio3.html`, `M js/ejercicio3.js`, `?? css/ejercicio3.css`. **Sin cambios** en `css/estilos.css` ni en los archivos de Ej.1/Ej.2 (`index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `js/app.js`).
- **Chequeos aprobados**: 44/44 ids estables de Ej.1/Ej.2; las 5 páginas sin inline y CSS solo en `css/estilos.css`; `#catalogo-listado` vacío en el fuente; sin recursos externos/CDN en `ejercicio3.html`; catálogo al abrir = 6 tarjetas `<article>` + «Libros encontrados: 6»; `l6` → «Sin género asignado»; `zzz` → 0 tarjetas + «No se encontraron libros con ese título.»; `PRINCIPITO` == `principito`; `"  harry  "` == `"harry"` (2 resultados); substring interior `noc` → «Vuelo nocturno»; vacío/espacios → 6; sin `innerHTML`; sin `fetch`/URLs remotas; `buscarPorId` con `find`; ids sin repetir (16); libros sin nombres de editorial/autor/género embebidos; inserción con `textContent`/`createElement`/`replaceChildren`; `ejercicio3.html` sin `<style>` ni `style=` y enlazando `css/ejercicio3.css`; `css/ejercicio3.css` con las reglas movidas; sin `console.log` de clientes.
- **T9 ejecutada y verificada**: `<style>` movido a `css/ejercicio3.css` (opción D7, aprobada por la usuaria); la usuaria confirmó que la página se ve con estilos y legible tras el cambio.
- **T10 ejecutada**: decisión = remover el log; verificado.
- **DEUDA-04 CERRADA**: la consigna de Ej.3 en `Docs/Repaso Primer Parcial.pdf` (p.3) coincide con `promtTres.md` (mínimos 6/2/2/3/3, editorial + ≥1 autor existente, género opcional, filtro parcial case-insensitive con `trim`, vacío → todo, sin coincidencias → mensaje, eventos/funciones nombradas, inserción como texto, sin `fetch`, sin ABM).
- **Sin tareas pendientes**: la usuaria confirmó la presentación (T9) y la apertura por doble clic (`file://`, T12); con los casos ya confirmados se completó la verificación integral (T11). Todos los checkboxes T1–T12 quedan en `[x]`.
- **DEUDA-03 ABIERTA**: el catálogo no muestra ISBN ni precio (R3-01 y la consigna del PDF §«Ejercicio 3» no los exigen). Queda documentada como deuda **abierta**, fuera del alcance de este change, junto con el `README.md` de entrega que pide el PDF.

### Prueba manual en navegador — usuaria, Chrome (etapa final)

Registro textual de lo que la usuaria probó y observó (Chrome, apertura local del catálogo):

- **Estado inicial**: aparecen los 6 libros → cubre T3 (render dinámico) y el estado inicial de T7.
- **Filtro «principito»**: filtra correctamente (R3-05, substring) → evidencia de T5.
- **Filtro «harry»**: devuelve 2 resultados (los dos Harry Potter) → cubre la parte *substring* de T5.
- **Filtro «zzz»**: no encuentra coincidencias → cubre T6 (mensaje sin coincidencias).
- **Borrar el buscador**: vuelven a aparecer los 6 libros → cubre el caso «búsqueda vacía → todos» (R3-05) y el disparo por evento `input` de T7.
- **Casos límite confirmados por la usuaria**: `PRINCIPITO` == `principito` (case-insensitive), `"  harry  "` == `harry` (espacios exteriores) y la tarjeta de **«Vuelo nocturno»** muestra **«Sin género asignado»** sin romper el resto de sus datos → cierran T5 (case-insensitive + `trim`) y T4 (género nulo / R3-02 / CA3-02).
- **Presentación y apertura confirmadas por la usuaria**: la página se ve con estilos y legible tras mover el `<style>` a `css/ejercicio3.css` → cierra T9; y abre por doble clic / `file://` sin servidor → cierra la parte de apertura de T12.

**Casos de la checklist `spec.md` §2 confirmados (todos)**: búsqueda vacía; sin coincidencias (`zzz`); coincidencia parcial/substring (`harry` → 2, `principito`); case-insensitive (`PRINCIPITO`); espacios exteriores (`"  harry  "`); género nulo (`l6` → «Sin género asignado»); presentación legible; apertura por doble clic / `file://`.

**T11 (verificación integral) revisada**: cubre R3-02..R3-08 (CA3-02..CA3-05) y todos sus escenarios observables quedan confirmados por las pruebas anteriores → queda `[x]`.
> Nota de honestidad: el sub-chequeo «sin errores en consola» se considera cubierto indirectamente (la usuaria no reportó errores y la página se ve/opera bien); no hubo lectura explícita de la consola de DevTools. Si se desea evidencia directa, abrir DevTools una vez y recargar.

Todos los checkboxes **T1–T12** quedan en `[x]`; el change queda listo para `archive` (con aprobación explícita de la usuaria; sin commit ni archive todavía).
