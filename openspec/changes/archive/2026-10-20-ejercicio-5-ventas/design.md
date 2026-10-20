# Design — ejercicio-5-ventas · Fase 2 PLAN (sin código de producto)

Documento de diseño del change `ejercicio-5-ventas` (Ejercicio 5 del TPI).
Explica **cómo** se implementará la venta simulada y el historial para cumplir
la SPEC (`spec.md` + deltas) y **por qué** se eligen esas decisiones. El plan
ejecutable vive en `tasks.md`. Motivación y alcance: `proposal.md`. Esta fase
solo produce documentos; **no** se escribe código de producto hasta la
autorización explícita del checkpoint «PLAN listo».

Convención de marcadores (igual que el resto de los artefactos): `HECHO
(código)`, `HECHO (consigna)`, `APROBADO`, `CONFIRMADO (2026-10-19)`,
`SUPUESTO`, `PLAN` (propuesta de este documento) y `DATO_PENDIENTE:`. Las
referencias «DD-nn (Ejercicio 4» apuntan al design archivado
`openspec/changes/archive/2026-10-19-ejercicio-4-altas/design.md`; los `DD-nn`
sin ese calificativo son las decisiones de **este** documento.

## Context

- **Estado verificado del código** (ver §Contexto verificado del
  `proposal.md`): `js/datos.js` es la fuente única (`clientes` `c1..c3` con
  `email`; `libros` `l1..l6` con `isbn`/`precio`, `l6` con `generoId: null`;
  `buscarPorId(lista, id)`). `js/app.js` contiene los helpers reutilizables
  (`generarId(prefijo, lista)`, `mostrarMensajeOk/Error`, `limpiarMensajes`,
  `actualizarSelector(elemento, items, etiqueta)`, `normalizarIsbn/Email`,
  `validarLibro/Cliente`, `manejarEnvioLibro/Cliente` con `preventDefault()` y
  `formulario.noValidate = true`, `refrescarOpcionesRelacionadas()` — hook
  reservado para los selectores del Ejercicio 5 — y el hook `DOMContentLoaded`
  con guardas `getElementById` + `typeof`, patrón DD-03 (Ejercicio 4)).
  `ventas.html` y `historial.html` son maquetas estáticas del Ejercicio 1:
  enlazan **solo** `js/app.js` con `defer` (**no** enlazan `js/datos.js`,
  HECHO código), tienen opciones y filas de ejemplo escritas en el HTML, y el
  botón «Confirmar venta» es `type="button"` **sin `id`** (HECHO código).
  No existe ningún modelo ni storage de ventas en el proyecto (VERIFICADO:
  `js/` no contiene `sessionStorage` ni `localStorage`).
- **Restricciones duras (HECHO consigna):** HTML5 + CSS existente + JS nativo
  (ES5/ES6 sin transpilar); apertura `file://`; cero librerías, frameworks,
  CDNs, npm, bundlers, servidores y `fetch`; no tocar `index.html`,
  `ejercicio3.html`, `libros.html`, `clientes.html`, `css/estilos.css`,
  `js/datos.js` ni `js/ejercicio3.js`; no alterar IDs estables ni estructura
  semántica; inserción segura (`textContent`/`createElement`/
  `replaceChildren`), prohibido `innerHTML` con datos (R5-12/CA5-04);
  **`localStorage` PROHIBIDO** en este change (APROBADO, exclusivo del
  Ejercicio 6; R5-10/CA5-05).
- **Restricción de arquitectura detectada (HECHO código):** `js/app.js` está
  enlazado por **las cinco páginas** de los Ejercicios 1–4. El código nuevo
  debe inicializarse condicionado a la presencia de los nodos de este change,
  sin asumir que `libros`/`clientes` existen en todas las páginas (mismo
  problema que resolvió el patrón DD-03 (Ejercicio 4)).
- **Sin test runner (HECHO proyecto):** no hay npm ni framework de pruebas.
  La verificación es manual en navegador por `file://`; **no** se inventan
  frameworks ni pruebas automatizadas. TDD estricto no aplica aquí. En el
  Ejercicio 4 la verificación se hizo con Edge headless + CDP sobre Node
  WebSocket nativo (sin Playwright ni instalaciones); se reutiliza ese método
  recomendado en T6.
- **Decisiones cerradas (CONFIRMADO 2026-10-19):** D1 → toda la lógica de
  ventas/historial **extiende `js/app.js`** (sin `js/ventas.js`) reutilizando
  los helpers existentes sin duplicarlos, y **`ventas.html` e
  `historial.html` agregan `<script defer src="js/datos.js">` antes que
  `app.js`** (hoy no lo enlazan); D2 → en un duplicado se **SUMA** la
  cantidad al renglón existente (recálculo + mensaje informativo, nunca un
  segundo renglón); D3 → `id` incremental `v1..vn` vía `generarId("v",
  ventas)` y `fecha` **almacenada directamente como string legible
  `dd/mm/aaaa hh:mm`** (elección del usuario que **anula** la recomendación
  previa de almacenamiento ISO con presentación locale; ver §DD-02 y
  §Risks).
- **Decisiones aprobadas antes del change (documentadas, no se re-abren):**
  puente `sessionStorage` con clave `libreria-ventas` (JSON, lectura
  defensiva, abstracción `obtenerVentas`/`guardarVentas`; `localStorage`
  prohibido) y el id nuevo `#venta-confirmar` en el botón «Confirmar venta»
  (el `type="button"` se conserva; ningún id existente se toca).

## Goals / Non-Goals

**Goals**

- Definir la arquitectura de la venta en curso (estado en memoria,
  composición de renglones, política de duplicados D2) y su render seguro en
  `#venta-renglones`/`#venta-resumen` (R5-02..R5-06).
- Fijar el modelo de la venta registrada (id/fecha D3, precio unitario
  congelado, datos descriptivos autosuficientes) y el flujo de confirmación
  con sus bloqueos (R5-07..R5-09).
- Diseñar el puente `sessionStorage` con una abstracción reemplazable por
  `localStorage` en el Ejercicio 6, sin reescribir presentación (R5-10).
- Definir el historial inmutable con listado y detalle leídos **solo** de la
  venta guardada (R5-10/R5-11).
- Mantener intactos los Ejercicios 1–4, los IDs estables y la apertura
  `file://` (R5-12/CA5-05), con cambios de HTML mínimos y acotados.

**Non-Goals**

- `localStorage` y persistencia entre sesiones (Ejercicio 6); README y casos
  manuales del Ejercicio 6.
- Edición/eliminación de ventas confirmadas; stock, descuentos, impuestos,
  facturación y vuelto.
- Modificación del catálogo desde la pantalla de venta; `fetch`; ABM de
  editoriales/géneros/autores.
- Cambios en `css/estilos.css`, `index.html`, `ejercicio3.html`,
  `libros.html`, `clientes.html`, `js/datos.js`, `js/ejercicio3.js` ni en los
  IDs estables.
- Tests automatizados o dependencias de desarrollo (no hay runner).

## Decisions

### DD-01 — Arquitectura: lógica en `js/app.js` con guardas por página (D1 CONFIRMADA)

**Decisión (PLAN):** toda la lógica de ventas e historial se agrega a
`js/app.js` (D1, CONFIRMADA 2026-10-19); no se crea `js/ventas.js`. La
inicialización se gatea con el patrón DD-03 (Ejercicio 4), extendiendo el
hook `DOMContentLoaded` existente:

```js
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("form-libro") && typeof libros !== "undefined") {
        inicializarLibros();
    }
    if (document.getElementById("form-cliente") && typeof clientes !== "undefined") {
        inicializarClientes();
    }
    if (document.getElementById("form-venta") && typeof libros !== "undefined"
            && typeof clientes !== "undefined") {
        inicializarVentas();
    }
    if (document.getElementById("historial-listado")) {
        inicializarHistorial();
    }
});
```

- `inicializarVentas()` solo existe operativa en `ventas.html` (guarda:
  `#form-venta` + arrays); `inicializarHistorial()` solo en `historial.html`
  (guarda: `#historial-listado`; **no** lee arrays: la venta es autosuficiente
  por R5-09). Cada grupo de `tasks.md` registra su rama/guarda cuando
  implementa su parte (T1 → ventas; T5 → historial), de modo que cada etapa
  quede verificable sin errores de consola intermedios.
- Orden de carga (D1): `ventas.html` e `historial.html` agregan
  `<script src="js/datos.js" defer></script>` **antes** de
  `<script src="js/app.js" defer></script>` (VERIFICADO: hoy no lo enlazan).
  Con `defer`, los scripts corren en orden de documento y antes de
  `DOMContentLoaded`: los arrays existen cuando `app.js` los consume, sin
  `fetch` ni esperas. `historial.html` lo enlaza por coherencia del contrato
  de carga compartido (aunque su init no dependa de los arrays).

**Motivo (D1/CA5-04/CA5-05):** `app.js` ya está enlazado por las cinco
páginas con guardas verificadas, es consistente con la D4 confirmada en el
Ejercicio 4 (la lógica de altas vive en `app.js`), evita un archivo nuevo y
permite reutilizar `generarId`, `mostrarMensajeOk/Error`, `limpiarMensajes`,
`actualizarSelector`, `normalizarIsbn/Email` y `buscarPorId` **sin
duplicarlos** (R5-12).

**Alternativas consideradas:** (a) crear `js/ventas.js` cargado solo por las
dos páginas — **descartada** por D1 (archivo adicional sin necesidad y
contraria a la elección uniforme del usuario); (b) re-declarar helpers en un
módulo propio — **descartada** por R5-12 (duplicación prohibida).

### DD-02 — Modelo de la venta: `id` `v1..vn`, `fecha` legible almacenada directamente, precio congelado

**Decisión (PLAN):** modelo de cada venta registrada (SPEC §3):

```js
{
    id: "v1",                     // generarId("v", listaVentas) → v1, v2, … (D3)
    fecha: "19/10/2026 15:30",    // dd/mm/aaaa hh:mm — D3 CONFIRMADA 2026-10-19
    clienteId: "c1",
    clienteNombre: "Lucía Pérez", // copia descriptiva al confirmar (R5-09)
    renglones: [
        { libroId: "l1", titulo: "El principito", cantidad: 2,
          precioUnitario: 1500, subtotal: 3000 }
    ],
    total: 5000                   // suma de subtotales (redondeada, §DD-04)
}
```

- **`id` (D3):** se genera con el helper existente
  `generarId("v", listaVentas)` → `v1`, `v2`, … La **lista de referencia es
  la que devuelve `obtenerVentas()`** (el puente), no un array vacío en
  memoria: así no se reutiliza `v1` tras recargar `ventas.html` con ventas ya
  confirmadas en la sesión (patrón `ed*`/`c*`/`l*` del Ejercicio 4).
- **`fecha` (D3, resolución del usuario):** se **almacena directamente** como
  string legible `dd/mm/aaaa hh:mm` (p. ej. `19/10/2026 15:30`), generado por
  el helper nuevo `formatearFechaActual()` (`String(...).padStart(2, "0")` en
  día, mes, hora y minutos sobre `new Date()`). **Esto anula la recomendación
  previa de este documento** de guardar ISO 8601 y formatear solo al mostrar;
  el usuario eligió el formato legible para el valor guardado. Consecuencias:
  listado y detalle muestran la fecha **tal cual, sin transformación**, y el
  orden del historial es el orden de inserción del array (no un orden
  lexicográfico de fechas). Ver §Risks.
- **`precioUnitario` congelado (R5-08):** se **copia** del catálogo
  (`buscarPorId(libros, libroId).precio`) **al agregar el renglón** y viaja
  sin cambios a la venta confirmada; el subtotal del renglón nace de ese
  valor. En este change la coincidencia con «copiado al confirmar» es
  estricta porque la pantalla de venta no permite modificar el catálogo
  (excluido por alcance): dentro de la misma carga de página el precio no
  puede cambiar. El historial **jamás** relee `precio` de `js/datos.js`
  (§DD-07).
- **Datos descriptivos (R5-09):** `titulo` (por renglón) y `clienteNombre`
  (por venta) se copian al componer/confirmar; la venta se lee sin buscar en
  los arrays actuales.

**Motivo (R5-08/R5-09/CA5-03):** la consigna exige precio histórico y
autosuficiencia del registro; `id` con `generarId` es consistente con el
proyecto y resuelve colisiones.

**Alternativas consideradas:** (a) `fecha` ISO + formato al mostrar —
**descartada por elección explícita del usuario** (D3, 2026-10-19); (b) id
numérico `1`, `2` como la maqueta — descartada (colisiona con el patrón de
prefijos y no escala con `generarId`); (c) re-leer precio del catálogo al
ver el detalle — **descartada** (incumple R5-08; el caso guiado de precio
histórico la detectaría).

### DD-03 — Estado de la venta en curso y composición de renglones (D2 CONFIRMADA)

**Decisión (PLAN):** la venta en curso vive **solo en memoria**, en un array
único declarado/inicializado en `inicializarVentas()`:

```js
let renglonesVentaActual = [];   // [{ libroId, titulo, cantidad, precioUnitario, subtotal }]
```

El DOM nunca es la fuente de verdad: toda mutación del array se sigue con un
re-render (`renderizarRenglones()` + `recalcularResumen()`). Funciones:

| Función | Responsabilidad |
| --- | --- |
| `inicializarVentas()` | Guarda de página (DD-01): estado `[]`, poblar selectores, limpiar mensajes de ejemplo, `form.noValidate = true`, registrar `submit` de `#form-venta` y `click` de `#venta-confirmar`, render inicial. |
| `poblarSelectorVentaCliente()` | `actualizarSelector(#venta-cliente, clientes, c => c.nombre)` (`value` = `id`). |
| `poblarSelectorVentaLibro()` | `actualizarSelector(#venta-libro, libros, l => l.titulo)` (`value` = `id`). |
| `agregarRenglon(evento)` | `preventDefault()`; lee `#venta-libro` y `#venta-cantidad`; valida libro existente (`buscarPorId`) y cantidad entera `> 0`; aplica la política de duplicados (abajo); empuja el renglón con `precioUnitario` copiado; re-render + resumen. |
| `actualizarCantidadRenglon(libroId, texto)` | Misma validación sobre el input de cantidad de la fila; válida → actualiza cantidad/subtotal/total; inválida → mensaje y **conserva el valor anterior** (re-render lo restaura). |
| `quitarRenglon(libroId)` | Filtra el renglón; re-render + resumen; si queda vacío, `#venta-renglones-vacio` visible y resumen `0.00`. |
| `renderizarRenglones()` | Limpia el `<tbody>` de `#venta-renglones` con `replaceChildren()`, crea una `<tr>` por renglón (título, `<input type="number">` de cantidad con el `libroId`, precio unitario y subtotal formateados), alterna `#venta-renglones-vacio`; construye todo con `createElement`/`textContent`. |
| `recalcularResumen()` | Ver §DD-04. |

**Política de duplicados (D2 CONFIRMADA 2026-10-19):** si `agregarRenglon`
detecta que el libro ya tiene renglón (búsqueda por `libroId` en
`renglonesVentaActual`):

1. **no se crea un segundo renglón** — se **suma** la cantidad ingresada a la
   del renglón existente;
2. se recalcula el subtotal **de ese renglón** y el total
   (`recalcularResumen`);
3. se muestra mensaje informativo de éxito (p. ej. «Libro ya presente:
   cantidad actualizada a N.») con `mostrarMensajeOk`, junto al formulario.

La misma entrada produce siempre el mismo resultado observable (política única).

**Validación de cantidad (R5-02/R5-06, JS como autoridad — patrón DD-08
(Ejercicio 4)):** `const n = Number(texto)`; se acepta solo si el texto no
está vacío, `Number.isFinite(n)`, `Number.isInteger(n)` y `n > 0`. Vacío,
`0`, negativo y decimal (`1,5`/`1.5`) → rechazo con `mostrarMensajeError` y
sin mutación. Los atributos nativos `min="1" required` de `#venta-cantidad`
(VERIFICADOS, sin `step`) quedan como documentación; `#form-venta` usa
`noValidate = true` para que el `submit` de «Agregar renglón» llegue siempre
a JS (si no, el navegador bloquea el envío con su globo nativo y R5-02/R5-07
no podrían mostrar texto propio).

**Motivo (R5-02/R5-03/R5-06/R5-07):** un único estado en memoria deriva
tablero, resumen y confirmación sin divergencias DOM↔datos; la política D2
suma es determinista y conserva el aporte del usuario (historial de la
decisión en `proposal.md` §Decisiones).

**Alternativas consideradas (D2):** reemplazar la cantidad (descartada:
pierde lo ya cargado) o solo informar el duplicado (descartada: obliga a
editar a mano); ambas registradas como historia en el proposal.

### DD-04 — Importes: redondeo a 2 decimales y formateo uniforme (R5-04/R5-05)

**Decisión (PLAN):** dos helpers pequeños en `js/app.js`, usados por
renglones, resumen e historial:

```js
function redondear2(numero) {
    return Math.round(numero * 100) / 100;
}
function formatearImporte(numero) {
    return redondear2(numero).toFixed(2);
}
```

- `subtotal = redondear2(cantidad * precioUnitario)`; `total =
  redondear2(suma de subtotales)`.
- `recalcularResumen()` recalcula el total desde `renglonesVentaActual` y lo
  escribe en `#venta-resumen` con `formatearImporte` (p. ej. `Total:
  5000.00.`); sin renglones muestra el estado vacío (`Total: 0.00.`).
- **Todo importe visible** (precio unitario, subtotal, total, totales del
  historial) pasa por `formatearImporte` → exactamente 2 decimales
  (`3000.00`, `2000.00`, `5000.00`, `15999.00`) — R5-04/R5-05.
- Se recalcula ante **cualquier** mutación: agregar renglón, duplicado D2,
  editar cantidad, quitar renglón (R5-05/R5-06).
- Los valores **almacenados** en la venta son números (redondeados con
  `redondear2`); los dos decimales son la regla de presentación (SUPUESTO
  §13 de la SPEC).

**Motivo (R5-04/R5-05/CA5-02):** `Math.round(n * 100) / 100` antes de
`toFixed(2)` absorbe los artefactos binarios de coma flotante (p. ej.
`1.005 * 100 = 100.4999…`), y un único helper evita que una pantalla muestre
`5000` y otra `5000.00`.

**Alternativas consideradas:** (a) `toFixed(2)` suelto en cada render —
descartada (duplicación y valores no redondeados guardados); (b) librería de
dinero — descartada (prohibido por alcance; los escenarios de la consigna
usan valores enteros cuya igualdad `total = Σ subtotales` se conserva tras
redondear).

### DD-05 — Flujo de confirmación: validación acumulada, registro y cierre (R5-07..R5-09/R5-12)

**Decisión (PLAN):** el botón `#venta-confirmar` (APROBADO; `type="button"`
conservado, se enlaza por `click`) dispara:

1. **`validarVentaActual()`** → `{ valido, errores }` acumulando **todos**
   los bloqueos de R5-07 en español:
   - sin cliente seleccionado (`#venta-cliente` con `value` vacío o cliente
     inexistente en `clientes`);
   - sin renglones (`renglonesVentaActual.length === 0`);
   - cantidades inválidas en algún renglón (comprobación de defensa con la
     misma regla de §DD-03; un renglón inválido jamás llega al array, pero
     la rama existe y es verificable).
2. Si **no** es válido: `mostrarMensajeError` con todos los errores unidos en
   una sola línea de texto (p. ej. «Revisá: seleccione un cliente; agregue al
   menos un renglón.») — **texto cerca del formulario** (`#msg-error` existe
   en la sección, VERIFICADO; mismo criterio que R4-08) — y **no** se muta ni
   el puente ni el estado.
3. Si es válido:
   - `const listaVentas = obtenerVentas();` (§DD-06 — lectura del puente);
   - construir la venta (§DD-02): `id = generarId("v", listaVentas)`,
     `fecha = formatearFechaActual()`, `clienteId`/`clienteNombre` con
     `buscarPorId(clientes, ...)`, **copia** de los renglones (`map` a
     objetos nuevos — `libroId`, `titulo`, `cantidad`, `precioUnitario`,
     `subtotal`) y `total = redondear2(suma)`;
   - `listaVentas.push(venta); guardarVentas(listaVentas);`
     (append read-modify-write: el array vive en memoria durante la
     operación y se persiste completo);
   - `limpiarMensajes()` + `mostrarMensajeOk` con id y total
     (p. ej. «Venta registrada: v1 — total 5000.00.»);
   - **`resetearFormularioVenta()`**: `#form-venta.reset()` (vuelve
     `#venta-cantidad` a `value="1"`), `renglonesVentaActual = []`,
     `renderizarRenglones()` (estado vacío + `#venta-renglones-vacio`),
     `recalcularResumen()` (`0.00`) — pantalla lista para una nueva venta
     (R5-12).
4. **Nunca** recarga ni navega la página.

`#form-venta` queda con `noValidate = true` desde `inicializarVentas()`
(patrón DD-08 (Ejercicio 4)); el botón de confirmar, siendo `type="button"`
(VERIFICADO), nunca estuvo sujeto a validación nativa — el `noValidate` es
para que «Agregar renglón» (submit) llegue a JS.

**Motivo (R5-07/R5-08/R5-12/CA5-01/CA5-04):** acumular errores informa todo
lo fallido en un solo intento sin mutaciones; el cierre con reset + mensaje
deja la pantalla verificable y reutilizable.

**Alternativas consideradas:** mostrar el primer error y cortar — descartada
(menos clara, más reintentos); registrar aunque falte el cliente con
«Genérico» — descartada (incumple R5-07).

### DD-06 — Puente `sessionStorage` con abstracción reemplazable (APROBADO; R5-10)

**Decisión (PLAN):** acceso al storage concentrado en dos funciones de
`js/app.js`, únicas que tocan el puente:

```js
const CLAVE_VENTAS = "libreria-ventas";

function obtenerVentas() {
    try {
        const crudo = sessionStorage.getItem(CLAVE_VENTAS);
        if (!crudo) { return []; }
        const lista = JSON.parse(crudo);
        return Array.isArray(lista) ? lista : [];
    } catch (error) {
        return [];          // clave ausente, vacía o JSON inválido → []
    }
}

function guardarVentas(lista) {
    try {
        sessionStorage.setItem(CLAVE_VENTAS, JSON.stringify(lista));
    } catch (error) {
        mostrarMensajeError("No se pudo guardar la venta en la sesión.");
    }
}
```

- **Clave:** `libreria-ventas` (APROBADO; fijada en este PLAN). **Formato:**
  JSON del array completo de ventas (modelo §DD-02); la escritura reemplaza
  el valor con el array completo (append lógico en memoria + escritura
  total).
- **Lectura defensiva:** `try/catch` + `Array.isArray`; clave ausente,
  vacía o JSON inválido → `[]`, sin errores en consola ni interfaz
  (escenario «Lectura defensiva» de la SPEC).
- **Consumidores:** la confirmación escribe **solo** vía `guardarVentas`;
  `historial.html` (y `generarId` en la confirmación) leen **solo** vía
  `obtenerVentas`. Ningún render toca `sessionStorage` directamente.
- **`localStorage` PROHIBIDO** en todo el change (APROBADO/CA5-05): la
  verificación T6 incluye `rg "localStorage" js/` sin coincidencias. El
  Ejercicio 6 cambiará **solo el cuerpo** de `obtenerVentas`/`guardarVentas`
  (o añadirá su capa), sin tocar presentación ni cálculos.

**Motivo (R5-10/CA5-03):** la abstracción es literalmente el contrato que el
Ejercicio 6 necesita para sustituir el storage sin reescribir la
presentación; `sessionStorage` es el puente mínimo aprobado entre las dos
páginas en la misma pestaña.

**Alternativas consideradas:** (a) `localStorage` directo — prohibido
(alcance); (b) leer/escribir `sessionStorage` disperso en render y
confirmación — descartada (rompe el reemplazo del Ej 6 y multiplica
`try/catch`); (c) par `clave+formato` distinto (`libreria:ventas`, JSON
envuelto) — innecesario (APROBADO `libreria-ventas`).

### DD-07 — Historial: listado, detalle e inmutabilidad con valores históricos (R5-10/R5-11)

**Decisión (PLAN):**

- **`inicializarHistorial()`** (guarda `#historial-listado`, DD-01):
  `limpiarMensajes()` (oculta los textos de ejemplo), registra los handlers
  de detalle y llama `renderizarHistorial(obtenerVentas())`.
- **`renderizarHistorial(ventas)`** limpia el `<tbody>` de
  `#historial-listado` con `replaceChildren()` y crea una `<tr>` por venta:
  `id`, `fecha` (**tal cual la guardada** — ya es legible por D3, sin
  transformar), `clienteNombre`, `total` con `formatearImporte`, y una celda
  «Detalle» con un `<a href="#historial-detalle">` «Ver detalle de la venta
  N» (mismo patrón de la maqueta, VERIFICADO) cuyo `click` hace
  `event.preventDefault()` y llama `verDetalleVenta(id)`. Si `ventas` está
  vacío: filas `0` y visible `#historial-vacio` (texto sin «(ejemplo)»).
- **`verDetalleVenta(id)`** busca la venta **solo** en la lista leída del
  puente y renderiza en `#historial-detalle` la cabecera (`id`, `fecha`,
  cliente, total) y, por cada renglón, `titulo`, `cantidad`,
  `precioUnitario` y `subtotal` (importes con `formatearImporte`), todo con
  `createElement`/`textContent`. **No** llama `buscarPorId(libros, …)` ni
  lee precios del catálogo: los importes salen **únicamente** de la venta
  guardada (R5-08/R5-09).
- **Inmutabilidad (R5-11):** no hay botones/enlaces de editar o eliminar; el
  único escritor del puente es `confirmarVenta` (DD-05). `verDetalleVenta`
  solo lee.

**Motivo (R5-08/R5-10/R5-11/CA5-03):** el caso guiado de la consigna
(confirmar → cambiar el precio en el catálogo → recargar el historial →
importes conservados) pasa **solo** si el detalle se dibuja desde la venta
guardada; la inmutabilidad se garantiza por ausencia de controles y de
código escritor.

**Alternativas consideradas:** resolver título/precio con
`buscarPorId(libros, libroId)` al pintar el detalle — **descartada**
(incumple R5-08: el detalle cambiaría si cambia el catálogo, que es
exactamente lo que el caso guiado detecta).

### DD-08 — Cambios mínimos de HTML (delta `datos-catalogo-filtro`/`estructura-html`)

**Decisión (PLAN):**

- **`ventas.html`:**
  1. agregar `<script src="js/datos.js" defer></script>` antes de
     `js/app.js` (D1);
  2. retirar las 4 opciones estáticas de los `<select>` (`value="ana"`,
     `value="luis"`, `value="jardin"`, `value="manual"`), dejándolos vacíos
     para `poblarSelectorVenta*`;
  3. retirar las 2 filas estáticas del `<tbody>` de `#venta-renglones`
     (queda vacío para `renderizarRenglones`);
  4. agregar `id="venta-confirmar"` al botón «Confirmar venta» (APROBADO; su
     `type="button"` se conserva);
  5. los textos de ejemplo de `#venta-renglones-vacio`, `#venta-resumen`,
     `#msg-ok` y `#msg-error` pasan a **estado inicial controlado por JS**
     al inicializar (ocultados/limpiados o reemplazados por su texto base,
     mismo criterio que el Ejercicio 4).
- **`historial.html`:**
  1. agregar `<script src="js/datos.js" defer></script>` antes de
     `js/app.js` (D1);
  2. retirar las 2 filas estáticas del `<tbody>` de `#historial-listado`;
  3. el contenido de ejemplo de `#historial-detalle` y los textos de
     `#historial-vacio`, `#msg-ok`, `#msg-error` pasan a estado inicial
     controlado por JS.
- **Sin otros cambios:** se conservan `fieldset`, `legend`, `caption`,
  columnas de ambas tablas, `label`, `nav`, `header`/`main`/`footer` y
  **todos** los IDs estables (`#titulo-ventas`, `#form-venta`,
  `#venta-cliente`, `#venta-libro`, `#venta-cantidad`, `#venta-renglones`,
  `#venta-renglones-vacio`, `#titulo-resumen`, `#venta-resumen`,
  `#titulo-historial`, `#historial-listado`, `#historial-vacio`,
  `#titulo-detalle`, `#historial-detalle`, `#msg-ok`, `#msg-error`).
- **No se tocan:** `index.html`, `ejercicio3.html`, `libros.html`,
  `clientes.html`, `css/estilos.css`, `js/datos.js`, `js/ejercicio3.js`.

**Motivo (CA5-05; deltas MODIFIED):** los deltas permiten reemplazar
contenido estático de ejemplo y agregar scripts locales en estas dos páginas
sin remover ni renombrar IDs; el `#venta-confirmar` es un id nuevo; el
cambio estructural se mantiene al mínimo para no alterar la maqueta ni el
CSS.

**Alternativa considerada:** agregar `novalidate` o cambios de estructura en
el HTML — descartada por mantener la autoridad en JS y el diff mínimo (la
decisión vive en `app.js`, §DD-03/DD-05).

## Data flow

**Carga de `ventas.html`:** `datos.js` → `app.js` (ambos `defer`) →
`DOMContentLoaded` → guarda `#form-venta` → `inicializarVentas()` →
`renglonesVentaActual = []` → `poblarSelectorVentaCliente`/
`poblarSelectorVentaLibro` (vía `actualizarSelector`) → render inicial
(`#venta-renglones-vacio` visible, `recalcularResumen()` → `0.00`) →
`limpiarMensajes()` (oculta textos «(ejemplo)») → `form.noValidate = true` →
registro de `submit` (`agregarRenglon`) y `click` (`#venta-confirmar`).

**Agregar renglón:** `submit` de `#form-venta` → `preventDefault()` →
`agregarRenglon` → valida libro (`buscarPorId`) + cantidad entera `> 0` →
¿falla?: `mostrarMensajeError`, sin mutar → ¿libro ya presente? (D2): suma
cantidad + recálculo subtotal/total + `mostrarMensajeOk` informativo →
si no: `push` con `precioUnitario` copiado → `renderizarRenglones()` +
`recalcularResumen()`.

**Editar cantidad / quitar renglón:** `change` en el input de la fila →
`actualizarCantidadRenglon` (inválida → mensaje + conserva valor anterior;
válida → actualiza y recalcula) · `click` en quitar → `quitarRenglon` →
filter → render (último renglón → `#venta-renglones-vacio` + `0.00`).

**Confirmar:** `click` `#venta-confirmar` → `validarVentaActual()` →
inválida: `mostrarMensajeError` (texto junto al form), sin registro →
válida: `obtenerVentas()` → construir venta (`generarId("v", …)`,
`formatearFechaActual()`, copia de cliente/renglones, `total`) → `push` →
`guardarVentas(lista)` → `mostrarMensajeOk` → `resetearFormularioVenta()`.

**Carga de `historial.html`:** `datos.js` → `app.js` (`defer`) →
`DOMContentLoaded` → guarda `#historial-listado` →
`inicializarHistorial()` → `limpiarMensajes()` →
`renderizarHistorial(obtenerVentas())` (filas o `#historial-vacio`) →
handlers de detalle registrados.

**Ver detalle:** `click` enlace → `preventDefault()` →
`verDetalleVenta(id)` → render cabecera + renglones en
`#historial-detalle` **desde la venta guardada**.

**Correspondencia de casos límite con funciones (consigna §6 / SPEC §2):**

| Caso observable | Función / comportamiento |
| --- | --- |
| Venta válida `2 × 1500` + `1 × 2000` → `3000.00` / `2000.00` / `5000.00` (precios de ejemplo ficticios) | `agregarRenglon` ×2 → subtotales con `formatearImporte`; `recalcularResumen` → `5000.00`; al confirmar, `verDetalleVenta` conserva esos importes (R5-04/R5-05/R5-08). |
| Cantidad `0`, negativa o decimal | `agregarRenglon`/`actualizarCantidadRenglon` → `mostrarMensajeError`, sin mutación (R5-02/R5-06). |
| Sin cliente / sin renglones | `validarVentaActual` acumula → `mostrarMensajeError`, la venta **no** se registra (R5-07). |
| Mismo libro dos veces | rama D2 de `agregarRenglon` → suma + recálculo + mensaje, **un solo renglón** (R5-03). |
| Precio histórico: confirmar → cambiar `precio` en `js/datos.js` (copia de prueba) → recargar `historial.html` | el historial lee solo la venta guardada (`renderizarHistorial`/`verDetalleVenta`) → importes conservados (R5-08). |
| Tras confirmar | `resetearFormularioVenta` (form limpio, renglones/resumen en 0) + `mostrarMensajeOk`; la venta aparece en `historial.html` vía `obtenerVentas` (R5-12/R5-10). |
| Texto con marcas HTML (`<b>`) en título o nombre | todo el render usa `textContent` → se muestra literal (R5-12). |
| `sessionStorage` ausente/inválido o pestaña nueva | `obtenerVentas` → `[]` sin errores; `#historial-vacio` visible (R5-10). |
| `localStorage` ausente | no hay llamadas en el código (T6 verifica con `rg`) (CA5-05). |

## Risks / Trade-offs

- **[`sessionStorage` se vacía al cerrar la pestaña o abrir otra] →
  Aceptado y documentado:** es el comportamiento natural del puente
  aprobado para este change; la verificación T6 usa **una sola pestaña**
  (ventas → historial por el `nav`). La persistencia entre sesiones es
  exclusiva del Ejercicio 6 (`localStorage`).
- **[`fecha` legible no es ordenable ni parseable lexicográficamente] →
  Trade-off asumido por elección del usuario (D3, 2026-10-19):** el orden
  del historial es el orden de inserción del array (append en cada
  confirmación), suficiente para este exercise; si el Ejercicio 6 necesita
  orden cronológico estricto, podrá derivarse del array o añadir un campo
  ISO adicional **sin** cambiar la presentación (fuera de alcance aquí).
  Se documenta que la recomendación inicial de almacenar ISO fue anulada.
- **[Artefactos de coma flotante en importes] → Mitigación:** `redondear2`
  antes de `toFixed(2)` y un único `formatearImporte` (DD-04); los
  escenarios de la consigna usan valores enteros cuya igualdad
  `total = Σ subtotales` se conserva; T6 verifica `3000.00`/`2000.00`/
  `5000.00`.
- **[`js/app.js` compartido por cinco páginas] → Mitigación:** guardas
  `DOMContentLoaded` + existencia de nodo + `typeof` (DD-01, patrón DD-03
  (Ejercicio 4)); T6 confirma que `index.html`, `ejercicio3.html`,
  `libros.html` y `clientes.html` abren sin errores de consola.
- **[Validación nativa bloquearía el `submit` de «Agregar renglón» y
  ocultaría los mensajes JS] → Mitigación:** `#form-venta.noValidate = true`
  en `inicializarVentas` (patrón DD-08 (Ejercicio 4)); los atributos
  `min`/`required` quedan como documentación (DD-03/DD-05).
- **[Los altas del Ejercicio 4 no aparecen en los selectores de venta tras
  navegar: `js/datos.js` se re-evalúa en cada carga de página y no existe
  puente de catálogo (solo de ventas)] → Mitigación acotada:** los
  selectores se pueblan **siempre** desde los arrays vigentes de la página
  (semilla `c1..c3`/`l1..l6` + cualquier alta hecho en la misma carga), sin
  opciones a mano, lo que cumple R5-01 observable; un puente de catálogo
  entre páginas estaría fuera del alcance aprobado (es alcance del Ejercicio
  6 / un delta nuevo). Se registra como observación para el checkpoint (ver
  §Open Questions).
- **[Divergencia DOM ↔ estado] → Mitigación:** `renglonesVentaActual` es la
  única fuente de verdad; cada mutación re-renderiza renglones y resumen; el
  input de cantidad de la fila solo escribe al `change` validado
  (DD-03).
- **[Sin test runner: cierres no automatizables] → Mitigación:** cada tarea
  define una comprobación observable en navegador por `file://`; el método
  recomendado es el del Ejercicio 4 (Edge headless + CDP sobre Node
  WebSocket nativo, sin Playwright ni instalaciones) o DevTools manual; el
  registro pasa/falla se asienta en `tasks.md`; no se marca un checkbox sin
  control ejecutado. TDD estricto no aplica.
- **[Inyección de HTML con títulos/nombres] → Mitigación:** todo el render
  usa `createElement`/`textContent`/`replaceChildren`; `innerHTML` con datos
  prohibido (T6 inspecciona); caso `<b>` en la checklist.
- **[`localStorage` introducido por error] → Mitigación:** prohibición
  explícita en este documento y verificación con `rg "localStorage" js/` sin
  coincidencias en T6.
- **[`DATO_PENDIENTE:` PDF de la consigna ilegible en la sesión de SPEC] →
  Aceptado:** los requisitos se tomaron de `promptCinco.md`, que declara
  haber contrastado la página 5; no bloquea el PLAN.

## Migration Plan

El cambio es **aditivo sobre estado en memoria + `sessionStorage`**; no hay
migración de datos ni de esquema, ni despliegue. Detalle ejecutable en
`tasks.md`; orden de ejecución:

1. **T1** — HTML base: `datos.js` (`defer`) en ambas páginas, opciones
   estáticas fuera, `#venta-confirmar`; `inicializarVentas` con guarda +
   selectores poblados.
2. **T3** — Helpers de importes (`redondear2`/`formatearImporte`) y
   `recalcularResumen`/`#venta-resumen` (se ejecuta **antes** de T2 porque el
   render de renglones consume esos helpers; su observación con renglones se
   completa en T2/T6 — mismo criterio de infraestructura previa que en el
   Ejercicio 4 con 5.1–5.2 antes de T3/T4).
3. **T2** — Composición: `renderizarRenglones` (+ quita de filas estáticas),
   `agregarRenglon` con validación y política D2, edición de cantidad, quita
   de renglones.
4. **T4** — Confirmación: `validarVentaActual`, construcción de la venta
   (id/fecha/precio congelado/datos descriptivos), puente
   `obtenerVentas`/`guardarVentas`, mensaje y reset.
5. **T5** — Historial: quita de filas estáticas, `inicializarHistorial`,
   `renderizarHistorial`, `verDetalleVenta`, inmutabilidad.
6. **T6** — Verificación manual integral por `file://` (checklist de casos
   límite + caso guiado de precio histórico + integridad Ejercicios 1–4/IDs/
   ausencia de `localStorage`), registrando pasa/falla.

**Rollback:** al no haber migraciones, revertir es `git checkout -- <archivo>`
sobre `js/app.js`, `ventas.html` e `historial.html` (única superficie de
producto de este change). `index.html`, `ejercicio3.html`, `libros.html`,
`clientes.html`, `css/estilos.css`, `js/datos.js` y `js/ejercicio3.js` no se
tocan y no requieren rollback. Esta fase de PLAN no modifica producto.

## Open Questions

- Ninguna incógnita que cambie la SPEC, el enfoque o el desglose de tareas:
  D1–D3 quedaron cerradas el 2026-10-19 (incluida la resolución de D3 con
  `fecha` legible almacenada directamente, que anula la recomendación ISO
  previa) y el puente `sessionStorage`/`#venta-confirmar` ya estaban
  aprobados.
- **Observación para el checkpoint (RESUELTO):** los selectores de venta (`#venta-cliente` / `#venta-libro`)
  se pueblan **únicamente desde `datos.js` (semilla del catálogo/cliente)** en el alcance de Ejercicio 5; la
  persistencia/runtime de nuevos libros/altas entre páginas es alcance de Ejercicio 6. R5-01 se cumple con
  opciones generadas desde los datos locales de la página sin opciones escritas a mano.
- Persiste como `DATO_PENDIENTE:` no bloqueante la lectura directa del PDF de
  la consigna (ver `proposal.md` §Información pendiente); la SPEC se apoya en
  `promptCinco.md`.
