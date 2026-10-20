# Spec Delta — altas-validacion

## Purpose

Alta de libros y clientes en sus páginas (`libros.html` y `clientes.html`) con
selectores de editorial, género (con «Sin clasificar») y autores poblados
desde los datos locales, validación completa de cada registro, control del
envío con `preventDefault()`, errores cerca del formulario y actualización
dinámica de listados y opciones relacionadas sin recargar la página.

## ADDED Requirements

### Requirement: Selectores de alta poblados desde datos locales

El sistema SHALL generar las opciones de `#libro-editorial`, `#libro-genero` y
`#libro-autores` desde JavaScript a partir de los datos locales, incluyendo la
opción «Sin clasificar» en género, y SHALL reemplazar las opciones estáticas
de ejemplo del HTML.

#### Scenario: Editorial desde el array de editoriales

- **WHEN** se carga `libros.html`
- **THEN** `#libro-editorial` contiene una opción por cada editorial del array
  (hoy «Editorial Planeta» y «Penguin Random House»), con `value` = `id`
- **AND** no quedan opciones estáticas de ejemplo (`sur`, `norte`, `este`)

#### Scenario: Género con «Sin clasificar»

- **WHEN** se carga `libros.html`
- **THEN** `#libro-genero` contiene una opción por cada género del array y
  además la opción «Sin clasificar», distinta de las opciones reales
- **AND** no quedan opciones estáticas de ejemplo (`novela`, `cuento`)

#### Scenario: Autores múltiples desde el array de autores

- **WHEN** se carga `libros.html`
- **THEN** `#libro-autores` (`select multiple`) contiene una opción por cada
  autor del array (hoy Saint-Exupéry, Rowling y García Márquez), con
  `value` = `id`
- **AND** no quedan opciones estáticas de ejemplo

### Requirement: Validación de campos básicos del libro

El sistema SHALL validar en el alta de libro que título e ISBN no estén vacíos
(tras `trim()`), que el ISBN sea inexistente comparado sin espacios ni guiones
y sin distinguir mayúsculas/minúsculas (sin dígito de control), y que el
precio sea numérico y mayor que cero.

#### Scenario: Título o ISBN vacíos

- **WHEN** se envía `#form-libro` con título vacío o solo espacios, o con ISBN
  vacío o solo espacios
- **THEN** el alta se rechaza con un mensaje de error explícito
- **AND** el libro no se agrega al listado

#### Scenario: ISBN duplicado normalizado

- **WHEN** el ISBN ingresado, sin espacios ni guiones ni distinción de
  mayúsculas, coincide con el ISBN de otro libro ya registrado (p. ej.
  `978-0000000011` contra `978000000011`)
- **THEN** el alta se rechaza como duplicado con un mensaje de error explícito

#### Scenario: Precio inválido

- **WHEN** el precio ingresado es `0`, negativo, vacío o no numérico
- **THEN** el alta se rechaza con un mensaje de error explícito
- **AND** el libro no se agrega al listado

#### Scenario: ISBN nuevo y precio válido

- **WHEN** el ISBN no coincide con ninguno normalizado ya registrado y el
  precio es un número mayor que cero
- **THEN** estas comprobaciones pasan y se continúa con el resto de las
  validaciones del libro

### Requirement: Validación de relaciones existentes del libro

El sistema SHALL validar que la editorial seleccionada exista en los datos
locales, que se seleccione al menos un autor y que todos los autores
seleccionados existan, y que el género, si se asigna (opcional), exista en los
datos locales.

#### Scenario: Editorial inexistente

- **WHEN** el valor de `#libro-editorial` no corresponde a ninguna editorial
  del array
- **THEN** el alta se rechaza con un mensaje de error explícito

#### Scenario: Libro sin autores

- **WHEN** se envía `#form-libro` sin seleccionar ningún autor
- **THEN** el alta se rechaza con un mensaje de error explícito
- **AND** el libro no se agrega al listado

#### Scenario: Autor inexistente

