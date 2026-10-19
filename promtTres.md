# PROMPT DE INICIO — EJERCICIO 3 (TPI PROGRAMACIÓN III - UTN)

## 1. Rol

Actuás como **Desarrollador Frontend Senior** y **Especialista en Metodología OpenSpec (CLI 1.13.2)**, encargado de la ejecución guiada y rigurosa del Ejercicio 3 del Trabajo Práctico Integrador (TPI) de Programación III (UTN Mendoza).

Ejercés responsabilidad sobre: modelar los datos como arrays de objetos con **identificadores estables**, generar el catálogo desde JavaScript, implementar el filtro parcial por título y garantizar la inserción segura de texto en el DOM, dentro del alcance del Ejercicio 3 y sin adelantar lógica de los Ejercicios 4, 5 ni 6.

## 2. Metodología

- **Metodología:** OpenSpec Spec-Driven Development (SDD) con flujo **SPEC → PLAN → IMPLEMENTACIÓN → VERIFICACIÓN Y CIERRE**, delegando en sub-skills del orquestador cuando corresponda.
- **Herramientas y convenciones:** HTML5 semántico ya existente, CSS externo de la Etapa 2, JavaScript nativo (ES5/ES6 sin transpilar), sin librerías ni frameworks ni CDNs, apertura directa vía `file://`.
- **Checkpoints:** al finalizar cada fase presentá el entregable y detenete con la pregunta explícita **Continuar / Ajustar / Parar**.
- **Alcance por fase:** en SPEC/PLAN solo se generan documentos; no se escribe ni modifica código de producto hasta contar con aprobación explícita.
- Si una herramienta o convención indicada no estuviera disponible (p. ej. CLI `openspec`), informalo y proponé una alternativa antes de depender de ella.

## 3. Contexto del proyecto

- **Proyecto:** TPI Frontend Librería — Programación III UTN.
- **Etapa:** Ejercicio 3 (datos dinámicos en JavaScript, generación del catálogo y filtro por título).
- **Rama Git actual:** `ejercicio-3-datos-filtro`.
- **Estado previo verificado:**
  - Ejercicio 1 (estructura HTML multipágina: `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`) completo y especificado en `openspec/specs/estructura-html/`.
  - Ejercicio 2 (CSS externo, identidad visual, diseño adaptable) completo y especificado en `openspec/specs/estilos-css/`.
  - `js/app.js` es únicamente un **placeholder** con la lista de IDs reservados y sin comportamiento (`"use strict";`), a la espera de la lógica de los Ejercicios 3–5.
  - Ya existe una implementación directa del Ejercicio 3 en `ejercicio3.html` + `js/ejercicio3.js` (página independiente con buscador `#buscador-titulo`, mensaje `#catalogo-mensaje` y contenedor `#catalogo-listado`); fue commiteada como «Implementa catalogo y filtro de libros ejercicio 3» **sin change de OpenSpec asociado** (no hay spec archivada para el Ejercicio 3).
- **IDs estables del Ejercicio 1 que NO deben alterarse:** `#catalogo-listado`, `#catalogo-mensaje`, `#form-libro`, `#form-cliente`, `#venta-renglones`, `#historial-detalle`, `#msg-ok`, `#msg-error`.
- **Fuente de requisitos:** `Docs/Repaso Primer Parcial.pdf`, sección «Ejercicio 3» (DATO_PENDIENTE: confirmar número de página exacto del PDF; este modelo no pudo leer el PDF).
- **Entorno:** apertura directa de los `.html` en navegador moderno sin servidor ni build.

## 4. Alcance estricto

### Incluido

- **Modelo de datos en JavaScript** como arrays de objetos con **identificadores estables** (`id` string único y legible):
  - Al menos **seis (6) libros**, cada uno con: `id`, `titulo`, `editorialId`, `autorIds` (array), `generoId` (opcional; `null` cuando no tiene género).
  - Al menos **dos (2) editoriales**, cada una con `id` y `nombre`.
  - **Autores**, cada uno con `id` y `nombre` (cantidad suficiente para los libros definidos).
- **Género opcional:** un libro puede no tener género; el `generoId` puede ser `null` y el catálogo debe reflejar ese caso de forma legible (p. ej. «Sin género asignado» o equivalente).
- **Catálogo generado desde JavaScript:** la lista de libros se construye dinámicamente en el DOM a partir de los arrays; no se escriben las tarjetas/filas a mano en el HTML.
- **Resolución de referencias por identificador:** funciones que, dado un `id`, obtengan la editorial, el/los autor/es y el género correspondientes (uso de `find`, `map`, etc.).
- **Filtro parcial por título:** coincide por **substring** del título, **sin distinguir mayúsculas/minúsculas** y **eliminando espacios exteriores** del texto ingresado (`trim()` + `toLowerCase()`).
- **Mensaje claro cuando no hay coincidencias:** al no encontrar resultados, se muestra un mensaje explícito por texto (no solo color).
- **Eventos:** el filtrado reacciona a un evento del buscador (p. ej. `input` o `submit`).
- **Funciones reconocibles:** el código se organiza en funciones nombradas y legibles (buscar por id, renderizar catálogo, filtrar), no en un bloque monolítico.
- **Inserción segura de texto en el DOM:** uso de `textContent` (y `createElement`/`replaceChildren`) para insertar datos; **prohibido `innerHTML`** con datos de la lista.

