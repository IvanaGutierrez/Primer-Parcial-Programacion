# SPEC — Ejercicio 5 · Venta simulada e historial

Change: `ejercicio-5-ventas` · Fase 1 SPEC (solo documentos, sin código de
producto). Los artefactos de Fase 2 PLAN (`design.md`, `tasks.md`) NO se
generan en esta fase, según la metodología acordada.

Fuentes: `promptCinco.md` (§3 contexto verificado, §4 alcance incluido/excluido,
§6 R5-01..R5-12 con «Verificación observable», §8 CA5-01..CA5-05, §7 fases con
checkpoints Continuar/Ajustar/Parar). La fuente primaria declarada es
`Docs/Repaso Primer Parcial.pdf` §«Ejercicio 5 — Venta simulada e historial»
(p.5 de 7); esta SPEC se apoya en `promptCinco.md` porque el PDF no pudo
leerse con la herramienta de esta sesión (ver §13, DATO_PENDIENTE). Estado
previo contrastado contra el código inspeccionado de la rama
`feature/ejercicio-5` (HEAD `7b3e178`): `js/datos.js`, `js/app.js`,
`ventas.html`, `historial.html` y las specs vigentes
`openspec/specs/estructura-html`, `estilos-css`, `datos-catalogo-filtro` y
`altas-validacion`.

Convención: «VERIFICADO código» = atribuido al código inspeccionado; «HECHO
consigna» = atribuido a `promptCinco.md`; «SUPUESTO» = asunción no bloqueante;
«CONFIRMADO (2026-10-19)» = decisión cerrada por el usuario en el checkpoint
de SPEC (D1–D3, ver §13); «APROBADO» = decisión cerrada por el usuario antes de
este change (puente `sessionStorage`, id `#venta-confirmar`); `DATO_PENDIENTE:` =
información faltante que no se inventa. No quedan decisiones pendientes de
confirmación en esta SPEC.

## 1. Requisitos verificables (R5-01..R5-12)

### R5-01 · Selectores — opciones generadas desde datos locales (HECHO consigna)

`#venta-cliente` y `#venta-libro` se **pueblan desde JavaScript** con los
datos locales (clientes y libros registrados, incluidos los dados de alta en
el Ejercicio 4), sin opciones escritas a mano.

Escenarios observables:

- Cliente: `#venta-cliente` se rellena con una opción por cada cliente del
  array (hoy `c1` Lucía Pérez, `c2` Mateo Gómez, `c3` Sofía López; más
  `c4+` dados de alta en `libros`/`clientes.html`), con `value` = `id`,
  reemplazando las opciones estáticas `value="ana"` / `value="luis"`
  (VERIFICADO código).
- Libro: `#venta-libro` se rellena con una opción por cada libro del
  catálogo (hoy `l1..l6`; más `l7+` dados de alta), con `value` = `id`,
  reemplazando las opciones estáticas `value="jardin"` / `value="manual"`
  (VERIFICADO código).
- Ambas páginas hoy enlazan solo `js/app.js` (VERIFICADO código: **no
  enlazan `js/datos.js`**), por lo que la implementación agrega esa
  referencia en `ventas.html` **e `historial.html`** (D1 CONFIRMADA
  2026-10-19: ambas páginas enlazan `js/datos.js` con `defer` antes que
  `js/app.js`).

### R5-02 · Composición — libro existente y cantidad entera > 0 (HECHO consigna)

Agregar un renglón exige un libro existente y una **cantidad entera mayor
que cero**; cantidad vacía, cero, negativa o decimal se rechaza con mensaje.

Escenarios observables:

- Renglón válido: libro seleccionado + cantidad entera > 0 → el renglón
  aparece en `#venta-renglones` con libro, cantidad, precio unitario y
  subtotal (columnas VERIFICADAS en la maqueta: Libro | Cantidad | Precio
  unitario | Subtotal).
- Cantidad inválida: vacía, `0`, negativa o decimal (p. ej. `1,5`) → el
  renglón **no se agrega** y se muestra mensaje explícito junto al
  formulario. La comprobación se hace en **JavaScript como autoridad**
  (patrón DD-08 del Ejercicio 4), pese a los atributos nativos
  `min="1" required` de `#venta-cantidad` (VERIFICADO código; sin `step`).
