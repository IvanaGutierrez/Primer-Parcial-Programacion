# SPEC — Ejercicio 6 · Persistencia, verificación y documentación

Change: `ejercicio-6-persistencia` · Fase 1 SPEC (solo documentos, sin código
de producto). Los artefactos de Fase 2 PLAN (`design.md`, `tasks.md`) NO se
generan en esta fase, según la metodología acordada (SPEC → PLAN →
IMPLEMENTACIÓN → VERIFICACIÓN, con checkpoint entre fases).

Fuentes: `Docs/Repaso Primer Parcial.pdf` §«Ejercicio 6 · 6. Persistencia,
verificación y documentación» (p. 6 de 7) y §«Formato de entrega» +
§«Criterios de evaluación» (p. 7 de 7), **leídas en esta sesión** extrayendo
el texto con `pypdf` (la herramienta Read no soporta PDF en este modelo; la
extracción fue exitosa y las citas provienen del texto extraído);
`promptSeis.md` (sin trackear) como contexto complementario de la
metodología; estado previo contrastado contra el código inspeccionado en
`main` (`a849663`): `js/datos.js`, `js/app.js`, `js/ejercicio3.js`, los 5
`.html`, `_verify_ej5.js` y las specs vigentes `openspec/specs/`
(`estructura-html`, `estilos-css`, `datos-catalogo-filtro`,
`altas-validacion`, `venta-historial`).

Convención: «VERIFICADO código» = atribuido al código inspeccionado;
«HECHO consigna» = atribuido al PDF p. 6/7; «SUPUESTO» = asunción no
bloqueante; «PROPUESTA (a)/(b)/(c)/D4» = decisión **pendiente de
confirmación** en el checkpoint de SPEC (§13); `DATO_PENDIENTE:` =
información faltante que no se inventa. **Ninguna decisión de este documento
está aprobada todavía; ningún CA se declara cumplido.**

## 1. Requisitos verificables (R6-01..R6-12)

### R6-01 — Persistencia de libros y clientes en `localStorage` (HECHO consigna)

PDF p. 6: «En la etapa final se utiliza `localStorage` para conservar libros,
clientes y ventas». Libros y clientes dados de alta se conservan en
`localStorage` bajo claves documentadas (§2), en formato JSON, con la misma
forma que los registros semilla.

Escenarios observables:

- Alta válida de libro en `libros.html` → la clave `libreria-libros` contiene
  un JSON de array de objetos con la forma del semilla (`id`, `titulo`,
  `isbn`, `editorialId`, `autorIds[]`, `generoId`, `precio`); el libro
  persiste tras recargar.
- Alta válida de cliente en `clientes.html` → la clave `libreria-clientes`
  contiene el array con forma `id`/`nombre`/`email`; persiste tras recargar.
- Colecciones NO persistidas: `editoriales`, `generos` y `autores` siguen
  viviendo solo en `js/datos.js` (el alcance es libros, clientes y ventas;
  no hay alta de esas colecciones).

### R6-02 — Persistencia de ventas y reemplazo del puente `sessionStorage` (HECHO consigna; sobre puente APROBADO en Ej 5)

Las ventas confirmadas pasan de `sessionStorage` a `localStorage` (clave
`libreria-ventas`, §2 y §4); el historial las lee desde la nueva capa.

Escenarios observables:

- Confirmar una venta válida → el array completo de ventas (incluida la
  nueva) queda escrito como JSON en `localStorage["libreria-ventas"]`.
- `historial.html` listado y detalle → leídos desde la nueva capa
  (`obtenerVentas()` sobre `localStorage`).
- Tras el cambio no quedan llamadas a `sessionStorage` en el proyecto
  (grep sobre `js/*.js`).

### R6-03 — Siembra única sin duplicar (HECHO consigna)

PDF p. 6: «En el primer inicio se cargan los ejemplos; al volver a abrir se
recuperan los registros guardados sin duplicar los datos iniciales».

Escenarios observables:

- Primer inicio (claves ausentes/vacías) → los ejemplos de `js/datos.js`
  (`l1..l6`, `c1..c3`) quedan copiados (deep copy vía JSON) a
  `localStorage`.
- Reapertura (claves con datos) → se recuperan los registros guardados; los
  ejemplos NO se agregan de nuevo (`l1..l6` y `c1..c3` aparecen exactamente
  una vez) y las ventas existentes no se duplican ni se re-escriben al abrir
  el historial (solo la confirmación escribe ventas).
- Integridad de la fuente: los arrays `const` de `js/datos.js` no se
  reasignan ni se modifican desde storage (§3, decisión (b) PROPUESTA).

### R6-04 — Continuidad de las altas del Ejercicio 4 sobre el conjunto persistido (HECHO consigna: casos 2 y 3)

Las validaciones del Ejercicio 4 se evalúan contra el conjunto vigente
persistido y las altas válidas quedan disponibles en las selecciones de
venta, sobreviviendo a la recarga.

Escenarios observables:

