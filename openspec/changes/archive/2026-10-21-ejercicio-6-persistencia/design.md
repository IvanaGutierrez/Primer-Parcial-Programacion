# Design — ejercicio-6-persistencia

Fase 2 — PLAN. Explica CÓMO implementar; el QUÉ y el POR QUÉ están en
`proposal.md`, los requisitos en `spec.md` y los deltas de `specs/`. Sin
código de producto en esta fase.

## Context

- Estado actual (VERIFICADO en `main@a849663`): única capa de persistencia =
  puente `sessionStorage` en `obtenerVentas()`/`guardarVentas(lista)`
  (`js/app.js:468–489`, `CLAVE_VENTAS = "libreria-ventas"`, `try/catch` ya
  probado). **Cero usos de `localStorage`** en el proyecto. Los catálogos
  viven en arrays `const` de `js/datos.js` (fuente de semilla: `libros`
  l1–l6, `clientes` c1–c3) y el código de vistas opera sobre ellos en
  runtime.
- Constraint duro (resuelto, propuesto y aprobado): los 5 `.html` no se
  tocan → no puede agregarse ningún `<script>` → **la capa de persistencia
  vive dentro de `js/app.js`** (cargado con `defer` por las 4 vistas que la
  necesitan). No se crea `js/persistencia.js`. Intactos:
  `css/estilos.css`, `js/datos.js`, `js/ejercicio3.js`, IDs estables.
- Decisiones aprobadas en el checkpoint de SPEC (tratadas aquí como
  confirmadas, ver prompt de fase): **(a)** claves `libreria-libros`,
  `libreria-clientes`, `libreria-ventas` + descarte del contenido previo de
  `sessionStorage`; **(b)** «siembra-una-vez + lectura siempre-desde-storage»
  con hook `inicializarPersistencia()` antes de los `inicializar*` en el
  `DOMContentLoaded` (`js/app.js:880–893`, guardas DD-03); **(c)**
  verificación manual por `file://` obligatoria + script headless opcional;
  **D4** delta sobre `altas-validacion` confirmado.
- Metodología: vanilla JS ES5/ES6, sin npm/test runner → cada tarea lleva una
  «comprobación de cierre» observable; los 8 casos de `spec.md` §6 son la
  suite de aceptación (Fase 4).

## Goals / Non-Goals

**Goals:**

- Capa de `localStorage` en `js/app.js` para las 3 claves, con siembra
  única, lectura siempre-desde-storage y escritura de array completo en cada
  alta/confirmación (R6-01..R6-05).
- Reemplazo mínimo del puente `sessionStorage` y de los puntos de lectura de
  catálogos, conservando firmas y helpers existentes (R6-02, R6-04).
- Defensa total ante storage vacío/JSON inválido/no disponible, con
  comportamiento observable de `spec.md` §5 (R6-06).
- Método de verificación y preparación del registro de los 8 casos (R6-07,
  R6-12) y del `README.md` (R6-09/R6-10, contenido solo especificado aquí).

**Non-Goals:**

- Sin `js/persistencia.js` ni ningún archivo JS nuevo salvo el opcional
  `_verify_ej6.js` (Fase 4); sin cambios en HTML/CSS/`js/datos.js`/
  `js/ejercicio3.js`.
- Sin migración de `sessionStorage` (descarte decisión (a)); sin UI de
  edición/eliminación; sin persistir editoriales/géneros/autores; sin
  backend/npm/librerías.
- Sin reabrir alcance de los Ejercicios 1–5 ni inventar funcionalidades.

## Decisions

### D1 — Claves y esquema (decisión (a) confirmada)

| Clave | Valor (JSON array) | Fuente |
| --- | --- | --- |
| `libreria-libros` | `[{ id, titulo, isbn, editorialId, autorIds[], generoId, precio }]` | semilla `js/datos.js` + altas Ej 4 |
| `libreria-clientes` | `[{ id, nombre, email }]` | semilla + altas Ej 4 |
| `libreria-ventas` | `[{ id, fecha, clienteId, clienteNombre, renglones[], total }]` | confirmaciones Ej 5 |

- Constantes nuevas `CLAVE_LIBROS`/`CLAVE_CLIENTES` junto a `CLAVE_VENTAS`
  existente (mismo estilo). Solo 3 claves creadas por la app (delta
  `persistencia-local`: «no hay claves de otros nombres»).
- Toda escritura serializa el **array completo** (patrón del puente Ej 5),
  nunca parches incrementales. `sessionStorage` queda sin uso en el
  proyecto; su contenido previo se descarta, sin rutina de migración.

### D2 — Siembra y ruta de lectura (decisión (b) confirmada)

