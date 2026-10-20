# Spec Delta — datos-catalogo-filtro

## MODIFIED Requirements

### Requirement: Integridad de los Ejercicios 1 y 2 e IDs estables

El sistema SHALL no alterar la estructura semántica ni los IDs estables
existentes del DOM de los Ejercicios 1 y 2, y SHALL dejar intactos
`index.html` y `css/estilos.css`; en `libros.html` y `clientes.html` (Ejercicio
4) y en `ventas.html` e `historial.html` (Ejercicio 5) MAY reemplazar el
contenido estático de ejemplo (opciones de selectores, filas de `tbody` y
textos de ejemplo de listados, vacío, resumen, detalle y mensajes) por render
dinámico, y MAY agregar referencias a scripts locales, sin remover ni
renombrar los IDs estables de sus formularios y listados; en `ventas.html`
MAY agregar el ID `#venta-confirmar` al botón «Confirmar venta» como ID nuevo,
sin tocar los existentes.

#### Scenario: Sin cambios en Ejercicios 1 y 2

- **WHEN** se comparan `index.html` y `css/estilos.css` con su estado previo
- **THEN** no se modifican
- **AND** la estructura semántica de las 5 páginas (header, nav, main,
  section, form, fieldset, table, footer) se conserva también en
  `ventas.html` e `historial.html`

#### Scenario: Contenido estático de ejemplo reemplazable

- **WHEN** el Ejercicio 4 necesita render dinámico en `libros.html` y
  `clientes.html`, y el Ejercicio 5 lo necesita en `ventas.html` e
  `historial.html`
- **THEN** las opciones estáticas de los selectores, las filas de ejemplo del
  `tbody` y los textos de ejemplo relacionados pueden reemplazarse por
  contenido generado desde JavaScript
- **AND** pueden agregarse referencias a scripts locales en estas páginas

#### Scenario: IDs estables conservados

- **WHEN** se inspecciona `ejercicio3.html`
- **THEN** existen `#catalogo-listado`, `#catalogo-mensaje` y
  `#buscador-titulo` con esos nombres exactos
- **AND** los IDs de `index.html` no se alteran
- **AND** en `libros.html` y `clientes.html` se conservan sus IDs estables de
  formulario y listado (`#form-libro`, `#libro-titulo`, `#libro-isbn`,
  `#libro-precio`, `#libro-editorial`, `#libro-genero`, `#libro-autores`,
  `#libros-listado`, `#libros-vacio`, `#form-cliente`, `#cliente-nombre`,
  `#cliente-email`, `#clientes-listado`, `#clientes-vacio`, `#msg-ok`,
  `#msg-error`)

#### Scenario: IDs estables de ventas e historial conservados

- **WHEN** el Ejercicio 5 modifica `ventas.html` e `historial.html`
- **THEN** se conservan sin cambios los IDs existentes de `ventas.html`
  (`#titulo-ventas`, `#form-venta`, `#venta-cliente`, `#venta-libro`,
  `#venta-cantidad`, `#venta-renglones`, `#venta-renglones-vacio`,
  `#titulo-resumen`, `#venta-resumen`, `#msg-ok`, `#msg-error`) y de
  `historial.html` (`#titulo-historial`, `#historial-listado`,
  `#historial-vacio`, `#titulo-detalle`, `#historial-detalle`, `#msg-ok`,
  `#msg-error`)
- **AND** el botón «Confirmar venta» recibe el ID nuevo `#venta-confirmar`
  sin renombrar ni duplicar ningún ID existente
