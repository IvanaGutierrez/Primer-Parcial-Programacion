# venta-historial Specification

## Purpose

Define la venta simulada del Ejercicio 5: composición de renglones con
validaciones y política de duplicados, cálculos de subtotal/total con dos
decimales, confirmación bloqueada ante datos inválidos con precio unitario
congelado como valor histórico y datos descriptivos autosuficientes, puente
`localStorage` hacia un historial inmutable con detalle de renglones (el
Ejercicio 6 reemplazó el puente `sessionStorage` del Ejercicio 5), todo
en `ventas.html`/`historial.html` con DOM seguro y reutilización de helpers.

## Requirements

### Requirement: Selectores de venta poblados desde datos locales

El sistema SHALL generar las opciones de `#venta-cliente` y `#venta-libro`
desde JavaScript con los datos locales (clientes y libros del catálogo,
incluidos los dados de alta en el Ejercicio 4), reemplazando las opciones
estáticas de ejemplo del HTML.

#### Scenario: Clientes desde el array de clientes

- **WHEN** se carga `ventas.html`
- **THEN** `#venta-cliente` contiene una opción por cada cliente registrado
  (hoy `c1` «Lucía Pérez», `c2` «Mateo Gómez», `c3` «Sofía López», más los
  dados de alta en el Ejercicio 4), con `value` = `id`
- **AND** no quedan las opciones estáticas de ejemplo (`value="ana"`,
  `value="luis"`)

#### Scenario: Libros desde el catálogo

- **WHEN** se carga `ventas.html`
- **THEN** `#venta-libro` contiene una opción por cada libro del catálogo
  (hoy `l1..l6`, más los dados de alta en el Ejercicio 4), con `value` = `id`
- **AND** no quedan las opciones estáticas de ejemplo (`value="jardin"`,
  `value="manual"`)

### Requirement: Composición de renglones con libro existente y cantidad entera positiva

El sistema SHALL agregar un renglón a `#venta-renglones` solo con un libro
existente del catálogo y una cantidad entera mayor que cero, validada en
JavaScript; SHALL rechazar cantidad vacía, cero, negativa o decimal con un
mensaje explícito.

#### Scenario: Renglón válido

- **WHEN** se selecciona un libro existente, se ingresa una cantidad entera
  mayor que cero y se envía «Agregar renglón»
- **THEN** el renglón aparece en `#venta-renglones` mostrando libro
  (título), cantidad, precio unitario y subtotal
- **AND** la fila se construye con `createElement`/`textContent`

#### Scenario: Cantidad inválida rechazada con mensaje

- **WHEN** la cantidad está vacía, es `0`, negativa o decimal (p. ej. `1,5`)
- **THEN** el renglón NO se agrega
- **AND** se muestra un mensaje de error explícito junto al formulario

#### Scenario: Sin libro seleccionado

- **WHEN** se intenta agregar un renglón sin libro seleccionado en
  `#venta-libro`
- **THEN** el renglón NO se agrega y se muestra un mensaje de error explícito

### Requirement: Política de duplicados sin segundo renglón para el mismo libro

El sistema SHALL aplicar una política única y consistente cuando el libro
seleccionado ya tiene un renglón en la venta: en ningún caso se crea un
segundo renglón para el mismo libro. (Política **confirmada — D2,
2026-10-19**: se SUMA la cantidad ingresada a la del renglón existente y se
recalculan subtotal y total, con mensaje informativo; historia de
alternativas en el proposal.)

#### Scenario: Mismo libro agregado dos veces (política confirmada: suma)

- **WHEN** se agrega un libro que ya tiene renglón en la venta
- **THEN** NO se crea un segundo renglón para ese libro
- **AND** la cantidad del renglón existente queda actualizada con la suma de
  la cantidad anterior y la ingresada
- **AND** subtotal del renglón y total de la venta se recalculan
- **AND** se muestra un mensaje informativo junto al formulario

### Requirement: Subtotal por renglón e importes presentados con dos decimales

El sistema SHALL mostrar en cada renglón el título del libro, la cantidad, el
precio unitario y el subtotal calculado como cantidad × precio unitario, con
todos los importes presentados con dos decimales.

#### Scenario: Subtotal correcto

- **WHEN** un renglón tiene cantidad `2` y precio unitario `1500`
- **THEN** el subtotal mostrado es `3000.00`
- **AND** el precio unitario se muestra con dos decimales

#### Scenario: Importes con dos decimales

- **WHEN** se renderizan los importes de renglones y resumen
- **THEN** cada importe se presenta con exactamente dos decimales
  (p. ej. `2000.00`, `15999.00`)

### Requirement: Total de la venta como suma de subtotales con recálculo

El sistema SHALL mostrar en `#venta-resumen` el total de la venta, calculado
como la suma de los subtotales de todos los renglones con dos decimales, y
SHALL recalcularlo ante cualquier cambio de cantidades o de conjuntos de
renglones.