- Sin libro seleccionado → rechazado con mensaje.

### R5-03 · Duplicados — un solo renglón por libro (HECHO consigna; política D2 CONFIRMADA 2026-10-19)

Un libro repetido dentro de la misma venta **no crea otro renglón**: se
modifica la cantidad del existente o se informa el duplicado (política
única, definida y documentada).

Escenarios observables:

- Mismo libro agregado dos veces → **un solo renglón** para ese libro.
- Política **confirmada (D2, 2026-10-19)**: la cantidad ingresada se **SUMA**
  a la del renglón existente, se recalculan subtotal y total, y se muestra un
  mensaje informativo junto al formulario.
- La política es única y consistente: la misma entrada produce siempre el
  mismo resultado observable.

### R5-04 · Cálculos — subtotal por renglón con dos decimales (HECHO consigna)

Cada renglón muestra libro, cantidad, precio unitario y **subtotal = cantidad
× precio unitario**; los importes se presentan con **dos decimales**.

Escenarios observables:

- Subtotal: cantidad `2` × precio `1500` → subtotal mostrado `3000.00`
  (ejemplo de la consigna, precios ficticios autorizados).
- Presentación: todo importe visible (precio unitario, subtotal, total) usa
  dos decimales (p. ej. `2000.00`, `15999.00`).

### R5-05 · Cálculos — total = suma de subtotales con recálculo (HECHO consigna)

`#venta-resumen` muestra el **total = suma de subtotales** con dos decimales;
se recalcula al cambiar cantidades o quitar renglones.

Escenarios observables:

- Total de ejemplo: renglones `2 × 1500` y `1 × 2000` → subtotales `3000.00`
  y `2000.00`, total `5000.00` en `#venta-resumen`.
- Recálculo: al cambiar una cantidad o quitar un renglón, subtotal(s)
  afectado(s) y total se re-renderizan sin recargar la página.

### R5-06 · Edición previa — cantidades y quita de renglones (HECHO consigna)

Antes de confirmar es posible **cambiar cantidades** y **quitar renglones**,
viendo el impacto en subtotal y total.

Escenarios observables:

- Cambiar cantidad: la nueva cantidad inválida (vacía, cero, negativa,
  decimal) rechaza el cambio con mensaje y conserva el valor anterior; la
  válida actualiza subtotal y total.
- Quitar renglón: el renglón desaparece de `#venta-renglones` y el total se
  recalcula; si era el último, se muestra `#venta-renglones-vacio` y el
  resumen vuelve a su estado vacío (p. ej. `0.00`).

### R5-07 · Bloqueo — confirmación inválida con errores en texto (HECHO consigna)

No se puede confirmar **sin cliente, sin renglones o con cantidades
inválidas**; los errores se muestran con **texto** cerca del formulario.

Escenarios observables:

- Sin cliente / sin renglones / con cantidades inválidas → la venta **no se
  registra** ni aparece en el historial.
- Los errores son texto explícito junto al formulario (`#msg-error` o
  contenedor próximo; mismo criterio que R4-08), no solo color.

### R5-08 · Confirmación — registro e histórico de precio (HECHO consigna)

Al confirmar se registra **id, fecha, cliente, renglones y total**; el
**precio unitario se copia al renglón** como valor histórico y no se relee
del catálogo al consultar el historial.

Escenarios observables:

- Registro: la venta confirmada contiene `id`, `fecha`, cliente, cada
  renglón (libro, cantidad, precio unitario, subtotal) y `total`.
- Precio histórico: confirmada una venta, se cambia el `precio` del libro en
  el catálogo y se recarga `historial.html` → el precio unitario, subtotales
  y total de esa venta **conservan los valores confirmados** (VERIFICADO
  modelo: el catálogo vive en `js/datos.js` y el precio es un campo mutable
  del array; el historial no debe depender de él).

### R5-09 · Datos históricos — datos descriptivos autosuficientes (HECHO consigna)