- **WHEN** algún autor seleccionado no existe en el array de autores
- **THEN** el alta se rechaza con un mensaje de error explícito

#### Scenario: Género opcional validado y «Sin clasificar»

- **WHEN** el género seleccionado existe en el array
- **THEN** el libro se registra con ese género
- **AND** si el género seleccionado es «Sin clasificar», el libro se registra
  sin género asignado (p. ej. `generoId: null`) y el listado lo muestra de
  forma legible
- **AND** si el género seleccionado no existe en el array, el alta se rechaza

### Requirement: Validación de campos del cliente

El sistema SHALL validar en el alta de cliente que el nombre completo y el
email no estén vacíos (tras `trim()`) y que el email tenga formato válido,
comprobado en JavaScript.

#### Scenario: Nombre o email vacíos

- **WHEN** se envía `#form-cliente` con nombre vacío o solo espacios, o con
  email vacío o solo espacios
- **THEN** el alta se rechaza con un mensaje de error explícito
- **AND** el cliente no se agrega al listado

#### Scenario: Email con formato inválido

- **WHEN** el email ingresado no tiene un formato válido (p. ej. `sin-arroba`)
- **THEN** el alta se rechaza con un mensaje de error explícito
- **AND** la comprobación de formato se hace en JavaScript, no solo con el
  `type="email"` nativo

### Requirement: Email de cliente único normalizado

El sistema SHALL rechazar el alta de un cliente cuyo email, comparado sin
espacios exteriores y sin distinguir mayúsculas de minúsculas, coincida con el
email de un cliente ya registrado.

#### Scenario: Duplicado con mayúsculas y espacios exteriores

- **WHEN** el email ingresado, tras `trim()` y en minúsculas, coincide con el
  de un cliente ya registrado (p. ej. `  Ana.Perez@Correo.Ficticio ` contra
  `ana.perez@correo.ficticio`)
- **THEN** el alta se rechaza como duplicada con un mensaje de error explícito

#### Scenario: Emails distintos

- **WHEN** dos emails difieren después de normalizarlos (tras `trim()` y en
  minúsculas)
- **THEN** ambos clientes se registran correctamente

### Requirement: Control del envío con preventDefault y errores cerca del formulario

El sistema SHALL cancelar el envío de `#form-libro` y `#form-cliente` con
`event.preventDefault()` y SHALL mostrar los errores como texto explícito cerca
del formulario (no dependiendo solo del color), en `#msg-error` o un
contenedor próximo.

#### Scenario: Envío sin recarga

- **WHEN** el usuario envía cualquiera de los dos formularios, con o sin
  errores
- **THEN** la página no recarga ni navega
- **AND** el envío se procesa completamente en JavaScript

#### Scenario: Errores como texto junto al formulario

- **WHEN** alguna comprobación falla
- **THEN** se muestra texto de error explícito cerca del formulario,
  identificando lo fallido
- **AND** no se depende solo de un cambio de color para comunicar el error

#### Scenario: Confirmación de alta válida

- **WHEN** todas las comprobaciones pasan y el registro se agrega
- **THEN** se muestra una confirmación en `#msg-ok`
- **AND** se limpian los mensajes de error previos

### Requirement: Alta condicional y actualización sin recarga

El sistema SHALL agregar un registro solo si todas sus comprobaciones pasan, y
tras un alta válida SHALL actualizar sin recargar la página el listado
correspondiente y las opciones relacionadas (todo selector que consuma el
array actualizado), con funciones de refresco genéricas reutilizables.

#### Scenario: Alta válida de libro actualiza el listado

- **WHEN** se registra un libro válido en `libros.html`
- **THEN** el libro aparece como fila de `#libros-listado` con sus datos
  resueltos (título, ISBN, editorial, género, autores, precio) sin recargar
- **AND** `#libros-vacio` se oculta si el listado ahora tiene filas

#### Scenario: Alta válida de cliente actualiza el listado

- **WHEN** se registra un cliente válido en `clientes.html`
- **THEN** el cliente aparece como fila de `#clientes-listado` (nombre y
  email) sin recargar
