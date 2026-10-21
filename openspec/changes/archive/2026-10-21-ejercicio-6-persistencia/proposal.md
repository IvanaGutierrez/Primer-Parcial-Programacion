# Proposal — ejercicio-6-persistencia

## Why

El Ejercicio 6 («Persistencia, verificación y documentación», 10 puntos en la
planilla de evaluación del PDF p. 7: persistencia 4 + pruebas manuales 3 +
documentación y entrega 3) es el cierre del TPI. Hoy la única capa de
persistencia del proyecto es el puente `sessionStorage` de las ventas
(`js/app.js` líneas 468–489, session-scoped: muere con la pestaña), no existe
`README.md` en la raíz y no hay registro de los ocho casos manuales exigidos.
Sin una SPEC no hay base verificable para el PLAN ni para la verificación de
CA6-01..CA6-04; este change la establece. Al igual que los Ejercicios 4 y 5,
este change es **prospectivo**: la implementación se realizará solo tras
aprobación explícita en el checkpoint de PLAN.

## What Changes

- Se crea la SPEC del Ejercicio 6 (este change): `proposal.md`, `spec.md`
  (documento de lectura en español) y los deltas `specs/persistencia-local/
  spec.md`, `specs/verificacion-entrega/spec.md` (capacidades nuevas),
  `specs/venta-historial/spec.md` y `specs/altas-validacion/spec.md`
  (capacidades modificadas). **Sin código de producto en esta fase** (Fase 1 —
  SPEC según la metodología acordada: SPEC → PLAN → IMPLEMENTACIÓN →
  VERIFICACIÓN, con checkpoint entre fases).
- **Persistencia en `localStorage`** de libros, clientes y ventas con claves
  y esquema JSON documentados; **siembra única** de los ejemplos de
  `js/datos.js` en el primer inicio sin duplicarlos al reabrir; **reemplazo
  del puente `sessionStorage`** en `obtenerVentas()`/`guardarVentas()`
  (mismo patrón `try/catch` ya verificado); continuidad de las altas del
  Ejercicio 4 y de las ventas del Ejercicio 5 sobre el conjunto persistido.
- **Verificación real** de los ocho casos manuales del PDF (p. 6) en
  navegador por `file://`, con su **resultado observado real** registrado en
  el `README.md`; ninguno se declara aprobado sin ejecutarse; incluye el caso
  guiado de precio histórico sobre una copia de prueba del proyecto.
- **`README.md` en la raíz** con el contenido del «Formato de entrega»
  (PDF p. 7): autores, apertura de `index.html` sin npm, navegación,
  funcionalidades implementadas/pendientes, ubicación de los datos
  iniciales, ubicación y estructura del catálogo guardado, funcionamiento y
  límites de `localStorage`, resultados de los ocho casos y procedencia de
  imágenes ajenas si existen. **El README se especifica aquí pero NO se crea
  en esta fase** (pertenece a la Fase 3 — IMPLEMENTACIÓN).
- **Decisiones propuestas (marcadas como PROPUESTAS, a confirmar en el
  checkpoint de SPEC):** (a) claves definitivas `libreria-libros`,
  `libreria-clientes`, `libreria-ventas` y **descarte** del contenido previo
  de `sessionStorage["libreria-ventas"]`; (b) patrón de integración sobre
  los arrays `const`: **siembra-una-vez + lectura siempre-desde-storage**
  mediante hook de arranque en `js/app.js`, sin reasignar ni mutar los arrays
  semilla; (c) método de verificación: **manual en navegador por `file://`
  como fuente de verdad obligatoria** para los ocho casos, más un script
  headless opcional de apoyo (rutas relativas con `__dirname`) que NO
  reemplaza la verificación manual; (D4) delta sobre `altas-validacion`.
  Historial de alternativas en §Decisiones.
- **Constraint ya resuelto que se declara:** el alcance PROHÍBE modificar
  los HTML, por lo que no puede agregarse ningún `<script>` nuevo → **la capa
  de persistencia vive dentro de `js/app.js`** (ya cargado con `defer` por
  las cuatro vistas que la necesitan). No se crea `js/persistencia.js`.
