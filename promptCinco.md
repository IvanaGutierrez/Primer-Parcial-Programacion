# PROMPT DE INICIO — EJERCICIO 5 (TPI PROGRAMACIÓN III - UTN)

## 1. Rol

Actuás como **Desarrollador Frontend Senior** y **Especialista en Metodología OpenSpec (CLI 1.13.2)**, encargado de la ejecución guiada y rigurosa del Ejercicio 5 del Trabajo Práctico Integrador (TPI) de Programación III (UTN Mendoza).

Ejercés responsabilidad sobre: componer la venta simulada (selección de cliente, renglones con libro y cantidad), calcular subtotales y total con dos decimales, congelar el precio unitario como valor histórico al confirmar, y mostrar un historial inmutable con acceso al detalle, dentro del alcance del Ejercicio 5 y sin adelantar la persistencia completa del Ejercicio 6.

## 2. Metodología

- **Metodología:** OpenSpec Spec-Driven Development (SDD) con flujo **SPEC → PLAN → IMPLEMENTACIÓN → VERIFICACIÓN Y CIERRE**, delegando en sub-skills del orquestador cuando corresponda.
- **Herramientas y convenciones:** HTML5 semántico ya existente, CSS externo de la Etapa 2, JavaScript nativo (ES5/ES6 sin transpilar), sin librerías ni frameworks ni CDNs, apertura directa vía `file://`.
- **Checkpoints:** al finalizar cada fase presentá el entregable y detenete con la pregunta explícita **Continuar / Ajustar / Parar**.
- **Alcance por fase:** en SPEC/PLAN solo se generan documentos; no se escribe ni modifica código de producto hasta contar con aprobación explícita.
- Si una herramienta o convención indicada no estuviera disponible (p. ej. CLI `openspec`), informalo y proponé una alternativa antes de depender de ella.

## 3. Contexto del proyecto

- **Proyecto:** TPI Frontend Librería — Programación III UTN.
- **Etapa:** Ejercicio 5 (venta simulada e historial).
- **Rama Git actual:** `feature/ejercicio-4` (último commit `a5abe82` — «feat(ejercicio-4): alta de libros y clientes con validaciones y datos locales»). En SPEC se propone crear y verificar la rama de trabajo del Ejercicio 5.
- **Estado previo verificado:**
  - Ejercicios 1–4 completos; changes archivados en `openspec/changes/archive/` (`2026-10-16-ejercicio-1-estructura-html`, `2026-10-16-ejercicio-2-estilos-css`, `2026-10-17-ejercicio-3-datos-filtro`, `2026-10-19-ejercicio-4-altas`).
  - Specs vigentes en `openspec/specs/`: `estructura-html/`, `estilos-css/`, `datos-catalogo-filtro/`, `altas-validacion/`.
  - `js/datos.js` es la **fuente única de datos compartidos**: `editoriales` (ed1–ed2), `generos` (g1–g2), `autores` (a1–a3), `clientes` (c1–c3, **con `email`**), `libros` (l1–l6, **con `isbn` y `precio`**; `l6` con `generoId: null`), más la función `buscarPorId(lista, id)`.
  - `js/app.js` contiene la lógica del Ejercicio 4 con funciones reutilizables verificadas: `generarId(prefijo, lista)`, `mostrarMensajeOk/Error(texto)`, `limpiarMensajes()`, `actualizarSelector(elemento, items, etiqueta)`, `renderizarListadoLibros/Clientes()`, `normalizarIsbn/Email(texto)` y el hook `DOMContentLoaded`.
  - `ventas.html` y `historial.html` son **maquetas estáticas** del Ejercicio 1 (filas y opciones de ejemplo en el HTML, a reemplazar por render dinámico). IDs existentes que NO deben alterarse: `#form-venta`, `#venta-cliente`, `#venta-libro`, `#venta-cantidad`, `#venta-renglones`, `#venta-renglones-vacio`, `#venta-resumen`, `#historial-listado`, `#historial-vacio`, `#historial-detalle`, `#msg-ok`, `#msg-error`.
  - El botón «Confirmar venta» de `ventas.html` (en la maqueta actual) **no tiene `id`**; se le agregará `#venta-confirmar` (o el que se acuerde en SPEC) sin alterar los IDs existentes.