La venta guarda los **datos descriptivos necesarios** (título del libro,
nombre del cliente) para leerse sin depender del estado actual del catálogo.

Escenarios observables:

- Lectura sin catálogo: el listado y el detalle muestran el título del libro
  desde el renglón guardado y el nombre del cliente desde la venta guardada,
  sin buscar en los arrays actuales.

### R5-10 · Historial — listado y detalle vía puente (HECHO consigna; puente APROBADO)

`historial.html` muestra identificador, fecha, cliente y total de las ventas
confirmadas (puente `sessionStorage`, **aprobado**) y permite **consultar los
renglones** en `#historial-detalle`.

Escenarios observables:

- Listado: `#historial-listado` (columnas VERIFICADAS: Id | Fecha | Cliente |
  Total | Detalle) muestra una fila por venta con id, fecha legible, nombre
  del cliente y total con dos decimales; las 2 filas estáticas de ejemplo se
  reemplazan por render dinámico.
- Detalle: al activar el control de detalle de una venta,
  `#historial-detalle` muestra id, fecha, cliente, total y sus renglones
  (título, cantidad, precio unitario, subtotal); el contenido de ejemplo
  estático actual se reemplaza.
- Vacío: sin ventas en la sesión, el listado queda sin filas y se muestra
  `#historial-vacio` (VERIFICADO: el id existe con texto de ejemplo).

### R5-11 · Inmutabilidad — sin edición ni eliminación (HECHO consigna)

Las ventas confirmadas **no se editan ni se eliminan** desde la interfaz.

Escenarios observables:

- Ausencia de controles: `historial.html` no expone botones ni enlaces de
  editar/eliminar ventas, y el código del Ejercicio 5 no escribe sobre
  ventas ya registradas.

### R5-12 · Cierre y código — limpieza, mensajes, DOM seguro y helpers (HECHO consigna)

Confirmar **limpia el formulario** para una nueva venta y muestra **mensaje
de resultado**; funciones nombradas, `textContent` (sin `innerHTML` con
datos) y apertura por `file://` sin dependencias; reutilización de helpers
existentes sin duplicarlos.

Escenarios observables:

- Cierre: tras confirmar, `#form-venta` queda limpio, la venta en curso se
  vacía (renglones y resumen en estado inicial) y `#msg-ok` muestra el
  mensaje de éxito; navegando a `historial.html` la venta recién registrada
  aparece en el listado.
- DOM seguro: opciones, renglones, filas y detalle se construyen con
  `createElement`/`textContent`/`replaceChildren`; un título o nombre con
  marcas HTML (p. ej. `<b>`) se muestra como texto literal.
- Funciones nombradas y helpers: responsabilidades reconocibles (poblar
  selectores, validar/agregar renglón, calcular, confirmar, puente de
  sesión, render de historial/detalle) reutilizando `generarId`,
  `mostrarMensajeOk/Error`, `limpiarMensajes`, `actualizarSelector` y
  `buscarPorId` **sin duplicarlos** (firmas VERIFICADAS en
  `js/app.js`/`js/datos.js`).
- `file://`: las dos páginas abren por doble clic con solo hojas y scripts
  locales.

## 2. Casos límite observables (consigna §6 «Verificación observable»)

| Caso | Resultado exigido |
| --- | --- |
| Venta válida: 2 unidades a 1500 y 1 a 2000 (precios de ejemplo ficticios) | Subtotales `3000.00` y `2000.00`, total `5000.00`; el detalle queda conservado en el historial (R5-04/R5-05/R5-08). |
| Cantidad `0`, negativa o decimal | El renglón no se agrega (o se rechaza el cambio de cantidad) con mensaje (R5-02/R5-06). |
| Sin cliente o sin renglones | La confirmación no registra la venta (R5-07). |
| Mismo libro dos veces | No se crea un segundo renglón para ese libro (R5-03; política D2). |
| Precio histórico: confirmar, cambiar el `precio` del libro en el catálogo y recargar `historial.html` | Precio unitario, subtotales y total conservan los valores confirmados (R5-08). |
| Tras confirmar | Formulario limpio, mensaje de éxito visible y la venta recién registrada visible en `historial.html` (R5-12/R5-10). |

