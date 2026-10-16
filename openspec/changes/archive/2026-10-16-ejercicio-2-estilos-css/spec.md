# SPEC — Ejercicio 2 · Identidad visual + CSS adaptable

Change: `ejercicio-2-estilos-css` · Fase 1 — SPEC (sin codigo de producto).

Fuentes de requisitos: `Docs/Repaso Primer Parcial.pdf`, pag. 3, seccion
"Ejercicio 2 · 2. Presentacion con CSS y uso adaptable" (hechos atribuidos
al PDF); `promtDos.md` (alcance, CA-01/CA-02/CA-03, ids estables,
exclusiones); estructura real inspeccionada en `index.html`,
`libros.html`, `clientes.html`, `ventas.html`, `historial.html` y
`css/estilos.css` actual. Nada de `tasks.md` en esta fase; PLAN e
IMPLEMENTACION bloqueados hasta aprobacion explicita.

Convencion: cada requisito usa codigo R2-xx. "HECHO (PDF p.3)" = cita
fiel del PDF; "PROPUESTA" = decision de diseno nueva de este change;
"SUPUESTO" = asuncion no bloqueante. Ninguna verificacion visual se
declara ejecutada.

## 1. Requisitos

### R2-01 · Identidad visual coherente con clases reutilizables (PROPUESTA que implementa HECHO PDF p.3)

HECHO (PDF p.3): "Se define una identidad visual propia y coherente:
colores, tipografia, espaciado, tarjetas, formularios y botones. El CSS se
mantiene en archivos externos y se reutilizan clases para elementos
equivalentes."

El sistema SHALL aplicar en las 5 paginas la identidad de `proposal.md`
(paleta con hex, tipografia del sistema, espaciado/escala) de modo que
tipografia, botones, formularios y tablas se vean coherentes, usando
clases reutilizables en espanol para elementos equivalentes.

Escenarios observables:

- Coherencia: al abrir las 5 paginas por `file://`, encabezado, nav,
  titulos, botones, `fieldset`, tablas y `#msg-ok`/`#msg-error` comparten
  paleta, tipografia y radios definidos en la propuesta.
- Reutilizacion: elementos equivalentes (botones primarios, tarjetas de
  seccion, campos de formulario, tablas) comparten las mismas clases;
  no hay estilos duplicados por pagina para el mismo patron.
- Tarjetas: cada `section`/`fieldset` principal se presenta como tarjeta
  (`#FFFFFF` sobre fondo `#F6F1E7`, borde `#D8CFC0`, radio `0.5rem`).
- Botones: boton primario `#1E3A5F` con texto blanco; hover con acento
  `#B4552D`; boton secundario con borde; todos con padding y radio
  uniformes.
- Formularios: `label` en bloque sobre su campo; `input/select` a ancho
  completo hasta `max-width: 28rem`; `fieldset/legend` con estilo tarjeta.
- Tablas: `thead` con fondo primario y texto blanco; filas con separacion
  legible y padding `0.5–0.75rem` por celda.

Vinculo: CA-01 (8 pts, identidad visual).

### R2-02 · Layout Flexbox/Grid adaptable 320/1280 sin overflow-x global (HECHO PDF p.3)

HECHO (PDF p.3): "Se utiliza Flexbox o Grid para organizar el contenido.
La interfaz se comprueba con un ancho de 320 px y otro de 1280 px: los
textos y controles resultan legibles y el contenido no provoca
desplazamiento horizontal de toda la pagina."

El sistema SHALL organizar el layout con Flexbox o Grid de modo que a
320 px y a 1280 px los textos y controles sean legibles y NO exista
desplazamiento horizontal de toda la pagina (`overflow-x` global no
permitido; no se admite `body { overflow-x: hidden }` como parche).

Escenarios observables:

- 320 px: con DevTools a 320 px de ancho, la pagina carga por `file://`,
  el `nav` hace wrap, los formularios apilan `label` sobre campo, y no hay
  barra de scroll horizontal de pagina (verificado con scroll manual +
  `document.documentElement.scrollWidth <= 320`).
- 1280 px: mismo documento a 1280 px usa el ancho con `main`
  (`max-width: 70rem` centrado), sin scroll horizontal global y sin
  columnas rotas.
- Legibilidad: a ambos anchos, textos con `line-height >= 1.5` y controles
  con area tactil suficiente (botones con padding `>= 0.5rem 1rem`).

Vinculo: CA-02 (8 pts, adaptacion responsive) — mitad de sus puntos.

### R2-03 · Tablas anchas con scroll solo en su contenedor `.tabla-contenedor` (HECHO PDF p.3)

HECHO (PDF p.3): "Si una tabla necesita mas espacio, se desplaza dentro
de su propio contenedor."