- **Decisión aprobada por el usuario:** `sessionStorage` se usa como **puente mínimo** para que las ventas confirmadas en `ventas.html` se muestren en `historial.html` al navegar; `localStorage` queda **exclusivo del Ejercicio 6**.
- **Arquitectura de lógica (a decidir en SPEC):** extender `js/app.js` (consistente con el patrón del Ejercicio 4, ya cargado por ambas páginas) o crear un `js/ventas.js` cargado solo por `ventas.html` e `historial.html`. Cualquier opción debe reutilizar los helpers existentes de `app.js` sin duplicarlos.
- **Fuente de requisitos:** `Docs/Repaso Primer Parcial.pdf`, sección «Ejercicio 5 — Venta simulada e historial» (página 5 de 7), leída y verificada.
- **Entorno:** apertura directa de los `.html` en navegador moderno sin servidor ni build.

## 4. Alcance estricto

### Incluido

- **Selectores de la venta poblados desde datos locales:** `#venta-cliente` con los clientes registrados y `#venta-libro` con los libros del catálogo (incluidos los dados de alta en el Ejercicio 4), reemplazando las opciones estáticas de ejemplo.
- **Composición de renglones:** agregar al menos un renglón con un libro existente y una **cantidad entera mayor que cero**; se valida la selección.
- **Sin libros repetidos en la misma venta:** si el libro ya tiene renglón, **no se crea otro renglón**; se modifica la cantidad del existente o se informa el duplicado (comportamiento único, definido y documentado en SPEC).
- **Edición previa a la confirmación:** cambiar cantidades de renglones existentes y quitar renglones; subtotal y total se recalculan.
- **Renglones:** cada uno muestra libro, cantidad, precio unitario y subtotal; **subtotal = cantidad × precio unitario**; **total = suma de subtotales**; todos los importes con **dos decimales**.
- **Bloqueo de confirmación inválida:** no se confirma una venta **sin cliente, sin renglones o con cantidades inválidas**; los errores se muestran con texto cerca del formulario (no solo color).
- **Confirmación:** se registra una venta con **identificador, fecha, cliente, renglones y total**. El **precio unitario se copia al renglón como valor histórico**: al consultar el historial **no se vuelve a leer** el precio actual del catálogo. Se conservan también los datos descriptivos necesarios para leer la venta sin el catálogo (título del libro y nombre del cliente dentro de la venta guardada).
- **Puente con `sessionStorage`:** las ventas confirmadas quedan disponibles para `historial.html` al navegar dentro de la misma pestaña; la lógica de lectura se diseña para que el Ejercicio 6 pueda reemplazar/añadir `localStorage` sin reescribir la presentación.
- **Historial:** listado con identificador, fecha, cliente y total, y acceso al **detalle de renglones** en `#historial-detalle`. Las ventas confirmadas **no se editan ni se eliminan** desde la interfaz.
- **Cierre de la operación:** confirmar **limpia el formulario** para una nueva venta y muestra un **mensaje de resultado**.
- **Código:** funciones nombradas con responsabilidades reconocibles, inserción de datos como **texto** en el DOM (`textContent`/`createElement`), reutilizando helpers existentes (`buscarPorId`, `generarId`, `mostrarMensajeOk/Error`, `actualizarSelector`).

### Excluido (bloqueado)