## 3. Modelo de la venta (propuesto sobre estado verificado)

Estado verificado: no existe modelo de ventas en el proyecto (las maquetas de
`ventas.html`/`historial.html` tienen filas de ejemplo estáticas; VERIFICADO
código). Modelo propuesto por venta registrada:

```js
{
    id: "v1",                    // string único — D3 CONFIRMADA: generarId("v", ventas) → v1..vn
    fecha: "19/10/2026 15:30",   // string legible dd/mm/aaaa hh:mm — D3 CONFIRMADA 2026-10-19
                                 // (almacenamiento directo en formato legible; anula la
                                 //  recomendación previa de ISO con presentación en locale)
    clienteId: "c1",             // referencia al cliente existente
    clienteNombre: "Lucía Pérez",// copia descriptiva al confirmar (R5-09)
    renglones: [
        {
            libroId: "l1",             // referencia al libro existente
            titulo: "El principito",   // copia descriptiva al confirmar (R5-09)
            cantidad: 2,               // entero > 0
            precioUnitario: 1500,      // COPIADO del catálogo al confirmar (histórico, R5-08)
            subtotal: 3000             // cantidad × precioUnitario
        }
        // …
    ],
    total: 5000                  // suma de subtotales
}
```

Notas:

- `clienteNombre` y `titulo` hacen a la venta **autosuficiente**: se lee sin
  depender del catálogo/clientes actuales (R5-09). El nombre del cliente se
  copia del array al confirmar.
- `precioUnitario` y `subtotal` se congelan al confirmar (R5-08); el
  historial jamás relee `precio` de `js/datos.js`.
- Importes: los valores se guardan como números; la presentación usa dos
  decimales (SUPUESTO, §13).

## 4. Selectores de la venta (R5-01)

- `#venta-cliente`: una opción por cliente (`value` = `id`, texto =
  `nombre`), poblada al cargar con `actualizarSelector(...)` (helper
  VERIFICADO en `js/app.js`).
- `#venta-libro`: una opción por libro (`value` = `id`, texto = `titulo`),
  mismo mecanismo; incluye libros dados de alta en el Ejercicio 4 porque
  comparten `js/datos.js` (VERIFICADO: fuente única).
- Ambas páginas deben enlazar `js/datos.js` antes que `js/app.js`
  (VERIFICADO: hoy no lo hacen), sin romper el patrón de guardas DD-03.

## 5. Renglones y política de duplicados (R5-02/R5-03/R5-06)

- Composición: «Agregar renglón» (submit de `#form-venta`, VERIFICADO con
  `action="#" method="post"`) procesa libro + cantidad con
  `preventDefault()`; validación en JS como autoridad (patrón DD-08).
- Duplicados: un libro con renglón existente **nunca** genera un segundo
  renglón. **D2 CONFIRMADA (2026-10-19): sumar la cantidad ingresada a la del
  renglón existente**, recalcular subtotal y total, y mostrar mensaje
  informativo (alternativas históricas B «reemplazar cantidad» e C «informar
  sin modificar» en el proposal §Decisiones).
- Edición: los renglones permiten cambiar cantidad (con la misma validación)
  y quitarse; toda mutación re-renderiza `#venta-renglones` y
  `#venta-resumen`, y alterna `#venta-renglones-vacio`.

## 6. Cálculos (R5-04/R5-05)

- Subtotal por renglón = cantidad × precio unitario (precio congelado del
  renglón, no el actual del catálogo).
- Total = suma de subtotales, en `#venta-resumen` (VERIFICADO: el nodo existe
  con texto de ejemplo «Total: 680.50 (ejemplo).» a reemplazar).
- Presentación: `toFixed(2)` (u equivalente) en todos los importes visibles.
- Recálculo ante: agregar/quitar renglón y cambiar cantidad.

## 7. Confirmación y bloqueos (R5-07/R5-08/R5-12)

- Botón «Confirmar venta»: VERIFICADO sin `id` → recibe **`#venta-confirmar`
  (APROBADO)**; `type="button"` (VERIFICADO), se enlaza por evento `click`.