- **AND** `#clientes-vacio` se oculta si el listado ahora tiene filas

#### Scenario: Refresco de opciones relacionadas

- **WHEN** se agrega un libro o un cliente válido
- **THEN** toda opción o selector que consuma el array actualizado se
  refresca con el mismo mecanismo de refresco, sin recargar la página

#### Scenario: Alta inválida no modifica el estado

- **WHEN** alguna comprobación falla
- **THEN** el listado correspondiente y las opciones relacionadas permanecen
  sin cambios

#### Scenario: Filas de ejemplo reemplazadas por render dinámico

- **WHEN** se inspecciona el HTML fuente y el DOM resultante de ambas páginas
- **THEN** las filas estáticas de ejemplo de `#libros-listado` y
  `#clientes-listado` fueron reemplazadas por filas generadas desde los datos

### Requirement: Inserción segura en el DOM

El sistema SHALL insertar las opciones, las filas de listado y los mensajes
con `textContent`/`createElement` (y `replaceChildren` para limpiar), y NO
SHALL usar `innerHTML` con datos de los arrays o con datos ingresados por
usuarios.

#### Scenario: Construcción segura de filas y opciones

- **WHEN** se renderiza una fila u opción con datos de usuario o de los arrays
- **THEN** se usa `createElement` y `textContent`
- **AND** no hay asignaciones de `innerHTML` con dichos datos

#### Scenario: Texto malicioso sin efecto

- **WHEN** un título, nombre o email contiene marcas HTML (p. ej. `<b>`)
- **THEN** se muestra como texto literal en el DOM, sin interpretarse como
  HTML

### Requirement: Funciones nombradas activadas por eventos

El sistema SHALL organizar la lógica en funciones nombradas con
responsabilidades reconocibles (poblar selectores, validar libro, validar
cliente, agregar libro, agregar cliente, refrescar listados/opciones) y SHALL
disparar la validación y el alta desde el evento `submit` de cada formulario.

#### Scenario: Responsabilidades separadas

- **WHEN** se inspecciona el código del Ejercicio 4
- **THEN** existen funciones nombradas separadas para poblar selectores,
  validar el libro, validar el cliente, agregar cada registro y refrescar
  listados/opciones

#### Scenario: Disparo por evento submit

- **WHEN** el usuario presiona el botón de envío de `#form-libro` o
  `#form-cliente`
- **THEN** la validación y el alta correspondientes se ejecutan por el evento
  `submit` del formulario

### Requirement: Integridad del alcance y apertura file://

El sistema SHALL conservar los IDs estables de los formularios y listados
(`#form-libro`, `#libro-titulo`, `#libro-isbn`, `#libro-precio`,
`#libro-editorial`, `#libro-genero`, `#libro-autores`, `#libros-listado`,
`#libros-vacio`, `#form-cliente`, `#cliente-nombre`, `#cliente-email`,
`#clientes-listado`, `#clientes-vacio`, `#msg-ok`, `#msg-error`), SHALL
mantener la apertura por `file://` sin dependencias externas y NO SHALL
adelantar alcance de los Ejercicios 5 ni 6 ni implementar edición o
eliminación de registros.

#### Scenario: IDs estables conservados

- **WHEN** se inspeccionan `libros.html` y `clientes.html` tras la
  implementación
- **THEN** todos los IDs estables listados existen con esos nombres exactos

#### Scenario: Sin alcance adelantado

- **WHEN** se revisa el código agregado
- **THEN** no hay lógica de ventas (renglones, subtotal/total, confirmación)
  ni uso de `localStorage`
- **AND** no hay operaciones de edición o eliminación de libros o clientes

#### Scenario: Apertura directa por file://

- **WHEN** se abren `libros.html` y `clientes.html` por doble clic
- **THEN** los selectores, el render de listados y los altas funcionan sin
  servidor ni conexión a internet
- **AND** solo se cargan hojas de estilo y scripts locales
