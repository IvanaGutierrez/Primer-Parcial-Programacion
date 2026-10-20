# SPEC — Ejercicio 4 · Altas de libros y clientes

Change: `ejercicio-4-altas` · Fase 1 SPEC completada; Fase 2 PLAN generada el
2026-10-19 (`design.md` + `tasks.md`), solo documentos, sin código de
producto.

Fuentes: `prompCuatro.md` (§3 contexto verificado, §4 alcance incluido/excluido,
§6 R4-01..R4-12 con «Verificación observable», §8 CA4-01..CA4-05, §7 fases con
checkpoints). La fuente primaria declarada es
`Docs/Repaso Primer Parcial.pdf` §«Ejercicio 4 — Alta de libros y clientes»
(p.4 de 7); esta SPEC se apoya en `prompCuatro.md` porque el PDF no pudo leerse
con la herramienta disponible (ver §11, DATO_PENDIENTE). Estado previo
contrastado contra el código inspeccionado de la rama `feature/ejercicio-4`:
`js/ejercicio3.js`, `js/app.js`, `libros.html`, `clientes.html`,
`ejercicio3.html` y `openspec/specs/datos-catalogo-filtro/spec.md`.

Convención: «VERIFICADO código» = atribuido al código inspeccionado; «HECHO
consigna» = atribuido a `prompCuatro.md`; «SUPUESTO» = asunción no bloqueante;
«DECISIÓN PENDIENTE» = requería confirmación del usuario en el checkpoint
(todas las D1–D4 se resolvieron el 2026-10-19, ver §11); «CONFIRMADO (fecha)»
= decisión cerrada en el checkpoint; `DATO_PENDIENTE:` = información faltante
que no se inventa.

## 1. Requisitos verificables (R4-01..R4-12)

### R4-01 · Datos — modelo extendido y fuente única (HECHO consigna; D1 CONFIRMADO 2026-10-19)

El modelo compartido contiene libros con `precio` y clientes con `email`,
conservando los IDs estables del Ejercicio 3; los arrays no están duplicados
entre archivos.

Escenarios observables:

- Extensión: cada uno de los 6 libros iniciales tiene `precio` numérico y
  cada uno de los 3 clientes iniciales tiene `email`, junto a sus campos
  actuales, con los IDs `l1..l6`, `c1..c3`, `ed1..ed2`, `g1..g2`, `a1..a3`
  sin cambios (VERIFICADO código: hoy los libros no tienen `precio` ni `isbn`
  y los clientes no tienen `email`).
- Fuente única: los arrays existen en un solo archivo del proyecto; ninguna
  otra página los redefine. `ejercicio3.html` y las páginas de altas consumen
  la misma fuente (`js/datos.js` — D1 confirmado 2026-10-19).
- Sin duplicación: `js/ejercicio3.js` deja de declarar los arrays al pasar a
  render/filtro sobre la fuente compartida (impacto de D1 sobre
  `ejercicio3.html`, confirmado 2026-10-19).

### R4-02 · Selectores — opciones generadas desde datos locales (HECHO consigna)

Las opciones de editorial, género y autores se generan desde JavaScript a
partir de los datos locales; no están escritas a mano en el HTML.

Escenarios observables:

- Editorial: `#libro-editorial` se rellena con una opción por cada editorial
  del array (hoy: «Editorial Planeta», «Penguin Random House»), reemplazando
  las opciones estáticas de ejemplo (`sur`/`norte`/`este` — VERIFICADO código).
- Autores: `#libro-autores` (`select multiple`) se rellena con una opción por
  cada autor del array (hoy: Saint-Exupéry, Rowling, García Márquez),
  reemplazando las opciones estáticas de ejemplo (VERIFICADO código).
- Género: `#libro-genero` se rellena con una opción por cada género del array
  más la opción «Sin clasificar», reemplazando las opciones estáticas
  (VERIFICADO código).

### R4-03 · Selectores — «Sin clasificar» como ausencia de género (HECHO consigna)

El selector de género incluye la opción «Sin clasificar», que al enviarse
produce un libro sin género asignado.

Escenarios observables:

- Selección «Sin clasificar»: el libro registrado queda con ausencia de
  género (p. ej. `generoId: null`, como el libro `l6` existente — VERIFICADO
  código) y el listado lo muestra de forma legible (p. ej. «Sin clasificar»
  o «Sin género asignado»).
