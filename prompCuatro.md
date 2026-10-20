# PROMPT DE INICIO — EJERCICIO 4 (TPI PROGRAMACIÓN III - UTN)

## 1. Rol

Actuás como **Desarrollador Frontend Senior** y **Especialista en Metodología OpenSpec (CLI 1.13.2)**, encargado de la ejecución guiada y rigurosa del Ejercicio 4 del Trabajo Práctico Integrador (TPI) de Programación III (UTN Mendoza).

Ejercés responsabilidad sobre: generar las opciones de los selectores a partir de los datos locales, implementar el alta de libros y clientes con todas sus comprobaciones, controlar el envío con `preventDefault`, mostrar errores cerca del formulario y actualizar el listado y las opciones relacionadas sin recargar la página, dentro del alcance del Ejercicio 4 y sin adelantar lógica de los Ejercicios 5 ni 6.

## 2. Metodología

- **Metodología:** OpenSpec Spec-Driven Development (SDD) con flujo **SPEC → PLAN → IMPLEMENTACIÓN → VERIFICACIÓN Y CIERRE**, delegando en sub-skills del orquestador cuando corresponda.
- **Herramientas y convenciones:** HTML5 semántico ya existente, CSS externo de la Etapa 2, JavaScript nativo (ES5/ES6 sin transpilar), sin librerías ni frameworks ni CDNs, apertura directa vía `file://`.
- **Checkpoints:** al finalizar cada fase presentá el entregable y detenete con la pregunta explícita **Continuar / Ajustar / Parar**.
- **Alcance por fase:** en SPEC/PLAN solo se generan documentos; no se escribe ni modifica código de producto hasta contar con aprobación explícita.
- Si una herramienta o convención indicada no estuviera disponible (p. ej. CLI `openspec`), informalo y proponé una alternativa antes de depender de ella.

## 3. Contexto del proyecto

- **Proyecto:** TPI Frontend Librería — Programación III UTN.
- **Etapa:** Ejercicio 4 (alta de libros y clientes con validación y actualización dinámica).
- **Rama Git actual:** `feature/ejercicio-4`.
- **Estado previo verificado:**
  - Ejercicio 1 (estructura HTML multipágina: `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`) completo y especificado en `openspec/specs/estructura-html/`.
  - Ejercicio 2 (CSS externo, identidad visual, diseño adaptable) completo y especificado en `openspec/specs/estilos-css/`.
  - Ejercicio 3 (datos locales, catálogo y filtro) completo y especificado en `openspec/specs/datos-catalogo-filtro/`; su change fue archivado en `openspec/changes/archive/2026-10-17-ejercicio-3-datos-filtro/`.
  - `js/ejercicio3.js` contiene los arrays de datos (2 editoriales, 2 géneros, 3 autores, 3 clientes, 6 libros con `generoId` nulo en un caso) y la lógica de catálogo/filtro de la página independiente `ejercicio3.html`.
  - **Campos faltantes verificados en `js/ejercicio3.js`:** los libros NO tienen `precio` y los clientes NO tienen `email`; el Ejercicio 4 exige ambos campos, por lo que el modelo de datos debe extenderse.
  - `js/app.js` es únicamente un **placeholder** con la lista de IDs reservados y sin comportamiento (`"use strict";`).
  - `libros.html` y `clientes.html` ya poseen los formularios y listados maquetados con datos estáticos de ejemplo en el `tbody`, a ser reemplazados por render dinámico.
- **IDs estables del Ejercicio 1 que NO deben alterarse:** `#form-libro`, `#libro-titulo`, `#libro-isbn`, `#libro-precio`, `#libro-editorial`, `#libro-genero`, `#libro-autores`, `#libros-listado`, `#libros-vacio`, `#form-cliente`, `#cliente-nombre`, `#cliente-email`, `#clientes-listado`, `#clientes-vacio`, `#msg-ok`, `#msg-error`, `#venta-cliente`, `#venta-libro`, `#venta-cantidad`, `#venta-renglones`, `#venta-resumen`.
- **Arquitectura de datos propuesta (a confirmar en SPEC):** extraer los arrays compartidos de `js/ejercicio3.js` a un nuevo `js/datos.js` (editoriales, géneros, autores, libros con `precio` y clientes con `email`), cargado por las páginas principales; `ejercicio3.html` pasa a cargar también `js/datos.js` y conserva solo render/filtro. No se duplican los arrays entre archivos.
- **Fuente de requisitos:** `Docs/Repaso Primer Parcial.pdf`, sección «Ejercicio 4 — Alta de libros y clientes» (página 4 de 7), leída y verificada.
- **Entorno:** apertura directa de los `.html` en navegador moderno sin servidor ni build.