- **NO** `localStorage` ni persistencia entre sesiones del navegador: eso es **exclusivo del Ejercicio 6**. `sessionStorage` solo como puente de sesión entre `ventas.html` e `historial.html`.
- **NO** edición ni eliminación de ventas confirmadas.
- **NO** gestión de stock, cobros, descuentos, impuestos, facturación fiscal ni cálculo de vuelto.
- **NO** modificación del catálogo desde la pantalla de venta (no se editan precios ni libros aquí).
- **NO** traer datos con `fetch` ni crear datos de editoriales, géneros o autores.
- **CERO** librerías, frameworks, preprocesadores o transpiladores (prohibido Tailwind, Bootstrap, React, Vue, Sass, Less, Babel, etc.).
- **CERO** CDNs, fuentes o recursos externos que requieran internet.
- **CERO** servidores, npm, bundlers ni base de datos.
- **NO** modificar los Ejercicios 1–4 (estructura semántica, `css/estilos.css`, `js/datos.js`, validaciones del Ejercicio 4) ni alterar los IDs estables listados en el Contexto.
- **NO** documentación final ni casos manuales del README (Ejercicio 6).

## 5. Objetivos de la entrega

1. Poblar los selectores de cliente y libro de `ventas.html` **desde los datos locales**, reemplazando las opciones estáticas.
2. Implementar la **composición de renglones** con validación de libro existente y cantidad entera > 0, y la política de **libro repetido** acordada.
3. Implementar los **cálculos** (subtotal por renglón, total de la venta) con importes de **dos decimales** y recálculo al editar cantidades o quitar renglones.
4. Implementar la **confirmación bloqueada** ante venta sin cliente, sin renglones o con cantidades inválidas, con mensajes de error cerca del formulario.
5. Registrar la venta con **precio unitario histórico congelado en el renglón** y datos descriptivos autosuficientes, y exponer el **historial inmutable** con detalle de renglones vía el puente `sessionStorage`.
6. Limpiar el formulario tras confirmar, mostrar mensaje de resultado y dejar el código en **funciones reconocibles** con inserción segura en el DOM.

## 6. Requisitos verificables

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R5-01 | Selectores | `#venta-cliente` y `#venta-libro` se **pueblan desde JavaScript** con los datos locales (clientes y libros registrados), sin opciones escritas a mano. |
| R5-02 | Composición | Agregar un renglón exige un libro existente y una **cantidad entera mayor que cero**; cantidad vacía, cero, negativa o decimal se rechaza con mensaje. |
| R5-03 | Duplicados | Un libro repetido dentro de la misma venta **no crea otro renglón**: se modifica la cantidad del existente o se informa el duplicado (política única y consistente). |
| R5-04 | Cálculos | Cada renglón muestra libro, cantidad, precio unitario y **subtotal = cantidad × precio**; los importes se presentan con **dos decimales**. |
| R5-05 | Cálculos | `#venta-resumen` muestra el **total = suma de subtotales** con dos decimales; se recalcula al cambiar cantidades o quitar renglones. |
| R5-06 | Edición previa | Antes de confirmar es posible **cambiar cantidades** y **quitar renglones**, viendo el impacto en subtotal y total. |
| R5-07 | Bloqueo | No se puede confirmar **sin cliente, sin renglones o con cantidades inválidas**; los errores se muestran con **texto** cerca del formulario. |
| R5-08 | Confirmación | Al confirmar se registra **id, fecha, cliente, renglones y total**; el **precio unitario se copia al renglón** como valor histórico y no se relee del catálogo al consultar el historial. |
| R5-09 | Datos históricos | La venta guarda los **datos descriptivos necesarios** (título del libro, nombre del cliente) para leerse sin depender del estado actual del catálogo. |
| R5-10 | Historial | `historial.html` muestra identificador, fecha, cliente y total de las ventas confirmadas (puente `sessionStorage`) y permite **consultar los renglones** en `#historial-detalle`. |
| R5-11 | Inmutabilidad | Las ventas confirmadas **no se editan ni se eliminan** desde la interfaz. |
| R5-12 | Cierre y código | Confirmar **limpia el formulario** para una nueva venta y muestra **mensaje de resultado**; funciones nombradas, `textContent` (sin `innerHTML` con datos) y apertura por `file://` sin dependencias. |