- Excluido explícitamente (Non-goals): sin UI de edición/eliminación (la
  modificación de precio del caso guiado es manual sobre `localStorage` en
  copia de prueba); sin backend/API/`fetch`/npm/build; cero
  librerías/CDNs/frameworks; sin seguridad real ni multiusuario; sin
  migración inventada de `sessionStorage` (se decide y documenta: descarte);
  sin reabrir el alcance de los Ejercicios 1–5 (sin validaciones nuevas, UI
  nueva, stock ni cobros); NO se modifican `css/estilos.css`,
  `js/ejercicio3.js`, las vistas HTML ni los IDs estables; las ediciones en
  `js/app.js` se limitan a la capa de persistencia y su integración; ningún
  caso de prueba se declara aprobado sin ejecución.
- No se agregan funcionalidades, dependencias ni refactorizaciones ajenas a
  esta entrega. **NO** se generan `tasks.md` ni `design.md` en esta fase:
  pertenecen a la Fase 2 — PLAN (checkpoint obligatorio entre fases).

### Criterios de aceptación y cobertura de requisitos (CA6-01..CA6-04)

| CA | Grupo (pts) | Requisitos cubiertos |
| --- | --- | --- |
| CA6-01 | Persistencia (4) | R6-01, R6-02, R6-03, R6-04, R6-05, R6-06 |
| CA6-02 | Pruebas manuales registradas (3) | R6-07, R6-08, R6-12 |
| CA6-03 | Documentación y entrega (3) | R6-09, R6-10 |
| CA6-04 | Integridad, calidad y compatibilidad (transversal, sin puntos propios en la planilla) | R6-11, R6-12 |

(Fuente: PDF p. 6 «Ejercicio 6» y p. 7 «Criterios de evaluación» /
«Formato de entrega»; el detalle de cada R está en `spec.md` §2 y §9.)

## Capabilities

### New Capabilities

- `persistencia-local`: conservación de libros, clientes y ventas en
  `localStorage` del navegador: claves y esquema JSON documentados, siembra
  única de los datos semilla sin duplicarlos en reaperturas, lectura del
  conjunto vigente en cada arranque, escritura en cada alta y confirmación,
  defensa ante almacenamiento vacío, JSON inválido o no disponible, y
  continuidad de las altas (Ej 4) y ventas (Ej 5) tras recargar
  (requisitos R6-01..R6-06).
- `verificacion-entrega`: cierre documental del TPI: `README.md` en la raíz
  con el contenido mínimo del «Formato de entrega», registro de los ocho
  casos manuales con su resultado observado real, método de verificación de
  cierre (manual por `file://` obligatorio, script auxiliar complementario),
  procedimiento guiado del precio histórico en copia de prueba y declaración
  de los límites de `localStorage` (requisitos R6-07..R6-10, R6-12).

### Modified Capabilities

- `venta-historial`: se REEMPLAZA el requisito «Puente de sesión con
  sessionStorage reemplazable» (verificado en
  `openspec/specs/venta-historial/spec.md`): exige hoy publicar las ventas
  en `sessionStorage` y dice textualmente «El sistema NO SHALL usar
  `localStorage` en este ejercicio», condición que el Ejercicio 6 invierte.
  Como MODIFIED obligaría a conservar escenarios hoy contradictorios («Sin
  `localStorage`»), el delta usa **REMOVED + ADDED**: elimina el requisito
  (Reason/Migration incluidos) y agrega «Puente de persistencia
  reemplazable con localStorage» (clave `libreria-ventas`, JSON, escritura
  al confirmar, lectura defensiva, abstracción única
  `obtenerVentas()`/`guardarVentas()`), con escenario «Persistencia entre
  pestañas y sesiones» y «Sin sessionStorage». El nombre nuevo elimina la
  referencia histórica a `sessionStorage`.
- `altas-validacion` (**PROPUESTA D4 — a confirmar en el checkpoint**): se
  MODIFICA el requisito «Integridad del alcance y apertura file://», cuyo
  escenario «Sin alcance adelantado» exige hoy que «el código agregado» no
  tenga «uso de `localStorage`» y que no se adelante «alcance de los
  Ejercicios 5 ni 6». Tras el Ejercicio 6, el `js/app.js` compartido por
  `libros.html`/`clientes.html` contendrá la capa de persistencia, por lo que
  el texto queda en contradicción literal con el código entregado. El delta
  conserva la conservación de IDs estables, la apertura `file://` sin
  dependencias y la prohibición de edición/eliminación de registros, y
  reemplaza la cláusula anti-`localStorage` por: `localStorage` se usa
  exclusivamente como capa de persistencia del Ejercicio 6, sin UI de
  edición ni alcance adelantado. Si el usuario lo rechaza en el checkpoint,
  el delta se retira sin afectar el resto de la SPEC.

