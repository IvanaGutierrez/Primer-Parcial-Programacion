# Spec Delta — venta-historial

## REMOVED Requirements

### Requirement: Puente de sesión con sessionStorage reemplazable

**Reason**: El Ejercicio 6 reemplaza el puente de sesión (`sessionStorage`,
session-scoped) por `localStorage` persistente; el requisito y su escenario
«Sin localStorage» quedan en contradicción directa con el alcance nuevo (que
exige exactamente lo contrario).

**Migration**: Usar el requisito «Puente de persistencia reemplazable con
localStorage» de este delta: mismo punto de integración
(`obtenerVentas()`/`guardarVentas()` concentran la lectura/escritura), misma
clave `libreria-ventas`, ahora sobre `localStorage`.

## ADDED Requirements

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