- Condiciones bloqueantes: sin cliente seleccionado, sin renglones o con
  cantidades inválidas → no se registra; errores como texto junto al
  formulario.
- Cierre: registro exitoso → persistir en el puente (§8), limpiar
  `#form-venta` y el estado de la venta en curso, mensaje en `#msg-ok`
  (helpers VERIFICADOS `mostrarMensajeOk`/`limpiarMensajes`).

## 8. Puente `sessionStorage` (R5-10; APROBADO por el usuario)

- **Alcance aprobado:** `sessionStorage` como puente mínimo entre
  `ventas.html` e `historial.html` dentro de la misma pestaña. **`localStorage`
  PROHIBIDO** en este change (exclusivo del Ejercicio 6; anti-confusión
  explícita de la consigna §9).
- **Clave confirmada:** `libreria-ventas` (fijada; historia de «detalle menor
  ajustable en PLAN» resuelta en `design.md` §DD-06).
- **Formato:** JSON del array completo de ventas (modelo §3). Escritura al
  confirmar (reemplaza el valor con el array completo).
- **Lectura defensiva:** `try/catch` sobre `JSON.parse`; clave ausente,
  vacía o inválido → tratar como `[]`, sin errores en consola ni interfaz.
- **Abstracción:** el acceso al storage se concentra en un único punto de
  lectura/escritura (p. ej. `obtenerVentas()` / `guardarVentas(ventas)`) y
  la presentación consume esa abstracción; el Ejercicio 6 podrá añadir o
  reemplazar por `localStorage` cambiando solo esa capa, sin reescribir
  render ni cálculos.

## 9. Historial e inmutabilidad (R5-10/R5-11)

- `historial.html` al cargar: leer el puente, renderizar filas en
  `#historial-listado` (id, fecha legible, cliente, total con dos decimales,
  control de detalle), alternar `#historial-vacio`.
- Detalle: el control de detalle de una venta carga en `#historial-detalle`
  la cabecera (id, fecha, cliente, total) y sus renglones (título, cantidad,
  precio unitario, subtotal) con `textContent`/`createElement`.
- Inmutabilidad: sin controles de edición/eliminación y sin escritura sobre
  ventas registradas; el único escritor del puente es la confirmación de una
  nueva venta.

## 10. DOM seguro y organización del código (R5-12)

- Construcción de opciones, renglones, filas y detalle con `createElement` +
  `textContent` (+ `replaceChildren` para limpiar), patrón ya verificado en
  `js/app.js` (render de listados del Ejercicio 4); sin `innerHTML` con
  datos.
- Reutilización **sin duplicación** de helpers VERIFICADOS:
  `generarId(prefijo, lista)`, `mostrarMensajeOk(texto)`,
  `mostrarMensajeError(texto)`, `limpiarMensajes()`,
  `actualizarSelector(elemento, items, etiqueta)`, `buscarPorId(lista, id)`
  (en `js/datos.js`); `renderizarListadoLibros/Clientes()` y
  `refrescarOpcionesRelacionadas()` quedan intactos para sus páginas.
- Inicialización con el patrón DD-03 VERIFICADO (`DOMContentLoaded` +
  guardas por presencia de formulario/nodos y `typeof` de los arrays) para no
  afectar a las otras páginas.
- Ubicación de la lógica: **D1 CONFIRMADA (2026-10-19): extender
  `js/app.js`** (ya enlazado por las 5 páginas; sin `js/ventas.js`), con
  reutilización de helpers sin duplicación y `js/datos.js` (defer) agregado a
  `ventas.html` e `historial.html`; la organización interna se detalla en
  `design.md` (Fase 2).

## 11. Criterios de aceptación (CA5-01..CA5-05)

- **CA5-01 (Composición y validaciones — 8 pts):** selectores de cliente y
  libro poblados desde datos locales; renglones con libro existente y
  cantidad entera > 0; política de duplicados sin segundo renglón; edición
  de cantidades y quita de renglones antes de confirmar; confirmación
  bloqueada sin cliente/sin renglones/cantidades inválidas con errores en
  texto (cubre R5-01/R5-02/R5-03/R5-06/R5-07).