## 4. Alcance estricto

### Incluido

- **Opciones de selectores generadas desde datos locales:**
  - Editorial: `<select>` poblado desde el array de editoriales.
  - Género: `<select>` poblado desde el array de géneros, incluyendo obligatoriamente la opción **«Sin clasificar»** que representa la ausencia de género.
  - Autores: `<select multiple>` (o controles de selección equivalentes) poblado desde el array de autores.
- **Extensión del modelo de datos:** agregar `precio` a cada libro de los datos iniciales y `email` a cada cliente, conservando los IDs estables existentes del Ejercicio 3.
- **Alta de libros con validaciones:**
  - Título e ISBN no vacíos.
  - ISBN **inexistente** en el conjunto local, comparado **sin espacios ni guiones** (no se implementa dígito de control).
  - Precio **numérico y mayor que cero**.
  - Editorial existente en los datos locales.
  - **Al menos un autor** seleccionado, y todos los autores seleccionados existentes en los datos locales.
  - Género opcional: si se asigna, debe existir en los datos locales; «Sin clasificar» equivale a ausencia de género.
- **Alta de clientes con validaciones:**
  - Nombre completo y email no vacíos (sin campo de apellido separado).
  - Email con **formato válido**.
  - Email **inexistente** entre los clientes registrados, comparado **sin espacios exteriores y sin distinguir mayúsculas de minúsculas**.
- **Control del envío:** `event.preventDefault()` en ambos formularios; los errores se muestran **cerca del formulario** (texto, no solo color); el registro solo se agrega si **todas** las comprobaciones pasan.
- **Actualización sin recarga:** tras un alta correcta, el listado correspondiente **y las opciones relacionadas** (selectores de clientes/libros u otras listas que consuman esos datos) se actualizan sin recargar la página.
- **Código:** funciones nombradas con responsabilidades reconocibles, inserción de datos de usuario como **texto** en el DOM (`textContent`/`createElement`), activadas por eventos.

### Excluido (bloqueado)

- **NO** lógica del Ejercicio 5 (venta simulada, renglones, cálculos de subtotal/total, confirmación de venta) ni del Ejercicio 6 (`localStorage`, casos manuales, README final).
- **NO** editar ni eliminar registros existentes (libros o clientes).
- **NO** gestión de stock, cobros ni facturación fiscal.
- **NO** traer datos con `fetch` ni administrar altas/bajas/modificaciones de editoriales, géneros o autores (son datos fijos locales).
- **CERO** librerías, frameworks, preprocesadores o transpiladores (prohibido Tailwind, Bootstrap, React, Vue, Sass, Less, Babel, etc.).
- **CERO** CDNs, fuentes o recursos externos que requieran internet.
- **CERO** servidores, npm, bundlers ni base de datos.
- **NO** modificar los Ejercicios 1 y 2 (estructura semántica, `css/estilos.css`) ni alterar los IDs estables listados en el Contexto.
- **NO** duplicar los arrays de datos entre archivos: la fuente única compartida es `js/datos.js` (o la alternativa acordada en SPEC).

## 5. Objetivos de la entrega

1. Generar las **opciones de los selectores** (editorial, género con «Sin clasificar», autores múltiples) a partir de los datos locales, reemplazando las opciones estáticas de ejemplo.
2. Extender el **modelo de datos** con `precio` en libros y `email` en clientes, preservando los IDs estables del Ejercicio 3.
3. Implementar el **alta de libros** con todas sus comprobaciones (título, ISBN único normalizado, precio > 0, relaciones existentes, ≥1 autor, género opcional validado).
4. Implementar el **alta de clientes** con todas sus comprobaciones (nombre, email válido, email único normalizado).
5. Controlar ambos envíos con `preventDefault`, mostrar errores cerca del formulario y **actualizar listados y opciones relacionadas sin recargar** la página.
6. Dejar el código en **funciones reconocibles** con inserción segura de texto en el DOM.

