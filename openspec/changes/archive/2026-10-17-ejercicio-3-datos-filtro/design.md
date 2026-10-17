# Design — ejercicio-3-datos-filtro · Fase 2 PLAN (sin código de producto)

Documento de diseño del change `ejercicio-3-datos-filtro` (Ejercicio 3 del TPI).
Explica **cómo** se alinea la implementación existente con la SPEC
(`spec.md` + delta `specs/datos-catalogo-filtro/spec.md`) y **por qué** se eligen
esas decisiones. El plan ejecutable vive en `tasks.md`. Con autorización
explícita se ejecutó la Fase 3 (ajustes de DEUDA-01/DEUDA-02) y parte de la
Fase 4; el estado de cada deuda y de la verificación se refleja en `spec.md` §7
y `tasks.md`. Motivación y alcance en `proposal.md`.

Convención de marcadores (igual que el resto de los artefactos): `HECHO (código)`,
`HECHO (git)`, `HECHO (consigna)`, `SUPUESTO`, `DEUDA`, `DATO_PENDIENTE:`.

## Context

- El Ejercicio 3 **ya está implementado directamente** en `ejercicio3.html` +
  `js/ejercicio3.js` y commiteado (`1d3a60e`, HECHO git), sin change de OpenSpec
  asociado. Este change es **retrospectivo**: formaliza el contrato y planifica
  su alineación/verificación, no su construcción desde cero.
- `js/ejercicio3.js` (HECHO código) define `editoriales` (2), `generos` (2),
  `autores` (3), `libros` (6, `l6` con `generoId: null`) y `clientes` (3);
  funciones nombradas `buscarPorId`, `mostrarLibros`, `filtrarLibros`; render con
  `replaceChildren`/`createElement`/`textContent` (sin `innerHTML`); filtro
  `trim().toLowerCase()` + `includes()`; evento `input`; render inicial
  `mostrarLibros(libros)`; el `console.log("Clientes cargados", ...)` final fue
  **eliminado** (DEUDA-02 resuelta).
- `ejercicio3.html` (HECHO código) expone `#buscador-titulo` (`input`),
  `#catalogo-mensaje` (`<p aria-live>`), `#catalogo-listado` (`<section>` vacía),
  enlaza `css/estilos.css` y `css/ejercicio3.css` y carga `js/ejercicio3.js` con
  `defer`; tenía un bloque `<style>` inline que se movió a `css/ejercicio3.css`
  (DEUDA-01 resuelta).
- **Consigna aclarada (HECHO consigna):** el modelo de datos incluye también
  `clientes` (≥3 ficticios, con `id` y `nombre`); los mínimos exactos son
  ≥6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes. El array `clientes`
  pasa a ser parte de R3-01.
- Restricciones duras: sin librerías/frameworks/CDN/npm/bundler/`fetch`; JS nativo;
  apertura `file://`; no alterar Ejercicios 1 y 2 ni IDs estables (R3-09); inserción
  segura sin `innerHTML` (R3-08).
- Estado del change: SPEC y PLAN completos (`proposal.md`, `spec.md`, delta,
  `design.md`, `tasks.md`); Fase 3 (DEUDA-01/DEUDA-02) aplicada y Fase 4 parcial
  (DEUDA-04 cerrada; verificación manual en navegador aún pendiente para los
  casos de §2 no reportados).

## Goals / Non-Goals

**Goals**

- Documentar las decisiones técnicas que hacen que la implementación existente
  cumpla R3-01..R3-10 y CA3-01..CA3-06, y que `tasks.md` pueda verificar.
- Incorporar `clientes` al modelo de datos (≥3 ficticios) como parte de R3-01.
- Definir la estrategia para resolver **DEUDA-01** (estilos inline) sin editar
  `css/estilos.css` y decidir **DEUDA-02** (`console.log` de clientes). Ambas
  quedaron **resueltas**: D7 aplicada (hoja `css/ejercicio3.css`) y el log
  eliminado.
- Mantener `R3-xx` / `CA3-xx` estables y coherentes entre `spec.md`, el delta,
  este `design.md` y `tasks.md`.

**Non-Goals**

- Lógica de los Ejercicios 4, 5 y 6 (validaciones, alta de libros/clientes/ventas,
  totales, confirmación, historial, `localStorage`, README de pruebas, docs final).
- Librerías, frameworks, preprocesadores, CDN, npm/bundlers, servidor ni `fetch`.
- Editar los Ejercicios 1 y 2 (`index.html`, `libros.html`, `clientes.html`,
  `ventas.html`, `historial.html`, `js/app.js`) ni `css/estilos.css`.
- Ejecutar `archive` ni commits (la Fase 3 `apply` y la Fase 4 `verify` parcial se
  ejecutaron con autorización explícita; ver `tasks.md`).

