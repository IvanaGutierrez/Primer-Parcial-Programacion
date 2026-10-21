# Spec Delta — persistencia-local

## Purpose

Conserva los libros, clientes y ventas del TPI en el `localStorage` del
navegador: claves y esquema JSON documentados, siembra única de los datos
semilla de `js/datos.js` sin duplicarlos en reaperturas, lectura del
conjunto vigente en cada arranque y escritura en cada alta y confirmación,
con defensa ante almacenamiento vacío, JSON inválido o no disponible.

## ADDED Requirements

### Requirement: Claves y esquema de almacenamiento en localStorage

El sistema SHALL conservar libros, clientes y ventas en `localStorage` bajo
las claves `libreria-libros`, `libreria-clientes` y `libreria-ventas`, con
valores en formato JSON: arrays de registros con la misma forma que los datos
semilla (`id`, `titulo`, `isbn`, `editorialId`, `autorIds`, `generoId`,
`precio` para libros; `id`, `nombre`, `email` para clientes). El sistema NO
SHALL persistir editoriales, géneros ni autores.

#### Scenario: Tres claves documentadas

- **WHEN** se inspecciona el almacenamiento del navegador tras usar las
  páginas
- **THEN** existen las claves `libreria-libros`, `libreria-clientes` y
  `libreria-ventas`, cada una con un array JSON
- **AND** no hay claves de almacenamiento de otros nombres creadas por la
  aplicación

#### Scenario: Esquema idéntico a la semilla

- **WHEN** se lee el JSON de `libreria-libros` o `libreria-clientes`
- **THEN** cada registro tiene los mismos campos y tipos que los del array
  semilla de `js/datos.js`
- **AND** un libro sin género persiste con `generoId` nulo y un libro dado de
  alta conserva su `id` generado (`l7+`)

### Requirement: Siembra única de los datos semilla sin duplicar

El sistema SHALL sembrar `localStorage` con los datos semilla de
`js/datos.js` solo cuando la clave correspondiente esté ausente o vacía, con
una copia profunda (serialización), y NO SHALL agregar los ejemplos de nuevo
cuando ya hay datos guardados.

#### Scenario: Primer inicio

- **WHEN** se abre por primera vez una página que usa el catálogo o las
  ventas (claves ausentes o vacías)
- **THEN** `libreria-libros` y `libreria-clientes` quedan pobladas con los
  ejemplos de `js/datos.js` (`l1..l6`, `c1..c3`) y `libreria-ventas` queda
  como lista vacía o se crea al confirmar la primera venta

#### Scenario: Reapertura sin duplicar

- **WHEN** se reabre la aplicación con claves que ya contienen datos
  guardados
- **THEN** los ejemplos semilla NO se agregan de nuevo: `l1..l6` y `c1..c3`
  aparecen exactamente una vez
- **AND** las ventas guardadas no se duplican ni se re-escriben al abrir el
  historial

#### Scenario: Arrays semilla intactos

- **WHEN** se inspecciona `js/datos.js` y el código de persistencia
- **THEN** los arrays `const` siguen declarados allí como única fuente de
  siembra
- **AND** no se les reasigna ni se les agrega contenido desde storage

### Requirement: Conjunto vigente leído desde localStorage en cada arranque

El sistema SHALL leer en cada arranque de página el conjunto vigente de
libros y clientes desde `localStorage` y SHALL poblar con esa lectura los
listados (`#libros-listado`, `#clientes-listado`), los selectores de venta
(`#venta-libro`, `#venta-cliente`) y las validaciones de duplicados y
relaciones, sin modificar los arrays semilla.

#### Scenario: Listados y selectores desde el conjunto guardado

- **WHEN** se abre `libros.html`, `clientes.html` o `ventas.html` con datos
  guardados en `localStorage`
- **THEN** los listados y las opciones de venta muestran el conjunto guardado
  (semilla + altas previas)

#### Scenario: Página sin js/datos.js

- **WHEN** se abre `index.html` (que no enlaza `js/datos.js`)
- **THEN** no se siembra ni se lee `localStorage` y la página conserva su
  comportamiento actual sin errores

### Requirement: Escritura del conjunto en cada alta y confirmación

El sistema SHALL serializar el array completo a su clave en cada alta válida
de libro o cliente y en cada confirmación de venta, de modo que el conjunto
guardado refleje la operación sin recargar.

#### Scenario: Alta de libro persistida

- **WHEN** se registra un libro válido en `libros.html`
- **THEN** `libreria-libros` contiene el array completo con el libro nuevo
- **AND** el libro aparece en `#libros-listado` y en `#venta-libro` sin
  recargar

#### Scenario: Alta de cliente persistida

- **WHEN** se registra un cliente válido en `clientes.html`
- **THEN** `libreria-clientes` contiene el array completo con el cliente
  nuevo
- **AND** el cliente aparece en `#clientes-listado` y en `#venta-cliente` sin
  recargar

#### Scenario: Operación con escritura fallida

- **WHEN** `localStorage.setItem` lanza error (cuota, permisos, modo
  privado) durante una alta o confirmación
- **THEN** la operación informa el fallo con un mensaje de texto explícito
  junto a la interfaz
- **AND** la página sigue siendo operable en la sesión en curso

### Requirement: Defensa ante almacenamiento vacío, JSON inválido o no disponible

El sistema SHALL proteger toda lectura y escritura de `localStorage` con
`try/catch`: clave ausente o vacía, JSON inválido o almacenamiento no
disponible NO SHALL romper la interfaz ni impedir que la página abra.

#### Scenario: Clave ausente o vacía

- **WHEN** una clave no existe o está vacía al arrancar
- **THEN** los libros y clientes se siembran desde `js/datos.js` y las ventas
  se tratan como lista vacía
- **AND** no se muestran errores en consola ni en la interfaz

#### Scenario: JSON inválido

- **WHEN** el valor de una clave no es JSON parseable
- **THEN** la página abre y opera con datos semilla (libros/clientes) o lista
  vacía (ventas)
- **AND** no hay errores visibles en la interfaz

#### Scenario: Almacenamiento no disponible

- **WHEN** `localStorage` no está disponible para el origen (p. ej.
  `file://` restringido o modo privado)
- **THEN** las lecturas y escrituras fallidas quedan contenidas por
  `try/catch`
- **AND** ninguna página queda inutilizable

### Requirement: Continuidad de las altas y ventas tras recargar

El sistema SHALL recuperar tras recargar las altas de libros y clientes y las
ventas confirmadas, sin alterar las validaciones del Ejercicio 4 ni los
flujos del Ejercicio 5, y SHALL evaluar los duplicados (ISBN, email) contra
el conjunto persistido.

#### Scenario: Recarga tras altas y venta

- **WHEN** se dan de alta un libro y un cliente, se confirma una venta y se
  recarga cada página
- **THEN** el libro y el cliente siguen presentes en sus listados y en los
  selectores de venta
- **AND** la venta sigue presente en el historial
- **AND** los ejemplos semilla no aparecen duplicados

#### Scenario: Duplicado contra datos guardados

- **WHEN** se intenta dar de alta un libro con ISBN ya registrado en una
  sesión anterior o un cliente con email ya registrado en una sesión anterior
- **THEN** el alta se rechaza como duplicada con mensaje explícito