El sistema SHALL mantener cada tabla (`#catalogo-listado`,
`#libros-listado`, `#clientes-listado`, `#venta-renglones`,
`#historial-listado`) dentro de su `.tabla-contenedor` existente con
`overflow-x: auto`, de modo que una tabla mas ancha que el viewport genere
scroll SOLO dentro de ese contenedor y nunca scroll global de pagina.

Escenarios observables:

- Tabla ancha a 320 px: con la tabla de catalogo (6 columnas) a 320 px, el
  scroll horizontal aparece unicamente dentro de `.tabla-contenedor`;
  la pagina completa sigue sin scroll horizontal.
- Contenedor preservado: cada una de las 5 tablas conserva su
  `div.tabla-contenedor` padre directo (estructura real del Ej.1).
- Sin parche global: el CSS no declara `overflow-x: hidden` en `body/html`
  para ocultar el desborde.

Vinculo: CA-02 (8 pts, adaptacion responsive) — mitad de sus puntos.

### R2-04 · Accesibilidad basica: foco visible, contraste y mensajes por texto (HECHO PDF p.3)

HECHO (PDF p.3): "Los controles conservan un foco visible y se recorren
con el teclado. Los mensajes de error se expresan con texto y no dependen
unicamente de un color. Las imagenes informativas tienen texto
alternativo; las decorativas no repiten informacion innecesaria."

El sistema SHALL conservar foco visible por teclado en todo control
interactivo, con contraste de texto suficiente, y expresar exito/error con
texto explicito (nunca solo color). Regla de imagenes: informativa con
`alt`, decorativa sin redundancia (hoy no hay imagenes: se especifica
como regla preventiva).

Escenarios observables:

- Foco por teclado: al recorrer cada pagina con Tab, cada enlace, boton,
  `input` y `select` muestra `:focus-visible` (`outline: 3px solid
  #005FCC` + `outline-offset: 2px`, ya presente en el CSS actual y que se
  conserva; jamas `outline: none` sin reemplazo).
- Contraste: texto `#1A1A1A` sobre `#FFFFFF`/`#F6F1E7` y blanco sobre
  primario `#1E3A5F` con relacion suficiente (AA); si el acento se usa en
  texto pequeno se oscurece a `#8A3E1C`.
- Mensajes por texto: `#msg-ok` y `#msg-error` de cada pagina contienen
  texto explicito ("...registrado (ejemplo)" / "No se pudo... (ejemplo)");
  el color (verde `#1E7A34` / rojo `#B3261E`) es redundante, no el unico
  canal. Verificacion pendiente de usuaria en Fase 4.
- Imagenes: si la Fase 3 agregara alguna, la informativa llevara `alt`
  descriptivo y la decorativa `alt=""` o se resolvra por CSS.

Vinculo: CA-03 (4 pts, accesibilidad basica).

### R2-05 · Calidad CSS: solo `css/estilos.css`, cero inline, clases en espanol (HECHO PDF p.3 + convencion Ej.1)

HECHO (PDF p.3): "El CSS se mantiene en archivos externos". Convencion
heredada del Ej.1: sin estilos inline, unico CSS, clases en espanol.

El sistema SHALL mantener todo el CSS del Ejercicio 2 en el unico
archivo `css/estilos.css`, sin atributo `style` en ningun HTML, con
clases reutilizables en espanol en minusculas (p. ej. `.tabla-contenedor`,
`.tarjeta`, `.boton`, `.boton-secundario`, `.campo`, `.mensaje-ok`,
`.mensaje-error`), estructurado por secciones comentadas.

Escenarios observables:

- Cero inline: busqueda de `style=` en los 5 HTML devuelve cero
  coincidencias.
- Unico CSS: cada HTML enlaza solo `css/estilos.css`; no se agregan
  `<style>`, otros `.css`, libs ni CDN.
- Clases en espanol: las clases nuevas son legibles en espanol,
  minusculas y reutilizables (un patron = una clase).
- Estructura: `css/estilos.css` con cabecera por secciones
  (variables/paleta, base, layout, nav, tarjetas, botones, formularios,
  tablas, mensajes, foco, responsive).

Sin vinculo directo a puntos; condicion de entrega (20 pts totales).

### R2-06 · No alterar los ids estables del Ejercicio 1 (restriccion `promtDos.md` §8)

HECHO (`promtDos.md` §8, anti-alucinacion): NO alterar los ids estables
del DOM del Ejercicio 1. La Fase 3 solo puede agregar clases; jamas
renombrar, eliminar ni duplicar ids.

El sistema SHALL conservar intactos todos los ids existentes listados
abajo. La hoja del Ejercicio 2 solo los referencia como selectores; no
los modifica.

Mapa completo de ids intocables (44, verificados por inspeccion directa
de los 5 HTML en esta sesion):

- `index.html`: `#titulo-catalogo`, `#form-buscador`, `#buscador-titulo`,
  `#catalogo-mensaje`, `#catalogo-listado`, `#catalogo-vacio`.