## Decisions

### D1 — Catálogo en página standalone `ejercicio3.html` + `js/ejercicio3.js`

**Decisión:** el catálogo vive en la página independiente `ejercicio3.html` con su
script `js/ejercicio3.js`; **no** se integra en `index.html`.

**Motivo (HECHO código):** el `#catalogo-listado` de `index.html` (Ej.1) es una
`<table>` con filas `<tbody>` escritas a mano y `js/app.js` es placeholder;
hacerlo dinámico obligaría a borrar esas filas o a cablear `js/app.js`.

**Alternativa considerada:** integrarlo en `index.html`. **Descartada** porque
rompe R3-09/CA3-06 (no alterar Ejercicios 1 y 2 ni IDs estables).

### D2 — Modelo de datos como arrays de objetos con `id` estable y resolución por `find`

**Decisión:** cada colección (`libros`, `editoriales`, `generos`, `autores`,
`clientes`) es un array de objetos con `id` string único y legible; los libros
referencian por id (`editorialId`, `autorIds[]`, `generoId`) y las referencias se
resuelven con una función nombrada `buscarPorId(lista, id)` que usa
`Array.prototype.find`.

**Motivo (HECHO consigna; HECHO código):** R3-01/R3-04 exigen ids estables y
resolución por id sin duplicar datos; ya está implementado así.

**Alternativa considerada:** objetos anidados (libro con la editorial/autor
embebidos) o duplicar nombres dentro del libro. **Descartada** por no cumplir
"ids estables + resolver referencias por id" y por riesgo de datos inconsistentes.

### D3 — Render dinámico con `replaceChildren` + `createElement` + `textContent`

**Decisión:** el render limpia `#catalogo-listado` con `replaceChildren()` y crea
las tarjetas con `document.createElement` + `textContent`, sin `innerHTML`.

**Motivo (HECHO consigna; HECHO código):** R3-03 pide generación dinámica (sin
filas a mano) y R3-08 exige inserción segura; `textContent` evita inyección de
HTML con datos de la lista.

**Alternativa considerada:** `innerHTML` con interpolación. **Descartada** por
R3-08 y por seguridad (datos insertados como texto, no como HTML).

### D4 — Filtro por substring, case-insensitive y con `trim()`

**Decisión:** `const busqueda = buscador.value.trim().toLowerCase()`; cada libro
coincide si `libro.titulo.toLowerCase().includes(busqueda)`.

**Motivo (HECHO consigna; HECHO código):** R3-05 exige coincidencia **parcial**
(substring), sin distinguir mayúsculas/minúsculas y quitando espacios exteriores.
Búsqueda vacía produce `""` y `.includes("")` es `true` para todo → se muestran
todos los libros (catálogo completo al abrir).

**Alternativas consideradas:** `startsWith` o expresiones regulares.
**Descartadas:** `startsWith` solo coincide por prefijo (no cumple "parcial") y
la regex añade complejidad/riesgo sin beneficio.

### D5 — Género opcional manejado en el render

**Decisión:** cuando `libro.generoId` es `null`/falsy, el render muestra el texto
«Sin género asignado» y no intenta resolver el id.

**Motivo (HECHO consigna; HECHO código):** R3-02/CA3-02 exigen que un libro sin
género (`l6`) se muestre legible sin romper el render. Implementado con un
condicional `genero ? genero.nombre : "Sin género asignado"`.

**Alternativa considerada:** usar un objeto género "sin asignar" con id propio.
**Descartada:** la consigna menciona `generoId: null` como caso explícito.

### D6 — `clientes` como colección del modelo (≥3 ficticios); `console.log` eliminado

**Decisión:** `clientes` es una colección de datos del modelo con ≥3 registros
ficticios (`c1`, `c2`, `c3`), cada uno con `id` único y `nombre` (parte de R3-01
según la consigna aclarada). El `console.log("Clientes cargados:", ...)` final se
**removió** (DEUDA-02 resuelta): era ruido de depuración; el array `clientes` se
conserva porque sí es parte del modelo.

**Motivo (HECHO consigna; HECHO código):** la consigna aclarada incorpora clientes
al modelo; el array ya existe en el código.

**Alternativa considerada:** mover la decisión de clientes fuera de este change.
**Descartada:** la consigna aclarada los incorpora al modelo de R3-01.

### D7 — Estrategia para DEUDA-01 (estilos inline) sin editar `css/estilos.css` (aplicada)

**Decisión (APLICADA):** se movió el bloque `<style>` de `ejercicio3.html` a una
hoja local propia del Ejercicio 3 (`css/ejercicio3.css`) enlazada con
`<link rel="stylesheet">`, conservando la presentación y **sin** tocar
`css/estilos.css` (Ej.2), y se retiró el `<style>` inline. La regla de la spec
`estilos-css` («CSS solo en `css/estilos.css`, sin inline») se redactó para las 5
páginas del Ejercicio 1/2; `ejercicio3.html` es una 6.ª página fuera de ese
conjunto, por lo que una hoja externa propia es compatible con «sin inline» y no
edita el CSS congelado. La opción fue confirmada por la usuaria.