- **Siembra** en `inicializarPersistencia()` (nueva, en `js/app.js`),
  invocada **primero** dentro del `DOMContentLoaded` existente, antes de
  `inicializarLibros/Clientes/Ventas/Historial`, con las mismas guardas
  `getElementById`/`typeof` (DD-03): si la clave está ausente o vacía →
  deep copy vía `JSON.parse(JSON.stringify(...))` del array semilla a la
  clave. Nunca concatena ni agrega sobre datos existentes → imposible
  duplicar l1–l6/c1–c3. Si `js/datos.js` no cargó (`index.html`), el hook no
  siembra ni lee nada.
- **Lectura**: helpers `leerLibros()`/`leerClientes()` (y
  `obtenerVentas()` ya existente) devuelven SIEMPRE el conjunto vigente
  desde `localStorage`; todos los renders (`renderizarListadoLibros/
  Clientes`), selectores (`actualizarSelector` alimentado desde storage) y
  validaciones (`validarLibro/Cliente`: ISBN/email duplicados, relaciones
  `editorialId`/`autorIds`/`generoId`/`clienteId`) consumen esos helpers.
- Los arrays `const` de `js/datos.js` **no se reasignan ni se les hace
  push**: quedan como única fuente de siembra. Colecciones no persistidas
  (editoriales/géneros/autores) se siguen leyendo de los arrays, como hoy.
- Se lee en cada operación (no se cachea el conjunto en variable global de
  módulo): una lectura fresca por render/validación elimina divergencia
  entre storage y pantalla a costo despreciable (arrays pequeños).

### D3 — Ruta de escritura

- **Alta de libro/cliente** (flujos existentes de `form-libro`/
  `form-cliente`): validar contra el conjunto leído de storage → si pasa,
  agregar el registro a la copia en memoria → `escribirLibros/Clientes`
  (array completo) → re-render. Si `setItem` falla → la operación queda
  visible en la sesión en curso (en memoria) **y** se informa con
  `mostrarMensajeError`/`#msg-error` (texto sobre «almacenamiento del
  navegador»); tras recargar no persiste (comportamiento registrado, no
  maquillado). Alta rechazada → storage no cambia.
- **`confirmarVenta()`**: flujo observable intacto (validar → registrar →
  `obtenerVentas()`/`guardarVentas()` → limpiar); solo cambia el objeto de
  almacenamiento detrás de las dos funciones. `inicializarHistorial()` y
  `verDetalleVenta()` **no cambian**: siguen llamando a `obtenerVentas()`.
  El historial solo LEE storage (nunca escribe al abrirse → no duplica ni
  re-escribe ventas, R6-03).

### D4 — Matriz de manejo de errores, incl. recuperación ante JSON corrupto

| Situación | Lectura | Escritura |
| --- | --- | --- |
| Clave ausente/vacía | libros/clientes → siembra (D2); ventas → `[]` | se crea al primer alta/confirmación |
| JSON inválido o no-array | **tratar como ausente**: devolver semilla en memoria (libros/clientes) o `[]` (ventas); la página opera normalmente, sin errores en consola/interfaz | — |
| `localStorage` no disponible (`getItem`/`setItem` lanza) | `try/catch` → fallback semilla/`[]`; página operable en memoria | `try/catch` → `false`; el llamador informa con mensaje explícito junto a la interfaz |

**Recuperación del valor corrupto (decisión de diseño, `spec.md` §5 lo deja
a PLAN): NO se sobrescribe en la lectura; el valor corrupto se reemplaza en
la siguiente escritura exitosa natural.** Concreto: un JSON inválido en
`libreria-libros` hace que cada sesión opere con la semilla en memoria
(observable igual que «re-sembrar»), pero **ninguna apertura de página
reescribe la clave**; el valor corrupto se pisa recién cuando el usuario
da de alta un libro (escritura de array completo semilla+altas) o cuando
otra escritura legítima lo reemplace; para `libreria-ventas`, con la
primera confirmación. Si nadie escribe, la clave corrupta queda intacta y
la app sigue funcionando en memoria.

- *Justificación*: (1) los flujos de solo lectura (p. ej. `historial.html`)
  conservan su propiedad de no-escribir — abrir una página no muta storage;
  (2) el valor corrupto queda disponible en DevTools como evidencia para
  depurar (y para registrar el comportamiento real si un caso falla);
  (3) la recuperación es idempotente: cada sesión vuelve a caer en el
  fallback, y la primera escritura legítima normaliza la clave.
- *Alternativa descartada*: re-sembrar/sobrescribir inmediatamente al
  detectar la corrupción («eager repair») — haría que una simple apertura
  de página destruya el valor (y con él cualquier dato de altas previas no
  recuperables) antes de que un humano pueda inspeccionarlo, y acoplaría la
  ruta de lectura con efectos secundarios de escritura.
