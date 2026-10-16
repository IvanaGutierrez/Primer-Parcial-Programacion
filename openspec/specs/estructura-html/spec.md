# estructura-html Specification

## Purpose
Define la estructura HTML navegable del Ejercicio 1 del TPI frontend de
librería: 5 vistas con datos ficticios, semántica, formularios, tablas,
estados en DOM e ids estables para el JS de los Ejercicios 3-5.

## Requirements

### Requirement: Vistas navegables del Ejercicio 1

The system SHALL expose las 5 vistas (Catálogo, Libros, Clientes, Ventas,
Historial) alcanzables desde `nav` en ≤2 clics, cada una con su contenido
mínimo y datos estáticos de ejemplo ficticios.

#### Scenario: Navegación entre vistas

- **WHEN** la usuaria abre `index.html` y usa el `nav`
- **THEN** cada enlace lleva a su vista en 1 clic y cualquier vista alcanza
  a cualquier otra en ≤2 clics, mostrando su contenido mínimo.

### Requirement: Estructura semántica e interfaces

The system SHALL usar `header/nav/main/footer` semánticos; formularios de
Libro, Cliente y Venta con `label for/id` por campo; botones con verbo de
acción («Registrar libro», «Registrar cliente», «Buscar por título»,
«Agregar renglón», «Confirmar venta»); y tablas con `thead/th`.

#### Scenario: Inspección de semántica

- **WHEN** se inspecciona el HTML de cualquier vista
- **THEN** existen `header`, `nav`, `main`, `footer`; todo campo tiene
  `label for/id`; los botones describen su acción; y cada tabla declara
  `thead` con `th` (catálogo: título, ISBN, editorial, género, autores,
  precio; venta renglones: libro, cantidad, precio unitario, subtotal;
  historial: id, fecha, cliente, total).

### Requirement: Datos de ejemplo y estados en DOM

The system SHALL mostrar datos ficticios por listado con placeholder de
vacío con `id`; buscador con `#catalogo-mensaje` para sin resultados;
zonas `#msg-ok` y `#msg-error`; y «Sin clasificar» para libro sin género.

#### Scenario: Casos límite presentes

- **WHEN** se inspecciona el DOM
- **THEN** al menos un libro muestra «Sin clasificar»; cada listado tiene
  placeholder de vacío con `id`; y existen `#catalogo-mensaje`, `#msg-ok`
  y `#msg-error`.

### Requirement: Calidad sin estilos inline

The system SHALL mantener HTML válido sin estilos inline, CSS solo en
`css/estilos.css`, ids y clases en español legibles, foco visible por
teclado e imágenes solo locales con `alt` (o ninguna).

#### Scenario: Revisión de calidad

- **WHEN** se inspecciona el HTML/CSS y se navega con Tab
- **THEN** no hay atributo `style`; el foco es visible; y no hay imágenes
  remotas ni sin `alt`.

### Requirement: Apertura file:// y anchos 320/1280

The system SHALL abrir `index.html` por doble clic/file:// sin npm ni
servidor, sin desplazamiento horizontal total a 320 px y 1280 px, con
tablas anchas en contenedor de scroll propio.

#### Scenario: Verificación visual

- **WHEN** se abre por doble clic y se ajusta a 320 px y 1280 px
- **THEN** la maqueta carga sin errores y no hay scroll horizontal total.

### Requirement: Convenciones de archivos

The system SHALL organizarse como `index.html` (+ páginas hermanas o
secciones `#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`),
carpetas `css/`, `js/` (placeholder) y `assets/` si aplica, todo en
minúsculas sin espacios.

#### Scenario: Revisión de estructura

- **WHEN** se lista la carpeta del proyecto
- **THEN** los nombres cumplen la convención y `css/estilos.css` es el
  único CSS.

### Requirement: Ids estables para Ejercicios 3-5

The system SHALL exponer los `id` estables documentados
(`#catalogo-listado`, `#catalogo-mensaje`, `#form-libro`,
`#form-cliente`, `#venta-renglones`, `#historial-detalle`, `#msg-ok`,
`#msg-error` y resto del mapa) sin comportamiento asociado.

#### Scenario: Reserva de hooks

- **WHEN** se inspecciona el DOM
- **THEN** cada `id` del mapa existe con el nombre exacto y sin lógica
  asociada.