- ISBN duplicado (comparación normalizada) rechazado aunque el libro
  duplicado provenga de una sesión anterior guardada en storage.
- Email duplicado (normalizado, distinguiendo solo por mayúsculas del
  input) rechazado aunque el cliente ya registrado venga del storage.
- Alta válida de libro → aparece en `#libros-listado` y en
  `#venta-libro`, y persiste tras recargar.
- Alta válida de cliente → aparece en `#clientes-listado` y en
  `#venta-cliente`, y persiste tras recargar.
- Alta rechazada → el almacenamiento no cambia.

### R6-05 — Continuidad de las ventas e historial del Ejercicio 5 (HECHO consigna: casos 4, 5 y 6)

Los flujos de `ventas.html`/`historial.html` conservan su comportamiento
sobre la nueva capa: validaciones de renglones, cálculos con dos decimales,
confirmación, precio unitario congelado como valor histórico e historial
inmutable.

Escenarios observables:

- Venta inválida (sin cliente, cantidad cero/negativa/decimal, libro
  repetido) → no se confirma; el libro repetido no crea otro renglón (suma
  la cantidad, política D2 del Ej 5).
- Venta válida: 2 unidades a 1500 y 1 a 2000 → subtotales `3000.00` y
  `2000.00`, total `5000.00`; el detalle queda conservado en el historial
  tras recargar.
- Precio histórico: tras confirmar, cambiar a mano el `precio` del libro
  **solo** en el catálogo guardado en `localStorage` (sin tocar las ventas
  guardadas) y recargar → el precio unitario, los subtotales y el total de
  esa venta conservan los valores confirmados (el historial no relee el
  precio del catálogo).

### R6-06 — Manejo defensivo del almacenamiento (HECHO consigna + patrón try/catch VERIFICADO)

PDF p. 6 («Si un caso falla o una funcionalidad queda pendiente, se registra
el comportamiento real») + continuidad del patrón defensivo de
`obtenerVentas()`/`guardarVentas()` (VERIFICADO: try/catch en
js/app.js:470–489).

Escenarios observables:

- Clave ausente o vacía → comportamiento de primera apertura: siembra de
  datos semilla (libros/clientes) u `[]` (ventas); ninguna página muestra
  errores.
- JSON inválido en alguna clave → la página abre y opera (datos semilla o
  lista vacía según la clave), sin errores en consola ni en la interfaz.
- `localStorage` no disponible (permisos, cuota excedida, modo privado,
  origen `file://` restringido) → lectura y escritura protegidas por
  `try/catch`; las páginas siguen abriendo; un fallo de escritura se
  informa con texto explícito junto a la interfaz (no silenciosamente) y la
  sesión en curso sigue siendo usable en memoria.

### R6-07 — Registro de los ocho casos manuales con resultado observado real (HECHO consigna)

PDF p. 6: «Se registra en el README el resultado observado de estos casos
manuales» e «No se indica una prueba como aprobada sin ejecutarla».

Escenarios observables:

- Los ocho casos de la tabla de §6 se ejecutan en navegador por `file://`
  antes de declarar la entrega, en el orden y con los pasos de §6.
- El `README.md` contiene la tabla de los ocho casos con la columna
  «Resultado observado» completada con lo **realmente visto** (incluye
  captura del resultado: texto/conducta observada; si un caso falla o queda
  pendiente, se registra el comportamiento real, sin maquillarlo).
- Ningún caso figura como aprobado sin evidencia de haberse ejecutado.

### R6-08 — Caso guiado de precio histórico en copia de prueba (HECHO consigna)

PDF p. 6: procedimiento guiado por el docente «en una copia del proyecto y
con datos de prueba».

Escenarios observables:

- Se confirma una venta y se anotan sus importes.
- Con las herramientas de almacenamiento del navegador se modifica
  **únicamente** el `precio` del libro dentro del catálogo guardado en
  `localStorage` (`libreria-libros`), sin modificar ni borrar las ventas
  guardadas.
- Se recarga y se consulta el detalle de la venta: precio unitario,
  subtotales y total conservan los valores confirmados.
- El README identifica la ubicación y la estructura del catálogo guardado
  para poder reproducir la comprobación.
- No se exige (ni se crea) una pantalla para editar precios.

### R6-09 — `README.md` en la raíz con el contenido del «Formato de entrega» (HECHO consigna)

PDF p. 7: el README identifica a quienes realizan el trabajo y contiene los
puntos de §7.

Escenarios observables:

- `README.md` existe en la raíz del proyecto.
- Contiene: identificación de autores; pasos para abrir `index.html` en el
  navegador sin npm; navegación entre vistas; funcionalidades implementadas
  y pendientes; ubicación de los datos iniciales; ubicación y estructura del
  catálogo guardado; funcionamiento y límites de `localStorage`; resultados
  de los ocho casos manuales; procedencia de imágenes ajenas si existen
  (hoy no existen recursos externos — VERIFICADO: sin CDN ni imágenes
  remotas).

### R6-10 — Límites del almacenamiento declarados (HECHO consigna)

