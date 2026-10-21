# Librería Ejemplo — TPI de Programación III

Trabajo Práctico Integrador de la materia Programación III (UTN): una
librería multipágina construida con HTML, CSS y JavaScript nativo (sin
librerías ni frameworks) que cubre los Ejercicios 1 a 6 del repaso del
primer parcial: estructura HTML, estilos, catálogo con filtro, altas con
validación, venta simulada con historial y, en el Ejercicio 6, persistencia
de los datos en el navegador, verificación manual y documentación.
Todos los datos son ficticios y de ejemplo.

## Autores

- Ivana Gutiérrez
- Brisa Muñoz
- Julieta Chávez
- Rayssa Alejo

## Cómo abrir el proyecto

1. Hacer doble clic en `index.html` (o en cualquier otra vista) para
   abrirlo en el navegador. No hace falta npm, ni servidor, ni conexión a
   internet: todos los archivos (HTML, CSS y JS) son locales.
2. Navegador moderno de escritorio recomendado (p. ej. Edge).
3. Para inspeccionar los datos guardados: teclado `F12` → pestaña
   *Application* (Almacenamiento) → *Local Storage*.

## Navegación entre vistas

Cada página (salvo `ejercicio3.html`) tiene un menú superior con los
siguientes enlaces:

| Vista | Archivo | Contenido |
| --- | --- | --- |
| Catálogo | `index.html` | Maqueta estática del catálogo (Ejercicio 1) |
| Catálogo con filtro | `ejercicio3.html` | Búsqueda por título (Ejercicio 3) |
| Libros | `libros.html` | Altas de libros con validación (Ejercicio 4) |
| Clientes | `clientes.html` | Altas de clientes con validación (Ejercicio 4) |
| Ventas | `ventas.html` | Venta simulada con renglones (Ejercicio 5) |
| Historial | `historial.html` | Historial de ventas y detalle (Ejercicio 5) |

`ejercicio3.html` no figura en el menú: se abre directamente (doble clic o
barra de direcciones).

## Funcionalidades implementadas y pendientes

- **Ejercicio 1 — Estructura HTML (implementado):** maqueta multipágina
  (`index.html` + las 5 vistas) con encabezado, menú de navegación y
  tablas de ejemplo.
- **Ejercicio 2 — Estilos CSS (implementado):** hoja `css/estilos.css`
  compartida por todas las vistas.
- **Ejercicio 3 — Catálogo con filtro (implementado):**
  `ejercicio3.html` + `js/ejercicio3.js` buscan por título sin distinguir
  mayúsculas, muestran el catálogo completo con búsqueda vacía y un
  mensaje cuando no hay coincidencias.
- **Ejercicio 4 — Altas con validación (implementado):** `libros.html` y
  `clientes.html` dan de alta registros sin recargar la página, con
  validación de campos obligatorios, formato, ISBN/email duplicados
  (comparación normalizada) y relaciones editorial/género/autor.
- **Ejercicio 5 — Venta simulada e historial (implementado):**
  `ventas.html` arma renglones (cantidad entera mayor que cero, libro no
  repetido — se suma la cantidad), calcula subtotales y total con dos
  decimales y confirma la venta; `historial.html` lista las ventas y
  muestra su detalle con el precio unitario congelado al momento de la
  confirmación.
- **Ejercicio 6 — Persistencia, verificación y documentación:**
  - *Implementado:* capa de `localStorage` en `js/app.js` que conserva
    libros, clientes y ventas entre sesiones (siembra única de los datos
    semilla, lectura siempre desde el almacenamiento, escritura del array
    completo en cada alta y confirmación, defensa con `try/catch` ante
    almacenamiento vacío, JSON inválido o no disponible) y este
    `README.md`.
  - *Verificado:* los ocho casos manuales de verificación fueron ejecutados
    a mano en Edge por `file://` y sus resultados registrados en la tabla
    más abajo (los 8 con resultado APROBADO, con sus observaciones).
    *Pendiente:* el script opcional de apoyo `_verify_ej6.js` no está
    creado ni ejecutado.