- Coherencia con Ejercicio 3: el catálogo de `ejercicio3.html` sigue mostrando
  «Sin género asignado» para ese libro (REQ. «Género opcional legible» de
  `datos-catalogo-filtro`).

### R4-04 · Validación libro — campos básicos y ISBN único normalizado (HECHO consigna)

Título e ISBN no vacíos; ISBN inexistente en el conjunto local comparado sin
espacios ni guiones; precio numérico y mayor que cero.

Escenarios observables:

- Campos vacíos: título o ISBN vacíos (o solo espacios) → el alta se rechaza
  con mensaje explícito.
- Precio inválido: `0`, negativo, vacío o no numérico → el alta se rechaza
  (VERIFICADO código: `#libro-precio` es `input type="number"`; la comprobación
  JS es la autoridad, no solo los atributos nativos).
- ISBN duplicado normalizado: un ISBN que, sin espacios ni guiones, coincide
  con el de otro libro ya registrado (inicial o dado de alta), p. ej.
  `978-0000000011` vs `978000000011` → rechazado como duplicado. No se
  valida dígito de control.
- ISBN nuevo: un ISBN no normalmente repetido permite continuar con las
  demás comprobaciones.

### R4-05 · Validación libro — relaciones existentes, ≥1 autor y género opcional (HECHO consigna)

La editorial existe en los datos locales; se selecciona al menos un autor y
todos los autores existen; el género, si se asigna, existe.

Escenarios observables:

- Editorial inexistente: no se permite enviar una editorial fuera del array
  (y la opción solo proviene del selector poblado en R4-02).
- Sin autores: enviar `#libro-autores` sin ninguna selección → rechazado.
- Autor inexistente: un autor seleccionado fuera del array → rechazado.
- Género asignado inexistente: rechazado; «Sin clasificar» no cuenta como
  género asignado (R4-03).

### R4-06 · Validación cliente — nombre y email (HECHO consigna)

Nombre completo y email no vacíos (sin campo de apellido separado); email con
formato válido.

Escenarios observables:

- Nombre vacío (o solo espacios) → el alta se rechaza con mensaje explícito.
- Email vacío → el alta se rechaza.
- Email con formato inválido (p. ej. `sin-arroba`) → rechazado; la
  comprobación de formato es JS, no solo el `type="email"` nativo
  (VERIFICADO código: `#cliente-email` tiene `type="email"`).

### R4-07 · Validación cliente — email único normalizado (HECHO consigna)

No existe otro cliente con el mismo email, comparado sin espacios exteriores
y sin distinguir mayúsculas de minúsculas.

Escenarios observables:

- Duplicado con mayúsculas y espacios exteriores: p. ej.
  `  Ana.Perez@Correo.Ficticio ` coincide con `ana.perez@correo.ficticio`
  registrado → rechazado como duplicado.
- Emails distintos: dos emails que difieren después de normalizar → ambos
  aceptados.
- Normalización: se aplica `trim()` y comparación case-insensitive; el valor
  almacenado y mostrado es el ingresado (o su forma limpia), no la clave de
  comparación.

### R4-08 · Envío — preventDefault y errores cerca del formulario (HECHO consigna)

Ambos formularios usan `preventDefault()`; los errores se muestran cerca del
formulario con texto explícito (no dependen solo del color).

Escenarios observables:

- Sin recarga: enviar `#form-libro` o `#form-cliente` (incluso con errores)
  no recarga la página ni navega a `#` (VERIFICADO código: los formularios
  tienen `action="#" method="post"`; el `submit` debe cancelarse con
  `preventDefault()`).
- Errores legibles: ante comprobaciones fallidas se muestra texto explícito
  junto al formulario (usando `#msg-error` o un contenedor próximo), nombrando
  lo fallido; no solo cambio de color.
- Éxito: tras un alta válida se muestra confirmación en `#msg-ok` y se limpian
  los errores previos (VERIFICADO código: `#msg-ok`/`#msg-error` existen con
  texto de ejemplo a reemplazar).

### R4-09 · Actualización — alta condicional y refresco sin recarga (HECHO consigna)

El registro solo se agrega si todas las comprobaciones pasan; el listado
correspondiente y las opciones relacionadas se actualizan sin recargar la
página.