**Motivo:** DEUDA-01 exige eliminar el `<style>` inline; la restricción prohíbe
editar `css/estilos.css`; una hoja externa satisface ambas.

**Alternativa considerada:** eliminar el `<style>` y depender solo de
`css/estilos.css`. **Válida y más simple**, pero degrada la presentación actual
(fuente, márgenes, tarjeta `.libro`, negrita de mensaje); se deja como opción de
respaldo si la usuaria prefiere una única hoja CSS.

## Risks / Trade-offs

- **[Estilo inline vs. spec `estilos-css`] → RESUELTO:** DEUDA-01 se resolvió
  retirando el `<style>` y moviendo esas reglas a `css/ejercicio3.css`, sin editar
  `css/estilos.css` (D7 aplicada); `ejercicio3.html` quedó sin `<style>` ni
  `style=`.
- **[`console.log` en producción] → RESUELTO:** DEUDA-02 se resolvió eliminando el
  log en la Fase 3.
- **[Ausencia de ISBN/precio en el render] → ABIERTO:** DEUDA-03 permanece como
  `DATO_PENDIENTE`; R3-01 y la consigna no los exigen, y si la cátedra los pide se
  agrega una tarea acotada antes de la verificación final.
- **[Verificación solo manual, sin test runner, por `file://`] → Mitigación:**
  cada tarea define un cierre observable en navegador (catálogo completo, filtros,
  mensaje, género nulo, sin error en consola) y no se marca ningún checkbox sin
  control efectivamente ejecutado; la verificación manual sigue pendiente para los
  casos de §2 no reportados.
- **[Posible diferencia entre `promtTres.md` y el PDF] → RESUELTO:** DEUDA-04 se
  cerró contrastando la consigna contra `Docs/Repaso Primer Parcial.pdf`
  §«Ejercicio 3»; coincide con `promtTres.md`.

## Migration Plan

Como la implementación **ya existe**, el plan es de alineación y verificación, no
de reescritura:

1. Auditar el modelo de datos contra R3-01 (libros/editoriales/géneros/autores/
   clientes, mínimos ≥6/2/2/3/3, ids únicos y legibles).
2. Confirmar la resolución por id (`buscarPorId`), el render dinámico en
   `#catalogo-listado`, el género opcional, el filtro parcial y el mensaje sin
   coincidencias contra R3-02..R3-07.
3. Confirmar funciones nombradas e inserción segura (sin `innerHTML`) contra R3-08.
4. Resolver DEUDA-01 (retirar `<style>` inline) sin editar `css/estilos.css`;
   decidir DEUDA-02 (`console.log` de clientes). **Hecho** (Fase 3): `<style>`
   movido a `css/ejercicio3.css` y log de clientes eliminado.
5. Verificación manual integral por `file://`: catálogo completo, filtros
   (`PRINCIPITO`/`principito`, `"  harry  "`, vacío, `zzz`), género nulo, sin
   errores de consola; más integridad de Ej.1/Ej.2 e IDs estables y compatibilidad
   `file://` (R3-09/R3-10).
6. Marcar checkboxes solo con controles ejecutados; archivar con aprobación.

**Rollback:** al ser planificación **documental**, no hay cambios de producto que
revertir. Si en la Fase 3 un ajuste de implementación resultara contraproducente,
se revierte con `git revert` del commit de implementación (o se regresa al estado
previo con `git checkout --`), ya que el código de Ejercicio 3 está versionado.
No se prevén migraciones de datos ni de esquema.

## Open Questions

Solo incógnitas genuinamente diferibles; las que cambiarían spec/enfoque/tareas se
resolvieron como decisiones de tarea, no como preguntas abiertas.

- **DEUDA-01 — Estilos inline: CERRADA.** Se optó por la hoja local del Ej.3
  (`css/ejercicio3.css`), confirmada por la usuaria y aplicada.
- **DEUDA-02 — `console.log` de clientes: CERRADA.** Se removió el log; el array
  `clientes` se conserva.
- **DEUDA-03 — ISBN y precio: ABIERTA.** ¿La cátedra exige ISBN/precio en el
  catálogo del Ejercicio 3? `DATO_PENDIENTE`; R3-01 y la consigna no los mencionan.
- **DEUDA-04 — Validación contra el PDF: CERRADA.** Consigna contrastada contra
  `Docs/Repaso Primer Parcial.pdf` §«Ejercicio 3»; coincide con `promtTres.md`.