- **Pendientes globales:** `index.html` sigue siendo una maqueta estática
  (su buscador no filtra; el filtro real es el del Ejercicio 3); no hay
  pantalla de edición ni eliminación de registros; no hay backend, servidor
  ni base de datos; editoriales, géneros y autores no se persisten (viven
  solo en `js/datos.js`, fuera del alcance de «libros, clientes y ventas»).

## Datos iniciales

Todos los datos iniciales son ficticios y viven en `js/datos.js`: los
arrays `editoriales` (ed1–ed2), `generos` (g1–g2), `autores` (a1–a3),
`clientes` (c1–c3, con email) y `libros` (l1–l6, con ISBN y precio;
`l6` sin género), más la función `buscarPorId(lista, id)`. Estos arrays
son la única fuente de siembra: nunca se modifican desde el
almacenamiento.

## Almacenamiento: claves, ubicación y estructura del catálogo guardado

**Ubicación:** las páginas guardan los datos en el `localStorage` del
navegador. Se inspecciona con `F12` → *Application* (Almacenamiento) →
*Local Storage* → origen `file://...` (la ruta del archivo abierto). El
Ejercicio 6 usa exactamente estas tres claves y ninguna otra:

| Clave | Contenido | Cuándo se crea |
| --- | --- | --- |
| `libreria-libros` | Array JSON de libros: semilla + dados de alta | Primer arranque de una página que carga `js/datos.js` |
| `libreria-clientes` | Array JSON de clientes: semilla + dados de alta | Primer arranque de una página que carga `js/datos.js` |
| `libreria-ventas` | Array JSON de ventas confirmadas | Al confirmar la primera venta |

**Estructura JSON (misma forma que los datos semilla):**

```json
{
  "libreria-libros": [
    { "id": "l1", "titulo": "…", "isbn": "…", "editorialId": "ed1",
      "autorIds": ["a1"], "generoId": "g1", "precio": 8999.99 }
  ],
  "libreria-clientes": [
    { "id": "c1", "nombre": "…", "email": "…@correo.ficticio" }
  ],
  "libreria-ventas": [
    { "id": "v1", "fecha": "dd/mm/aaaa hh:mm", "clienteId": "c1",
      "clienteNombre": "…",
      "renglones": [
        { "libroId": "l1", "titulo": "…", "cantidad": 2,
          "precioUnitario": 1500, "subtotal": 3000 }
      ],
      "total": 5000 }
  ]
}
```

**Regla de siembra (sin duplicar):** en el primer arranque, si una clave
no existe o está vacía, se copia allí el array semilla de `js/datos.js`
con una copia profunda (serialización JSON). Al reabrir, si la clave ya
tiene datos, los ejemplos NO se agregan de nuevo: `l1..l6` y `c1..c3`
aparecen exactamente una vez y las ventas no se duplican ni se re-escriben
al abrir el historial. Un valor existente no se pisa al abrir una página
(aunque su JSON esté dañado: la página opera en memoria con la semilla y
el valor corrupto se reemplaza recién en la próxima escritura exitosa).

**Para reproducir el caso del precio histórico (caso 6):** sobre una
*copia* del proyecto, confirmar una venta y anotar sus importes; luego en
DevTools → *Local Storage* → origen `file://`, modificar **únicamente** el
campo `precio` del libro dentro de la clave `libreria-libros` (sin tocar
`libreria-ventas`); recargar y abrir el detalle de la venta: el precio
unitario, los subtotales y el total deben conservar los valores
confirmados. No existe ninguna pantalla para editar precios.

## Funcionamiento y límites de `localStorage`

- El almacenamiento **depende del navegador, del perfil de usuario y de la
  ubicación de apertura** (origen `file://` de la carpeta desde la que se
  abrió la página): los datos quedan solo en ese equipo y ese perfil.
- **No comparte información entre usuarios** ni entre perfiles, y no
  sincroniza con ningún servidor: no hay backend, no hay red.
- **Borrar los datos del navegador** (o desde DevTools) elimina el catálogo
  guardado y el historial; al volver a abrir, la aplicación siembra de
  nuevo los ejemplos de `js/datos.js` (libros/clientes) y el historial
  arranca vacío.