Escenarios observables:

- Alta válida de libro: el libro aparece como fila de `#libros-listado` (y se
  oculta `#libros-vacio` si el listado estaba vacío) sin recargar; toda
  selector que consuma el array de libros (hoy ninguno en esta página; en el
  Ejercicio 5, `#venta-libro`) se refresca con la misma función genérica.
- Alta válida de cliente: el cliente aparece como fila de `#clientes-listado`
  (y se oculta `#clientes-vacio` si corresponde) sin recargar; idéntico
  criterio para selectores que consuman `clientes` (Ejercicio 5,
  `#venta-cliente`).
- Alta inválida: si alguna comprobación falla, NO se agrega el registro ni se
  modifica el listado ni las opciones.
- Filas de ejemplo reemplazadas: las filas estáticas actuales del `tbody`
  (2 en cada página — VERIFICADO código) se sustituyen por el render dinámico
  de los arrays.

### R4-10 · DOM — inserción segura de datos de usuario (HECHO consigna)

Los datos escritos por usuarios y las opciones se insertan como texto en el
DOM (`textContent`/`createElement`); prohibido `innerHTML` con datos de
usuario.

Escenarios observables:

- Inserción segura: filas, opciones y mensajes se construyen con
  `createElement` y `textContent` (patrón ya verificado en
  `js/ejercicio3.js`: `replaceChildren`/`createElement`/`textContent`).
- Sin `innerHTML` con datos de usuario: ninguna cadena construida con datos
  de los arrays o ingresados por el usuario se asigna vía `innerHTML`.

### R4-11 · Código — funciones nombradas activadas por eventos (HECHO consigna)

El código se organiza en funciones nombradas con responsabilidades
reconocibles (validar libro, validar cliente, agregar libro, agregar cliente,
refrescar listados/opciones), activadas por eventos.

Escenarios observables:

- Funciones reconocibles: existen funciones separadas y nombradas para
  poblar selectores, validar el libro, validar el cliente, agregar cada
  registro y refrescar listados/opciones.
- Eventos: el envío de `#form-libro` y `#form-cliente` dispara la validación
  y el alta correspondientes por evento `submit`.

### R4-12 · Integridad — Ejercicios 1-2, IDs estables y file:// (HECHO consigna)

No se modifican los Ejercicios 1 y 2 ni los IDs estables; no se implementa
alcance de los Ejercicios 5 ni 6; las páginas abren por `file://` sin
dependencias.

Escenarios observables:

- IDs estables conservados: `libros.html` y `clientes.html` conservan
  `#form-libro`, `#libro-titulo`, `#libro-isbn`, `#libro-precio`,
  `#libro-editorial`, `#libro-genero`, `#libro-autores`, `#libros-listado`,
  `#libros-vacio`, `#form-cliente`, `cliente-nombre`, `#cliente-email`,
  `#clientes-listado`, `#clientes-vacio`, `#msg-ok`, `#msg-error` (todos
  VERIFICADOS código). Los cambios se limitan al contenido estático de
  ejemplo (opciones y filas) y a referencias de scripts locales.
- Sin Ejercicios 5 ni 6: no se implementa lógica de ventas
  (`#venta-cliente`/`#venta-libro`/`#venta-cantidad`/`#venta-renglones`/
  `#venta-resumen`, VERIFICADOS en `ventas.html`) ni `localStorage`.
- Sin editar/eliminar: no hay borrado ni modificación de registros existentes.
- `file://`: `libros.html` y `clientes.html` abren por doble clic con solo
  hojas y scripts locales, sin servidor, npm ni internet.

## 2. Casos límite observables (consigna §6 «Verificación observable»)

| Caso | Resultado exigido |
| --- | --- |
| ISBN con espacios o guiones que coincide con uno existente normalizado (`978-0000000011` vs `978000000011`) | Rechazado como duplicado (R4-04). |
| Precio `0`, negativo, vacío o no numérico | Rechazado (R4-04). |
| Envío de libro sin autores seleccionados | Rechazado (R4-05). |
| Género «Sin clasificar» | El libro se registra sin género y el listado lo muestra de forma legible (R4-03/R4-09). |
| Email existente con distintas mayúsculas y espacios exteriores | Rechazado como duplicado (R4-07). |
| Email con formato inválido (p. ej. `sin-arroba`) | Rechazado (R4-06). |
| Alta válida de libro o cliente | Aparece en su listado y en las opciones relacionadas sin recargar (R4-09). |