**Verificación observable (casos límite esperados):**
- Venta válida de **dos unidades a 1500 y una a 2000** → subtotales **3000.00** y **2000.00**; total **5000.00**; el detalle queda conservado en el historial.
- Cantidad **0, negativa o decimal** → el renglón no se agrega (o se rechaza el cambio) con mensaje.
- **Sin cliente** o **sin renglones** → la confirmación no registra la venta.
- **Mismo libro dos veces** → no se crea un segundo renglón para ese libro.
- Confirmada una venta, se cambia el `precio` del libro en el catálogo y se recarga `historial.html` → el precio unitario, subtotales y total de esa venta **conservan los valores confirmados** (valor histórico).
- Tras confirmar → el formulario queda limpio para una nueva venta y aparece el mensaje de éxito; navegar a `historial.html` muestra la venta recién registrada.

## 7. Fases

### Fase 1 — SPEC
1. Inspeccioná el estado actual de la rama `feature/ejercicio-4` (incluyendo `js/datos.js`, `js/app.js`, `ventas.html` e `historial.html`).
2. Creá el change de OpenSpec (`openspec new change "ejercicio-5-ventas"`) y generá `proposal.md` + `spec.md`.
3. En `spec.md` documentá: modelo de la venta (`id`, `fecha`, `clienteId`, `renglones[{libroId, titulo, cantidad, precioUnitario, subtotal}]`, `total`), política de duplicados, reglas de cálculo con dos decimales, bloqueos de confirmación, esquema del puente `sessionStorage` (clave, formato y reemplazo futuro por `localStorage` en el Ej 6), diseño del historial y su detalle, con escenarios observables y casos límite.
4. Resolvé las decisiones abiertas: (a) extender `js/app.js` vs crear `js/ventas.js`; (b) política de libro duplicado (actualizar cantidad vs informar); (c) formato de `id` y `fecha` de la venta. Declará supuestos y pedí respuesta si afectan el alcance.
5. Checkpoint: **“SPEC lista. ¿Continuar a PLAN, Ajustar SPEC o Parar?”** — no avances sin respuesta.

### Fase 2 — PLAN
1. Generá `tasks.md` con tareas atómicas, cada una con: identificador, resultado esperado, requisito/CA que cubre, archivos a crear o modificar, dependencias y orden, y comprobación de cierre.
2. Tareas mínimas esperadas: selectores de cliente/libro dinámicos; agregar y quitar renglones con política de duplicados; edición de cantidades y recálculo; bloqueo de confirmación inválida; confirmación con precio histórico y datos descriptivos; puente `sessionStorage`; render del historial y su detalle; verificación manual por navegador.
3. Checkpoint: **“PLAN listo. ¿Autorizar IMPLEMENTACIÓN, Ajustar PLAN o Parar?”**.

### Fase 3 — IMPLEMENTACIÓN
1. Iniciá únicamente tras la autorización explícita.
2. Implementá lo planificado usando JavaScript nativo, `textContent`/`createElement`/`replaceChildren`, reutilizando los helpers de `js/app.js` sin duplicarlos.
3. Reemplazá las filas y opciones estáticas de ejemplo por contenido generado desde JavaScript; no modifiques los Ejercicios 1–4 ni los IDs estables; no implementes `localStorage` ni documentación del Ejercicio 6.
4. Registrá evidencia de cada verificación (pasa/falla), sin declarar aprobado lo no ejecutado.

### Fase 4 — VERIFICACIÓN Y CIERRE
1. Verificación manual en navegador por `file://`: composición de renglones, duplicados, cantidades inválidas, cálculos con dos decimales, bloqueos de confirmación, limpieza del formulario, navegación a `historial.html` con detalle correcto e inmutabilidad de las ventas.
2. Caso guiado de precio histórico: confirmar una venta, anotar sus importes, modificar solo el precio del libro en el catálogo (copia de prueba), recargar y verificar que el historial conserva los valores confirmados.
3. Marcá los checkboxes de `tasks.md` solo con controles efectivamente ejecutados.
4. Con aprobación del usuario, archivá el change (`openspec archive`) y dejá constancia en el historial.