## 6. Requisitos verificables

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R4-01 | Datos | El modelo compartido contiene libros con `precio` y clientes con `email`, conservando los IDs estables del Ejercicio 3; los arrays no están duplicados entre archivos. |
| R4-02 | Selectores | Las opciones de editorial, género y autores se **generan desde JavaScript** a partir de los datos locales (no están escritas a mano en el HTML). |
| R4-03 | Selectores | El selector de género incluye la opción **«Sin clasificar»**, que al enviarse produce un libro sin género asignado. |
| R4-04 | Validación libro | Título e ISBN no vacíos; ISBN **inexistente** comparado **sin espacios ni guiones**; precio numérico y **mayor que cero**. |
| R4-05 | Validación libro | La editorial existe en los datos locales; se selecciona **al menos un autor** y todos los autores existen; el género, si se asigna, existe. |
| R4-06 | Validación cliente | Nombre completo y email no vacíos; email con **formato válido**. |
| R4-07 | Validación cliente | No existe otro cliente con el mismo email, comparado **sin espacios exteriores** y **sin distinguir mayúsculas/minúsculas**. |
| R4-08 | Envío | Ambos formularios usan `preventDefault()`; los errores se muestran **cerca del formulario** con texto explícito (no dependen solo del color). |
| R4-09 | Actualización | Tras un alta correcta, el registro **solo se agrega si todas las comprobaciones pasan**; el listado correspondiente y las opciones relacionadas se actualizan **sin recargar la página**. |
| R4-10 | DOM | Los datos escritos por usuarios y las opciones se insertan como **texto** en el DOM (`textContent`/`createElement`); **prohibido `innerHTML`** con datos de usuario. |
| R4-11 | Código | El código se organiza en **funciones nombradas** con responsabilidades reconocibles (validar libro, validar cliente, agregar libro, agregar cliente, refrescar listados/opciones), activadas por eventos. |
| R4-12 | Integridad | No se modifican los Ejercicios 1 y 2 ni los IDs estables; no se implementa alcance de los Ejercicios 5 ni 6; la página abre por `file://` sin dependencias. |

**Verificación observable (casos límite esperados):**
- ISBN con espacios o guiones que coincide con uno existente normalizado (p. ej. `978-0000000011` vs `978000000011`) → rechazado como duplicado.
- Precio `0`, negativo, vacío o no numérico → rechazado.
- Envío de libro sin autores seleccionados → rechazado.
- Género «Sin clasificar» → el libro se registra sin género y el listado lo muestra de forma legible.
- Email existente con distintas mayúsculas y espacios exteriores (p. ej. `  ana.perez.ejemplo@correo.ficticio `) → rechazado como duplicado.
- Email con formato inválido (p. ej. `sin-arroba`) → rechazado.
- Alta válida de libro o cliente → aparece en su listado y en las opciones relacionadas sin recargar.

## 7. Fases

### Fase 1 — SPEC
1. Inspeccioná el estado actual de la rama `feature/ejercicio-4` (incluyendo `js/ejercicio3.js`, `libros.html`, `clientes.html` y `js/app.js`).
2. Creá el change de OpenSpec (`openspec new change "ejercicio-4-altas"`) y generá `proposal.md` + `spec.md`.
3. En `spec.md` documentá: modelo de datos extendido (`precio`, `email`), estrategia de archivo compartido `js/datos.js`, población de selectores, reglas de validación de libros y clientes con normalización de ISBN/email, mensajes de estado y actualización sin recarga, con escenarios observables y casos límite.
4. Declará supuestos, información pendiente y decisiones que requieran respuesta del usuario (en particular, confirmar la extracción a `js/datos.js` y el impacto en `ejercicio3.html`).
5. Checkpoint: **“SPEC lista. ¿Continuar a PLAN, Ajustar SPEC o Parar?”** — no avances sin respuesta.

### Fase 2 — PLAN
1. Generá `tasks.md` con tareas atómicas, cada una con: identificador, resultado esperado, requisito/CA que cubre, archivos a crear o modificar, dependencias y orden, y comprobación de cierre.
2. Tareas mínimas esperadas: extracción/extensión del modelo a `js/datos.js`; población de selectores; validación y alta de libro; validación y alta de cliente; refresco de listados y opciones relacionadas; verificación manual por navegador.
3. Checkpoint: **“PLAN listo. ¿Autorizar IMPLEMENTACIÓN, Ajustar PLAN o Parar?”**.