## 3. Modelo de datos extendido (propuesto sobre estado verificado)

Estado verificado (`js/ejercicio3.js`, §Contexto verificado del proposal):
`editoriales` (2: `ed1` Planeta, `ed2` Penguin Random House), `generos` (2:
`g1` Novela, `g2` Fantasía), `autores` (3: `a1` Saint-Exupéry, `a2` Rowling,
`a3` García Márquez), `clientes` (3: `c1` Lucía Pérez, `c2` Mateo Gómez,
`c3` Sofía López — sin `email`), `libros` (6: `l1..l6` — sin `precio` ni
`isbn`; `l6` «Vuelo nocturno» con `generoId: null`).

Extensiones propuestas, conservando todos los `id` estables:

- `precio` (number) en cada libro inicial (valores ficticios de ejemplo — D3
  confirmado 2026-10-19): requerido por R4-01.
- `email` (string) en cada cliente inicial (valores ficticios de ejemplo, p. ej.
  `lucia.perez@correo.ficticio` — D3 confirmado 2026-10-19): requerido por
  R4-01.
- `isbn` (string) en cada libro inicial (p. ej. `978-0000000011` ..
  `978-0000000066`): **confirmado (D2, 2026-10-19)**; el modelo actual no lo
  tiene (VERIFICADO código) pero la tabla `#libros-listado` tiene columna ISBN
  y el caso límite de ISBN duplicado presupone ISBNs locales.
- Nuevos libros dados de alta incluyen `id` único, `titulo`, `isbn`,
  `precio`, `editorialId`, `autorIds[]` y `generoId` (o ausencia vía «Sin
  clasificar»); nuevos clientes incluyen `id` único, `nombre` y `email`.

## 4. Fuente única de datos (D1 CONFIRMADO 2026-10-19)

Resolución del checkpoint (CONFIRMADO 2026-10-19): crear `js/datos.js` con
los arrays extendidos (editoriales, géneros, autores, libros con `isbn` y
`precio`, clientes con `email`), enlazado con `<script defer>` por
`libros.html`, `clientes.html` y `ejercicio3.html`; `js/ejercicio3.js` queda
solo con render/filtro y `ejercicio3.html` enlaza ambos scripts (datos.js
antes que ejercicio3.js). Sin duplicación de arrays entre archivos (R4-01).

Historial: la alternativa descrita en el proposal (mantener los arrays en
`js/ejercicio3.js` y enlazarlo desde las otras páginas) quedó descartada en el
checkpoint; esta SPEC y los deltas reflejan la decisión cerrada.

## 5. Población de selectores (R4-02/R4-03)

- `#libro-editorial`: una opción por editorial (`value` = `id`, texto =
  `nombre`).
- `#libro-genero`: una opción por género + «Sin clasificar» como representante
  de la ausencia de género (distinta de las opciones de género reales).
- `#libro-autores`: `select multiple` con una opción por autor; la selección
  puede ser de uno o varios.
- Todas las opciones estáticas actuales de ejemplo se reemplazan; las opciones
  se generan al cargar la página desde la fuente compartida.

## 6. Reglas de validación y normalización

- ISBN: no vacío (tras `trim()`); único comparando la forma normalizada
  (quitar todos los espacios y guiones, comparar sin distinguir
  mayúsculas/minúsculas) contra el ISBN normalizado de todos los libros ya
  registrados; sin dígito de control.
- Precio: debe convertirse a número y ser `> 0`; vacío o no numérico → error.
- Editorial: su `value` (id) debe existir en el array de editoriales.
- Autores: al menos una selección; cada `id` seleccionado debe existir en el
  array de autores.
- Género: opcional; si no es «Sin clasificar», su `id` debe existir en el
  array de géneros; «Sin clasificar» ⇒ sin género asignado.
- Nombre de cliente: no vacío (tras `trim()`).
- Email de cliente: no vacío; formato válido verificado en JS; único comparando
  la forma `trim()` + minúsculas contra todos los clientes ya registrados.
- Toda comprobación fallida impide el alta y produce un mensaje explícito;
  solo el pase íntegro de todas las comprobaciones permite agregar (R4-08/
  R4-09).

