# Spec Delta — altas-validacion

## MODIFIED Requirements

### Requirement: Integridad del alcance y apertura file://

El sistema SHALL conservar los IDs estables de los formularios y listados
(`#form-libro`, `#libro-titulo`, `#libro-isbn`, `#libro-precio`,
`#libro-editorial`, `#libro-genero`, `#libro-autores`, `#libros-listado`,
`#libros-vacio`, `#form-cliente`, `#cliente-nombre`, `#cliente-email`,
`#clientes-listado`, `#clientes-vacio`, `#msg-ok`, `#msg-error`), SHALL
mantener la apertura por `file://` sin dependencias externas y NO SHALL
implementar edición o eliminación de registros ni adelantar alcance ajeno a
las altas. El uso de `localStorage` queda reservado a la capa de
persistencia del Ejercicio 6 (claves de catálogos y ventas), sin UI de
edición y sin reabrir el alcance de los Ejercicios 1–5. (Ejercicio 6: se
retira la cláusula que prohibía «uso de `localStorage`», que contradiría el
código entregado una vez que `js/app.js` — compartido por estas páginas —
contiene la capa de persistencia.)

#### Scenario: IDs estables conservados

- **WHEN** se inspeccionan `libros.html` y `clientes.html` tras la
  implementación
- **THEN** todos los IDs estables listados existen con esos nombres exactos

#### Scenario: Sin alcance adelantado

- **WHEN** se revisa el código agregado
- **THEN** no hay lógica de ventas propia de las altas (renglones,
  subtotal/total, confirmación) en los flujos de altas
- **AND** el único uso de `localStorage` en el código compartido es la capa
  de persistencia del Ejercicio 6 (claves `libreria-libros`,
  `libreria-clientes`, `libreria-ventas`)
- **AND** no hay operaciones de edición o eliminación de libros o clientes

#### Scenario: Apertura directa por file://

- **WHEN** se abren `libros.html` y `clientes.html` por doble clic
- **THEN** los selectores, el render de listados y las altas funcionan sin
  servidor ni conexión a internet
- **AND** solo se cargan hojas de estilo y scripts locales
