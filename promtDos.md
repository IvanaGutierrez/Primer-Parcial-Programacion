# PROMPT DE INICIO — EJERCICIO 2 (TPI PROGRAMACIÓN III - UTN)
## 1. Rol
Actúas como un **Desarrollador Frontend Senior** y **Especialista en Metodología OpenSpec (CLI 1.13.2)**, encargado de la ejecución guiada y rigurosa del Ejercicio 2 del Trabajo Práctico Integrador (TPI) de Programación III (UTN Mendoza).

## 2. Metodología y Flujo de Trabajo
Seguirás estrictamente el ciclo de vida **OpenSpec Spec-Driven Development**:
1. **Fase 1 — SPEC:** Creación de `proposal.md` y `spec.md` dentro de un nuevo change `ejercicio-2-estilos-css`.
2. **Fase 2 — PLAN:** Generación del plan de tareas atómicas en `tasks.md`.
3. **Fase 3 — IMPLEMENTACIÓN:** Modificación exclusiva de `css/estilos.css` (y ajuste mínimo de clases en los HTML solo de ser estrictamente necesario).
4. **Fase 4 — VERIFICACIÓN Y ARCHIVO:** Comprobación responsive, accesibilidad y archivo del change (`openspec archive`).

## 3. Contexto del Proyecto
- **Proyecto:** TPI Frontend Librería — Programación III UTN.
- **Estado previo verificado:** El Ejercicio 1 (Estructura HTML multipágina: `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`) se encuentra completo, commiteado en la rama `main` y con su especificación instalada en `openspec/specs/estructura-html/`.
- **Rama Git actual:** `ejercicio-2-estilos`.
- **Fuente de requisitos:** `Docs/Repaso Primer Parcial.pdf`, página 3, sección "Ejercicio 2. 2. Presentación con CSS y uso adaptable" (20 puntos).

## 4. Alcance Estricto
### INCLUIDO:
- Definición de identidad visual propia y coherente (paleta de colores, tipografía, espaciados, tarjetas, botones, formularios, tablas).
- Archivo CSS externo centralizado (`css/estilos.css`) con reutilización de clases.
- Layout responsive usando Flexbox o Grid.
- Verificación a **320 px** (móvil) y **1280 px** (escritorio) sin desplazamiento horizontal total (`overflow-x` global no permitido).
- Tablas con scroll horizontal contenido exclusivamente en su propio contenedor responsivo (`overflow-x: auto` en contenedor).
- Accesibilidad básica: estado `:focus` claramente visible navegable por teclado, contraste suficiente y mensajes de error/éxito por texto explícito (no depender solo de color).

### EXCLUIDO (Bloqueado):
- NO agregar lógica JavaScript activa ni manipular datos locales (corresponde a Ejercicios 3, 4 y 5).
- CERO librerías, frameworks o preprocesadores (prohibido Tailwind, Bootstrap, Sass, Less, etc.).
- CERO CDNs o fuentes/recursos externos que requieran internet.
- CERO servidores o npm (apertura directa vía protocolo `file://`).

## 5. Objetivos de la Entrega (Ejercicio 2)
1. Convertir la maqueta HTML cruda del Ejercicio 1 en una interfaz visual atractiva, profesional y accesible.
2. Garantizar adaptabilidad responsiva fluida en dispositivos móviles y de escritorio.
3. Dejar el código CSS limpio, estructurado por secciones y reutilizable.

## 6. Requisitos Verificables Fases
- **Fase 1 (SPEC):** Change creado (`openspec new change "ejercicio-2-estilos-css"`), `proposal.md` con propuesta estética/paleta de colores, y `spec.md` con criterios de maquetación y reglas CSS.
- **Fase 2 (PLAN):** `tasks.md` generado con tareas atómicas verificables.
- **Fase 3 (IMPLEMENTACIÓN):** `css/estilos.css` redactado por completo.
- **Fase 4 (CIERRE):** Verificación manual, checklist en 100% y `openspec archive` ejecutado.

## 7. Criterios de Aceptación (CA-Ejercicio 2)
- **CA-01 (Identidad Visual - 8 pts):** Coherencia gráfica en las 5 páginas en tipografía, botones, formularios y tablas.
- **CA-02 (Adaptación Responsive - 8 pts):** Sin scroll horizontal a 320px ni 1280px. Tablas con desplazamiento interno.
- **CA-03 (Accesibilidad Básica - 4 pts):** Indicadores de foco `:focus` visibles e intencionados en todos los elementos interactivos. Mensajes de error expresados en texto.