## 7. Envío, mensajes y actualización sin recarga

- `submit` de `#form-libro` y `#form-cliente` cancelado con `preventDefault()`.
- Errores: texto explícito cerca del formulario (contenedor junto al `<form>`,
  reutilizando `#msg-error` o uno equivalente por página); el éxito se
  comunica en `#msg-ok`; limpieza de mensajes al reintentar.
- Tras alta válida: refresco del listado correspondiente
  (`#libros-listado`/`#clientes-listado`, ocultando `#libros-vacio`/
  `#clientes-vacio` si el listado tiene filas) y de las opciones relacionadas
  mediante funciones de refresco genéricas (hoy sin selectores dependientes en
  estas páginas; preparadas para `#venta-libro`/`#venta-cliente` del
  Ejercicio 5, que NO se implementan aquí). Ninguna recarga de página.

## 8. DOM seguro y organización del código (R4-10/R4-11)

- Construcción de opciones, filas y mensajes con `createElement` +
  `textContent` (+ `replaceChildren` para limpiar), patrón ya verificado en
  `js/ejercicio3.js`; sin `innerHTML` con datos de usuario.
- Funciones nombradas con responsabilidades reconocibles: poblar selectores,
  validar libro, validar cliente, agregar libro, agregar cliente, refrescar
  listados y refrescar opciones; activadas por eventos `submit`. La ubicación
  exacta se resolvió en el checkpoint: D4 CONFIRMADO (2026-10-19) — viven en
  `js/app.js`, con organización detallada en `design.md`.

## 9. Criterios de aceptación (CA4-01..CA4-05)

- **CA4-01 (Libros y selectores — 6 pts):** los selectores de editorial,
  género (con «Sin clasificar») y autores se generan desde los datos locales;
  el alta de libro valida título, ISBN único normalizado, precio > 0,
  relaciones existentes y ≥1 autor, y el libro registrado aparece en el
  listado sin recargar (cubre R4-01/R4-02/R4-03/R4-04/R4-05).
- **CA4-02 (Clientes — 4 pts):** el alta de cliente valida nombre completo,
  formato de email y email único normalizado (sin espacios exteriores,
  case-insensitive); el cliente registrado aparece en el listado sin recargar
  (cubre R4-06/R4-07).
- **CA4-03 (Validación y actualización — 5 pts):** `preventDefault` en ambos
  formularios, errores cerca del formulario con texto explícito, alta solo
  con todas las comprobaciones pasando y actualización de listados y opciones
  relacionadas sin recargar la página (cubre R4-08/R4-09).
- **CA4-04 (Calidad de código):** código en funciones reconocibles, activado
  por eventos, con inserción segura vía `textContent` (sin `innerHTML`)
  (cubre R4-10/R4-11).
- **CA4-05 (Integridad y compatibilidad):** no se alteran Ejercicios 1 y 2 ni
  IDs estables; no se adelanta alcance de los Ejercicios 5 ni 6; las páginas
  abren por `file://` sin dependencias (cubre R4-12).

Ningún criterio se declara cumplido en esta fase: la verificación es manual por
navegador en la Fase 4.

## 10. Alcance excluido (bloqueado)

- Ejercicio 5: venta simulada, renglones, cálculos de subtotal/total,
  confirmación de venta y los selectores `#venta-*` (existes como IDs
  estables en `ventas.html`, VERIFICADO; no se implementan aquí).
- Ejercicio 6: `localStorage`, casos manuales de prueba, README final.
- Edición y eliminación de libros o clientes; stock, cobros y facturación.
- `fetch` de datos; ABM de editoriales, géneros o autores (datos fijos
  locales).
- Cero librerías, frameworks, preprocesadores, transpiladores, CDNs, fuentes
  externas, servidores, npm, bundlers y base de datos.
- `index.html`, `ventas.html`, `historial.html` y `css/estilos.css` no se
  modifican; no se alteran los IDs estables de la lista de `prompCuatro.md` §3.

## 11. Decisiones (resueltas en el checkpoint — 2026-10-19), supuestos y datos pendientes

### Decisiones (D1–D4 CONFIRMADAS el 2026-10-19)