PDF p. 6: «El README explica que el almacenamiento depende del navegador, del
perfil y de la ubicación de apertura, y que no comparte información entre
usuarios».

Escenarios observables:

- El README declara: la persistencia depende del navegador, del perfil de
  usuario y de la ubicación/origen de apertura; conserva datos solo en esa
  máquina/perfil; no comparte información entre usuarios ni sincroniza con
  ningún servidor; borrar datos del navegador (o DevTools) elimina el
  catálogo guardado y el historial.

### R6-11 — Integridad del alcance y calidad del código (HECHO consigna + constraint resuelto)

La capa de persistencia se agrega sin reabrir el alcance de los Ejercicios
1–5.

Escenarios observables:

- Capa en `js/app.js`: los 5 `.html` no cambian (no se agrega ningún
  `<script>`); no existe `js/persistencia.js` ni archivo JS nuevo.
- Intactos: `css/estilos.css`, `js/datos.js` (solo se lee como semilla),
  `js/ejercicio3.js` y los IDs estables de las vistas.
- DOM seguro: la lectura/escritura y cualquier render nuevo usan
  `textContent`/`createElement`/`replaceChildren` (sin `innerHTML` con
  datos); JS nativo ES5/ES6 sin librerías; las páginas siguen abriendo por
  `file://` sin servidor, npm ni conexión a internet.

### R6-12 — Método de verificación de cierre (PROPUESTA (c))

La verificación de cierre tiene fuente de verdad **manual en navegador**;
cualquier script es complementario.

Escenarios observables:

- Los ocho casos de §6 se ejecutan manualmente por `file://`, incluyendo
  navegación por teclado y anchos de 320 px y 1280 px (foco visible,
  controles utilizables, tabla con desplazamiento propio si lo necesita).
- Opcionalmente se corre un script headless (tipo `_verify_ej5.js` con
  rutas derivadas de `__dirname`, sin rutas absolutas de otra máquina) como
  apoyo de regresión; su resultado NO sustituye el registro manual del
  README.

## 2. Claves y esquema de `localStorage` (R6-01/R6-02; decisión (a) PROPUESTA)

Claves propuestas (misma base `libreria-` que la clave sessionStorage
existente `libreria-ventas` — VERIFICADO: `CLAVE_VENTAS = "libreria-ventas"`
en js/app.js:468):

| Clave | Contenido | Valor |
| --- | --- | --- |
| `libreria-libros` | Array JSON de libros (semilla + dados de alta) | `[{ id, titulo, isbn, editorialId, autorIds: [], generoId: string\|null, precio: number }]` |
| `libreria-clientes` | Array JSON de clientes (semilla + dados de alta) | `[{ id, nombre, email }]` |
| `libreria-ventas` | Array JSON de ventas confirmadas (modelo del Ej 5) | `[{ id, fecha, clienteId, clienteNombre, renglones: [{ libroId, titulo, cantidad, precioUnitario, subtotal }], total }]` |

Notas (HECHO consigna + VERIFICADO modelo):

- La forma de cada registro es **idéntica** a la de los arrays semilla de
  `js/datos.js` (libros/clientes) y al modelo de venta confirmado del
  Ejercicio 5, de modo que los helpers existentes (`buscarPorId`,
  `generarId`, `redondear2`, `formatearImporte`) operan sin cambios sobre
  los datos leídos.
- `editoriales`, `generos` y `autores` **no** se persisten (fuera del
  alcance «libros, clientes y ventas» del PDF).
- La clave `libreria-ventas` mantiene su nombre al pasar de `sessionStorage`
  a `localStorage`; solo cambia el objeto de almacenamiento, lo que deja
  `obtenerVentas()`/`guardarVentas()` casi sin cambio de firma (§4).
- **Destino del contenido previo de `sessionStorage["libreria-ventas"]`:
  DESCARTAR** (PROPUESTA (a)): `sessionStorage` muere con la pestaña, el
  contenido previo ya no existe en una apertura «para siempre», y una
  migración agregaria código y modos de fallo sin caso de uso graduado ni
  exigencia en los ocho casos.
- Escritura: cada mutación relevante escribe el **array completo**
  serializado (mismo patrón que el puente del Ej 5: reemplazo total del
  valor), no parches incrementales.

## 3. Estrategia de siembra sin duplicar sobre los arrays `const` (R6-03; decisión (b) PROPUESTA)

Patrón propuesto: **siembra-una-vez + lectura siempre-desde-storage**.

- **Siembra:** en el arranque de una página que carga `js/datos.js`, si la
  clave correspondiente está **ausente o vacía** → copiar (deep copy vía
  `JSON.parse(JSON.stringify(...))` o equivalente) el array semilla a
  `localStorage`. Nunca se concatena, nunca se agregan ejemplos sobre datos
  existentes → imposible duplicar `l1..l6`/`c1..c3` al reabrir.