- La siembra normal (clave ausente/vacía) SÍ escribe en el arranque: es la
  escritura explícita prevista por R6-03 («primer inicio → quedan
  copiados»), distinta de la lectura.

### D5 — Puntos de integración en `js/app.js` (cambios mínimos)

| Elemento | Cambio |
| --- | --- |
| `CLAVE_VENTAS` + nuevas `CLAVE_LIBROS`/`CLAVE_CLIENTES` | constantes de clave |
| `obtenerVentas()`/`guardarVentas()` (≈468–489) | `sessionStorage` → `localStorage`; texto del `catch` pasa a «almacenamiento del navegador» |
| `leerLibros()`/`leerClientes()`/`escribirLibros()`/`escribirClientes()` | nuevos helpers con `try/catch` (mismo patrón del puente) |
| `inicializarPersistencia()` | nueva; siembra; primera en el `DOMContentLoaded` (880–893) con guardas DD-03 |
| `inicializarLibros`/`inicializarClientes` | renders y validaciones alimentados desde los helpers de lectura en vez de los arrays `const` |
| `inicializarVentas`/`actualizarSelector` | `#venta-libro`/`#venta-cliente` poblados desde storage (selectores no persistidos siguen de arrays) |
| `validarLibro`/`validarCliente` | duplicados ISBN/email y relaciones evaluados contra el conjunto de storage |
| alta en `form-libro`/`form-cliente` | push en copia leída + escritura completa + manejo de fallo (D3) |
| `confirmarVenta`, `inicializarHistorial`, `verDetalleVenta`, `renderizarRenglones`, `renderizarHistorial` | sin cambio de flujo observable (detrás: nueva capa) |
| `renderizarListadoLibros`/`renderizarListadoClientes` | reciben/sirven el conjunto leído (render actual con `textContent`, sin `innerHTML` con datos) |

### D6 — Método de verificación (decisión (c) confirmada)

- **Obligatorio (Fase 4):** los 8 casos de `spec.md` §6 ejecutados a mano en
  Edge por `file://` (incluye teclado y 320/1280 px), con el resultado
  observado real registrado en el `README.md`; caso 6 solo sobre copia de
  prueba. Ningún caso aprobado sin ejecutarse.
- **Opcional:** `_verify_ej6.js` tipo `_verify_ej5.js` (Edge headless vía
  CDP, Node WebSocket nativo) con `BASE`/rutas derivadas de `__dirname` en
  lugar de `C:\Users\julic\...` (hardcodeo VERIFICADO en `_verify_ej5.js`
  líneas 11–13). Apoyo de regresión, jamás sustituto.

## Risks / Trade-offs

- [`file://` puede restringir `localStorage` en algunos navegadores] →
  todo con `try/catch` (D4); Edge ya se usó así en los Ej 5; si ocurriera,
  se registra el comportamiento real (spec §5, R6-06).
- [Valor corrupto permanece hasta la próxima escritura] → aceptado y
  justificado en D4; observable equivalente a re-sembrar; evidencia
  preservada.
- [Escritura fallida ⇒ memoria y storage divergentes hasta recargar] →
  mensaje explícito junto a la interfaz + registro honesto; ninguna página
  queda inutilizable (R6-06).
- [Leer storage en cada operación en vez de cachear] → más lecturas
  `JSON.parse`, costo irrelevante a la escala del TPI; se elige por
  simplicidad y cero riesgo de estado desincronizado.
- [Editores/géneros/autores fuera de storage] → selectores siguen con los
  arrays `const` (alcance: solo libros/clientes/ventas); los IDs de esos
  arrays no cambian, las relaciones siguen resolviendo.
- [`DATO_PENDIENTE`: 4.ª integrante «Rayssa Alejo» no está en git] →
  lista de autores del README a confirmar con el usuario antes de Fase 3;
  no se inventa.

## Migration Plan

No hay despliegue ni migración de datos: la app es `file://` local.
- **Descarte (decisión (a):** el contenido previo de
  `sessionStorage["libreria-ventas"]` no se migra (session-scoped, ya no
  existe en una apertura real).
- **Rollback:** revertir los cambios en `js/app.js` en la rama
  `feature/ejercicio-6` (sin commits en esta fase); las claves creadas en
  `localStorage` del navegador son inocuas y pueden borrarse desde DevTools.

## Open Questions

- Lista de autores del `README.md` (`DATO_PENDIENTE`, Rayssa Alejo):
  confirmar con el usuario en Fase 3 — no altera specs, diseño ni
  desglose de tareas.
- Conveniencia de ejecutar el script opcional `_verify_ej6.js` en Fase 4:
  la tarea figura como opcional; decidir al llegar (sin impacto en el
  alcance ni en la suite manual obligatoria).