- **D1 — `js/datos.js`: CONFIRMADO (2026-10-19).** Se extraen los arrays de
  `js/ejercicio3.js` a `js/datos.js` y `ejercicio3.html` enlaza además
  `js/datos.js`; `js/ejercicio3.js` conserva solo render/filtro. Ver §4.
  (Antes del checkpoint figuraba como pendiente.)
- **D2 — `isbn` inicial: CONFIRMADO (2026-10-19).** Se agrega `isbn` a los 6
  libros iniciales además del `precio` obligatorio; el modelo actual no lo
  tiene (VERIFICADO código) y sin él la columna ISBN del listado quedaría
  vacía para los libros iniciales y el caso límite de duplicado normalizado
  solo aplicaría a libros dados de alta.
- **D3 — Valores ficticios (menor): CONFIRMADO (2026-10-19).** Los valores
  exactos de `precio` de los 6 libros y `email` de los 3 clientes iniciales
  son ejemplos ficticios aceptados; el PLAN fija valores concretos y los
  marca como ficticios.
- **D4 — Ubicación de la lógica (menor): CONFIRMADO (2026-10-19).** La lógica
  de altas vive en `js/app.js` (placeholder ya enlazado por ambas páginas);
  su organización se detalla en `design.md` (PLAN), sin impacto en requisitos
  observables.

### Supuestos

- SUPUESTO: «errores cerca del formulario» se cumple con texto explícito junto
  al `<form>` (`#msg-error` o contenedor equivalente), no solo con color.
- SUPUESTO: el refresco de «opciones relacionadas» se implementa como función
  genérica reutilizable; en las páginas del Ejercicio 4 el observable concreto
  es el listado, porque ningún selector de estas páginas consume
  hoy libros/clientes (los `#venta-*` son Ejercicio 5).
- SUPUESTO: normalización de ISBN = quitar espacios y guiones + comparación
  case-insensitive, sin dígito de control; email = `trim()` + case-insensitive
  para unicidad, con formato verificado en JS.
- SUPUESTO: los datos ficticios actuales y sus IDs se aceptan como ejemplos
  válidos y se conservan intactos al moverlos a la fuente compartida.

### Datos pendientes

- `DATO_PENDIENTE: la lectura de Docs/Repaso Primer Parcial.pdf (página 4,
  «Ejercicio 4 — Alta de libros y clientes») no pudo realizarse en esta
  sesión; la SPEC se basa en prompCuatro.md, que declara haber contrastado esa
  página.` Disponible el pegado del texto para verificación cruzada.
- Discrepancia registrada: el ejemplo de email duplicado de la consigna
  (`  ana.perez.ejemplo@correo.ficticio `) corresponde a la fila estática de
  `clientes.html` («Ana Pérez»), no al array `clientes`; tras el render
  dinámico el ejemplo se hará con los emails del modelo extendido. No afecta
  la regla R4-07.

## 12. Hechos verificados vs supuestos vs decisiones

- Hechos (código inspeccionado): contenido exacto de los arrays y sus IDs;
  ausencia de `precio` e `isbn` en libros y de `email` en clientes; libro
  `l6` con `generoId: null`; existencia de todos los IDs estables de
  `libros.html`/`clientes.html` y de `#venta-*` en `ventas.html`; `js/app.js`
  placeholder con IDs reservados; formularios con `action="#" method="post"`;
  opciones y filas estáticas de ejemplo en ambas páginas; `ejercicio3.html`
  enlaza `js/ejercicio3.js` y consume los arrays; sin `innerHTML` en el render
  del Ejercicio 3.
- Hechos (consigna): R4-01..R4-12, CA4-01..CA4-05, casos límite de §2 y el
  alcance excluido de §10, según `prompCuatro.md`.
- Decisiones cerradas en el checkpoint (2026-10-19): `js/datos.js` como
  fuente única (D1), `isbn` inicial (D2), valores ficticios de `precio`/`email`
  (D3) y ubicación de la lógica de altas en `js/app.js` (D4), todas
  CONFIRMADAS.
- Supuestos: mensajes cerca del formulario en `#msg-error`, refresco genérico
  de opciones, normalización ISBN/email y conservación de datos ficticios.
- `DATO_PENDIENTE:` PDF ilegible en esta sesión (§11).
- Verificación: ningún CA se declara cumplido; la verificación manual en
  navegador queda para la Fase 4.
