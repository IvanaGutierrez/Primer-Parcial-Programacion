# Spec Delta — datos-catalogo-filtro

## Purpose

Genera dinámicamente el catálogo de libros desde JavaScript a partir de un
modelo de datos con identificadores estables (libros, editoriales, géneros,
autores y clientes ficticios), resuelve las referencias por ID y ofrece un
filtro parcial por título, en la página standalone del Ejercicio 3.

## ADDED Requirements

### Requirement: Datos con IDs estables

El sistema SHALL definir el modelo de datos como arrays de objetos con `id` string único y legible: al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes, todos ficticios. Cada libro SHALL incluir `id`, `titulo`, `editorialId`, `autorIds` (array) y `generoId`. Cada cliente SHALL incluir al menos `id` string único y `nombre` ficticio.

#### Scenario: Inventario mínimo de datos

- **WHEN** se inspecciona el código del Ejercicio 3
- **THEN** existen ≥6 libros, ≥2 editoriales, ≥2 géneros, ≥3 autores y ≥3 clientes con `id` estable
- **AND** cada libro referencia su editorial, autores y género por ID

#### Scenario: Clientes ficticios

- **WHEN** se inspecciona el array de clientes
- **THEN** hay ≥3 clientes ficticios, cada uno con `id` único y `nombre`
- **AND** los datos de clientes no duplican datos de otras colecciones

#### Scenario: IDs únicos y legibles

- **WHEN** se comparan los `id` de libros, editoriales, autores, géneros y clientes
- **THEN** no hay `id` duplicados dentro de cada colección
- **AND** los `id` son strings cortos y legibles (p. ej. `l1`, `ed1`, `a1`, `g1`, `c1`)

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

El sistema SHALL no modificar los Ejercicios 1 y 2 (`index.html`, `libros.html`,
`clientes.html`, `ventas.html`, `historial.html`, `js/app.js`, `css/estilos.css`)
ni alterar los IDs estables existentes del DOM.

#### Scenario: Sin cambios en Ejercicios 1 y 2

- **WHEN** se compara el commit del Ejercicio 3 con el estado previo
- **THEN** solo se agregan archivos del Ejercicio 3
- **AND** no se modifican archivos de los Ejercicios 1 y 2

#### Scenario: IDs estables conservados

- **WHEN** se inspecciona `ejercicio3.html`
- **THEN** existen `#catalogo-listado`, `#catalogo-mensaje` y `#buscador-titulo` con esos nombres exactos
- **AND** los IDs de `index.html` no se alteran

### Requirement: Compatibilidad con apertura file://

El sistema SHALL abrir por `file://` sin servidor, npm, bundler ni dependencias externas, sin `fetch` de datos.

#### Scenario: Apertura directa

- **WHEN** se abre `ejercicio3.html` por doble clic
- **THEN** la página funciona sin servidor ni conexión a internet
- **AND** no hay recursos externos (CDN, fuentes o scripts remotos)