#### Scenario: Total de una venta de ejemplo

- **WHEN** la venta tiene renglones de `2 × 1500` y `1 × 2000` (precios de
  ejemplo ficticios autorizados por la consigna)
- **THEN** `#venta-resumen` muestra el total `5000.00`

#### Scenario: Recálculo al cambiar un renglón

- **WHEN** cambia la cantidad de un renglón o se quita un renglón
- **THEN** los subtotales afectados y el total se recalculan y se
  re-renderizan sin recargar la página

### Requirement: Edición de cantidades y quita de renglones antes de confirmar

El sistema SHALL permitir, antes de confirmar, cambiar la cantidad de un
renglón existente y quitar un renglón de la venta, reflejando el impacto en
subtotal y total.

#### Scenario: Cambiar cantidad de un renglón

- **WHEN** la usuaria modifica la cantidad de un renglón existente a un
  entero mayor que cero
- **THEN** el subtotal del renglón y el total se recalculan con dos
  decimales
- **AND** una cantidad inválida (vacía, cero, negativa o decimal) rechaza el
  cambio con mensaje y conserva el valor anterior

#### Scenario: Quitar un renglón

- **WHEN** se quita un renglón de la venta
- **THEN** el renglón desaparece de `#venta-renglones` y el total se
  recalcula
- **AND** si era el último renglón, se muestra `#venta-renglones-vacio` y el
  total vuelve a su estado vacío (p. ej. `0.00`)

### Requirement: Bloqueo de la confirmación con datos inválidos

El sistema SHALL impedir confirmar una venta sin cliente seleccionado, sin
renglones o con cantidades inválidas en alguno de ellos, y SHALL mostrar los
errores como texto explícito cerca del formulario (no solo color).

#### Scenario: Confirmar sin cliente

- **WHEN** se presiona «Confirmar venta» sin cliente seleccionado
- **THEN** la venta NO se registra ni se agrega al historial
- **AND** se muestra un mensaje de error explícito junto al formulario

#### Scenario: Confirmar sin renglones

- **WHEN** se presiona «Confirmar venta» sin renglones compuestos
- **THEN** la venta NO se registra
- **AND** se muestra un mensaje de error explícito junto al formulario

#### Scenario: Confirmar con cantidades inválidas

- **WHEN** algún renglón de la venta tiene una cantidad inválida (vacía,
  cero, negativa o decimal)
- **THEN** la venta NO se registra
- **AND** se muestra un mensaje de error explícito junto al formulario

### Requirement: Confirmación con precio unitario congelado como valor histórico

El sistema SHALL registrar, al confirmar, una venta con `id`, `fecha`,
cliente, renglones y total; el precio unitario de cada renglón se COPIA al
confirmar como valor histórico y el historial NO vuelve a leer el precio
actual del catálogo.

#### Scenario: Registro de una venta válida

- **WHEN** se confirma una venta con cliente, al menos un renglón válido y
  totales correctos
- **THEN** la venta queda registrada con `id`, `fecha`, cliente, sus
  renglones (libro, cantidad, precio unitario, subtotal) y `total`
- **AND** el precio unitario de cada renglón es el del catálogo **al momento
  de confirmar**, copiado al renglón

#### Scenario: Precio histórico conservado tras cambiar el catálogo

- **WHEN** se confirma una venta, se cambia el `precio` del libro en el
  catálogo y se recarga `historial.html`
- **THEN** el precio unitario, los subtotales y el total de esa venta
  conservan los valores confirmados
- **AND** el historial no depende del precio actual del catálogo

### Requirement: Datos descriptivos autosuficientes en la venta guardada

El sistema SHALL guardar dentro de cada venta los datos descriptivos
necesarios para leerla sin depender del estado actual del catálogo: el
título del libro en cada renglón y el nombre del cliente junto a su `id`.

#### Scenario: Venta legible sin consultar el catálogo

- **WHEN** se lee una venta guardada (p. ej. en el historial)
- **THEN** cada renglón muestra su título y el nombre del cliente se muestra
  desde el dato guardado en la venta
- **AND** la lectura no requiere buscar el libro ni el cliente en los arrays
  actuales

### Requirement: Historial con listado y detalle de renglones

El sistema SHALL mostrar en `historial.html` el listado de las ventas
confirmadas (identificador, fecha, cliente y total) leídas desde el puente de
sesión, y SHALL permitir consultar los renglones de una venta en
`#historial-detalle`; con el historial vacío SHALL mostrar
`#historial-vacio`.

#### Scenario: Listado de ventas

- **WHEN** se carga `historial.html` con ventas confirmadas en la sesión
- **THEN** `#historial-listado` muestra una fila por venta con id, fecha
  (formateada de forma legible), nombre del cliente y total con dos
  decimales
- **AND** las filas estáticas de ejemplo del HTML fueron reemplazadas por
  render dinámico