- **Lectura:** en **todo** arranque, los listados (`#libros-listado`,
  `#clientes-listado`), los selectores de venta (`#venta-libro`,
  `#venta-cliente`) y las validaciones (ISBN/email duplicados, relaciones)
  **leen el conjunto vigente desde `localStorage`** (`JSON.parse`).
- **Arrays `const` intactos:** `editoriales`, `generos`, `autores`,
  `clientes` y `libros` de `js/datos.js` quedan como **única fuente de
  siembra**: no se reasignan (`const`) ni se les hace `push`/hidratación
  desde storage. Las colecciones no persistidas (editoriales/géneros/
  autores) se siguen leyendo directo de los arrays, tal como hoy.
- **Quién y cuándo:** un hook de arranque en `js/app.js`
  (`inicializarPersistencia()` o equivalente) invocado **antes** de los
  hooks `inicializar*` existentes dentro del `DOMContentLoaded`
  (VERIFICADO: js/app.js:880–893), con guardas `getElementById`/`typeof`
  (patrón DD-03). En `index.html` (no carga `js/datos.js`): el hook no
  siembra ni lee nada y la página sigue siendo la maqueta estática
  (VERIFICADO: index.html solo enlaza `js/app.js`).
- **Escritura:** las altas de libro/cliente y la confirmación de venta
  añaden al conjunto en memoria de la sesión **y** serializan el array
  completo a su clave; una escritura fallida se informa (R6-06).
- Alternativa descartada (historial): hidratar los arrays `const` en lugar
  (`splice`/`push` sobre los declarados) — tocaba menos el código existente
  pero mezclaba storage con la semilla y contradice el patrón pedido.

## 4. Reemplazo del puente `sessionStorage` (R6-02)

Consecuencia exacta (VERIFICADO el estado actual en js/app.js:468–489):

- `obtenerVentas()`: mismo cuerpo defensivo (`try`/`JSON.parse`/
  `Array.isArray` → `[]`), pero `sessionStorage.getItem(CLAVE_VENTAS)` →
  `localStorage.getItem(CLAVE_VENTAS)`.
- `guardarVentas(lista)`: `sessionStorage.setItem(...)` →
  `localStorage.setItem(CLAVE_VENTAS, JSON.stringify(lista))`; el mensaje de
  error del `catch` pasa a hablar de «almacenamiento del navegador» en lugar
  de «la sesión» (texto actual VERIFICADO: «No se pudo guardar la venta en
  la sesión.»).
- `ventas.html`: `confirmarVenta()` no cambia su flujo observable (validar →
  registrar → `obtenerVentas()`/`guardarVentas()` → limpiar); con el cambio,
  la venta confirmada queda disponible **entre pestañas y sesiones**, no solo
  en la pestaña actual.
- `historial.html`: `inicializarHistorial()` y `verDetalleVenta(id)` leen el
  historial desde la nueva capa (siguen llamando a `obtenerVentas()`, que
  ahora es `localStorage`); el render del listado y del detalle no cambia.
- Cobertura de catálogos: `libros.html`/`clientes.html`/selectores de venta
  dejan de operar sobre los arrays semilla en runtime y pasan al conjunto
  persistido (§3).

## 5. Manejo de storage vacío / JSON inválido / storage no disponible (R6-06)

| Situación | Comportamiento exigido |
| --- | --- |
| Clave ausente o vacía (libros/clientes) | Siembra desde `js/datos.js` (§3); la página opera normalmente. |
| Clave ausente o vacía (ventas) | Historial como lista vacía (`#historial-vacio`), como hoy con el puente. |
| JSON inválido en alguna clave | `try/catch` en la lectura: la página **abre y opera** con datos semilla (libros/clientes) o `[]` (ventas); sin errores en consola ni en la interfaz. |
| `localStorage` no disponible o escritura fallida | Lectura y escritura protegidas por `try/catch`; ninguna página queda inutilizable; la operación afectada informa el fallo con texto explícito junto a la interfaz (helpers `mostrarMensajeError`/`#msg-error` VERIFICADOS). |

Detalle fino de recuperación (qué valor conserva la clave corrupta, si la
siembra sobrescribe o no un JSON inválido) → Fase 2 PLAN (`design.md`);
aquí se fija solo el comportamiento observable: **las páginas siempre abren
y ningún fallo de almacenamiento rompe la interfaz**.

## 6. Plan de ejecución y registro de los ocho casos manuales (R6-07/R6-08/R6-12)

Los ocho casos del PDF (p. 6) con su procedimiento y resultado esperado de
la consigna. La columna «Resultado observado» se captura **al ejecutar** cada
caso en la Fase 4 (VERIFICACIÓN) y se transcribe al `README.md`; en esta SPEC
figura como PENDIENTE y **ningún caso se declara aprobado sin ejecutarse**.

