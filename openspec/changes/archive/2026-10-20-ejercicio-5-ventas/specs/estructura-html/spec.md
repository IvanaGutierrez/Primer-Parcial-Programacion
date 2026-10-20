# Spec Delta — estructura-html

## MODIFIED Requirements

### Requirement: Vistas navegables del Ejercicio 1

The system SHALL expose las 5 vistas (Catálogo, Libros, Clientes, Ventas,
Historial) alcanzables desde `nav` en ≤2 clics, cada una con su contenido
mínimo; los datos estáticos de ejemplo ficticios con que nace cada vista en el
Ejercicio 1 son el estado base de la maqueta y MAYEN ser reemplazados por
contenido generado desde JavaScript en etapas posteriores (Ejercicio 4:
`libros.html` y `clientes.html`; Ejercicio 5: `ventas.html` e
`historial.html`), conservando en todo caso la estructura semántica y los IDs
estables.

#### Scenario: Navegación entre vistas

- **WHEN** la usuaria abre `index.html` y usa el `nav`
- **THEN** cada enlace lleva a su vista en 1 clic y cualquier vista alcanza a
  cualquier otra en ≤2 clics, mostrando su contenido mínimo

#### Scenario: Contenido dinámico en vistas de etapas posteriores

- **WHEN** el Ejercicio 4 renderiza `libros.html`/`clientes.html` y el
  Ejercicio 5 renderiza `ventas.html`/`historial.html` desde JavaScript
- **THEN** el contenido de ejemplo del Ejercicio 1 (opciones, filas y textos
  de ejemplo) es reemplazado por contenido generado
- **AND** la navegación, la semántica (header, nav, main, section, footer) y
  los IDs estables de ambas páginas se conservan sin cambios