### Fase 3 — IMPLEMENTACIÓN
1. Iniciá únicamente tras la autorización explícita.
2. Implementá lo planificado usando JavaScript nativo, `textContent`/`createElement`/`replaceChildren`, y funciones nombradas.
3. Reemplazá las filas y opciones estáticas de ejemplo por contenido generado desde JavaScript; no modifiques los Ejercicios 1 y 2 ni los IDs estables; no implementes alcance de los Ejercicios 5 ni 6.
4. Registrá evidencia de cada verificación (pasa/falla), sin declarar aprobado lo no ejecutado.

### Fase 4 — VERIFICACIÓN Y CIERRE
1. Verificación manual en navegador por `file://` en `libros.html` y `clientes.html`: opciones dinámicas, «Sin clasificar», rechazo de ISBN duplicado normalizado, precio inválido, sin autores, email inválido y email duplicado case-insensitive, y actualización sin recarga tras un alta válida.
2. Marcá los checkboxes de `tasks.md` solo con controles efectivamente ejecutados.
3. Con aprobación del usuario, archivá el change (`openspec archive`) y dejá constancia en el historial.

## 8. Criterios de aceptación

- **CA4-01 (Libros y selectores — 6 pts):** Los selectores de editorial, género (con «Sin clasificar») y autores se generan desde los datos locales; el alta de libro valida título, ISBN único normalizado, precio > 0, relaciones existentes y ≥1 autor, y el libro registrado aparece en el listado sin recargar (cubre R4-01/R4-02/R4-03/R4-04/R4-05).
- **CA4-02 (Clientes — 4 pts):** El alta de cliente valida nombre completo, formato de email y email único normalizado (sin espacios exteriores, case-insensitive); el cliente registrado aparece en el listado sin recargar (cubre R4-06/R4-07).
- **CA4-03 (Validación y actualización — 5 pts):** `preventDefault` en ambos formularios, errores cerca del formulario con texto explícito, alta solo con todas las comprobaciones pasando y actualización de listados y opciones relacionadas sin recargar la página (cubre R4-08/R4-09).
- **CA4-04 (Calidad de código):** Código en funciones reconocibles, activado por eventos, con inserción segura vía `textContent` (sin `innerHTML`) (cubre R4-10/R4-11).
- **CA4-05 (Integridad y compatibilidad):** No se alteran Ejercicios 1 y 2 ni IDs estables; no se adelanta alcance de los Ejercicios 5 ni 6; las páginas abren por `file://` sin dependencias (cubre R4-12).

## 9. Restricciones anti-alucinación

- No inventes requisitos, funcionalidades, archivos existentes, APIs, contratos, credenciales, datos reales ni resultados de comprobaciones.
- Diferenciá **hechos verificados**, **supuestos** y **propuestas**; atribuí los hechos al código inspeccionado o a `Docs/Repaso Primer Parcial.pdf` (Ejercicio 4, página 4) cuando corresponda.
- Si falta un dato no bloqueante, usá `DATO_PENDIENTE: descripción` y no lo reemplaces por un valor que parezca real.
- Si un dato faltante afecta el alcance o una decisión esencial (p. ej. la estrategia del archivo de datos compartido), **preguntá antes de avanzar** con el trabajo afectado.
- No afirmes haber leído una fuente, ejecutado una herramienta o validado un resultado si no ocurrió.
- Usá datos ficticios solo cuando estén autorizados, señalándolos como ejemplos.
- Ante requisitos contradictorios, señalá la contradicción y pedí una decisión; no elijas en silencio.
- No declares completa la entrega si quedan criterios sin verificar; enumerá pendientes y motivos.
- **No sobrescribas** archivos existentes sin revisarlos, **no modifiques** los Ejercicios 1 y 2, y **no hagas commits ni push** salvo pedido explícito.

## 10. Instrucción de inicio

Empezá únicamente por la **Fase 1 — SPEC**. Inspeccioná el estado de la rama `feature/ejercicio-4` y los archivos `js/ejercicio3.js`, `libros.html`, `clientes.html` y `js/app.js`, generá los artefactos `proposal.md` y `spec.md` del change `ejercicio-4-altas`, presentalos para revisión —incluyendo la decisión sobre extraer los datos a `js/datos.js`— y esperá la respuesta con **“Continuar a PLAN, Ajustar SPEC o Parar”**. No avances a PLAN ni IMPLEMENTACIÓN sin aprobación explícita.  