| # | Caso (consigna PDF p. 6) | Procedimiento (resumen) | Resultado esperado (consigna) | Requisitos | Resultado observado (registrar en README) |
| --- | --- | --- | --- | --- | --- |
| 1 | Búsqueda con parte del título en mayúsculas; luego búsqueda vacía y texto inexistente | En `ejercicio3.html`: buscar p. ej. `PRINCIPITO`; luego vaciar el buscador; luego buscar `zzz` | Coincidencias sin distinguir mayúsculas; catálogo completo; mensaje sin resultados | R6-07, R6-11 (regresión de `datos-catalogo-filtro`) | PENDIENTE — se captura al ejecutar |
| 2 | Alta de libro con ISBN existente y luego ISBN nuevo | En `libros.html`: alta con un ISBN ya registrado (p. ej. `978-0000000011`); luego alta con ISBN nuevo; recargar | Duplicado rechazado; el válido aparece en catálogo (`#libros-listado`) y selección de venta; **persiste tras recargar** | R6-04, R6-01, R6-03 | PENDIENTE — se captura al ejecutar |
| 3 | Alta de cliente con email inválido, email existente en mayúsculas y email nuevo | En `clientes.html`: email `sin-arroba`; luego un email existente en MAYÚSCULAS; luego uno nuevo; recargar | Se rechazan los dos primeros; el nuevo aparece en listado y selección; **persiste tras recargar** | R6-04, R6-01, R6-03 | PENDIENTE — se captura al ejecutar |
| 4 | Venta sin cliente, cantidad cero/negativa/decimal; libro repetido | En `ventas.html`: intentar confirmar en cada estado inválido; agregar el mismo libro dos veces | No se confirma; el duplicado no crea otro renglón (suma cantidad) | R6-05 (política D2 del Ej 5) | PENDIENTE — se captura al ejecutar |
| 5 | Venta válida: dos unidades a 1500 y una a 2000 | Con precios de ejemplo ficticios: renglones 2×1500 y 1×2000; confirmar; abrir historial y su detalle | Subtotales `3000.00` y `2000.00`, total `5000.00`; detalle conservado en el historial | R6-05, R6-02 | PENDIENTE — se captura al ejecutar |
| 6 | Venta confirmada y cambio exclusivo del precio de catálogo guardado, en copia de prueba | **Copia del proyecto** (procedimiento guiado): confirmar venta y anotar importes; en DevTools modificar SOLO `precio` del libro en `libreria-libros`; sin tocar ventas; recargar y ver detalle | El precio unitario, los subtotales y el total de esa venta conservan los valores confirmados | R6-08, R6-05 | PENDIENTE — se captura al ejecutar (caso guiado) |
| 7 | Recarga después de altas y venta | Tras los casos 2/3/5: recargar `libros.html`, `clientes.html`, `ventas.html` e `historial.html` | Se recuperan datos sin duplicar ejemplos ni ventas | R6-03, R6-01, R6-02 | PENDIENTE — se captura al ejecutar |
| 8 | Navegación por teclado y anchos de 320 px y 1280 px | Recorrer las vistas con Tab/Shift+Tab/Enter; forzar 320 px y 1280 px; probar formularios, tablas y menú | Foco visible, controles utilizables y tabla con desplazamiento propio si lo necesita | R6-07, R6-11 (regresión de `estructura-html`/`estilos-css`) | PENDIENTE — se captura al ejecutar |

Reglas de registro (HECHO consigna): si un caso falla o una funcionalidad
queda pendiente, se registra el **comportamiento real**; no se indica una
prueba como aprobada sin ejecutarla. El caso 6 se ejecuta **solo sobre una
copia de prueba** del proyecto, nunca sobre la entrega.

## 7. `README.md`: contenido y estructura (R6-09/R6-10)

Estructura propuesta para el README de la raíz (se crea en Fase 3 —
IMPLEMENTACIÓN, no ahora):

1. **Título y descripción** del TPI (Librería Ejemplo — Programación III,
   UTN).
2. **Autores** — quiénes realizaron el trabajo (§13 `DATO_PENDIENTE`: lista a
   confirmar).
3. **Cómo abrir** — doble clic en `index.html` (y en las demás vistas), sin
   npm, sin servidor, sin conexión; navegador moderno recomendado.
4. **Navegación entre vistas** — `index.html` (Catálogo maqueta),
   `ejercicio3.html` (Catálogo con filtro, Ej 3), `libros.html` (altas de
   libros, Ej 4), `clientes.html` (altas de clientes, Ej 4), `ventas.html`
   (venta simulada, Ej 5), `historial.html` (historial, Ej 5).
5. **Funcionalidades implementadas y pendientes** — por Ejercicio (1–6);
   pendientes explícitos (p. ej. `index.html` sigue siendo maqueta; sin UI
   de edición/eliminación; sin backend).
6. **Datos iniciales** — `js/datos.js` (arrays semilla `editoriales`,
   `generos`, `autores`, `clientes`, `libros` + `buscarPorId`), todos
   ficticios.
7. **Almacenamiento: claves, ubicación y estructura del catálogo
   guardado** — `localStorage` del navegador (DevTools →
   Application/Almacenamiento → Local Storage → origen `file://`); claves
   `libreria-libros`, `libreria-clientes`, `libreria-ventas` con su esquema
   JSON (§2); cómo se siembra y que no se duplica al reabrir (§3).
