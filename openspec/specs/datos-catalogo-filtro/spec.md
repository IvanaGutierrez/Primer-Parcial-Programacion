# datos-catalogo-filtro Specification

## Purpose
Genera dinámicamente el catálogo de libros desde JavaScript a partir de un
modelo de datos con identificadores estables (libros, editoriales, géneros,
autores y clientes ficticios), resuelve las referencias por ID y ofrece un
filtro parcial por título, en la página standalone del Ejercicio 3.

## Requirements

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

### Requirement: Género opcional legible

El sistema SHALL permitir que un libro no tenga género (`generoId: null`) y SHALL mostrarlo de forma legible en el catálogo, sin romper el render.

#### Scenario: Libro sin género

- **WHEN** un libro tiene `generoId: null`
- **THEN** el catálogo lo muestra con el texto «Sin género asignado»
- **AND** el resto de los datos del libro se renderiza normalmente

### Requirement: Catálogo generado desde JavaScript

El sistema SHALL construir la lista de libros dinámicamente en el contenedor `#catalogo-listado` a partir de los arrays; no SHALL existir tarjetas ni filas de libros escritas a mano en el HTML.

#### Scenario: Render dinámico al abrir

- **WHEN** se abre `ejercicio3.html` por `file://`
- **THEN** `#catalogo-listado` contiene una tarjeta por cada libro del array
- **AND** el HTML fuente de `ejercicio3.html` tiene `#catalogo-listado` vacío (sin tarjetas a mano)

### Requirement: Resolución de referencias por ID

El sistema SHALL resolver editorial, autores y género a partir de sus `id` mediante funciones de búsqueda nombradas, sin repetir datos en los libros.

#### Scenario: Resolución de editorial, autores y género

- **WHEN** se renderiza un libro con `editorialId`, `autorIds[]` y `generoId`
- **THEN** se muestran el nombre de la editorial, los nombres de todos sus autores y el nombre del género resueltos por `id`
- **AND** la resolución se hace con una función nombrada de búsqueda por `id`

### Requirement: Filtro parcial por título

El sistema SHALL filtrar por coincidencia parcial (substring) del título, sin distinguir mayúsculas/minúsculas y aplicando `trim()` al texto de búsqueda.

#### Scenario: Coincidencia parcial

- **WHEN** el usuario escribe una parte del título
- **THEN** se muestran los libros cuyo título contiene ese texto como substring

#### Scenario: Distinta capitalización

- **WHEN** se busca `PRINCIPITO` o `principito`
- **THEN** se obtienen los mismos resultados

#### Scenario: Espacios exteriores

- **WHEN** se busca `"  harry  "`
- **THEN** se obtienen los mismos resultados que buscando `"harry"`

#### Scenario: Búsqueda vacía o solo espacios

- **WHEN** el buscador está vacío o contiene solo espacios
- **THEN** se muestran todos los libros (no se filtra por cadena vacía)

### Requirement: Mensaje claro sin coincidencias

El sistema SHALL mostrar un mensaje de texto explícito en `#catalogo-mensaje` cuando la búsqueda no arroja coincidencias.

#### Scenario: Búsqueda sin resultados

- **WHEN** el usuario busca un texto que no coincide con ningún título (p. ej. `zzz`)
- **THEN** `#catalogo-mensaje` muestra un mensaje explícito de «sin resultados»
- **AND** no se muestran tarjetas de libros

### Requirement: Interacción por evento y estado inicial completo

El sistema SHALL disparar el filtrado por un evento del buscador (`input` o `submit`) y SHALL mostrar el catálogo completo al abrir la página.

#### Scenario: Filtrado por evento

- **WHEN** el usuario modifica el texto del buscador
- **THEN** el catálogo se actualiza según el filtro

#### Scenario: Catálogo completo al abrir

- **WHEN** se carga la página sin haber escrito en el buscador
- **THEN** se muestra el catálogo completo con todos los libros

### Requirement: Calidad e inserción segura de texto

El sistema SHALL organizar el código en funciones nombradas y reconocibles (buscar por `id`, renderizar, filtrar) y SHALL insertar los datos en el DOM con `textContent`/`createElement`/`replaceChildren`; NO SHALL usar `innerHTML` con datos de la lista.

#### Scenario: Funciones reconocibles

- **WHEN** se inspecciona `js/ejercicio3.js`
- **THEN** existen funciones nombradas separadas para buscar por `id`, renderizar el catálogo y filtrar

#### Scenario: Inserción segura

- **WHEN** se inspecciona el render de textos de libros
- **THEN** se usa `textContent` (y `createElement`/`replaceChildren`)
- **AND** no hay uso de `innerHTML` con datos de la lista

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

### Requirement: Compatibilidad con apertura file://

El sistema SHALL abrir por `file://` sin servidor, npm, bundler ni dependencias externas, sin `fetch` de datos.

#### Scenario: Apertura directa

- **WHEN** se abre `ejercicio3.html` por doble clic
- **THEN** la página funciona sin servidor ni conexión a internet
- **AND** no hay recursos externos (CDN, fuentes o scripts remotos)
