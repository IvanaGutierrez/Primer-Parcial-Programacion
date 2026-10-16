# Tasks — ejercicio-1-estructura-html · Fase 2 PLAN (Ejercicio 1, sin código aún)

> Decisión de arquitectura CONFIRMADA por la usuaria: MULTIPÁGINA — `index.html`
> (Catálogo) + `libros.html` + `clientes.html` + `ventas.html` + `historial.html`.
> Si algún artefacto SPEC aún menciona la alternativa por secciones con anclas,
> este plan asume multipágina como ajuste menor ya autorizado; no se implementa
> la variante por secciones. Nada de este plan crea código todavía: los archivos
> .html/.css/.js se DECLARAN pero se crean recién en Fase 3 (apply, bloqueada).
> Orden: T1 primero; T2–T6 en paralelo tras T1; T7 tras T2–T6; T8 al final.
> Nota CLI: `design.md` no existe en este change (fase SPEC sin diseño); este
> `tasks.md` sigue el formato checklist que exige el CLI (`- [x] X.Y …` con
> verificación en cada tarea) y referencia `spec.md` + `specs/estructura-html/spec.md`.

## 1. T1 — Estructura de archivos y base común multipágina (R-01, R-02, R-06; CA-01, CA-02)

- [x] 1.1 T1 — Declarar estructura de archivos/directorios y crear base común header/nav/main/footer con nav de 5 enlaces y activo por página en `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` (declara `css/estilos.css` vía `<link>` y `js/app.js` vía `<script src>`, sin crear lógica) y verificar por inspección que cada página tiene header/nav/main/footer, nav con 5 enlaces (Catálogo·Libros·Clientes·Ventas·Historial, ≤2 clics entre vistas) y marca de activo por página

## 2. T2 — Catálogo en index.html (R-01, R-02, R-03, R-07; CA-01, CA-02, CA-03)

- [x] 2.1 T2 — Crear en `index.html` el buscador (`#buscador-titulo` input + botón "Buscar por título") con `#catalogo-listado` (tabla con thead/th: título, ISBN, editorial, género, autores, precio), `#catalogo-mensaje` y 2–3 libros ficticios incluyendo uno «Sin clasificar», y verificar por inspección HTML que ids, columnas thead/th y ejemplos ficticios existen

## 3. T3 — Libros en libros.html (R-01, R-02, R-03, R-07; CA-01, CA-02, CA-03)

- [x] 3.1 T3 — Crear en `libros.html` `#form-libro` (campos `#libro-titulo`, `#libro-isbn`, `#libro-precio`, `#libro-editorial` select, `#libro-genero` select con opción «Sin clasificar», `#libro-autores` multi, cada campo con `label for/id`, botón "Registrar libro") más tabla `#libros-listado` con ejemplos, y verificar por inspección que labels, ids exactos, thead/th y botón existen

## 4. T4 — Clientes en clientes.html (R-01, R-02, R-03, R-07; CA-01, CA-02, CA-03)

- [x] 4.1 T4 — Crear en `clientes.html` `#form-cliente` (`#cliente-nombre` nombre completo, `#cliente-email` email, labels for/id, botón "Registrar cliente") más tabla `#clientes-listado` (nombre completo, email) con 2 ejemplos ficticios, y verificar por inspección que formulario, listado y ejemplos existen con ids exactos

## 5. T5 — Ventas en ventas.html (R-01, R-02, R-03, R-07; CA-01, CA-02, CA-03)

- [x] 5.1 T5 — Crear en `ventas.html` `#venta-cliente` (select), `#venta-libro` (select), `#venta-cantidad`, botón "Agregar renglón", tabla `#venta-renglones` (libro, cantidad, precio unitario, subtotal) con 1–2 renglones ejemplo, `#venta-resumen` (total) y botón "Confirmar venta", y verificar por inspección que selects, tabla con thead/th, resumen y ejemplos existen

## 6. T6 — Historial en historial.html (R-01, R-02, R-03, R-07; CA-01, CA-02, CA-03)

- [x] 6.1 T6 — Crear en `historial.html` tabla `#historial-listado` (id, fecha, cliente, total) con 1–2 ventas ejemplo más zona `#historial-detalle` con acceso a detalle (enlace/botón por venta), y verificar por inspección y navegación manual que el listado, el detalle y el acceso existen

## 7. T7 — Mensajes y estados en DOM (R-03; CA-03)

- [x] 7.1 T7 — Crear placeholders de lista vacía con id por cada listado, `#catalogo-mensaje` sin resultados y `#msg-ok` / `#msg-error` por página que opere (textos estáticos tipo «No hay registros», «Sin resultados…», éxito/error de ejemplo), depende de T2–T6, y verificar por inspección del DOM que cada placeholder y zona de mensaje existe con id exacto

## 8. T8 — CSS mínimo, JS placeholder y verificación manual integral (R-04, R-05; CA-04 + CA-01..CA-03)

- [x] 8.1 T8 — Crear `css/estilos.css` mínimo externo (sin ocultar foco, tablas anchas con contenedor de scroll propio) enlazado desde las 5 páginas sin ningún atributo `style` inline, y verificar por inspección que hay un solo `<link>` por página y cero `style` inline
- [x] 8.2 T8 — Crear `js/app.js` placeholder (solo contenedor/ids, sin lógica de Ej. 3–5: sin render, filtro funcional, validaciones, cálculos ni confirmación) referenciado por las 5 páginas, y verificar por inspección que el archivo solo reserva hooks sin comportamiento
- [x] 8.3 T8 — Verificación manual integral file:// (doble clic `index.html`, sin npm/servidor/consola de red): navegar las 5 vistas, comprobar 320px y 1280px sin scroll horizontal total, Tab con foco visible en todos los controles, y re-verificar CA-01 (5 vistas con ejemplos), CA-02 (semántica/labels/botones/th), CA-03 (casos límite en DOM) y CA-04 (file://, anchos, foco); depende de T1–T7 y cierra la Fase 3
