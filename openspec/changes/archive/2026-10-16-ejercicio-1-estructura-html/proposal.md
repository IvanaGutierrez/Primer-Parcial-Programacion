# Proposal — ejercicio-1-estructura-html

## Why

No existe código previo del TPI en el repositorio (verificado: solo `.git/`,
`Docs/Repaso Primer Parcial.pdf` y `promtUno.md`; sin `index.html`, `css/`,
`js/` ni `README.md`). El Ejercicio 1 exige una maqueta HTML navegable con las
5 vistas de la librería (20 puntos: 10 vistas y navegación + 10 semántica,
formularios y estados, según `Docs/Repaso Primer Parcial.pdf`, pág. 2) como
base de los Ejercicios 2-6. Sin esta SPEC no hay contrato verificable para el
PLAN ni la IMPLEMENTACIÓN de la Etapa 1.

## What Changes

- Se crea la SPEC del Ejercicio 1 (este change): `proposal.md` + `spec.md`.
  Sin código de producto en esta fase.
- La SPEC define las 5 vistas con datos estáticos de ejemplo (ficticios):
  Catálogo, Libros, Clientes, Ventas, Historial.
- La SPEC exige estructura semántica (`header`, `nav`, `main`, `footer`),
  formularios con `label for/id`, tablas con `thead/th` y mensajes de estado
  previstos en el DOM (lista vacía, búsqueda sin resultados, ok/error).
- La SPEC reserva `id` estables documentados para el JS futuro de los
  Ejercicios 3-5, sin implementar comportamiento.
- Excluido explícitamente (fuera de este change y de la implementación
  Etapa 1): estilos completos e identidad visual del Ejercicio 2 (solo CSS
  mínimo estructural externo); lógica JS de Ejercicios 3-5 (render desde
  arrays, filtro funcional, validaciones, cálculos, confirmación de venta);
  persistencia `localStorage`, README de pruebas manuales y documentación
  final del Ejercicio 6; editar/eliminar registros, gestión de stock, cobros,
  facturación, ABM de editoriales/géneros/autores, fetch de datos
  (fuente: `promtUno.md`, sección Excluido).
- No se agregan funcionalidades, dependencias, integraciones ni
  refactorizaciones ajenas a esta entrega.

## Capabilities

### New Capabilities

- `estructura-html`: estructura HTML navegable del Ejercicio 1 — 5 vistas,
  semántica, formularios, tablas, estados en DOM, convenciones de archivos e
  ids estables (requisitos R-01 a R-07, criterios CA-01 a CA-04).

### Modified Capabilities

- (ninguna — `openspec list --specs` confirma que el proyecto no tiene specs
  previas que modificar).

## Impact

- Esta fase no toca código de producto: NO se crea ni modifica `index.html`,
  `css/`, `js/`, `assets/` ni `README.md`. Solo documentos SPEC.
- La implementación futura (Fase 3, bloqueada hasta aprobación explícita)
  creará `index.html` (+ páginas o secciones), `css/estilos.css`,
  `js/` placeholder y `assets/` si aplica; apertura por `file://` sin npm,
  servidor, build, API, DB ni login real.
- Sin dependencias nuevas: solo HTML5 + CSS3 externo mínimo + JS nativo
  placeholder. Prohibidos: librerías, frameworks, CDNs, npm/bundlers,
  API/DB/servidor (fuente: `promtUno.md`, Contexto del proyecto).

## Contexto verificado

- Fuente de requisitos: `Docs/Repaso Primer Parcial.pdf`, págs. 1-2,
  sección «Ejercicio 1 · 1. Estructura y pantallas HTML» (leído completo,
  7 páginas). Hechos atribuidos al PDF: entrada `index.html`; se permiten
  varias páginas o secciones con navegación clara; Catálogo (título de la
  librería, buscador por título, listado con título, ISBN, editorial, género,
  autores, precio; «Sin clasificar» si no hay género); Libros (formulario de
  alta + listado); Clientes (formulario de alta + listado); Ventas (selección
  de cliente, composición de renglones, resumen); Historial (listado de ventas
  + acceso a detalles); etiquetas semánticas; cada campo con etiqueta
  asociada; botones con textos de acción; tablas con encabezados; mensajes
  para listas vacías, búsquedas sin resultados y operaciones correctas o
  rechazadas; datos estáticos de ejemplo en la primera etapa.
- Estado del repositorio verificado por inspección directa el 2026-10-16:
  existen `.git/`, `Docs/Repaso Primer Parcial.pdf`, `promtUno.md` y
  (tras esta fase) `openspec/`. No existe código de producto.
- Requisitos R-01 a R-07 y criterios CA-01 a CA-04: reproducidos fielmente
  desde `promtUno.md` (líneas 50-62 y 112-122) en `spec.md`.

## Restricciones técnicas

- HTML5 semántico; CSS3 solo en archivos externos (mínimo estructural);
  JS nativo solo como placeholder/contenedores con `id` (sin lógica de
  Ej. 3-5). Sin estilos inline.
- Entrada `index.html`, apertura `file://` sin servidor; verificación a
  320 px y 1280 px solo para no romper layout (sin responsive completo
  del Ej. 2); tablas anchas con contenedor de scroll propio.
- Nombres de archivos en minúsculas sin espacios; `css/estilos.css`,
  `js/` placeholder, `assets/` solo si hay imágenes locales con `alt`.
- Sin librerías, frameworks, CDNs, npm/bundlers/compiladores, API, base de
  datos, servidor, conexión backend ni login real.

## Supuestos y datos pendientes

- Supuesto: el nombre comercial de la librería es placeholder ficticio
  («Librería Ejemplo») hasta que la usuaria indique el real.
  `DATO_PENDIENTE: nombre comercial de la librería.`
- Supuesto: en Etapa 1 no hay imágenes (se evita `assets/`); si se agregara
  alguna, será local con `alt`.
  `DATO_PENDIENTE: confirmar cero imágenes en Etapa 1.`
- Supuesto: los datos de ejemplo (2-3 libros, 2 clientes, 1-2 renglones,
  1-2 ventas) usan valores inventados genéricos marcados como ficticios;
  ISBNs, emails, precios y fechas son placeholders, no datos reales.
  `DATO_PENDIENTE: editoriales, géneros y autores concretos de ejemplo
  (valores finales al implementar).`
- `DATO_PENDIENTE (bloqueante para PLAN, no para SPEC): decisión abierta
  multipágina vs. secciones — ver sección siguiente.`

## Decisión abierta (requiere respuesta explícita — NO cerrada)

**¿Multipágina (`index.html` + `libros.html` + `clientes.html` +
`ventas.html` + `historial.html`) o SPA por secciones en una misma página
con anclas/nav (`#catalogo`, `#libros`, `#clientes`, `#ventas`,
`#historial`)?**

- Opción recomendada: **multipágina**. Motivo: el PDF (pág. 2) permite ambas
  («varias páginas o secciones de una misma página»); multipágina es más
  simple con apertura `file://`, cada vista es un documento evaluable por
  separado y el `nav` con enlaces entre archivos satisface «≤2 clics».
- Alternativa: secciones con anclas en un solo `index.html` (una sola
  apertura, navegación por `:target`/anclas; exige más CSS/JS para mostrar
  una sección por vez).
- La SPEC contempla ambas (R-06) y el PLAN queda bloqueado hasta la
  confirmación. Por favor responder: **«Multipágina», «Secciones» o
  «Ajustar SPEC»**.