## 8. Restricciones Anti-Alucinación
- NO declarar aprobado ningún test responsive ni visual sin solicitar antes la verificación manual del usuario.
- NO alterar los IDs estables del DOM creados en el Ejercicio 1 (`#catalogo-listado`, `#catalogo-mensaje`, `#form-libro`, `#form-cliente`, `#venta-renglones`, `#historial-detalle`, `#msg-ok`, `#msg-error`).
- Atribuir siempre los requisitos a la pág. 3 del PDF del parcial.

## 9. Instrucción de Inicio Inmediata
1. **Crear el archivo `promtDos.md`** en la raíz del proyecto y pegar este prompt completo en su interior para dejar constancia formal del inicio del Ejercicio 2.
2. Ejecutar la **Fase 1 (SPEC)**: Inicializar el change `openspec new change "ejercicio-2-estilos-css"` y generar `proposal.md` y `spec.md`.
3. Informar los artefactos creados y solicitar la aprobación para avanzar a la Fase 2 (PLAN).

---

## Historial de Prompts y Decisiones (Ejercicio 2) — completado 2026-10-16

Bitácora de la secuencia SDD SPEC → PLAN → IMPLEMENTACIÓN → Cierre, ejecutada en la rama `ejercicio-2-estilos` vía orquestador + OpenSpec CLI **1.13.2**.

### P1 — SPEC (Fase 1)
Prompt de inicio (este documento): rol Desarrollador Frontend Senior + Especialista OpenSpec, con orden de crear `promtDos.md` y ejecutar Fase 1 sin tocar producto.
Resultado: change `ejercicio-2-estilos-css` creado por CLI, artefactos `proposal.md` + `spec.md` (+ espejo delta `specs/estilos-css/spec.md`). `openspec validate` → válido. Checkpoint: "SPEC lista. ¿Continuar a PLAN, Ajustar SPEC o Parar?".

### P2 — PLAN (Fase 2)
Orden de la usuaria: "continuar a plan" (paleta aprobada).
Resultado: `tasks.md` con 13 tareas (1.1–7.2) en 7 grupos cubriendo R2-01–R2-06 y CA-01/CA-02/CA-03. Checkpoint: "PLAN listo. ¿Autorizar IMPLEMENTACIÓN, Ajustar PLAN o Parar?".

### P3 — IMPLEMENTACIÓN (Fase 3)
Orden de la usuaria: "autorizo implementacion".
Resultado: `css/estilos.css` reescrito completo (384 líneas, 11 secciones comentadas en español). Único archivo de producto tocado: HTML sin cambios (ningún ajuste de clases fue necesario), `js/app.js` intacto, ningún id alterado. Verificación técnica por grep: `style=` → 0, `<style|@import|http` → 0, `overflow-x` solo `auto` en `.tabla-contenedor`, 10 hex en `:root`, 8 ids núcleo + 5 de vacío intactos.

### P4 — Cierre (Fase 4)
Verificación manual en navegador realizada y **aprobada** por la usuaria: apertura `file://`, responsive 320/1280 px sin scroll horizontal global (tablas con scroll interno), navegación por teclado con foco visible. Checkboxes de `tasks.md` marcados 13/13, change archivado, spec `estilos-css` instalada en `openspec/specs/`, commit en rama `ejercicio-2-estilos`.

### Paleta adoptada
Fondo `#F6F1E7` · superficie `#FFFFFF` · primario `#1E3A5F` · acento `#B4552D` · texto `#1A1A1A`/secundario `#4A4A4A` · borde `#D8CFC0` · éxito `#1E7A34` · error `#B3261E` · foco `#005FCC`. Tipografía del sistema sin CDN: `system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`.

### Decisiones adoptadas
- Implementación limitada a `css/estilos.css`; HTML solo condicional (no hizo falta), ids del Ej. 1 intocables.
- Formularios multi-campo apilados a propósito (sus pares label/campo hermanos no admiten grid de 2 columnas sin romper el apilado).
- Sin `design.md` (no requerido por el alcance).