#### Scenario: Detalle de una venta

- **WHEN** la usuaria activa el control de detalle de una venta del listado
- **THEN** `#historial-detalle` muestra el id, la fecha, el cliente y el
  total de esa venta y, por cada renglón, el título del libro, la cantidad,
  el precio unitario y el subtotal
- **AND** el detalle se construye con `textContent`/`createElement`

#### Scenario: Historial vacío

- **WHEN** no hay ventas confirmadas en la sesión
- **THEN** el listado queda sin filas y se muestra `#historial-vacio`

### Requirement: Ventas inmutables desde la interfaz

El sistema SHALL presentar las ventas confirmadas como inmutables: la
interfaz NO SHALL exponer controles de edición ni de eliminación de ventas
ni operaciones de escritura sobre ventas ya registradas.

#### Scenario: Sin controles de edición o eliminación

- **WHEN** se inspecciona `historial.html` y el código del Ejercicio 5
- **THEN** no existen botones ni enlaces de editar o eliminar ventas
- **AND** no hay código que modifique o borre una venta ya confirmada

### Requirement: Cierre de la operación con limpieza del formulario y mensaje

El sistema SHALL limpiar el formulario y el estado de la venta en curso tras
una confirmación exitosa, dejar la pantalla lista para componer una nueva
venta y SHALL mostrar un mensaje de resultado en `#msg-ok`.

#### Scenario: Confirmación exitosa deja la pantalla lista

- **WHEN** la confirmación registra la venta correctamente
- **THEN** `#form-venta` queda limpio, la venta en curso se vacía
  (renglones y total en estado inicial) y se muestra el mensaje de éxito en
  `#msg-ok`
- **AND** la venta recién registrada aparece en `historial.html` al navegar
  a esa página

### Requirement: DOM seguro y reutilización de helpers existentes

El sistema SHALL insertar opciones, filas, mensajes y detalle con
`textContent`/`createElement`/`replaceChildren` (sin `innerHTML` con datos),
SHALL organizar la lógica en funciones nombradas con responsabilidades
reconocibles y SHALL reutilizar los helpers existentes de `js/app.js` y
`js/datos.js` (`generarId`, `mostrarMensajeOk/Error`, `limpiarMensajes`,
`actualizarSelector`, `buscarPorId`, entre otros) sin duplicarlos, con
apertura por `file://` sin dependencias externas.

#### Scenario: Inserción segura

- **WHEN** se renderizan opciones, renglones, filas del historial y detalle
- **THEN** se usan `createElement`, `textContent` y `replaceChildren`
- **AND** un título o nombre con marcas HTML (p. ej. `<b>`) se muestra como
  texto literal, sin interpretarse como HTML

#### Scenario: Helpers reutilizados sin duplicación

- **WHEN** se inspecciona el código del Ejercicio 5
- **THEN** las responsabilidades viven en funciones nombradas separadas
  (poblar selectores, validar y agregar renglón, calcular, confirmar,
  leer/guardar el puente de sesión, renderizar historial y detalle)
- **AND** no existen copias locales de helpers ya definidos en `js/app.js` o
  `js/datos.js`

#### Scenario: Apertura directa por file://

- **WHEN** se abren `ventas.html` e `historial.html` por doble clic
- **THEN** la composición, el cálculo, la confirmación y el historial
  funcionan sin servidor ni conexión a internet
- **AND** solo se cargan hojas de estilo y scripts locales

### Requirement: Puente de persistencia reemplazable con localStorage

El sistema SHALL publicar las ventas confirmadas para `historial.html`
mediante `localStorage` (clave `libreria-ventas`, valor en formato JSON), con
escritura al confirmar y lectura defensiva (`try/catch` → lista vacía ante
JSON ausente o inválido), y SHALL concentrar el acceso al almacenamiento en
una única abstracción de lectura/escritura. El sistema NO SHALL usar
`sessionStorage` para las ventas.

#### Scenario: Publicación al confirmar

- **WHEN** se confirma una venta válida
- **THEN** el array completo de ventas (incluida la nueva) queda escrito en
  `localStorage` bajo la clave `libreria-ventas` como JSON

#### Scenario: Lectura defensiva

- **WHEN** `historial.html` lee la clave y esta no existe, está vacía o
  contiene JSON inválido
- **THEN** el historial se trata como una lista vacía, sin errores en
  consola ni en la interfaz

#### Scenario: Persistencia entre pestañas y sesiones

- **WHEN** se confirma una venta, se cierra la pestaña o el navegador y se
  vuelve a abrir `historial.html`
- **THEN** la venta confirmada sigue presente en el listado y su detalle
  sigue consultable

#### Scenario: Sin sessionStorage

- **WHEN** se inspecciona el código del proyecto tras el Ejercicio 6
- **THEN** no hay llamadas a `sessionStorage` para las ventas
- **AND** las ventas solo se leen y escriben en `localStorage`
