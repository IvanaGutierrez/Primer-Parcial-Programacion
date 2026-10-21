# Spec Delta — verificacion-entrega

## Purpose

Define el cierre documental del TPI: el `README.md` de la raíz con el
contenido mínimo del formato de entrega, el registro de los ocho casos
manuales con su resultado observado real, el método de verificación de
cierre, el procedimiento guiado del precio histórico sobre copia de prueba y
la declaración de los límites del almacenamiento del navegador.

## ADDED Requirements

### Requirement: README.md de identificación con apertura file:// y navegación

El sistema (la entrega del proyecto) SHALL incluir un archivo `README.md` en
la raíz que identifique a quienes realizaron el trabajo, describa los pasos
para abrir `index.html` en el navegador sin npm y explique la navegación
entre las vistas del proyecto.

#### Scenario: Archivo presente

- **WHEN** se revisa la raíz del proyecto
- **THEN** existe `README.md`

#### Scenario: Autores e identificación

- **WHEN** se lee el README
- **THEN** identifica a quienes realizaron el trabajo
- **AND** el proyecto se describe como el TPI de Programación III con sus
  vistas por ejercicio

#### Scenario: Apertura y navegación documentadas

- **WHEN** se leen las secciones de uso del README
- **THEN** la apertura se describe por doble clic en `index.html` (sin npm,
  sin servidor, sin conexión)
- **AND** se explica cómo navegar entre las vistas de los ejercicios

### Requirement: README con funcionalidades, datos iniciales y recursos declarados

El README SHALL declarar las funcionalidades implementadas y las pendientes
por ejercicio, la ubicación de los datos iniciales ficticios y la
procedencia de imágenes u otros recursos ajenos si existen.

#### Scenario: Funcionalidades implementadas y pendientes

- **WHEN** se lee la sección de alcance del README
- **THEN** enumera las funcionalidades implementadas y las que quedan
  pendientes, diferenciadas por ejercicio

#### Scenario: Datos iniciales documentados

- **WHEN** se lee la sección de datos del README
- **THEN** se indica que los datos iniciales ficticios viven en `js/datos.js`

#### Scenario: Recursos ajenos

- **WHEN** se revisa el README y los recursos del proyecto
- **THEN** se declara la procedencia de imágenes o recursos ajenos si
  existen, o se declara explícitamente que no hay recursos externos

### Requirement: Registro de los ocho casos manuales con resultado observado real

El sistema (la entrega) SHALL registrar en el `README.md` el resultado
observado de los ocho casos manuales del Ejercicio 6, y ningún caso SHALL
figurar como aprobado sin haberse ejecutado.

#### Scenario: Los ocho casos registrados

- **WHEN** se lee la sección de resultados del README
- **THEN** están los ocho casos de la consigna (búsqueda; alta de libro con
  ISBN duplicado/nuevo; alta de cliente con email inválido/en mayúsculas/
  nuevo; venta inválida; venta válida 2×1500 y 1×2000; precio histórico en
  copia de prueba; recarga tras altas y venta; teclado y anchos 320/1280 px)
- **AND** cada uno tiene su resultado observado escrito

#### Scenario: Nada aprobado sin ejecutar

- **WHEN** se revisa el registro antes de la entrega
- **THEN** ningún caso aparece como aprobado sin evidencia de ejecución
- **AND** un caso fallido o pendiente registra el comportamiento real visto

### Requirement: Método de verificación manual por file:// como fuente de verdad

La verificación de cierre SHALL ejecutarse manualmente en navegador abierto
por `file://`, incluyendo la navegación por teclado y los anchos de 320 px y
1280 px; cualquier script automatizado SHALL ser solo complementario.

#### Scenario: Verificación manual obligatoria

- **WHEN** se ejecuta la fase de verificación
- **THEN** los ocho casos se prueban a mano en navegador por `file://`
- **AND** se verifican foco visible, controles utilizables con teclado y
  tabla con desplazamiento propio en 320 px y 1280 px

#### Scenario: Script auxiliar no sustitutivo

- **WHEN** se usa opcionalmente un script de verificación (p. ej. Edge
  headless con rutas relativas derivadas de `__dirname`)
- **THEN** su resultado se presenta como apoyo de regresión
- **AND** no reemplaza el registro manual de los ocho casos en el README

### Requirement: Procedimiento guiado de precio histórico en copia de prueba

El caso de precio histórico SHALL ejecutarse sobre una copia del proyecto
con datos de prueba, modificando a mano desde las herramientas del navegador
únicamente el precio del libro dentro del catálogo guardado, sin tocar las
ventas guardadas.

#### Scenario: Modificación manual aislada del precio

- **WHEN** se confirma una venta, se anotan sus importes y se cambia solo el
  `precio` del libro en `libreria-libros` desde DevTools
- **THEN** las ventas guardadas no se modifican ni se borran
- **AND** tras recargar, el detalle de esa venta conserva precio unitario,
  subtotales y total confirmados

#### Scenario: Reproducibilidad documentada

- **WHEN** se lee el README
- **THEN** se identifican la ubicación y la estructura del catálogo guardado
  necesarias para reproducir la comprobación
- **AND** no se exige ninguna pantalla de edición de precios (no existe)

### Requirement: Límites del almacenamiento declarados en el README

El `README.md` SHALL explicar que el almacenamiento depende del navegador,
del perfil y de la ubicación de apertura, y que no comparte información
entre usuarios.

#### Scenario: Dependencia del navegador, perfil y ubicación

- **WHEN** se lee la sección de límites del README
- **THEN** se explica que los datos persisten solo en el navegador, perfil y
  equipo donde se abrió la página
- **AND** se explica que no hay servidor, sincronización ni datos compartidos
  entre usuarios
- **AND** se explica que borrar los datos del navegador elimina el catálogo
  guardado y el historial
