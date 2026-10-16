# Proposal — ejercicio-2-estilos-css

## Why

El Ejercicio 1 dejo una maqueta HTML cruda y funcional (5 paginas
multipagina: `index.html`, `libros.html`, `clientes.html`, `ventas.html`,
`historial.html`, con `css/estilos.css` minimo estructural y `js/app.js`
placeholder). Hecho verificado por lectura directa en esta sesion: el CSS
actual solo define `box-sizing`, tipografia `system-ui, Arial`, ancho
`max-width: 60rem`, `nav` en flex basico, `:focus-visible` con
`outline: 3px solid #005fcc` y `.tabla-contenedor` con `overflow-x: auto`.
No hay identidad visual propia: sin paleta definida, sin jerarquia
tipografica, sin estilo de tarjetas/botones/formularios/tablas.

El Ejercicio 2 (fuente: `Docs/Repaso Primer Parcial.pdf`, pag. 3, seccion
"Ejercicio 2 · 2. Presentacion con CSS y uso adaptable", 20 puntos) exige
convertir esa maqueta en una interfaz atractiva, profesional y accesible,
con CSS externo, clases reutilizables, layout Flexbox/Grid y adaptacion
verificada a 320 px y 1280 px. Sin esta SPEC no hay contrato verificable
para el PLAN (Fase 2) ni la IMPLEMENTACION (Fase 3, solo `css/estilos.css`).

## What Changes

- Se crea la SPEC del Ejercicio 2 (este change): `proposal.md` + `spec.md`.
  Sin codigo de producto en esta fase (NO se toca `css/estilos.css`,
  ningun HTML ni `js/app.js`).
- La SPEC define la identidad visual propuesta (paleta con hex, tipografia
  del sistema, espaciado/escala, estilos de tarjetas, botones,
  formularios y tablas) y las reglas CSS verificables (R2-01 a R2-06,
  criterios CA-01 a CA-03).
- La SPEC congela los ids estables del Ejercicio 1 como intocables
  (listados en `spec.md`, R2-06) y fija las reglas responsive
  (320/1280 sin `overflow-x` global; tablas con scroll solo en
  `.tabla-contenedor`) y de accesibilidad (`:focus-visible` visible,
  contraste suficiente, mensajes por texto).
- Excluido explicitamente (fuente: `promtDos.md`, seccion Alcance Estricto):
  logica JS activa y manipulacion de datos locales (Ejercicios 3, 4 y 5);
  librerias, frameworks o preprocesadores (Tailwind, Bootstrap, Sass, Less);
  CDNs o fuentes/recursos externos con internet; servidores o npm.
  Apertura siempre directa por protocolo `file://`.

## Capabilities

### New Capabilities

- `estilos-css`: identidad visual y CSS adaptable del Ejercicio 2 —
  paleta/tipografia/espaciado, layout Flexbox/Grid 320/1280, tablas con
  scroll interno, accesibilidad basica y reglas de calidad CSS
  (requisitos R2-01 a R2-06, criterios CA-01 a CA-03).

### Modified Capabilities

- (ninguna — `openspec list --json` confirma cero changes activos y la spec
  instalada `estructura-html` del Ejercicio 1 no se modifica; este change
  solo agrega la capa visual sin alterar su estructura).

## Impact

- Esta fase no toca codigo de producto: NO se crea ni modifica
  `css/estilos.css`, ningun `.html`, `js/app.js` ni assets.
  Solo documentos SPEC en `openspec/changes/ejercicio-2-estilos-css/`.
- La implementacion futura (Fase 3, bloqueada hasta aprobacion explicita)
  redactara exclusivamente `css/estilos.css` (y ajuste minimo de clases en
  HTML solo si es estrictamente necesario, sin tocar ids estables).
  Sin dependencias nuevas: solo CSS3 externo + HTML existente.
- Restriccion `file://`: sin build, sin fetch, sin red; todo local.

## Contexto verificado

- Rama actual: `ejercicio-2-estilos` (verificado con
  `git branch --show-current` en esta sesion).
- Arbol limpio salvo `?? promtDos.md` (nuevo, no commiteado) —
  verificado con `git status --short` en esta sesion.
- Ultimo commit: `927b6dc feat(ejercicio-1): estructura html multipagina
  y fundacion openspec completada`.
- `openspec list --json` devuelve `{"changes": []}` (sin changes activos).
- Spec instalada: `openspec/specs/estructura-html/spec.md` (Ejercicio 1).
- `promtDos.md` ya existe en la raiz (no recrearlo).
- Base real inspeccionada: 5 HTML con `header/nav/main/footer`,
  formularios `#form-buscador`, `#form-libro`, `#form-cliente`,
  `#form-venta`, tablas `#catalogo-listado`, `#libros-listado`,
  `#clientes-listado`, `#venta-renglones`, `#historial-listado`,
  contenedores `.tabla-contenedor`, clase `.activo` en nav y zonas
  `#msg-ok` / `#msg-error` por pagina.