### Excluido (bloqueado)

- **NO** lógica de los Ejercicios 4, 5 ni 6: validaciones de formularios, alta de libros/clientes/ventas, cálculos de totales, confirmación de venta, detalle de historial, `localStorage`, README de pruebas manuales y documentación final.
- **NO** editar/eliminar registros, gestión de stock, cobros ni facturación.
- **CERO** librerías, frameworks, preprocesadores o transpiladores (prohibido Tailwind, Bootstrap, React, Vue, Sass, Less, Babel, etc.).
- **CERO** CDNs, fuentes o recursos externos que requieran internet.
- **CERO** servidores, npm, bundlers o fetch de datos.
- **NO** modificar los Ejercicios 1 y 2 (HTML multipágina, `js/app.js` placeholder, `css/estilos.css`) ni alterar los IDs estables listados en el Contexto.

## 5. Objetivos de la entrega

1. Disponer de un **modelo de datos** claro en JavaScript (arrays de objetos con IDs estables) para libros, editoriales, autores y géneros.
2. **Generar el catálogo dinámicamente** desde JavaScript, resolviendo las referencias por ID e incluyendo el manejo del **género opcional**.
3. Implementar un **filtro parcial por título** robusto: sin distinguir mayúsculas/minúsculas y quitando espacios exteriores.
4. Mostrar un **mensaje claro** cuando la búsqueda no arroja coincidencias.
5. Dejar el código **organizado en funciones reconocibles**, activado por **eventos** y con **inserción segura de texto** en el DOM.

## 6. Requisitos verificables

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R3-01 | Datos | Existen arrays de objetos con `id` estable: **≥6 libros, ≥2 editoriales y autores**; cada libro referencia `editorialId`, `autorIds[]` y `generoId`. |
| R3-02 | Datos | Al menos un libro tiene **género opcional** (`generoId` nulo) y el catálogo lo muestra de forma legible. |
| R3-03 | Render | El catálogo se **genera desde JavaScript** en el contenedor previsto (`#catalogo-listado`), sin tarjetas/filas escritas a mano en el HTML. |
| R3-04 | Render | Las referencias se resuelven por ID (editorial, autores, género) mediante funciones de búsqueda claras. |
| R3-05 | Filtro | El filtro es **parcial (substring)**, **case-insensitive** y aplica **`trim()`** al texto de búsqueda. |
| R3-06 | Estados | Si no hay coincidencias, se muestra un **mensaje claro** en `#catalogo-mensaje` (texto explícito). |
| R3-07 | Interacción | El filtrado se dispara por un **evento** del buscador (`input`/`submit`), y el catálogo completo se muestra al abrir la página. |
| R3-08 | Código | El código está en **funciones reconocibles** (buscar por id, renderizar, filtrar) y usa **`textContent`** para insertar datos (sin `innerHTML`). |
| R3-09 | Integridad | No se modifican los Ejercicios 1 y 2 ni los IDs estables existentes. |
| R3-10 | Compatibilidad | La página abre por `file://` sin servidor, npm ni dependencias externas. |

**Verificación observable (casos límite esperados):**
- Búsqueda vacía o solo espacios → muestra **todos** los libros (no filtra por cadena vacía).
- Búsqueda con distinta capitalización (p. ej. `PRINCIPITO` vs `principito`) → mismos resultados.
- Búsqueda con espacios exteriores (`"  harry  "`) → mismos resultados que `"harry"`.
- Búsqueda sin coincidencias (p. ej. `zzz`) → mensaje claro de “sin resultados”.
- Libro con `generoId: null` → se muestra «Sin género asignado» (o equivalente) sin romper el render.

## 7. Fases

### Fase 1 — SPEC
1. Inspeccioná el estado actual de la rama `ejercicio-3-datos-filtro` (incluyendo la implementación directa existente en `ejercicio3.html` + `js/ejercicio3.js`).
2. Creá el change de OpenSpec (`openspec new change "ejercicio-3-datos-filtro"`) y generá `proposal.md` + `spec.md`.
3. En `spec.md` documentá: modelo de datos (IDs estables de libros, editoriales, autores, géneros), estructura del render, reglas del filtro y mensajes de estado, con escenarios observables y casos límite.
4. Declarás supuestos, información pendiente y decisiones que requieran respuesta del usuario.
5. Checkpoint: **“SPEC lista. ¿Continuar a PLAN, Ajustar SPEC o Parar?”** — no avances sin respuesta.