8. **Funcionamiento y límites de `localStorage`** — depende del navegador,
   del perfil y de la ubicación de apertura; no comparte información entre
   usuarios; no sincroniza con servidores; borrarlo elimina catálogo
   guardado e historial (R6-10).
9. **Resultados de los ocho casos manuales** — la tabla de §6 con el
   resultado observado real de cada uno (R6-07).
10. **Procedencia de imágenes/recursos ajenos** — ninguno hoy (VERIFICADO:
    sin CDN ni imágenes remotas); se declara explícitamente.

## 8. Escenarios y casos límite observables (mapeo)

Los ocho casos de §6 son los escenarios de aceptación de cierre; se mapean
además contra requisitos:

| Caso límite | Resultado exigido | Requisito |
| --- | --- | --- |
| JSON inválido en `libreria-libros` | La página abre con los ejemplos; sin errores en consola/interfaz | R6-06 |
| `localStorage` sin permisos / cuota / modo privado | Lectura y escritura con `try/catch`; fallo de escritura informado con texto; páginas utilizables | R6-06 |
| Reabrir con altas + ventas guardadas | Sin duplicar ejemplos ni ventas | R6-03 |
| Precio del catálogo cambiado tras confirmar | Historial conserva precio unitario, subtotales y total confirmados | R6-05, R6-08 |
| ISBN/email existente guardado en storage | El duplicado se rechaza igual que contra la semilla | R6-04 |
| Cerrar pestaña y reabrir `historial.html` | Las ventas siguen presentes (ya no son session-scoped) | R6-02 |
| Búsqueda con mayúsculas / vacía / sin coincidencias (Ej 3 intacto) | Filtro sin distinguir mayúsculas; catálogo completo; mensaje sin resultados | R6-07, R6-11 |
| Teclado y anchos 320/1280 px | Foco visible, controles utilizables, tabla con scroll propio | R6-07, R6-11 |

## 9. Criterios de aceptación (CA6-01..CA6-04)

- **CA6-01 (Persistencia — 4 pts):** `localStorage` conserva libros,
  clientes y ventas con claves y esquema documentados; siembra única sin
  duplicar ejemplos al reabrir; el puente `sessionStorage` queda reemplazado
  y el historial lee la nueva capa; altas del Ej 4 y ventas del Ej 5
  persisten y sobreviven a la recarga; ante storage vacío, JSON inválido o
  storage no disponible las páginas siguen abriendo (cubre R6-01, R6-02,
  R6-03, R6-04, R6-05, R6-06).
- **CA6-02 (Pruebas manuales registradas — 3 pts):** los ocho casos se
  ejecutan y su resultado observado real queda registrado en el README; el
  caso guiado de precio histórico se realiza sobre copia de prueba; nada se
  declara aprobado sin ejecución; el método es manual por `file://` con
  script auxiliar opcional no sustitutivo (cubre R6-07, R6-08, R6-12).
- **CA6-03 (Documentación y entrega — 3 pts):** `README.md` en la raíz con
  autores, apertura sin npm, navegación, funcionalidades implementadas y
  pendientes, ubicación de los datos iniciales, ubicación y estructura del
  catálogo guardado, funcionamiento y límites de `localStorage`, resultados
  de los casos y procedencia de recursos (cubre R6-09, R6-10).
- **CA6-04 (Integridad, calidad y compatibilidad — transversal):** sin
  cambios en HTML/CSS/`js/ejercicio3.js`/IDs estables; capa en `js/app.js`;
  `textContent` sin `innerHTML` con datos; JS nativo; `file://`; métodos de
  verificación respetados (cubre R6-11, R6-12).

Ningún criterio se declara cumplido en esta fase: la verificación es manual
por navegador en la Fase 4 (decisión (c) PROPUESTA).

## 10. Deltas openspec (capacidades afectadas) [req. del punto 8 del encargo]

- `specs/persistencia-local/spec.md` — **nueva capacidad** (ADDED):
  claves/esquema, siembra única, lectura del conjunto vigente en cada
  arranque, escritura en altas y confirmación, defensa del almacenamiento,
  continuidad tras recargar.
- `specs/verificacion-entrega/spec.md` — **nueva capacidad** (ADDED):
  README con contenido mínimo, registro de los ocho casos con resultado
  observado, método de verificación, procedimiento guiado del precio
  histórico y límites del almacenamiento.
- `specs/venta-historial/spec.md` — **modificada** (REMOVED + ADDED): el
  requisito «Puente de sesión con sessionStorage reemplazable» se elimina
  (Reason/Migration en el delta; MODIFIED era inviable porque conservaría el
  escenario hoy contradictorio «Sin `localStorage`») y se agrega «Puente de
  persistencia reemplazable con localStorage»: exige `localStorage` (clave
  `libreria-ventas`), persistencia entre pestañas/sesiones, lectura
  defensiva y «Sin sessionStorage».