- **CA5-02 (Cálculos — 5 pts):** subtotal = cantidad × precio unitario y
  total = suma de subtotales, ambos con dos decimales y recalculados ante
  cambios (cubre R5-04/R5-05).
- **CA5-03 (Confirmación e historial inmutable — 7 pts):** la venta
  confirmada registra id, fecha, cliente, renglones y total con precio
  unitario congelado como valor histórico y datos descriptivos
  autosuficientes; el historial (puente `sessionStorage`) muestra listado y
  detalle, y las ventas no se editan ni eliminan (cubre
  R5-08/R5-09/R5-10/R5-11).
- **CA5-04 (Cierre y calidad de código):** confirmar limpia el formulario y
  muestra mensaje de resultado; funciones reconocibles, reutilización de
  helpers y `textContent` sin `innerHTML` con datos (cubre R5-12).
- **CA5-05 (Integridad y compatibilidad):** no se alteran los Ejercicios 1–4
  ni los IDs estables; `localStorage` no se usa (exclusivo del Ej 6); las
  páginas abren por `file://` sin dependencias (cubre R5-12).

Ningún criterio se declara cumplido en esta fase: la verificación es manual
por navegador en la Fase 4.

## 12. Alcance excluido (bloqueado)

- Ejercicio 6: `localStorage` y persistencia entre sesiones del navegador,
  casos manuales de prueba y README final.
- Edición y eliminación de ventas confirmadas.
- Stock, cobros, descuentos, impuestos, facturación fiscal y cálculo de
  vuelto.
- Modificación del catálogo desde la pantalla de venta (no se editan precios
  ni libros allí).
- `fetch` de datos; ABM de editoriales, géneros o autores (datos fijos
  locales).
- Cero librerías, frameworks, preprocesadores, transpiladores, CDNs, fuentes
  externas, servidores, npm, bundlers y base de datos.
- `index.html`, `ejercicio3.html`, `libros.html`, `clientes.html`,
  `js/datos.js` y `css/estilos.css` no se modifican; no se alteran los IDs
  estables de `promptCinco.md` §3 ni la estructura semántica de los
  Ejercicios 1–4.

## 13. Decisiones, supuestos y datos pendientes

### Decisiones

#### Aprobadas antes de este change (documentadas, no se preguntan)

- **Puente `sessionStorage` — APROBADO:** único mecanismo de persistencia de
  este Ejercicio; `localStorage` exclusivo del Ejercicio 6. Detalle en §8.
- **`#venta-confirmar` — APROBADO:** id nuevo para el botón «Confirmar
  venta» (hoy sin id, VERIFICADO); no altera ids existentes.

#### Confirmadas en el checkpoint de SPEC (D1–D3 — CONFIRMADO 2026-10-19)

- **D1 — Archivo de lógica: CONFIRMADA — extender `js/app.js`** (ya enlazado
  por las 5 páginas con guardas DD-03; consistente con la D4 confirmada en el
  Ejercicio 4; sin `js/ventas.js`). Reutilizar los helpers de `app.js` sin
  duplicarlos; agregar `js/datos.js` (`defer`) a `ventas.html` **e
  `historial.html`** (hoy no lo enlazan). Detalle completo en el proposal
  §Decisiones.
- **D2 — Política de duplicados: CONFIRMADA — sumar la cantidad ingresada al
  renglón existente** y recalcular subtotal/total mostrando mensaje
  informativo (§5). Alternativas históricas: reemplazar la cantidad; informar
  el duplicado sin modificar. Detalle en el proposal §Decisiones.
- **D3 — Formato de `id` y `fecha` (menor): CONFIRMADA — `id` incremental
  `v1..vn` vía `generarId("v", ventas)`** (consistente con `ed*`/`c*`/`l*`
  del Ejercicio 4) **y `fecha` almacenada directamente como string legible
  `dd/mm/aaaa hh:mm`** (elección explícita del usuario que **anula** la
  recomendación previa de fecha ISO con presentación en locale; ver §3).
  Alternativa histórica: id numérico como la maqueta y/o fecha ISO.

### Supuestos