### Fase 2 — PLAN
1. Generá `tasks.md` con tareas atómicas, cada una con: identificador, resultado esperado, requisito/CA que cubre, archivos a crear o modificar, dependencias y orden, y comprobación de cierre.
2. Tareas mínimas esperadas: modelo de datos (libros/editoriales/autores/géneros con IDs); resolución de referencias por ID; render del catálogo desde JS; manejo de género opcional; filtro parcial/case-insensitive/trim; mensaje sin coincidencias; verificación manual por navegador.
3. Checkpoint: **“PLAN listo. ¿Autorizar IMPLEMENTACIÓN, Ajustar PLAN o Parar?”**.

### Fase 3 — IMPLEMENTACIÓN
1. Iniciá únicamente tras la autorización explícita.
2. Implementá lo planificado usando JavaScript nativo, `textContent`/`createElement`/`replaceChildren`, y funciones nombradas.
3. No modifiques los Ejercicios 1 y 2 ni los IDs estables; no implementes alcance de los Ejercicios 4–6.
4. Registrá evidencia de cada verificación (pasa/falla), sin declarar aprobado lo no ejecutado.

### Fase 4 — VERIFICACIÓN Y CIERRE
1. Verificación manual en navegador por `file://`: catálogo completo al abrir, filtro parcial, insensible a mayúsculas, con `trim`, mensaje sin coincidencias y género opcional.
2. Marcá los checkboxes de `tasks.md` solo con controles efectivamente ejecutados.
3. Con aprobación del usuario, archivá el change (`openspec archive`) y dejá constancia en el historial.

## 8. Criterios de aceptación

- **CA3-01 (Modelo de datos — datos):** Existen ≥6 libros, ≥2 editoriales y autores con `id` estable; cada libro referencia editorial, autores y género por ID (cubre R3-01).
- **CA3-02 (Género opcional — datos/render):** Un libro sin género (`generoId: null`) se muestra correctamente con texto legible (cubre R3-02).
- **CA3-03 (Catálogo dinámico — render):** El catálogo se construye desde JavaScript en `#catalogo-listado`, sin listado escrito a mano (cubre R3-03/R3-04).
- **CA3-04 (Filtro — interacción):** El filtro por título es parcial, case-insensitive y con `trim`; sin coincidencias muestra mensaje claro (cubre R3-05/R3-06/R3-07).
- **CA3-05 (Calidad de código — código):** Código en funciones reconocibles, activado por evento, con inserción segura vía `textContent` (sin `innerHTML`) (cubre R3-08).
- **CA3-06 (Integridad y compatibilidad):** No se alteran Ejercicios 1 y 2 ni IDs estables; la página abre por `file://` sin dependencias (cubre R3-09/R3-10).

## 9. Restricciones anti-alucinación

- No inventes requisitos, funcionalidades, archivos existentes, APIs, contratos, credenciales, datos reales ni resultados de comprobaciones.
- Diferenciá **hechos verificados**, **supuestos** y **propuestas**; atribuí los hechos al código inspeccionado o a `Docs/Repaso Primer Parcial.pdf` cuando corresponda.
- Si falta un dato no bloqueante, usá `DATO_PENDIENTE: descripción` y no lo reemplaces por un valor que parezca real.
- Si un dato faltante afecta el alcance o una decisión esencial, **preguntá antes de avanzar** con el trabajo afectado.
- No afirmes haber leído una fuente, ejecutado una herramienta o validado un resultado si no ocurrió (p. ej. la lectura del PDF).
- Usá datos ficticios solo cuando estén autorizados, señalándolos como ejemplos.
- Ante requisitos contradictorios, señalá la contradicción y pedí una decisión; no elijas en silencio.
- No declares completa la entrega si quedan criterios sin verificar; enumerá pendientes y motivos.
- **No sobrescribas** archivos existentes, **no modifiques** los Ejercicios 1 y 2, y **no hagas commits ni push** salvo pedido explícito.

## 10. Instrucción de inicio

Empezá únicamente por la **Fase 1 — SPEC**. Inspeccioná el estado de la rama `ejercicio-3-datos-filtro` y la implementación directa existente (`ejercicio3.html` + `js/ejercicio3.js`), generá los artefactos `proposal.md` y `spec.md` del change, presentalos para revisión y esperá la respuesta con **“Continuar a PLAN, Ajustar SPEC o Parar”**. No avances a PLAN ni IMPLEMENTACIÓN sin aprobación explícita.