### Capacidades NO modificadas (y por qué)

- `datos-catalogo-filtro`: su requisito «Datos con IDs estables» exige que
  cada array se **declare** en un solo archivo (`js/datos.js`, «sin duplicar
  los arrays entre archivos»); la siembra a `localStorage` copia datos en
  runtime, no redeclara arrays en archivos, por lo que el requisito sigue
  cumpliéndose. Sus escenarios de filtro y catálogo están explícitamente
  scoping a `ejercicio3.html`/`js/ejercicio3.js` («WHEN se abre
  `ejercicio3.html`»), archivos que este change NO modifica. Sin delta.
- `estructura-html`: apertura `file://` y anchos 320/1280 px no cambian de
  comportamiento; el caso 8 de la verificación solo los re-ejecuta como
  regresión. Sin delta.
- `estilos-css`: `css/estilos.css` no se modifica. Sin delta.
- `venta-historial` (requisito de selectores): «poblados desde los datos
  locales» sigue siendo cierto: el conjunto persistido en el navegador
  *es* dato local; no requiere delta adicional.
- Observación post-archive (NO se hace ahora): el `## Purpose` del spec
  principal `venta-historial` menciona `sessionStorage`; cambiarlo exige
  editar `openspec/specs/venta-historial/spec.md` directamente, lo que este
  cambio no hace (specs principales son de solo lectura en esta fase) →
  queda como pendiente de aprobación al archivear.

## Impact

- **Archivos de producto afectados en fases posteriores (no en esta fase):**
  - `js/app.js` — **único archivo de código tocado**: (1) capa de
    persistencia (claves, siembra, lectura/escritura con `try/catch` sobre
    `localStorage`), (2) reemplazo de `obtenerVentas()`/`guardarVentas()` de
    `sessionStorage` a `localStorage` manteniendo `CLAVE_VENTAS =
    "libreria-ventas"` (VERIFICADO: js/app.js:468–489), (3) integración de
    los puntos de lectura/escritura con los hooks `inicializar*` existentes
    desde el `DOMContentLoaded` (VERIFICADO: js/app.js:880–893). Las
    ediciones se limitan a la capa de persistencia y su integración.
  - `README.md` — archivo nuevo en la raíz (Fase 3; hoy NO existe,
    VERIFICADO).
  - Opcional (Fase 4, decisión (c)): script de verificación tipo
    `_verify_ej5.js` con rutas relativas (`__dirname`) — apoyo de regresión,
    jamás sustituto de la verificación manual.
- **Archivos NO afectados (bloqueado):** los 5 `.html` (no se agrega ningún
  `<script>`), `css/estilos.css`, `js/datos.js` (se consume como fuente de
  siembra, no se modifica), `js/ejercicio3.js`, `js/ejercicio3.html`-vista y
  los IDs estables de los Ejercicios 1–5.
- **Almacenamiento:** `localStorage` con claves `libreria-libros`,
  `libreria-clientes`, `libreria-ventas` (PROPUESTA (a)); `sessionStorage`
  queda sin uso en el proyecto tras el cambio.
- Sin dependencias nuevas: HTML5 + CSS existente + JS nativo (ES5/ES6 sin
  transpilar) + apertura `file://`. Prohibidos librerías, frameworks, CDNs,
  npm/bundlers, servidores y `fetch`.

## Contexto verificado

Inspección previa a redactar esta propuesta (árbol limpio en `main` salvo
`promptSeis.md` sin trackear):

- **Git (hecho):** rama `main`, HEAD `a849663` («Merge pull request #4 from
  IvanaGutierrez/feature/ejercicio-5»); changes archivados Ej 1–5 en
  `openspec/changes/archive/`; `git shortlog -sne --all` muestra **tres
  identidades de autoría**: Julieta/Chavez Estela Julieta Ailen, Ivana
  Gutierrez/Gutierrez Ivana Isabel Lourdes y `brissa596`
  (munozbrisa856@gmail.com). Ver §DATO_PENDIENTE (4.ª integrante).
