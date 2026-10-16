# Prompt Ejercicio 1 — Listo para orquestador active-stack

## Rol

Actuá como arquitecto frontend SDD con experiencia en HTML semántico y maquetación de sistemas de gestión (librería: catálogo, libros, clientes, ventas, historial) y responsabilidad sobre definir SPEC verificable, plan atómico e implementación acotada al Ejercicio 1 sin agregar lógica de ejercicios posteriores.

## Metodología

- Metodología a utilizar: SDD con flujo SPEC → PLAN → IMPLEMENTACIÓN vía active-orchestrator + OpenSpec (openspec init, kb-creator, roadmap-generator con 1 change, agent-instruction). Delegá a sub-skills, no implementes lógica vos mismo en fase SPEC.
- Herramientas y convenciones: HTML5 + CSS3 externo mínimo + JS nativo solo si es imprescindible para placeholder; sin librerías ni frameworks; validación manual con checklist observable; checkpoints con pregunta explícita Continuar / Ajustar / Parar al final de cada fase.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a OpenSpec (proposal.md / tasks.md / spec.md dentro del change).
- No escribas código ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles (ej. CLI openspec no instalado, sub-skill faltante), informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: TPI frontend de una librería — Programación III UTN (Etapa 1 / Ejercicio 1).
- Propósito y usuarios: maqueta navegable de librería que presenta catálogo y anticipa registro de libros, clientes y ventas para la materia; destinatarios: docente evaluador y estudiantes que continuarán con Ej. 2-6.
- Ubicación o repositorio: `C:\Users\Ivana Gutierrez\Documents\Primer-Parcial-Programacion` (trabajo local, apertura por archivo).
- Estado actual verificado: solo existe `Docs/Repaso Primer Parcial.pdf`; no hay `index.html`, ni carpetas `css/`, `js/`, ni `README.md`. Sin código previo.
- Fuentes de requisitos: `Docs/Repaso Primer Parcial.pdf`, páginas 1-2, sección Ejercicio 1 · 1. Estructura y pantallas HTML (20 puntos: 10 vistas y navegación + 10 semántica, formularios y estados).
- Tecnologías y dependencias permitidas: HTML5 semántico, CSS3 en archivos externos (mínimo para estructura legible), JavaScript nativo solo como placeholder/contenedores con ids (sin lógica completa de Ej. 3-5).
- Tecnologías y dependencias excluidas: librerías, frameworks, CDNs de CSS o JS, npm / bundlers / compiladores, API, base de datos, servidor, conexión backend, login real.
- Punto de entrada o componente afectado: `index.html` como entrada; navegación clara a 5 vistas (multipágina o secciones en misma página con anclas/nav).
- Condiciones del entorno: apertura directa de `index.html` en navegador moderno sin servidor ni build; verificación visual a 320 px y 1280 px solo para no romper layout (sin exigir responsive completo del Ej. 2).

## Alcance estricto

### Objetivo de esta entrega

Entregar estructura HTML navegable con las 5 vistas del Ejercicio 1 usando datos estáticos de ejemplo, etiquetas semánticas, formularios etiquetados, tablas con encabezados y mensajes de estado previstos, dejando ids/contenedores listos para el JS futuro.

### Incluido

- `index.html` + páginas/secciones para: Catálogo (título librería, buscador por título, listado con título, ISBN, editorial, género, autores, precio; «Sin clasificar» si no hay género), Libros (form alta + listado), Clientes (form alta + listado), Ventas (selector cliente, composición renglones, resumen), Historial (listado ventas + acceso a detalle).
- `header`, `nav`, `main` (+ `footer`) semánticos y navegación clara entre vistas.
- Formularios con `label for/id` por campo, botones con texto de acción ("Registrar libro", "Registrar cliente", "Buscar por título", "Agregar renglón", "Confirmar venta"), tablas con `thead/th`.
- Mensajes previstos en DOM: lista vacía, búsqueda sin resultados, operación correcta, operación rechazada (pueden ser estáticos/ocultos con ids).
- Datos estáticos de ejemplo (2-3 por listado) marcados como ejemplos, más contenedores con `id` estables para futuro JS (ej. `#catalogo-listado`, `#catalogo-mensaje`, `#form-libro`, `#form-cliente`, `#venta-renglones`, `#historial-detalle`).