- Algunos navegadores pueden restringir `localStorage` en orígenes
  `file://`; toda lectura y escritura está protegida con `try/catch`, de
  modo que la página siempre abre: si el almacenamiento no está
  disponible, la aplicación funciona en memoria durante la sesión y las
  operaciones afectadas informan el fallo con un mensaje visible junto a
  la interfaz.
- `sessionStorage` ya no se usa: las ventas se guardan en
  `localStorage["libreria-ventas"]` y persisten entre pestañas y sesiones.

## Resultados de los ocho casos manuales

Los ocho casos de la consigna (búsqueda; altas; venta inválida; venta
válida; precio histórico; recarga; teclado y anchos) se ejecutan de a mano
en el navegador abierto por `file://` en la fase de verificación. **Ningún
caso figura como aprobado sin haberse ejecutado:** la columna «Resultado
observado» se completa con lo que se vea al ejecutar cada uno (incluidos
eventuales fallos, sin maquillar). El caso 6 se realiza solo sobre una
copia de prueba del proyecto.

**Preparación (antes del caso 1):** al borrar `libreria-libros` y
`libreria-clientes` con `localStorage.removeItem(...)` y recargar (F5),
las claves **reaparecen sembradas** con `libreria-libros` = 6 y
`libreria-clientes` = 3 → siembra única comprobada. (También hay una
clave ajena `experimentar_ultima` en el mismo origen `file://`: no
pertenece al proyecto.)