- **Fuente de requisitos:** `Docs/Repaso Primer Parcial.pdf`, sección
  «Ejercicio 6 · 6. Persistencia, verificación y documentación» (p. 6 de 7)
  y «Formato de entrega» + «Criterios de evaluación» (p. 7 de 7). **Leídas en
  esta sesión** extrayendo el texto con `pypdf` (la herramienta Read no
  soporta PDF en este modelo; la extracción de texto fue exitosa y las
  citas de la SPEC provienen del texto extraído, no de segunda mano).
  `promptSeis.md` (sin trackear) se usa como contexto complementario.
- **`js/datos.js` inspeccionado (hecho):** fuente única de datos semilla
  — arrays `const`: `editoriales` (ed1–ed2), `generos` (g1–g2), `autores`
  (a1–a3), `clientes` (c1–c3 **con `email`**), `libros` (l1–l6 **con `isbn`
  y `precio`**; l6 con `generoId: null`), más `buscarPorId(lista, id)`.
- **`js/app.js` inspeccionado (hecho):** toda la lógica de vistas con
  helpers verificados (`generarId`, `mostrarMensajeOk/Error`,
  `limpiarMensajes`, `actualizarSelector`, `renderizarListadoLibros/Clientes`,
  `normalizarIsbn/Email`, `validarLibro/Cliente`, `redondear2`,
  `formatearImporte`, `renderizarRenglones`, `confirmarVenta`,
  `renderizarHistorial`, `verDetalleVenta`, hooks `inicializarLibros/Clientes/
  Ventas/Historial` y `DOMContentLoaded` con guardas `getElementById` +
  `typeof`, patrón DD-03). Única capa de persistencia existente:
  `obtenerVentas()`/`guardarVentas(lista)` sobre **`sessionStorage`**, clave
  `CLAVE_VENTAS = "libreria-ventas"`, con `try/catch` ya usado
  (js/app.js:468–489). **Cero usos de `localStorage` en todo el proyecto**
  (grep verificado sobre `js/*.js` y `_verify_ej5.js`).
- **Carga de scripts (hecho):** `libros.html`, `clientes.html`,
  `ventas.html` e `historial.html` cargan `js/datos.js` + `js/app.js` (ambos
  `defer`); `index.html` solo `js/app.js`; `ejercicio3.html` `js/datos.js` +
  `js/ejercicio3.js` (este último filtra sobre el array `const libros`,
  VERIFICADO — no se modifica).