- SUPUESTO: «errores cerca del formulario» se cumple con texto explícito
  junto al `<form>` (`#msg-error` o contenedor equivalente), no solo color;
  el éxito se comunica en `#msg-ok`.
- SUPUESTO: «dos decimales» es una regla de presentación; los valores
  almacenados son números y la igualdad «total = suma de subtotales» se
  mantiene en los escenarios de la consigna.
- SUPUESTO: los datos ficticios actuales del catálogo/clientes (incluidos los
  altas del Ejercicio 4) son el contenido válido de los selectores de venta.
- SUPUESTO: el vaciado de la pestaña (cierre o nueva pestaña) vacía el
  historial: comportamiento propio de `sessionStorage` y aceptado dentro del
  alcance mínimo aprobado; la persistencia entre sesiones es del Ejercicio 6.
- SUPUESTO: la inmutabilidad exige ausencia de controles y de escritura en la
  interfaz; la manipulación manual desde DevTools queda fuera de lo exigido.
- SUPUESTO: la clave `libreria-ventas` y los nombres de la abstracción
  (`obtenerVentas`/`guardarVentas`) son detalles fijados en el PLAN
  (`design.md` §DD-06) sin impacto en requisitos observables.

### Datos pendientes

- `DATO_PENDIENTE: la lectura de Docs/Repaso Primer Parcial.pdf (página 5,
  «Ejercicio 5 — Venta simulada e historial») no pudo realizarse en esta
  sesión (formato PDF no soportado por la herramienta de lectura); la SPEC se
  apoya en promptCinco.md, que declara haber contrastado esa página.`
  Disponible el pegado del texto para verificación cruzada.
- D1–D3 confirmadas el 2026-10-19; el delta `venta-historial` y este
  documento reflejan las opciones confirmadas (D2: suma de cantidad; D3: fecha
  legible almacenada directamente).
- Discrepancias registradas (no bloqueantes): (1) `promptCinco.md` §3 declara
  rama `feature/ejercicio-4`/`a5abe82`, pero la rama actual es
  `feature/ejercicio-5` con HEAD `7b3e178` (VERIFICADO git); (2) la spec
  `estructura-html` lista para `#historial-listado` las columnas «id, fecha,
  cliente, total» mientras la maqueta tiene además «Detalle» (VERIFICADO;
  discrepancia preexistente, ajena a este change).

## 14. Hechos verificados vs supuestos vs decisiones

- Hechos (código inspeccionado): contenido exacto de `js/datos.js` (arrays,
  ids, precios, `email`, `l6.generoId: null`, `buscarPorId`); helpers y
  firmas exactas de `js/app.js` (incluidas las guardas DD-03 y el hook
  `refrescarOpcionesRelacionadas` reservado para el Ejercicio 5); ids
  estables y contenido estático de ejemplo de `ventas.html` e
  historial.html (opciones `ana`/`luis`/`jardin`/`manual`, 2 filas de
  renglones, 2 filas de historial, textos de vacío/resumen/detalle/mensajes,
  botón «Confirmar venta» sin `id`, columnas de ambas tablas); **ninguna de
  las dos páginas enlaza hoy `js/datos.js`**; estado git de la rama.
- Hechos (consigna): R5-01..R5-12, CA5-01..CA5-05, casos límite de §2 y el
  alcance excluido de §12, según `promptCinco.md`.
- Decisiones: `sessionStorage` y `#venta-confirmar` APROBADOS por el usuario
  antes de este change; D1–D3 CONFIRMADAS el 2026-10-19 (D1 `js/app.js`, D2
  suma de cantidad en duplicados, D3 `id` `v1..vn` + `fecha` legible
  `dd/mm/aaaa hh:mm` almacenada directamente).
- Supuestos: mensajes en `#msg-error`/`#msg-ok`, dos decimales como
  presentación, datos ficticios válidos, vaciado del puente al cerrar la
  pestaña, alcance de la inmutabilidad y detalles menores de clave/nombres.
- `DATO_PENDIENTE:` PDF ilegible en esta sesión (§13).
- Verificación: ningún CA se declara cumplido; la verificación manual en
  navegador queda para la Fase 4.