| # | Caso | Resultado esperado (consigna) | Resultado observado |
| --- | --- | --- | --- |
| 1 | Búsqueda con parte del título en mayúsculas; luego búsqueda vacía y texto inexistente (`ejercicio3.html`) | Coincidencias sin distinguir mayúsculas; catálogo completo; mensaje sin resultados | **APROBADO.** `PRINCIPITO` (mayúsculas) → «Libros encontrados: 1» mostrando *El principito*. Buscador vacío → «Libros encontrados: 6» (catálogo completo). `zzz` → «No se encontraron libros con ese título.». Obs.: *Vuelo nocturno* muestra «Género: Sin género asignado» (coherente con `l6.generoId = null`). |
| 2 | Alta de libro con ISBN existente y luego ISBN nuevo (`libros.html`); recargar | Duplicado rechazado; el válido aparece en el catálogo y en la selección de venta; persiste tras recargar | **APROBADO.** ISBN duplicado `978-0000000011` → «Revisá: el ISBN ya existe registrado; debe seleccionar al menos un autor.» (la fila NO se creó; tabla siguió con 6 libros). Obs. honesta: el mensaje incluyó además «debe seleccionar al menos un autor» porque el autor se había destildado en el formulario; el rechazo del ISBN duplicado sí ocurrió. Luego ISBN nuevo `978-9999999999`, título «Libro de prueba Ej6», precio 1500, Editorial Planeta, Género Novela, autor Antoine de Saint-Exupéry → «Libro registrado: «Libro de prueba Ej6».» y la tabla pasó a 7 libros (el nuevo con precio `1500.00`). El libro apareció en el selector de libros de `ventas.html`. Tras recargar `libros.html` (F5) siguieron 7 libros, sin duplicar los 6 ejemplos. |
| 3 | Alta de cliente con email inválido, email existente en mayúsculas y email nuevo (`clientes.html`); recargar | Se rechazan los dos primeros; el nuevo aparece en el listado y en la selección; persiste tras recargar | **APROBADO.** Email `sin-arroba` → «Revisá: el email no tiene un formato válido.» (tabla 3 clientes). Email `LUCIA.PEREZ@CORREO.FICTICIO` (existente en mayúsculas) → «Revisá: el email ya existe registrado.» (tabla 3). Email nuevo `prueba.ej6@correo.ficticio`, nombre «Prueba Ej6» → «Cliente registrado: «Prueba Ej6».» (tabla 4 clientes). «Prueba Ej6» apareció en el selector de clientes de `ventas.html`. Tras F5 siguieron 4 clientes. |
| 4 | Venta sin cliente, con cantidades cero/negativas/decimales y con libro repetido (`ventas.html`) | No se confirma; el libro repetido no crea otro renglón (suma la cantidad) | **APROBADO.** Todos los estados inválidos dieron el mensaje esperado: sin cliente → «Revisá: seleccione un cliente.»; sin renglones → «Revisá: agregue al menos un renglón.»; cantidad 0 / negativa / decimal → «Revisá: la cantidad debe ser un entero mayor que cero.» (no se agregó fila); libro repetido → «Libro ya presente: cantidad actualizada a N.» con un solo renglón (la cantidad se sumó). |
| 5 | Venta válida: dos unidades a 1500 y una a 2000; abrir historial y su detalle | Subtotales `3000.00` y `2000.00`, total `5000.00`; detalle conservado en el historial | **APROBADO.** Se cargaron dos libros de prueba («Libro 1500» precio 1500 y «Libro 2000» precio 2000). Venta: «Libro 1500» ×2 + «Libro 2000» ×1, cliente Lucía Pérez. Resumen mostró **Total: 5000.00**. Confirmación: «Venta registrada: v1 — total 5000.00.» Historial mostró la venta (id `v1`, fecha `20/10/2026 20:16`, cliente Lucía Pérez, total `5000.00`); el detalle mostró «Libro 1500 — cantidad 2 — precio unitario 1500.00 — subtotal 3000.00.» y «Libro 2000 — cantidad 1 — precio unitario 2000.00 — subtotal 2000.00.» → subtotales 3000.00 y 2000.00 exactos. |
| 6 | Venta confirmada y cambio exclusivo del precio de catálogo guardado, en copia de prueba | El precio unitario, los subtotales y el total de esa venta conservan los valores confirmados | **APROBADO (en COPIA DE PRUEBA fuera del proyecto).** Se trabajó sobre una copia del proyecto en carpeta temporal (fuera de la entrega). Venta confirmada con «El principito» a precio de catálogo 8999.99 (precio unitario/subtotal/total 8999.99). Luego se modificó a mano SOLO el precio de ese libro en el catálogo guardado: `var cat = JSON.parse(localStorage.getItem('libreria-libros')); cat[0].precio = 1; localStorage.setItem('libreria-libros', JSON.stringify(cat));` (sin tocar `libreria-ventas`). Tras recargar `historial.html`, el detalle de esa venta **conservó** precio unitario 8999.99, subtotal 8999.99 y total 8999.99, mientras el catálogo decía 1 → el historial NO relee el precio del catálogo. (Nota: en el mismo origen `file://` también se observó que las ventas guardadas `v1` (total 5000.00) y `v2` (total 2000.00) mantuvieron sus `precioUnitario`/`subtotal` intactos.) Al final se limpió el storage: `libreria-libros`=6, `libreria-clientes`=3, `libreria-ventas`=null. |
| 7 | Recarga después de las altas y la venta (`libros`, `clientes`, `ventas`, `historial`) | Se recuperan los datos sin duplicar ejemplos ni ventas | **APROBADO.** Tras recargar libros/clientes/historial: `libreria-libros` = **9** (6 semilla + 3 altas: Libro de prueba Ej6, Libro 1500, Libro 2000), `libreria-clientes` = **4** (3 semilla + Prueba Ej6), `libreria-ventas` = **1** (v1). Los conteos se mantuvieron iguales entre recargas; ejemplos y ventas sin duplicar. |
| 8 | Navegación por teclado (Tab/Shift+Tab/Enter) y anchos de 320 px y 1280 px | Foco visible, controles utilizables y tabla con desplazamiento propio si lo necesita | **APROBADO.** Teclado: Tab recorrió los campos con foco visible (1: sí); Shift+Tab volvió hacia atrás (2: sí); en `ventas.html` Enter en «Confirmar venta» activó el botón (3: respondió con la validación «Revisá: agregue al menos un renglón.» por estar vacía la venta — confirma que Enter disparó el botón). Ancho 1280 px: sin desbordes raros. Ancho 320 px (modo dispositivo de DevTools): menú usable (sí), formularios usables (sí), tablas con desplazamiento propio horizontal (sí). |

## Procedencia de imágenes y recursos ajenos

Ninguno. El proyecto no carga CDNs, librerías, fuentes remotas ni imágenes
externas: todo (HTML, CSS, JavaScript y datos) es local y propio del
trabajo. *(Verificado.)*