- `specs/altas-validacion/spec.md` — **modificada** (MODIFIED, PROPUESTA
  D4): «Integridad del alcance y apertura file://» actualiza su escenario
  «Sin alcance adelantado», que prohíbe hoy literalmente «uso de
  `localStorage`»; conserva IDs, `file://` y la prohibición de
  edición/eliminación.
- `datos-catalogo-filtro`, `estructura-html`, `estilos-css`: **sin delta**
  (justificación en el proposal §Capabilities).
- Pendiente post-archive (no se hace ahora): el `## Purpose` del spec
  principal `venta-historial` menciona `sessionStorage`; actualizarlo exige
  editar el spec principal, fuera del alcance de esta fase.

## 11. Método de verificación (decisión (c) PROPUESTA)

- **Obligatorio:** verificación **manual en navegador por `file://`** de los
  ocho casos de §6 (incluye teclado y anchos 320 px/1280 px, que un script
  no cubre de forma confiable), ejecutada antes de declarar la entrega y
  registrada en el README con su resultado observado real.
- **Opcional (apoyo):** script headless tipo `_verify_ej5.js` (Edge headless
  vía CDP con Node WebSocket nativo, VERIFICADO el patrón) con rutas
  derivadas de `__dirname` (hoy `BASE`/`DATOS_PATH`/`USER_DATA` están
  hardcodeadas a `C:\Users\julic\Primer-Parcial-Programacion\`, VERIFICADO
  en `_verify_ej5.js` líneas 11–13) como apoyo de regresión para lo
  automatizable (claves, JSON, importes). **NO reemplaza** los ocho casos
  manuales ni su registro.

## 12. Alcance

### Incluido

- Persistencia en `localStorage` de libros, clientes y ventas con claves
  documentadas; siembra única; reemplazo del puente `sessionStorage`;
  continuidad de altas (Ej 4) y ventas (Ej 5); verificación real de los ocho
  casos; caso guiado de precio histórico en copia de prueba; `README.md` en
  raíz (especificado, **no creado en esta fase**); `try/catch` en lectura y
  escritura; `textContent` sin `innerHTML` con datos; JS nativo; `file://`.

### Excluido (bloqueado — Non-goals)

- Sin UI de edición/eliminación de libros, clientes ni precios (la
  modificación de precio del caso guiado es manual sobre `localStorage` en
  copia de prueba).
- Sin backend, API, `fetch`, npm, build ni base de datos; cero librerías,
  frameworks, CDNs o transpiladores.
- Sin seguridad real ni multiusuario; sin sincronización entre
  dispositivos/perfiles.
- Sin migración inventada de `sessionStorage` (decisión (a): descarte
  documentado).
- Sin reabrir el alcance de los Ejercicios 1–5: sin validaciones nuevas, UI
  nueva, stock, cobros, descuentos, impuestos ni ABM de editoriales/géneros/
  autores.
- NO se modifican `css/estilos.css`, `js/ejercicio3.js`, las vistas HTML ni
  los IDs estables; las ediciones en `js/app.js` se limitan a la capa de
  persistencia y su integración.
- No se crea `js/persistencia.js` ni ningún archivo JS nuevo (constraint §3).
- Ningún caso se declara aprobado sin ejecución.

## 13. Decisiones, supuestos y datos pendientes

### Decisiones propuestas (PENDIENTES de confirmación en el checkpoint de SPEC)

- **(a) — PROPUESTA: claves `libreria-libros`, `libreria-clientes`,
  `libreria-ventas`; contenido previo de `sessionStorage["libreria-ventas"]`
  DESCARTADO.** Misma base `libreria-` que la clave existente; permite que
  `obtenerVentas()`/`guardarVentas()` solo cambien de objeto de
  almacenamiento. Descarte justificado: `sessionStorage` muere con la
  pestaña (no hay contenido que migrar en una apertura real), la migración
  agregaría superficie de código y modos de fallo sin caso de uso graduado,
  y los ocho casos no la exigen. Alternativa descartada: migración
  automática en el arranque.
- **(b) — PROPUESTA: «siembra-una-vez + lectura siempre-desde-storage» sobre
  los arrays `const`.** Siembra con deep copy solo si la clave está
  ausente/vacía; en todo arranque, renders/selectores/validaciones leen
  desde `localStorage`; los arrays `const` de `js/datos.js` quedan intactos
  como única fuente de siembra (no se reasignan ni se les hace push desde
  storage); hook de arranque en `js/app.js` invocado antes de los
  `inicializar*` dentro de `DOMContentLoaded` con guardas DD-03 (no afecta
  `index.html`, que no carga `js/datos.js`). Detalle en §3. Alternativa
  descartada: hidratar los arrays `const` en lugar.
- **(c) — PROPUESTA: verificación manual en navegador por `file://` como
  fuente de verdad obligatoria** para los ocho casos (incluye teclado y
  320/1280 px) **más** script headless opcional de apoyo con rutas relativas
  (`__dirname`) que NO reemplaza lo manual. Detalle en §11. Alternativa
  descartada: verificación solo con script.
- **D4 — PROPUESTA: delta MODIFIED sobre `altas-validacion`** (su escenario
  «Sin alcance adelantado» prohíbe literalmente «uso de `localStorage`»);
  retirable si el usuario lo rechaza, sin afectar el resto de la SPEC.
- **Constraint ya resuelto (declarado):** los HTML no se modifican → sin
  `<script>` nuevo → la capa de persistencia vive en `js/app.js`. No se crea
  `js/persistencia.js`.

### Supuestos

- SUPUESTO: «catálogo» en los casos 2 y 7 = `#libros-listado` de
  `libros.html` + selección de venta, porque `ejercicio3.html`/`index.html`
  y `js/ejercicio3.js` quedan fuera del alcance; el caso 1 se ejecuta en
  `ejercicio3.html` (vista con filtro funcional VERIFICADO).
- SUPUESTO: los registros persistidos copian exactamente la forma de la
  semilla (mismos campos/tipos), por lo que los helpers existentes operan
  sin cambios sobre ellos.
- SUPUESTO: «sin duplicar» = cada ejemplo aparece exactamente una vez tras
  recargar y las ventas no se re-escriben al abrir el historial.
- SUPUESTO: ante JSON inválido, operar con la semilla (o `[]` para ventas)
  durante la sesión; qué pasa exactamente con el valor corrupto en storage
  es detalle de PLAN.
- SUPUESTO: si la escritura falla, la operación queda visible en la sesión
  en curso con mensaje de error explícito (mismo patrón de mensajes
  `#msg-error` ya verificado); ninguna página queda inutilizable.
- SUPUESTO: los ocho casos se ejecutan en navegador moderno de escritorio
  (Edge, como en los Ejercicios 4 y 5) sobre una copia limpia y una copia
  de prueba.
- SUPUESTO: la inmutabilidad del historial del Ej 5 se conserva: la
  manipulación de precios del caso guiado es manual (DevTools), sin UI.

### Datos pendientes

- `DATO_PENDIENTE: la 4.ª integrante «Rayssa Alejo» (mencionada en memoria
  de sesiones previas) NO está en git log ni en git shortlog -sne --all
  (VERIFICADO: solo tres identidades — Julieta Chávez, Ivana Gutiérnez,
  Brissa Muñoz/brissa596).` El README debe identificar a quienes realizaron
  el trabajo; la lista de autores se confirma con el usuario antes de la
  Fase 3; no se inventa.
- Decisiones (a), (b), (c) y D4 **propuestas, sin confirmar**; el checkpoint
  «SPEC lista. ¿Continuar a PLAN, Ajustar SPEC o Parar?» las somete a
  aprobación. Ninguna decisión está marcada como cerrada.
- Discrepancia no bloqueante: CLI declarada `openspec` 1.13.2 vs instalada
  **1.14.1** (VERIFICADO `openspec --version`); el flujo
  `new change`/`status`/`instructions` funcionó sin diferencias relevantes.

## 14. Hechos verificados vs supuestos vs propuestas

- **Hechos (código inspeccionado):** contenido exacto de `js/datos.js`
  (arrays, ids, precios, `email`, `l6.generoId: null`, `buscarPorId`);
  firmas y helpers de `js/app.js` (incluidos `obtenerVentas`/`guardarVentas`
  sobre `sessionStorage` con `CLAVE_VENTAS = "libreria-ventas"`,
  js/app.js:468–489, y el hook `DOMContentLoaded` con guardas DD-03,
  js/app.js:880–893); carga de scripts con `defer` en los 5 `.html`
  (`index.html` solo `js/app.js`); `js/ejercicio3.js` filtra sobre el array
  `const libros`; **cero usos de `localStorage`** en el proyecto (grep);
  ausencia de `README.md`; `_verify_ej5.js` con rutas absolutas de otra
  máquina; estado git (`main`, `a849663`, árbol limpio salvo
  `promptSeis.md`); autores en git (tres identidades); sin registro de
  skills (`.atl/skill-registry.md` y `.agents/SKILLS.md` inexistentes).
- **Hechos (consigna):** R6-01..R6-12, CA6-01..CA6-04, los ocho casos con su
  resultado esperado, el procedimiento guiado del precio histórico, el
  contenido del README y los límites de `localStorage`, según el texto
  extraído del PDF (p. 6 y p. 7).
- **Propuestas (pendientes de confirmación):** (a) claves y descarte de la
  migración sessionStorage; (b) patrón siembra-una-vez + lectura
  siempre-desde-storage con hook en `js/app.js`; (c) método de verificación
  manual obligatorio + script opcional; D4 delta sobre `altas-validacion`.
- **Supuestos:** ver §13 (catálogo = `libros.html` + selectores; semilla
  idéntica en forma; semántica de JSON inválido; escritura fallida;
  navegador Edge; inmutabilidad con DevTools).
- **`DATO_PENDIENTE:`** 4.ª integrante del equipo (§13).
- **Verificación:** ningún CA ni caso se declara cumplido; la verificación
  manual en navegador queda para la Fase 4.