### Excluido

- Estilos completos e identidad visual del Ejercicio 2 (solo CSS mínimo estructural externo).
- Lógica JS de Ejercicios 3-5 (render desde arrays, filtro funcional, validaciones, cálculos, confirmación de venta).
- Persistencia localStorage, README de pruebas manuales y documentación final del Ejercicio 6.
- Editar/eliminar registros, gestión de stock, cobros, facturación, ABM de editoriales/géneros/autores, fetch de datos.

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Funcional | Las 5 vistas existen y son alcanzables desde `nav` en ≤2 clics: Catálogo, Libros, Clientes, Ventas, Historial. Cada vista muestra su contenido mínimo descrito en Incluido con datos estáticos de ejemplo. |
| R-02 | Estructura e interfaces | `header/nav/main/footer` semánticos; formularios Libro (título, ISBN, precio, editorial select, género select con «Sin clasificar», autores multi), Cliente (nombre completo, email), Venta (select cliente, select libro, cantidad, tabla renglones, resumen total), Historial (tabla ventas + zona detalle); todo input con `label for/id`; botones con verbo de acción; tablas con `thead/th`. |
| R-03 | Datos y estados | Cada listado tiene estado con datos de ejemplo y placeholder de vacío con `id`; buscador de catálogo con `input + botón Buscar` y zona `#catalogo-mensaje` para "sin resultados"; zonas `#msg-ok` y `#msg-error` para operaciones correctas/rechazadas; libro sin género muestra «Sin clasificar». |
| R-04 | Calidad | HTML válido sin estilos inline; CSS solo en archivo externo `css/estilos.css`; ids y clases en español, legibles; foco visible por teclado sin CSS que lo oculte; imágenes solo si son locales con `alt` (o ninguna). |
| R-05 | Compatibilidad | `index.html` abre por doble clic/file:// sin npm ni servidor; sin desplazamiento horizontal total a 320 px y 1280 px (tablas con contenedor de scroll propio si exceden). |
| R-06 | Convenciones | Archivos: `index.html` (+ `libros.html`, `clientes.html`, `ventas.html`, `historial.html` o secciones `#catalogo`, `#libros`, etc.); carpetas `css/`, `js/` (js solo placeholder), `assets/` si hay imágenes; nombres en minúsculas sin espacios. |
| R-07 | Preparación futura | Todos los listados, formularios, mensajes y tablas llevan `id` estable documentado en SPEC para que Ej. 3-5 los reutilice; no se implementa comportamiento futuro, solo se reserva el hook. |

Datos de ejemplo: 2-3 libros (uno con género y uno «Sin clasificar», con título, ISBN, editorial, género, autores, precio), 2 clientes, 1-2 renglones de venta de ejemplo y 1-2 ventas en historial. Identificados como ejemplos ficticios; no presentarlos como datos reales.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná `Docs/Repaso Primer Parcial.pdf` y verificá que no existe código previo antes de definir la solución.

Generá `openspec/changes/ejercicio-1-estructura-html/proposal.md` + `spec.md` con:

1. Problema, objetivo y resultado esperado (maqueta Ej. 1 navegable).
2. Contexto verificado y referencias concretas (PDF pág. 1-2, estado actual sin código).
3. Alcance incluido y exclusiones explícitas (tal como arriba).
4. Requisitos R-01 a R-07 y escenarios observables, incluidos casos límite: libro sin género → «Sin clasificar»; lista vacía; búsqueda sin resultados.
5. Estructura propuesta: mapa de páginas/secciones, `nav`, formularios con campos e ids, tablas con columnas, contenedores de mensajes con ids.
6. Estados y manejo de errores previstos en DOM (vacío, sin resultados, ok, error).
7. Restricciones técnicas y convenciones (solo nativo, sin CDN, externo CSS, file://).
8. Criterios de aceptación CA-01 a CA-04 vinculados a requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta (ej. ¿multipágina o SPA por secciones? proponer una y pedir confirmación).

Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta.

Al terminar, presentá la especificación para revisión y detenete. Preguntame: "SPEC lista. ¿Continuar a PLAN, Ajustar SPEC o Parar?". No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar con "Continuar a PLAN", generá `openspec/changes/ejercicio-1-estructura-html/tasks.md` con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Tareas mínimas esperadas: T1 crear `index.html` + `nav`; T2 Catálogo estático; T3 Libros form+listado; T4 Clientes form+listado; T5 Ventas form+renglones+resumen; T6 Historial+detalle; T7 mensajes/estados; T8 CSS externo mínimo + revisión 320/1280 + teclado.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar. Al terminar presentá el plan y preguntá: "PLAN listo. ¿Autorizar IMPLEMENTACIÓN, Ajustar PLAN o Parar?".

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación con "Autorizar IMPLEMENTACIÓN".

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá convenciones: HTML5 semántico, CSS externo, ids en español estables, sin inline, sin frameworks.
- Respetá política de verificación manual: checklist visual por vista (existe, navega, labels, th, mensajes presentes, «Sin clasificar» visible, file:// funciona, 320/1280 sin scroll total, Tab recorre con foco). Registrá evidencia con lista pasa/falla, sin declarar aprobado lo no ejecutado.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá carpeta con `index.html`, demás HTML, `css/`, `js/` placeholder, `assets/` si aplica, junto con un resumen de cambios, comprobaciones realizadas, limitaciones y pendientes (lo pendiente de Ej. 2-6 como propuesta, no implementado).

## Criterios de aceptación

- [ ] CA-01 — Las 5 vistas cargan desde `nav` con datos de ejemplo y cubren R-01 (verificado por navegación manual).
- [ ] CA-02 — Estructura semántica, labels, botones descriptivos y `th` presentes en todas las vistas y cubren R-02/R-06 (verificado por inspección HTML).
- [ ] CA-03 — Casos límite visibles: «Sin clasificar», lista vacía, sin resultados, ok/error presentes en DOM y cubren R-03 (verificado por inspección).
- [ ] CA-04 — Apertura file:// sin errores, 320/1280 sin scroll total, Tab con foco visible y cubre R-04/R-05 (verificado manualmente).
- [ ] Se cubre todo el alcance aprobado y no se incorpora trabajo excluido.
- [ ] Se respetan las tecnologías, dependencias y convenciones permitidas.
- [ ] Las comprobaciones exigidas se ejecutaron y sus resultados se informan con evidencia.
- [ ] Se distinguen los controles aprobados, fallidos, omitidos y pendientes; ningún control no ejecutado se presenta como aprobado.
- [ ] Los supuestos, placeholders pendientes y limitaciones quedan identificados.

## Restricciones anti-alucinación

- No inventes requisitos, funcionalidades, archivos existentes, APIs, contratos, credenciales, datos reales ni resultados de comprobaciones.
- Diferenciá los hechos verificados, los supuestos y las propuestas. Atribuí los hechos a `Docs/Repaso Primer Parcial.pdf` cuando corresponda.
- Si falta un dato no bloqueante, usá `DATO_PENDIENTE: descripción` y declaralo como pendiente. No lo reemplaces con un valor que parezca real.
- Si el dato faltante afecta el alcance, una decisión esencial o la validez de la solución (ej. multipágina vs. secciones), preguntá antes de avanzar con el trabajo afectado.
- No afirmes haber leído una fuente, ejecutado una herramienta o validado un resultado si no ocurrió. Si no tenés acceso, informalo.
- Usá datos ficticios solo cuando estén autorizados (listados de ejemplo) y señalalos como ejemplos.
- Ante requisitos contradictorios, señalá la contradicción y pedí una decisión; no elijas silenciosamente.
- No declares completa la entrega si quedan criterios sin verificar. Enumerá los pendientes y sus motivos.

## Instrucción de inicio

Empezá ahora únicamente por la **Fase 1 — SPEC**. Generá los documentos `proposal.md` y `spec.md` indicados, presentalos para revisión y esperá mi respuesta con "Continuar a PLAN, Ajustar SPEC o Parar". No avances automáticamente a PLAN ni IMPLEMENTACIÓN. Antes de implementar, solicitá mi aprobación explícita de la especificación y mi autorización para iniciar la Fase 3.

---

## Historial de Prompts y Decisiones (Ejercicio 1) — completado 2026-10-16

Bitácora de la secuencia SDD SPEC → PLAN → IMPLEMENTACIÓN → Cierre → Archivo, ejecutada vía orquestador + OpenSpec CLI **1.13.2**.

### P1 — SPEC (Fase 1)
Prompt inicial: este mismo documento (`promtUno.md`), rol de arquitecto frontend SDD, con instrucción de empezar únicamente por Fase 1 — SPEC sin escribir código de producto.
Resultado: fundación OpenSpec inicializada (`openspec init`), change `ejercicio-1-estructura-html` creado, artefactos `proposal.md` + `spec.md` (+ espejo delta `specs/estructura-html/spec.md`). `openspec validate` → change válido. Checkpoint: "SPEC lista. ¿Continuar a PLAN, Ajustar SPEC o Parar?".

### P2 — PLAN (Fase 2)
Prompt del usuario con **decisión de arquitectura confirmada: MULTIPÁGINA** (`index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`) y orden de generar exclusivamente `tasks.md`, sin código.
Resultado: `tasks.md` con 10 tareas (grupos T1–T8) cubriendo R-01–R-07 y CA-01–CA-04. `openspec status` → proposal done, specs done, tasks done. Checkpoint: "PLAN listo. ¿Autorizar IMPLEMENTACIÓN, Ajustar PLAN o Parar?".

### P3 — IMPLEMENTACIÓN (Fase 3)
Prompt del usuario autorizando ejecutar T1–T8: crear las 5 páginas HTML semánticas, `css/estilos.css` mínimo, `js/app.js` placeholder, respetando ids estables y restricciones (sin frameworks/CDNs/npm, apertura `file://`).
Resultado: 5 HTML + `css/estilos.css` + `js/app.js` creados. Verificado por inspección: 0 estilos inline, los 8 ids estables presentes (`#catalogo-listado`, `#catalogo-mensaje`, `#form-libro`, `#form-cliente`, `#venta-renglones`, `#historial-detalle`, `#msg-ok`, `#msg-error`), «Sin clasificar» visible, ejemplos marcados como ficticios.

### P4 — Cierre (verificación + checkboxes)
Prompt del usuario: marcar checkboxes de `tasks.md` como `[x]` y dejar el change activo para revisión manual.
Resultado: 10/10 tareas completadas en `openspec list` (status `complete`, sin archivar). Verificación manual en navegador (`file://`, 320 px / 1280 px, navegación entre vistas) realizada y **aprobada** por la usuaria.

### P5 — Archivo
Prompt del usuario: archivar el change tras verificación exitosa.
Resultado: `openspec archive ejercicio-1-estructura-html` → archivado como `2026-10-16-ejercicio-1-estructura-html`, spec principal `estructura-html` (7 requirements) sincronizada en `openspec/specs/`. `openspec list` → sin changes pendientes.

### P6 — Bitácora + primer commit (este registro)
Prompt del usuario: agregar esta sección de historial a `promtUno.md` y realizar el primer commit en Git.

### Decisiones adoptadas
- **Arquitectura MULTIPÁGINA** (confirmada por la usuaria en P2; recomendada por simplicidad con `file://` y vistas evaluables por separado).
- Nombre placeholder «Librería Ejemplo» (DATO_PENDIENTE: confirmar nombre comercial real).
- Cero imágenes en Etapa 1 (DATO_PENDIENTE: confirmar).
- Metodología: orquestador que delega a sub-agentes vía `task`; sin fase `design.md` (no requerida por el alcance).
