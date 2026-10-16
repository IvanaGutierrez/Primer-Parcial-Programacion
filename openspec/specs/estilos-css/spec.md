# estilos-css Specification

## Purpose
Define la identidad visual y el CSS adaptable del Ejercicio 2 del TPI
frontend de libreria: paleta, tipografia del sistema, layout Flexbox/Grid
a 320/1280 px, tablas con scroll interno y accesibilidad basica, solo en
`css/estilos.css` y sin alterar los ids estables del Ejercicio 1. Fuente:
`Docs/Repaso Primer Parcial.pdf`, pag. 3. Espejo en formato delta del
`spec.md` raiz del change (R2-01 a R2-06); el `spec.md` raiz es el
documento de lectura y este archivo existe solo porque
`openspec validate` (CLI 1.13.2) exige al menos un delta en `specs/`.

## Requirements

### Requirement: Identidad visual coherente con clases reutilizables

The system SHALL aplicar en las 5 paginas la identidad de `proposal.md`
(fondo `#F6F1E7`, superficie `#FFFFFF`, primario `#1E3A5F`, acento
`#B4552D`, texto `#1A1A1A`/`#4A4A4A`, borde `#D8CFC0`, exito `#1E7A34`,
error `#B3261E`, foco `#005FCC`; tipografia
`system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`) con
clases reutilizables en espanol, de modo que tipografia, botones,
formularios y tablas sean coherentes (CA-01, 8 pts).

#### Scenario: Coherencia en las 5 paginas

- **WHEN** la usuaria abre cada pagina por `file://`
- **THEN** encabezado, nav, titulos, botones, `fieldset`, tablas y
  `#msg-ok`/`#msg-error` comparten paleta, tipografia y radios, y los
  elementos equivalentes reutilizan las mismas clases.

### Requirement: Layout Flexbox/Grid adaptable sin overflow-x global

The system SHALL organizar el layout con Flexbox o Grid de modo que a
320 px y a 1280 px los textos y controles sean legibles y no exista
desplazamiento horizontal de toda la pagina (sin `overflow-x: hidden`
global como parche; CA-02 parcial).

#### Scenario: Verificacion a 320 y 1280 px

- **WHEN** se abre cualquier pagina por `file://` y se ajusta a 320 px y
  a 1280 px
- **THEN** no hay barra de scroll horizontal de pagina
  (`document.documentElement.scrollWidth <= viewport`), el `nav` hace
  wrap, los formularios apilan etiqueta sobre campo y los textos mantienen
  `line-height >= 1.5`.

### Requirement: Tablas con scroll solo en `.tabla-contenedor`

The system SHALL mantener cada tabla (`#catalogo-listado`,
`#libros-listado`, `#clientes-listado`, `#venta-renglones`,
`#historial-listado`) dentro de su `div.tabla-contenedor` con
`overflow-x: auto`, de modo que una tabla mas ancha que el viewport
genere scroll solo interno (CA-02 parcial; PDF p.3: "se desplaza dentro
de su propio contenedor").

#### Scenario: Tabla ancha a 320 px

- **WHEN** se visualiza la tabla de catalogo (6 columnas) a 320 px
- **THEN** el scroll horizontal aparece unicamente dentro de
  `.tabla-contenedor` y la pagina completa sigue sin scroll horizontal.

### Requirement: Accesibilidad basica con foco visible y mensajes por texto

The system SHALL conservar `:focus-visible`
(`outline: 3px solid #005FCC` + `outline-offset: 2px`, jamas
`outline: none` sin reemplazo) en todo control, con contraste AA, y
expresar exito/error con texto explicito en `#msg-ok`/`#msg-error`
(nunca solo color); imagen informativa con `alt`, decorativa sin
redundancia (CA-03, 4 pts; PDF p.3).

#### Scenario: Recorrido por teclado y mensajes

- **WHEN** se recorre cada pagina con Tab y se inspeccionan `#msg-ok` /
  `#msg-error`
- **THEN** cada enlace, boton, `input` y `select` muestra foco visible, y
  cada mensaje contiene texto explicito cuyo color es redundante.

### Requirement: Calidad CSS solo en `css/estilos.css` sin inline

The system SHALL mantener todo el CSS en el unico `css/estilos.css`, sin
atributo `style`, sin `<style>` ni otros CSS/CDN/libs, con clases en
espanol reutilizables y hoja estructurada por secciones (PDF p.3: "El CSS
se mantiene en archivos externos").

#### Scenario: Revision de calidad CSS

- **WHEN** se inspeccionan los 5 HTML y el CSS
- **THEN** `style=` devuelve cero coincidencias, cada HTML enlaza solo
  `css/estilos.css` y las clases nuevas son reutilizables en espanol.

### Requirement: Ids estables del Ejercicio 1 intactos

The system SHALL conservar intactos los 44 ids del Ejercicio 1
(`index.html`: `#titulo-catalogo`, `#form-buscador`, `#buscador-titulo`,
`#catalogo-mensaje`, `#catalogo-listado`, `#catalogo-vacio`;
`libros.html`: `#titulo-libros`, `#form-libro`, `#libro-titulo`,
`#libro-isbn`, `#libro-precio`, `#libro-editorial`, `#libro-genero`,
`#libro-autores`, `#msg-ok`, `#msg-error`, `#libros-listado`,
`#libros-vacio`; `clientes.html`: `#titulo-clientes`, `#form-cliente`,
`#cliente-nombre`, `#cliente-email`, `#msg-ok`, `#msg-error`,
`#clientes-listado`, `#clientes-vacio`; `ventas.html`: `#titulo-ventas`,
`#form-venta`, `#venta-cliente`, `#venta-libro`, `#venta-cantidad`,
`#venta-renglones`, `#venta-renglones-vacio`, `#titulo-resumen`,
`#venta-resumen`, `#msg-ok`, `#msg-error`; `historial.html`:
`#titulo-historial`, `#historial-listado`, `#historial-vacio`,
`#titulo-detalle`, `#historial-detalle`, `#msg-ok`, `#msg-error`;
incluidos los 8 nucleo de `promtDos.md`: `#catalogo-listado`,
`#catalogo-mensaje`, `#form-libro`, `#form-cliente`,
`#venta-renglones`, `#historial-detalle`, `#msg-ok`, `#msg-error`).

#### Scenario: Reserva de hooks

- **WHEN** se inspecciona el DOM de cada pagina
- **THEN** cada id existe con nombre exacto, sin duplicados ni renombres,
  y el CSS solo los referencia sin modificarlos.