- **`README.md` (hecho):** no existe en la raíz (a crear en Fase 3).
- **`_verify_ej5.js` (hecho):** verificación Edge headless vía CDP con Node
  WebSocket nativo, sin instalaciones; rutas absolutas hardcodeadas de otra
  máquina (`C:\Users\julic\Primer-Parcial-Programacion\` en `BASE`,
  `DATOS_PATH` y perfil de usuario — líneas 11–13) que deberían derivarse de
  `__dirname` si se reutiliza.
- **Referencia externa (hecho):** en el directorio hermano
  `..\Primer-Parcial-Programacion` existe una implementación previa del
  Ej 6 **sin commitear** (README.md, js/persistencia.js, js/catalogo.js,
  _verify_ej6.js, HTMLs modificados) cuyo alcance REABRE los Ejercicios 1–5
  (catálogo de `index`, cambios en HTML). **No se copia ningún archivo** de
  ahí; se descarta su alcance (fuera de los Non-goals) y solo se lo cita como
  referencia de ideas/claves.
- **Estándares del proyecto (hecho):** no existe registro de skills —
  se buscaron `.atl/skill-registry.md` y `.agents/SKILLS.md` y **no están
  presentes**; solo existe `openspec/config.yaml` (schema `spec-driven`,
  sin `context` ni `rules` personalizados). Las convenciones de artefacto se
  toman de los changes archivados (estilo español, R/CA numerados, deltas
  `## ADDED/MODIFIED Requirements`).

## Restricciones técnicas

- Esta fase (SPEC) se limita a `openspec/changes/ejercicio-6-persistencia/`:
  solo se crean documentos. **NO** se escribe ni modifica código de producto,
  `README.md`, HTML, CSS ni JS hasta aprobación explícita en el checkpoint;
  **NO** se generan `tasks.md` ni `design.md` (Fase 2 — PLAN); no se hace
  commit ni push.
- JS nativo (ES5/ES6 sin transpilar), sin librerías/frameworks/CDN, sin npm
  ni servidor; apertura por `file://`.
- Inserción segura de texto: `textContent`/`createElement`/`replaceChildren`;
  **prohibido `innerHTML` con datos**.
- No se modifican las vistas HTML, `css/estilos.css`, `js/datos.js`,
  `js/ejercicio3.js` ni los IDs estables de los Ejercicios 1–5; por eso la
  capa de persistencia vive en `js/app.js` (constraint declarado arriba).
- Ningún caso de prueba ni criterio se declara cumplido en esta fase.

## Supuestos, información pendiente y decisiones

### Decisiones propuestas — PROPUESTAS a confirmar en el checkpoint de SPEC

Ninguna de las decisiones de este apartado está aprobada: se presentan para
que el usuario las confirme (o ajuste) en el checkpoint «SPEC lista».

- **(a) — PROPUESTA: claves definitivas `libreria-libros`,
  `libreria-clientes`, `libreria-ventas`; contenido previo de
  `sessionStorage["libreria-ventas"]` DESCARTADO.** Misma base `libreria-`
  que la clave sessionStorage existente (`libreria-ventas`), lo que permite
  que `obtenerVentas()`/`guardarVentas()` solo cambien de objeto de
  almacenamiento manteniendo `CLAVE_VENTAS`. **Justificación del descarte:**
  `sessionStorage` muere con la pestaña (cualquier contenido previo ya no
  existe cuando el usuario abre la app «para siempre»); una rutina de
  migración agregaría superficie de código y modos de fallo sin caso de uso
  graduado (los ocho casos manuales no la exigen) y el PDF solo pide
  conservar libros/clientes/ventas desde el primer inicio. Alternativa
  descartada: migrar `sessionStorage → localStorage` en el arranque
  (superficie extra sin beneficio verificable).
- **(b) — PROPUESTA: integración sobre los arrays `const` vía
  «siembra-una-vez + lectura siempre-desde-storage».** En el arranque, si la
  clave está vacía/inexistente → copiar (deep copy vía `JSON`) el array
  semilla de `js/datos.js` a `localStorage`; en **todo** arranque, los
  listados, selectores de venta y validaciones **leen desde `localStorage`**
  (`JSON.parse`); los arrays `const` de `js/datos.js` quedan intactos como
  única fuente de siembra — **jamás se reasignan ni se les hace push desde
  storage**. Quién y cuándo: hook de arranque (`inicializarPersistencia()`
  o equivalente) invocado **primero** dentro del `DOMContentLoaded` de
  `js/app.js`, antes de los `inicializar*` existentes, con las mismas
  guardas `getElementById`/`typeof` (patrón DD-03): en `index.html` (que no
  carga `js/datos.js`) el hook no siembra ni lee nada y la página sigue
  siendo la maqueta estática. `editoriales`/`generos`/`autores` NO se
  persisten (el alcance es libros/clientes/ventas) y sus selectores siguen
  leyendo los arrays. Justificación: storage como única fuente de verdad en
  runtime evita divergencia entre lo renderizado y lo guardado, y respeta la
  prohibición de reasignar los `const`. Alternativa descartada (historial de
  la decisión): **hidratar los arrays `const` en lugar** (`splice`/`push`
  sobre el array declarado) — menos invasiva para el código existente pero
  contradice el patrón pedido (metería storage «dentro» de los arrays
  semilla) y haría que `js/datos.js` deje de ser solo semilla.
- **(c) — PROPUESTA: verificación de cierre manual en navegador por `file://`
  como fuente de verdad obligatoria** para los ocho casos (incluye teclado y
  anchos 320 px / 1280 px, que un script no cubre de forma confiable),
  **más** opcionalmente un script headless tipo `_verify_ej5.js` con rutas
  actualizadas (`__dirname` y rutas relativas en lugar de
  `C:\Users\julic\...`) como apoyo de regresión. El script **NO reemplaza**
  los ocho casos manuales ni su registro en el README. Justificación: el PDF
  exige «resultado observado» de casos que incluyen foco visible, teclado y
  anchos; el script solo agrega repetibilidad a las verificaciones
  DOM/storage. Alternativa descartada: verificar solo con script (incumple
  el carácter manual de la consigna).
- **D4 — PROPUESTA: delta MODIFIED sobre `altas-validacion`** (ver
  §Capabilities): necesario porque su escenario «Sin alcance adelantado»
  prohíbe literalmente «uso de `localStorage`»; retirable si el usuario
  prefiere dejar esa spec intacta con la misma justificación histórica del
  Ejercicio 5.
- **Constraint ya resuelto (declarado, no se pregunta):** la capa de
  persistencia vive en `js/app.js` — los HTML no se modifican, luego no
  puede agregarse ningún `<script>` nuevo; no se crea `js/persistencia.js`.

### Supuestos

- SUPUESTO: «catálogo» en los casos 2 y 7 de la consigna se refiere al
  listado de `libros.html` (`#libros-listado`) y a la selección de venta de
  `ventas.html`, porque `ejercicio3.html`/`index.html` quedan fuera del
  alcance (no se modifican `js/ejercicio3.js` ni HTML); el caso 1 (búsqueda)
  se ejecuta en `ejercicio3.html`, la vista con filtro funcional.
- SUPUESTO: los registros persistidos conservan exactamente la forma de los
  arrays semilla (mismos campos y tipos), de modo que los helpers existentes
  (`buscarPorId`, `generarId`, `redondear2`, `formatearImporte`) operan sin
  cambios sobre ellos.
- SUPUESTO: «sin duplicar» se cumple si, tras recargar, cada ejemplo
  (`l1..l6`, `c1..c3`) aparece exactamente una vez y las ventas no se
  re-escriben al abrir el historial (solo la confirmación escribe ventas).
- SUPUESTO: la siembra usa deep copy (`JSON.parse(JSON.stringify(x))` o
  equivalente) para no compartir referencias entre los arrays semilla y el
  valor serializado.
- SUPUESTO: si la escritura falla (cuota/permisos), la operación se muestra
  en la sesión en curso con mensaje de error explícito junto a la interfaz;
  ninguna página queda inutilizable (semántica fina de recuperación → PLAN).
- SUPUESTO: los ocho casos se ejecutan en un navegador moderno de escritorio
  (Edge, como en los ejercicios anteriores) sobre una copia limpia y sobre
  una copia de prueba para el caso 6.
- SUPUESTO: la inmutabilidad de ventas del Ejercicio 5 se conserva: la
  modificación de precio del caso guiado se hace **a mano** desde las
  herramientas del navegador, sin crear UI de edición.

### Información pendiente

- `DATO_PENDIENTE: la 4.ª integrante del equipo «Rayssa Alejo» (mencionada
  en memoria de sesiones previas) NO aparece en git log ni en
  git shortlog -sne --all (VERIFICADO: solo tres identidades — Julieta
  Chávez, Ivana Gutiérnez y Brissa Muñoz/brissa596).` El `README.md` exige
  identificar a quienes realizan el trabajo (PDF p. 7); la lista de autores
  debe confirmarse con el usuario antes de redactar el README en Fase 3 — no
  se inventa.
- D1…(a)(b)(c) y D4 **propuestas, no confirmadas**: el checkpoint de SPEC
  pendiente («SPEC lista. ¿Continuar a PLAN, Ajustar SPEC o Parar?»).
- Discrepancia registrada (no bloqueante): el enunciado declara CLI
  `openspec` 1.13.2; la versión instalada verificada es **1.14.1** (hecho:
  `openspec --version`). No se detectaron diferencias de flujo relevantes
  (`new change`, `status`, `instructions` funcionan como se esperaba).

## Estado de los artefactos

- Fase 1 — SPEC: **en curso al cerrar este archivo**: `proposal.md` y los
  deltas de §Capabilities; `spec.md` (documento raíz) y los 4 deltas en
  `specs/`; `design.md` y `tasks.md` **NO se generan** (Fase 2 — PLAN, por
  decisión del usuario: checkpoint entre fases). `openspec status` seguirá
  listándolos como pendientes/bloqueados: es lo esperado y NO se crearán en
  esta fase.
- Fase 2 — PLAN: pendiente de la respuesta al checkpoint.
- Fase 3 — IMPLEMENTACIÓN: no iniciada; requiere autorización explícita;
  incluye la creación de `README.md`.
- Fase 4 — VERIFICACIÓN: pendiente; manual en navegador por `file://`
  (decisión (c) propuesta); ningún CA se declara cumplido todavía.