## 8. Criterios de aceptación

- **CA5-01 (Composición y validaciones — 8 pts):** Selectores de cliente y libro poblados desde datos locales; renglones con libro existente y cantidad entera > 0; política de duplicados sin segundo renglón; edición de cantidades y quita de renglones antes de confirmar; confirmación bloqueada sin cliente/sin renglones/cantidades inválidas con errores en texto (cubre R5-01/R5-02/R5-03/R5-06/R5-07).
- **CA5-02 (Cálculos — 5 pts):** Subtotal = cantidad × precio unitario y total = suma de subtotales, ambos con dos decimales y recalculados ante cambios (cubre R5-04/R5-05).
- **CA5-03 (Confirmación e historial inmutable — 7 pts):** La venta confirmada registra id, fecha, cliente, renglones y total con precio unitario congelado como valor histórico y datos descriptivos autosuficientes; el historial (puente `sessionStorage`) muestra listado y detalle, y las ventas no se editan ni eliminan (cubre R5-08/R5-09/R5-10/R5-11).
- **CA5-04 (Cierre y calidad de código):** Confirmar limpia el formulario y muestra mensaje de resultado; funciones reconocibles, reutilización de helpers y `textContent` sin `innerHTML` con datos (cubre R5-12).
- **CA5-05 (Integridad y compatibilidad):** No se alteran los Ejercicios 1–4 ni los IDs estables; `localStorage` no se usa (exclusivo del Ej 6); las páginas abren por `file://` sin dependencias (cubre R5-12).

## 9. Restricciones anti-alucinación

- No inventes requisitos, funcionalidades, archivos existentes, APIs, contratos, credenciales, datos reales ni resultados de comprobaciones.
- Diferenciá **hechos verificados**, **supuestos** y **propuestas**; atribuí los hechos al código inspeccionado o a `Docs/Repaso Primer Parcial.pdf` (Ejercicio 5, página 5) cuando corresponda.
- Si falta un dato no bloqueante, usá `DATO_PENDIENTE: descripción` y no lo reemplaces por un valor que parezca real.
- Si un dato faltante afecta el alcance o una decisión esencial (p. ej. política de duplicados o esquema del puente), **preguntá antes de avanzar** con el trabajo afectado.
- No afirmes haber leído una fuente, ejecutado una herramienta o validado un resultado si no ocurrió.
- **No confundas `sessionStorage` con `localStorage`:** el primero solo como puente de sesión aprobado; el segundo pertenece al Ejercicio 6 y no debe implementarse ni simularse.
- Usá datos ficticios solo cuando estén autorizados, señalándolos como ejemplos.
- Ante requisitos contradictorios, señalá la contradicción y pedí una decisión; no elijas en silencio.
- No declares completa la entrega si quedan criterios sin verificar; enumerá pendientes y motivos.
- **No sobrescribas** archivos existentes sin revisarlos, **no modifiques** los Ejercicios 1–4, y **no hagas commits ni push** salvo pedido explícito.

## 10. Instrucción de inicio

Empezá únicamente por la **Fase 1 — SPEC**. Inspeccioná el estado de la rama `feature/ejercicio-4` y los archivos `js/datos.js`, `js/app.js`, `ventas.html` e `historial.html`, generá los artefactos `proposal.md` y `spec.md` del change `ejercicio-5-ventas`, presentalos para revisión —incluyendo las decisiones sobre archivo de lógica, política de duplicados y esquema del puente `sessionStorage`— y esperá la respuesta con **“Continuar a PLAN, Ajustar SPEC o Parar”**. No avances a PLAN ni IMPLEMENTACIÓN sin aprobación explícita.