## Propuesta estetica CONCRETA (propuesta, no hecho verificado)

> Esta seccion es PROPUESTA de diseno para el Ejercicio 2. No proviene del
> PDF ni de los HTML; son valores nuevos que la implementacion aplicara.
> Tonos exactos pendientes de confirmacion por la usuaria
> (ver `DATO_PENDIENTE` en `spec.md`).

### Paleta (hex + rol)

| Rol | Hex | Uso |
|-----|-----|-----|
| Fondo de pagina | `#F6F1E7` | `body`: marfil calido de libreria |
| Superficie (tarjetas/secciones) | `#FFFFFF` | `section`, `fieldset`, `.tarjeta` |
| Primario | `#1E3A5F` | header, titulos `h1/h2`, botones primarios, `thead` |
| Acento | `#B4552D` | enlaces activos, bordes destacados, hover de botones |
| Texto principal | `#1A1A1A` | parrafos, celdas, labels |
| Texto secundario | `#4A4A4A` | descripciones, `caption`, footer |
| Borde sutil | `#D8CFC0` | bordes de tarjetas, inputs, tablas |
| Exito (texto + color) | `#1E7A34` | `#msg-ok`: borde/fondo tenue + texto explicito |
| Error (texto + color) | `#B3261E` | `#msg-error`: borde/fondo tenue + texto explicito |
| Foco visible | `#005FCC` | `:focus-visible` outline (ya existe en CSS actual; se conserva) |

Criterio: texto `#1A1A1A` sobre `#FFFFFF`/`#F6F1E7` y `#FFFFFF` sobre
`#1E3A5F` superan contraste AA. Acento `#B4552D` se usa en superficies
grandes y estados; para texto pequeno sobre blanco se oscurece a
`#8A3E1C` si la verificacion manual lo exige. Los mensajes de exito/error
NUNCA dependen solo del color: siempre llevan texto explicito
(exigencia del PDF, pag. 3).

### Tipografia del sistema (sin CDN ni descargas)

```css
font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
```

- Base `16px` (`1rem`), `line-height: 1.5`.
- Escala: `h1` 2rem, `h2` 1.5rem, `h3` 1.25rem, cuerpo 1rem,
  pequeno (`caption`, ayuda) 0.875rem.
- Jerarquia por peso/tamano, no por color solo.

### Espaciado y escala

- Unidad base `0.25rem`; escala `0.5 / 1 / 1.5 / 2rem`.
- Contenedor `main`: `max-width: 70rem`, centrado, padding lateral `1rem`.
- Tarjetas/secciones: padding `1–1.5rem`, radio `0.5rem`,
  borde `1px solid #D8CFC0`, sombra sutil.
- Botones: padding `0.5rem 1rem`, radio `0.375rem`.

### Estilo de componentes (resumen verificable en spec.md R2-01)

- Tarjetas/secciones: fondo `#FFFFFF` sobre fondo `#F6F1E7`, borde y radio
  coherentes en las 5 paginas.
- Botones: primario `#1E3A5F` con texto blanco; hover con acento `#B4552D`;
  `type="button"` secundario con borde; foco siempre visible.
- Formularios: `label` en bloque sobre el campo; `input/select` a ancho
  completo hasta `max-width: 28rem`, borde `#D8CFC0`, radio `0.375rem`;
  `fieldset/legend` con tarjeta.
- Tablas: `thead` con fondo primario y texto blanco; filas alternas tenues;
  `th/td` con padding `0.5–0.75rem`; jamas scroll global — scroll solo en
  `.tabla-contenedor`.
- Navegacion: `nav ul` en Flexbox con wrap; enlace `.activo` subrayado y
  en negrita (se conserva la convencion del Ej.1).

## Alcance incluido vs exclusiones

Incluido (fuente: PDF pag. 3 + `promtDos.md`): identidad visual coherente;
CSS externo centralizado con clases reutilizables en espanol; layout
Flexbox/Grid; verificacion 320 px y 1280 px sin scroll horizontal total;
tablas con scroll interno; foco visible por teclado; mensajes por texto;
`alt` en imagenes informativas (hoy no hay imagenes: no aplica).

Excluido/bloqueado: JS activo y datos locales (Ej. 3–5); libs/frameworks/
preprocesadores; CDN/fuentes externas; npm/servidores; alterar ids
estables; estilos inline.

## Supuestos

- Se asume que la usuaria confirmara o ajustara los tonos exactos antes de
  la Fase 3 (no bloquea la SPEC; ver `DATO_PENDIENTe` en `spec.md`).
- Se asume que no se agregaran imagenes en el Ejercicio 2; si aparecen,
  aplican las reglas `alt` del PDF.
- No se afirma ninguna verificacion visual/responsive ejecutada: todas
  quedan para la Fase 4 con verificacion manual de la usuaria.
