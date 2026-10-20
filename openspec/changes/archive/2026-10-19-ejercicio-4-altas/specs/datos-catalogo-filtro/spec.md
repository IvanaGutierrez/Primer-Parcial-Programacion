# Spec Delta — datos-catalogo-filtro

## MODIFIED Requirements

### Requirement: Datos con IDs estables

El sistema SHALL definir el modelo de datos como arrays de objetos con `id` string único y legible: al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes, todos ficticios, declarados en una única fuente compartida (`js/datos.js`, decisión D1 confirmada el 2026-10-19) enlazada por todas las páginas que consumen el modelo, sin duplicar los arrays entre archivos. Cada libro SHALL incluir `id`, `titulo`, `editorialId`, `autorIds` (array), `generoId` y `precio` (numérico). Cada cliente SHALL incluir al menos `id` string único, `nombre` ficticio y `email`. Los `id` existentes del Ejercicio 3 se conservan sin cambios.

#### Scenario: Inventario mínimo de datos

- **WHEN** se inspecciona el código del modelo de datos compartido
- **THEN** existen ≥6 libros, ≥2 editoriales, ≥2 géneros, ≥3 autores y ≥3 clientes con `id` estable
- **AND** cada libro referencia su editorial, autores y género por ID

#### Scenario: Clientes ficticios

- **WHEN** se inspecciona el array de clientes
- **THEN** hay ≥3 clientes ficticios, cada uno con `id` único, `nombre` y `email`
- **AND** los datos de clientes no duplican datos de otras colecciones

#### Scenario: IDs únicos y legibles

- **WHEN** se comparan los `id` de libros, editoriales, autores, géneros y clientes
- **THEN** no hay `id` duplicados dentro de cada colección
- **AND** los `id` son strings cortos y legibles (p. ej. `l1`, `ed1`, `a1`, `g1`, `c1`)
- **AND** los `id` existentes del Ejercicio 3 (`l1..l6`, `ed1..ed2`, `g1..g2`, `a1..a3`, `c1..c3`) se conservan sin cambios

#### Scenario: Modelo extendido con precio y email

- **WHEN** se inspecciona el modelo compartido tras el Ejercicio 4
- **THEN** cada libro tiene un campo `precio` numérico junto a sus datos existentes
- **AND** cada cliente tiene un campo `email` junto a su `id` y `nombre`

#### Scenario: Fuente única sin duplicación

- **WHEN** se buscan las declaraciones de los arrays en todos los archivos JS del proyecto
- **THEN** cada array se declara en un solo archivo (la fuente compartida: `js/datos.js`)
- **AND** `js/ejercicio3.js` consume esa fuente y ya no redeclara los arrays
- **AND** las páginas `ejercicio3.html`, `libros.html` y `clientes.html` consumen la misma fuente

### Requirement: Integridad de los Ejercicios 1 y 2 e IDs estables

El sistema SHALL no alterar la estructura semántica ni los IDs estables existentes del DOM de los Ejercicios 1 y 2, y SHALL dejar intactos `index.html`, `ventas.html`, `historial.html` y `css/estilos.css`; en `libros.html` y `clientes.html` MAY reemplazar el contenido estático de ejemplo (opciones de selectores y filas de `tbody`) por render dinámico y agregar referencias a scripts locales, sin remover los IDs estables de sus formularios y listados.

#### Scenario: Sin cambios en Ejercicios 1 y 2

- **WHEN** se comparan `index.html`, `ventas.html`, `historial.html` y `css/estilos.css` con su estado previo
- **THEN** no se modifican
- **AND** la estructura semántica de `libros.html` y `clientes.html` (header, nav, main, section, form, fieldset, table, footer) se conserva

#### Scenario: Contenido estático de ejemplo reemplazable

- **WHEN** el Ejercicio 4 necesita render dinámico en `libros.html` y `clientes.html`
- **THEN** las opciones estáticas de los selectores y las filas de ejemplo del `tbody` pueden reemplazarse por contenido generado desde JavaScript
- **AND** pueden agregarse referencias a scripts locales en estas páginas

#### Scenario: IDs estables conservados

- **WHEN** se inspecciona `ejercicio3.html`
- **THEN** existen `#catalogo-listado`, `#catalogo-mensaje` y `#buscador-titulo` con esos nombres exactos
- **AND** los IDs de `index.html` no se alteran
- **AND** en `libros.html` y `clientes.html` se conservan sus IDs estables de formulario y listado (`#form-libro`, `#libro-titulo`, `#libro-isbn`, `#libro-precio`, `#libro-editorial`, `#libro-genero`, `#libro-autores`, `#libros-listado`, `#libros-vacio`, `#form-cliente`, `#cliente-nombre`, `#cliente-email`, `#clientes-listado`, `#clientes-vacio`, `#msg-ok`, `#msg-error`)