- `libros.html`: `#titulo-libros`, `#form-libro`, `#libro-titulo`,
  `#libro-isbn`, `#libro-precio`, `#libro-editorial`, `#libro-genero`,
  `#libro-autores`, `#msg-ok`, `#msg-error`, `#libros-listado`,
  `#libros-vacio`. Incluye los 8 ids nucleo citados en `promtDos.md`:
  `#catalogo-listado`, `#catalogo-mensaje`, `#form-libro`,
  `#form-cliente`, `#venta-renglones`, `#historial-detalle`, `#msg-ok`,
  `#msg-error` (estos aparecen repartidos por pagina; `#msg-ok` /
  `#msg-error` existen en `libros.html`, `clientes.html`, `ventas.html`,
  `historial.html` con el mismo nombre por pagina).
- `clientes.html`: `#titulo-clientes`, `#form-cliente`,
  `#cliente-nombre`, `#cliente-email`, `#msg-ok`, `#msg-error`,
  `#clientes-listado`, `#clientes-vacio`.
- `ventas.html`: `#titulo-ventas`, `#form-venta`, `#venta-cliente`,
  `#venta-libro`, `#venta-cantidad`, `#venta-renglones`,
  `#venta-renglones-vacio`, `#titulo-resumen`, `#venta-resumen`,
  `#msg-ok`, `#msg-error`.
- `historial.html`: `#titulo-historial`, `#historial-listado`,
  `#historial-vacio`, `#titulo-detalle`, `#historial-detalle`,
  `#msg-ok`, `#msg-error`.

Escenarios observables:

- Reserva: inspeccion del DOM muestra cada id con nombre exacto y sin
  duplicados en su pagina.
- Sin logica: los ids siguen sin comportamiento JS asociado (Ej. 3–5
  futuros); el CSS solo los estiliza.

Sin vinculo directo a puntos; restriccion bloqueante (romperla invalida
los Ejercicios 3–5).

## 2. Criterios de aceptacion del Ejercicio 2 (fuente: `promtDos.md` §7)

- CA-01 (Identidad Visual — 8 pts): coherencia grafica en las 5 paginas
  en tipografia, botones, formularios y tablas. Vinculado a R2-01 + R2-05.
- CA-02 (Adaptacion Responsive — 8 pts): sin scroll horizontal a 320 px ni
  1280 px; tablas con desplazamiento interno. Vinculado a R2-02 + R2-03.
- CA-03 (Accesibilidad Basica — 4 pts): indicadores de foco `:focus`
  visibles en todos los elementos interactivos; mensajes de error en
  texto. Vinculado a R2-04.

Ningun criterio se declara cumplido en esta fase SPEC. La verificacion es
manual por la usuaria en Fase 4 (anti-alucinacion `promtDos.md` §8).

## 3. Estados y casos limite

- Tabla ancha a 320 px → scroll interno del `.tabla-contenedor`, nunca
  global (R2-03). Caso: catalogo con 6 columnas.
- Lista vacia / sin resultados: placeholders `#catalogo-vacio`,
  `#libros-vacio`, `#clientes-vacio`, `#venta-renglones-vacio`,
  `#historial-vacio` y `#catalogo-mensaje` conservan estilo de mensaje
  coherente (R2-01 + R2-04).
- Foco por teclado en cada control: Tab recorre nav, buscador, todos los
  campos de `#form-libro` / `#form-cliente` / `#form-venta` (incluido
  `select multiple #libro-autores`), botones "Registrar libro",
  "Registrar cliente", "Buscar por titulo", "Agregar renglon",
  "Confirmar venta" y enlaces "Ver detalle" (R2-04).
- Mensaje de error sin color: con CSS desactivado o en alto contraste, el
  texto de `#msg-error` sigue comunicando el fallo (R2-04).
- `file://`: doble clic en cada HTML sin servidor ni red; sin recursos
  externos (R2-05 + restricciones).

## 4. Supuestos y pendientes

SUPUESTO S-01: no se agregan imagenes en el Ejercicio 2; la regla `alt`
del PDF queda como preventiva.
SUPUESTO S-02: la escala tipografica y el `max-width: 70rem` propuestos
son aceptables; se ajustan en Fase 3 solo con aprobacion.
SUPUESTO S-03: `js/app.js` permanece placeholder; ningun estilo depende
de JS.

DATO_PENDIENTE P-01: tonos exactos de la paleta a confirmar por la
usuaria antes de la Fase 3 (propuesta actual: fondo `#F6F1E7`, primario
`#1E3A5F`, acento `#B4552D`, exito `#1E7A34`, error `#B3261E`,
foco `#005FCC`). No bloquea esta SPEC.
DATO_PENDIENTE P-02: confirmar si "Confirmar venta" (`ventas.html`, boton
fuera de `form-venta`) lleva estilo primario o secundario. No bloquea.
