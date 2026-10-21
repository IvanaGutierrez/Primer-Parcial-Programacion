// Ejercicio 4 — Altas de libros y clientes con validación y refresco sin recarga.
// Este archivo lo comparten las cinco páginas de los Ejercicios 1-2: la
// inicialización se condiciona a la presencia de cada formulario y de los
// arrays de js/datos.js (guardas typeof), de modo que las páginas que no
// cargan datos.js no lanzan errores.
"use strict";

// ---------- Inicialización por página ----------

// ORQUESTA LA PÁGINA DE LIBROS: SELECTORES, LISTADO, MENSAJES Y EVENTOS
function inicializarLibros() {
    const formulario = document.getElementById("form-libro");

    // DD-08: la validación la hace JavaScript para que el submit siempre
    // llegue acá y los errores se comuniquen como texto en #msg-error.
    // Los atributos required/type/min del HTML quedan como documentación.
    formulario.noValidate = true;

    poblarSelectorEditorial();
    poblarSelectorGenero();
    poblarSelectorAutores();
    renderizarListadoLibros();
    limpiarMensajes();

    formulario.addEventListener("submit", manejarEnvioLibro);
}

// ORQUESTA LA PÁGINA DE CLIENTES: LISTADO, MENSAJES Y EVENTOS
function inicializarClientes() {
    const formulario = document.getElementById("form-cliente");

    formulario.noValidate = true;

    renderizarListadoClientes();
    limpiarMensajes();

    formulario.addEventListener("submit", manejarEnvioCliente);
}

// ---------- Selectores de alta desde datos locales ----------

// POBLA #libro-editorial CON EL ARRAY DE EDITORIALES (value = id)
function poblarSelectorEditorial() {
    actualizarSelector(document.getElementById("libro-editorial"), editoriales, function (editorial) {
        return editorial.nombre;
    });
}

// POBLA #libro-genero CON LOS GÉNEROS MÁS «SIN CLASIFICAR» (value = "")
function poblarSelectorGenero() {
    const selector = document.getElementById("libro-genero");

    actualizarSelector(selector, generos, function (genero) {
        return genero.nombre;
    });

    if (selector) {
        const opcionSinClasificar = document.createElement("option");
        opcionSinClasificar.value = "";
        opcionSinClasificar.textContent = "Sin clasificar";
        selector.appendChild(opcionSinClasificar);
    }
}

// POBLA #libro-autores (select multiple) CON EL ARRAY DE AUTORES
function poblarSelectorAutores() {
    actualizarSelector(document.getElementById("libro-autores"), autores, function (autor) {
        return autor.nombre;
    });
}

// ---------- Render seguro de listados (textContent / createElement) ----------

// GENERA LAS FILAS DE #libros-listado DESDE EL ARRAY DE LIBROS
function renderizarListadoLibros() {
    const tabla = document.getElementById("libros-listado");
    if (!tabla) {
        return;
    }

    const cuerpo = tabla.querySelector("tbody");
    const vacio = document.getElementById("libros-vacio");
    cuerpo.replaceChildren();

    const listaLibros = leerLibros();

    listaLibros.forEach(function (libro) {
        const editorial = buscarPorId(editoriales, libro.editorialId);
        const genero = libro.generoId ? buscarPorId(generos, libro.generoId) : null;
        const nombresAutores = libro.autorIds.map(function (autorId) {
            const autor = buscarPorId(autores, autorId);
            return autor ? autor.nombre : autorId;
        });

        const fila = document.createElement("tr");
        const textosCeldas = [
            libro.titulo,
            libro.isbn,
            editorial ? editorial.nombre : libro.editorialId,
            genero ? genero.nombre : "Sin clasificar",
            nombresAutores.join(", "),
            libro.precio.toFixed(2)
        ];

        textosCeldas.forEach(function (texto) {
            const celda = document.createElement("td");
            celda.textContent = texto;
            fila.appendChild(celda);
        });

        cuerpo.appendChild(fila);
    });

    if (vacio) {
        if (listaLibros.length === 0) {
            vacio.textContent = "No hay registros de libros.";
            vacio.hidden = false;
        } else {
            vacio.hidden = true;
        }
    }
}

// GENERA LAS FILAS DE #clientes-listado DESDE EL ARRAY DE CLIENTES
function renderizarListadoClientes() {
    const tabla = document.getElementById("clientes-listado");
    if (!tabla) {
        return;
    }

    const cuerpo = tabla.querySelector("tbody");
    const vacio = document.getElementById("clientes-vacio");
    cuerpo.replaceChildren();

    const listaClientes = leerClientes();

    listaClientes.forEach(function (cliente) {
        const fila = document.createElement("tr");

        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = cliente.nombre;
        fila.appendChild(celdaNombre);

        const celdaEmail = document.createElement("td");
        celdaEmail.textContent = cliente.email;
        fila.appendChild(celdaEmail);

        cuerpo.appendChild(fila);
    });

    if (vacio) {
        if (listaClientes.length === 0) {
            vacio.textContent = "No hay registros de clientes.";
            vacio.hidden = false;
        } else {
            vacio.hidden = true;
        }
    }
}

// ---------- Validación y normalización (funciones puras, acumulan errores) ----------

// Quita espacios y guiones (ASCII y tipográfico) y pasa a minúsculas.
// No valida dígito de control.
function normalizarIsbn(texto) {
    return String(texto).replace(/[\s\u2013-]/g, "").toLowerCase();
}

// APLICA trim() Y MINÚSCULAS PARA COMPARAR (la clave de comparación del email)
function normalizarEmail(texto) {
    return String(texto).trim().toLowerCase();
}

// VALIDA LOS DATOS DEL LIBRO Y DEVUELVE { valido, errores } CON TODOS LOS
// ERRORES ENCONTRADOS (R4-04/R4-05)
function validarLibro(datos, listaLibros) {
    const errores = [];

    if (!Array.isArray(listaLibros)) {
        listaLibros = leerLibros();
    }

    // «Sin clasificar» (value = "") equivale a ausencia de género.
    if (!datos.generoId) {
        datos.generoId = null;
    }

    if (!String(datos.titulo).trim()) {
        errores.push("el título no puede quedar vacío");
    }

    if (!String(datos.isbn).trim()) {
        errores.push("el ISBN no puede quedar vacío");
    } else {
        const isbnNormalizado = normalizarIsbn(datos.isbn);
        const duplicado = listaLibros.some(function (libro) {
            return normalizarIsbn(libro.isbn) === isbnNormalizado;
        });
        if (duplicado) {
            errores.push("el ISBN ya existe registrado");
        }
    }

    if (datos.precio === "" || datos.precio === null || datos.precio === undefined) {
        errores.push("el precio no puede quedar vacío");
    } else if (!Number.isFinite(Number(datos.precio)) || Number(datos.precio) <= 0) {
        errores.push("el precio debe ser un número mayor que cero");
    }

    if (!buscarPorId(editoriales, datos.editorialId)) {
        errores.push("la editorial seleccionada no existe");
    }

    if (!datos.autorIds || datos.autorIds.length === 0) {
        errores.push("debe seleccionar al menos un autor");
    } else {
        const hayAutorInexistente = datos.autorIds.some(function (autorId) {
            return !buscarPorId(autores, autorId);
        });
        if (hayAutorInexistente) {
            errores.push("alguno de los autores seleccionados no existe");
        }
    }

    if (datos.generoId && !buscarPorId(generos, datos.generoId)) {
        errores.push("el género seleccionado no existe");
    }

    return { valido: errores.length === 0, errores: errores };
}

// VALIDA LOS DATOS DEL CLIENTE Y DEVUELVE { valido, errores } (R4-06/R4-07)
function validarCliente(datos, listaClientes) {
    const errores = [];

    if (!Array.isArray(listaClientes)) {
        listaClientes = leerClientes();
    }

    if (!String(datos.nombre).trim()) {
        errores.push("el nombre completo no puede quedar vacío");
    }

    const email = String(datos.email).trim();
    if (!email) {
        errores.push("el email no puede quedar vacío");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errores.push("el email no tiene un formato válido");
    } else {
        const emailNormalizado = normalizarEmail(email);
        const duplicado = listaClientes.some(function (cliente) {
            return normalizarEmail(cliente.email) === emailNormalizado;
        });
        if (duplicado) {
            errores.push("el email ya existe registrado");
        }
    }

    return { valido: errores.length === 0, errores: errores };
}

// ---------- Altas ----------

// GENERA EL SIGUIENTE ID ÚNICO CON EL PREFIJO DADO (l7, c4, ...),
// REVISANDO COLISIONES CON LOS IDS EXISTENTES
function generarId(prefijo, lista) {
    const idsExistentes = lista.map(function (item) {
        return item.id;
    });

    let numero = lista.length + 1;
    let id = prefijo + numero;

    while (idsExistentes.indexOf(id) !== -1) {
        numero += 1;
        id = prefijo + numero;
    }

    return id;
}

// AGREGA EL LIBRO YA VALIDADO A LA COPIA INDICADA (nunca a los arrays const)
function agregarLibro(datos, lista) {
    const libro = {
        id: generarId("l", lista),
        titulo: String(datos.titulo).trim(),
        isbn: String(datos.isbn).trim(),
        editorialId: datos.editorialId,
        autorIds: datos.autorIds.slice(),
        generoId: datos.generoId,
        precio: Number(datos.precio)
    };

    lista.push(libro);
    return libro;
}

// AGREGA EL CLIENTE YA VALIDADO A LA COPIA INDICADA (nunca a los arrays const)
function agregarCliente(datos, lista) {
    const cliente = {
        id: generarId("c", lista),
        nombre: String(datos.nombre).trim(),
        email: String(datos.email).trim()
    };

    lista.push(cliente);
    return cliente;
}

// ---------- Manejadores de envío (submit + preventDefault) ----------

// PROCESA EL ALTA DE LIBRO DESDE #form-libro SIN RECARGAR LA PÁGINA
function manejarEnvioLibro(evento) {
    evento.preventDefault();

    const formulario = evento.target;
    const selectorAutores = document.getElementById("libro-autores");
    const autorIds = Array.prototype.map.call(selectorAutores.selectedOptions, function (opcion) {
        return opcion.value;
    });

    const datos = {
        titulo: document.getElementById("libro-titulo").value,
        isbn: document.getElementById("libro-isbn").value,
        precio: document.getElementById("libro-precio").value,
        editorialId: document.getElementById("libro-editorial").value,
        generoId: document.getElementById("libro-genero").value,
        autorIds: autorIds
    };

    const listaLibros = leerLibros();
    const resultado = validarLibro(datos, listaLibros);

    if (!resultado.valido) {
        mostrarMensajeError("Revisá: " + resultado.errores.join("; ") + ".");
        return;
    }

    const libro = agregarLibro(datos, listaLibros);
    const guardado = escribirLibros(listaLibros);
    refrescarListados();
    if (guardado) {
        mostrarMensajeOk("Libro registrado: «" + libro.titulo + "».");
    } else {
        mostrarMensajeError("Libro «" + libro.titulo + "» visible solo en esta sesión: no se pudo guardar en el almacenamiento del navegador; no sobrevivirá a la recarga.");
    }
    formulario.reset();
    document.getElementById("libro-titulo").focus();
}

// PROCESA EL ALTA DE CLIENTE DESDE #form-cliente SIN RECARGAR LA PÁGINA
function manejarEnvioCliente(evento) {
    evento.preventDefault();

    const formulario = evento.target;

    const datos = {
        nombre: document.getElementById("cliente-nombre").value,
        email: document.getElementById("cliente-email").value
    };

    const listaClientes = leerClientes();
    const resultado = validarCliente(datos, listaClientes);

    if (!resultado.valido) {
        mostrarMensajeError("Revisá: " + resultado.errores.join("; ") + ".");
        return;
    }

    const cliente = agregarCliente(datos, listaClientes);
    const guardado = escribirClientes(listaClientes);
    refrescarListados();
    if (guardado) {
        mostrarMensajeOk("Cliente registrado: «" + cliente.nombre + "».");
    } else {
        mostrarMensajeError("Cliente «" + cliente.nombre + "» visible solo en esta sesión: no se pudo guardar en el almacenamiento del navegador; no sobrevivirá a la recarga.");
    }
    formulario.reset();
    document.getElementById("cliente-nombre").focus();
}

// ---------- Mensajes de estado junto al formulario ----------

// MUESTRA EL MENSAJE DE ÉXITO EN #msg-ok Y VACÍA/OCULTA EL DE ERROR
function mostrarMensajeOk(texto) {
    const mensajeOk = document.getElementById("msg-ok");
    const mensajeError = document.getElementById("msg-error");

    if (mensajeError) {
        mensajeError.textContent = "";
        mensajeError.hidden = true;
    }
    if (mensajeOk) {
        mensajeOk.textContent = texto;
        mensajeOk.hidden = false;
    }
}

// MUESTRA EL MENSAJE DE ERROR EN #msg-error Y VACÍA/OCULTA EL DE ÉXITO
function mostrarMensajeError(texto) {
    const mensajeOk = document.getElementById("msg-ok");
    const mensajeError = document.getElementById("msg-error");

    if (mensajeOk) {
        mensajeOk.textContent = "";
        mensajeOk.hidden = true;
    }
    if (mensajeError) {
        mensajeError.textContent = texto;
        mensajeError.hidden = false;
    }
}

// VACÍA Y OCULTA AMBOS MENSAJES (TAMBIÉN AL ABRIR LA PÁGINA, PARA NO DEJAR
// LOS TEXTOS DE EJEMPLO COMO ESTADO REAL)
function limpiarMensajes() {
    const mensajeOk = document.getElementById("msg-ok");
    const mensajeError = document.getElementById("msg-error");

    if (mensajeOk) {
        mensajeOk.textContent = "";
        mensajeOk.hidden = true;
    }
    if (mensajeError) {
        mensajeError.textContent = "";
        mensajeError.hidden = true;
    }
}

// ---------- Refresco genérico sin recarga ----------

// REFRESCA EL LISTADO PRESENTE EN LA PÁGINA Y LAS OPCIONES RELACIONADAS
function refrescarListados() {
    if (document.getElementById("libros-listado")) {
        renderizarListadoLibros();
    }
    if (document.getElementById("clientes-listado")) {
        renderizarListadoClientes();
    }
    refrescarOpcionesRelacionadas();
}

// HOOK GENÉRICO: hoy ninguna página del Ejercicio 4 tiene selectores que
// consuman libros/clientes. El Ejercicio 5 podrá reutilizar aquí
// actualizarSelector(...) para refrescar sus propios selectores desde los
// arrays, sin que este archivo contenga lógica de etapas futuras.
function refrescarOpcionesRelacionadas() {
}

// RECONSTRUYE LAS OPCIONES DE UN <select> A PARTIR DE UN ARRAY.
// elemento: nodo select; items: array de objetos con id;
// etiqueta: función (item) => texto visible de la opción.
function actualizarSelector(elemento, items, etiqueta) {
    if (!elemento) {
        return;
    }

    const opciones = items.map(function (item) {
        const opcion = document.createElement("option");
        opcion.value = item.id;
        opcion.textContent = etiqueta(item);
        return opcion;
    });

    elemento.replaceChildren(...opciones);
}

// ---------- Persistencia local (Ejercicio 6) ----------
// Únicas claves que la aplicación crea en localStorage. Toda lectura es
// defensiva (try/catch + Array.isArray): clave ausente/vacía, JSON inválido
// o almacenamiento no disponible devuelven la semilla en memoria sin escribir.

var CLAVE_LIBROS = "libreria-libros";
var CLAVE_CLIENTES = "libreria-clientes";
var CLAVE_VENTAS = "libreria-ventas";

// Copias de sesión: altas cuya escritura falló. Se sirven hasta recargar
// para que la operación quede visible en la sesión en curso; no sobreviven
// a la recarga.
var librosEnSesion = null;
var clientesEnSesion = null;

// LEE UNA CLAVE COMO ARRAY JSON. Devuelve null si está ausente o vacía, si
// el valor no es un array o si el almacenamiento no está disponible.
function leerClaveArray(clave) {
    try {
        var crudo = localStorage.getItem(clave);
        if (!crudo) {
            return null;
        }
        var lista = JSON.parse(crudo);
        return Array.isArray(lista) ? lista : null;
    } catch (error) {
        return null;
    }
}

// COPIA PROFUNDA DE LA SEMILLA: los arrays const de js/datos.js no se
// exponen ni se modifican jamás desde esta capa.
function copiaSemilla(lista) {
    return JSON.parse(JSON.stringify(lista));
}

// CONJUNTO VIGENTE DE LIBROS: lo guardado; sin lectura válida, la semilla.
function leerLibros() {
    if (librosEnSesion) {
        return librosEnSesion;
    }
    var guardado = leerClaveArray(CLAVE_LIBROS);
    if (guardado !== null) {
        return guardado;
    }
    return copiaSemilla(typeof libros !== "undefined" ? libros : []);
}

// CONJUNTO VIGENTE DE CLIENTES (mismo criterio que leerLibros).
function leerClientes() {
    if (clientesEnSesion) {
        return clientesEnSesion;
    }
    var guardado = leerClaveArray(CLAVE_CLIENTES);
    if (guardado !== null) {
        return guardado;
    }
    return copiaSemilla(typeof clientes !== "undefined" ? clientes : []);
}

// ESCRIBE EL ARRAY COMPLETO EN SU CLAVE. Devuelve true si se guardó; si
// setItem lanza, la copia queda visible en la sesión y devuelve false.
function escribirLibros(lista) {
    try {
        localStorage.setItem(CLAVE_LIBROS, JSON.stringify(lista));
        librosEnSesion = null;
        return true;
    } catch (error) {
        librosEnSesion = lista;
        return false;
    }
}

function escribirClientes(lista) {
    try {
        localStorage.setItem(CLAVE_CLIENTES, JSON.stringify(lista));
        clientesEnSesion = null;
        return true;
    } catch (error) {
        clientesEnSesion = lista;
        return false;
    }
}

// SIEMBRA ÚNICA: copia la semilla SOLO cuando la clave está ausente o vacía;
// nunca concatena sobre datos existentes, así que l1..l6 / c1..c3 no pueden
// duplicarse al reabrir. Un valor ya presente —aunque su JSON sea inválido—
// no se pisa al arrancar: se reemplaza recién en la próxima escritura
// exitosa. Sin js/datos.js (index.html) no siembra ni lee nada.
function inicializarPersistencia() {
    if (typeof libros === "undefined" || typeof clientes === "undefined") {
        return;
    }
    sembrarClave(CLAVE_LIBROS, libros);
    sembrarClave(CLAVE_CLIENTES, clientes);
}

function sembrarClave(clave, semilla) {
    try {
        if (localStorage.getItem(clave)) {
            return;
        }
        localStorage.setItem(clave, JSON.stringify(semilla));
    } catch (error) {
        // Almacenamiento no disponible: la página opera en memoria.
    }
}

// ---------- Arranque ----------

// ---------- Ventas (Ejercicio 5) ----------

var renglonesVentaActual = [];

function redondear2(numero) {
    return Math.round(Number(numero) * 100) / 100;
}

function formatearImporte(numero) {
    return redondear2(numero).toFixed(2);
}

function crearFechaLegible() {
    var fecha = new Date();
    var dia = String(fecha.getDate()).padStart(2, "0");
    var mes = String(fecha.getMonth() + 1).padStart(2, "0");
    var anio = fecha.getFullYear();
    var horas = String(fecha.getHours()).padStart(2, "0");
    var minutos = String(fecha.getMinutes()).padStart(2, "0");
    return dia + "/" + mes + "/" + anio + " " + horas + ":" + minutos;
}

function obtenerVentas() {
    var lista = leerClaveArray(CLAVE_VENTAS);
    return Array.isArray(lista) ? lista : [];
}

function guardarVentas(lista) {
    try {
        localStorage.setItem(CLAVE_VENTAS, JSON.stringify(lista));
        return true;
    } catch (error) {
        mostrarMensajeError("No se pudo guardar la venta en el almacenamiento del navegador.");
        return false;
    }
}

function poblarSelectorVentaCliente() {
    if (typeof actualizarSelector === "function") {
        actualizarSelector(document.getElementById("venta-cliente"), leerClientes(), function (cliente) {
            return cliente.nombre;
        });
    }
}

function poblarSelectorVentaLibro() {
    if (typeof actualizarSelector === "function") {
        actualizarSelector(document.getElementById("venta-libro"), leerLibros(), function (libro) {
            return libro.titulo;
        });
    }
}

function recalcularResumen() {
    var resumen = document.getElementById("venta-resumen");
    if (!resumen) {
        return;
    }
    var total = 0;
    for (var i = 0; i < renglonesVentaActual.length; i++) {
        total += redondear2(renglonesVentaActual[i].subtotal);
    }
    total = redondear2(total);
    resumen.textContent = "Total: " + formatearImporte(total) + ".";
}

function renderizarRenglones() {
    var tabla = document.getElementById("venta-renglones");
    if (!tabla) {
        return;
    }
    var cuerpo = tabla.querySelector("tbody");
    var vacio = document.getElementById("venta-renglones-vacio");
    if (!cuerpo) {
        return;
    }
    cuerpo.replaceChildren();

    for (var i = 0; i < renglonesVentaActual.length; i++) {
        var renglon = renglonesVentaActual[i];
        var fila = document.createElement("tr");

        var celdaTitulo = document.createElement("td");
        celdaTitulo.textContent = renglon.titulo;
        fila.appendChild(celdaTitulo);

        var celdaCantidad = document.createElement("td");
        var inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.min = "1";
        inputCantidad.value = renglon.cantidad;
        inputCantidad.setAttribute("data-libroid", renglon.libroId);
        inputCantidad.addEventListener("change", function (evento) {
            var libroId = evento.target.getAttribute("data-libroid");
            actualizarCantidadRenglon(libroId, evento.target.value);
        });
        celdaCantidad.appendChild(inputCantidad);
        fila.appendChild(celdaCantidad);

        var celdaPrecio = document.createElement("td");
        celdaPrecio.textContent = formatearImporte(renglon.precioUnitario);
        fila.appendChild(celdaPrecio);

        var celdaSubtotal = document.createElement("td");
        celdaSubtotal.textContent = formatearImporte(renglon.subtotal);
        fila.appendChild(celdaSubtotal);

        var celdaAccion = document.createElement("td");
        var btnQuitar = document.createElement("button");
        btnQuitar.type = "button";
        btnQuitar.textContent = "Quitar";
        btnQuitar.setAttribute("data-libroid", renglon.libroId);
        btnQuitar.addEventListener("click", function (evento) {
            var libroId = evento.target.getAttribute("data-libroid");
            quitarRenglon(libroId);
        });
        celdaAccion.appendChild(btnQuitar);
        fila.appendChild(celdaAccion);

        cuerpo.appendChild(fila);
    }

    if (vacio) {
        if (renglonesVentaActual.length === 0) {
            vacio.hidden = false;
        } else {
            vacio.hidden = true;
        }
    }

    recalcularResumen();
}

function agregarRenglon(evento) {
    if (evento) {
        evento.preventDefault();
    }
    var selectorLibro = document.getElementById("venta-libro");
    var inputCantidad = document.getElementById("venta-cantidad");
    if (!selectorLibro || !inputCantidad) {
        return;
    }
    var libroId = selectorLibro.value;
    var cantidadTexto = inputCantidad.value;

    if (!libroId) {
        mostrarMensajeError("Revisá: seleccione un libro.");
        return;
    }
    if (cantidadTexto === "" || cantidadTexto === null || cantidadTexto === undefined) {
        mostrarMensajeError("Revisá: la cantidad debe ser un entero mayor que cero.");
        return;
    }
    var cantidad = Number(cantidadTexto);
    if (!Number.isFinite(cantidad) || !Number.isInteger(cantidad) || cantidad <= 0) {
        mostrarMensajeError("Revisá: la cantidad debe ser un entero mayor que cero.");
        return;
    }

    var libro = null;
    if (typeof buscarPorId === "function") {
        libro = buscarPorId(leerLibros(), libroId);
    }
    if (!libro) {
        mostrarMensajeError("Revisá: el libro seleccionado no existe.");
        return;
    }

    for (var i = 0; i < renglonesVentaActual.length; i++) {
        if (renglonesVentaActual[i].libroId === libroId) {
            renglonesVentaActual[i].cantidad = renglonesVentaActual[i].cantidad + cantidad;
            renglonesVentaActual[i].subtotal = redondear2(renglonesVentaActual[i].cantidad * renglonesVentaActual[i].precioUnitario);
            limpiarMensajes();
            mostrarMensajeOk("Libro ya presente: cantidad actualizada a " + renglonesVentaActual[i].cantidad + ".");
            renderizarRenglones();
            return;
        }
    }

    var precioUnitario = Number(libro.precio);
    var subtotal = redondear2(cantidad * precioUnitario);
    renglonesVentaActual.push({
        libroId: libro.id,
        titulo: libro.titulo,
        cantidad: cantidad,
        precioUnitario: precioUnitario,
        subtotal: subtotal
    });
    limpiarMensajes();
    renderizarRenglones();
}

function actualizarCantidadRenglon(libroId, textoCantidad) {
    if (textoCantidad === "" || textoCantidad === null || textoCantidad === undefined) {
        mostrarMensajeError("Revisá: la cantidad debe ser un entero mayor que cero.");
        renderizarRenglones();
        return;
    }
    var cantidad = Number(textoCantidad);
    if (!Number.isFinite(cantidad) || !Number.isInteger(cantidad) || cantidad <= 0) {
        mostrarMensajeError("Revisá: la cantidad debe ser un entero mayor que cero.");
        renderizarRenglones();
        return;
    }
    for (var i = 0; i < renglonesVentaActual.length; i++) {
        if (renglonesVentaActual[i].libroId === libroId) {
            renglonesVentaActual[i].cantidad = cantidad;
            renglonesVentaActual[i].subtotal = redondear2(cantidad * renglonesVentaActual[i].precioUnitario);
            break;
        }
    }
    limpiarMensajes();
    renderizarRenglones();
}

function quitarRenglon(libroId) {
    var nuevoArray = [];
    for (var i = 0; i < renglonesVentaActual.length; i++) {
        if (renglonesVentaActual[i].libroId !== libroId) {
            nuevoArray.push(renglonesVentaActual[i]);
        }
    }
    renglonesVentaActual = nuevoArray;
    limpiarMensajes();
    renderizarRenglones();
}

function validarVentaActual() {
    var errores = [];
    var selectorCliente = document.getElementById("venta-cliente");
    if (!selectorCliente || !selectorCliente.value) {
        errores.push("seleccione un cliente");
    } else if (typeof buscarPorId === "function") {
        var cliente = buscarPorId(leerClientes(), selectorCliente.value);
        if (!cliente) {
            errores.push("seleccione un cliente");
        }
    }
    if (renglonesVentaActual.length === 0) {
        errores.push("agregue al menos un renglón");
    }
    for (var i = 0; i < renglonesVentaActual.length; i++) {
        var r = renglonesVentaActual[i];
        if (!Number.isFinite(r.cantidad) || !Number.isInteger(r.cantidad) || r.cantidad <= 0) {
            errores.push("cantidades inválidas en algún renglón");
            break;
        }
    }
    return { valido: errores.length === 0, errores: errores };
}

function resetearFormularioVenta() {
    var formulario = document.getElementById("form-venta");
    if (formulario) {
        formulario.reset();
        var inputCantidad = document.getElementById("venta-cantidad");
        if (inputCantidad) {
            inputCantidad.value = "1";
        }
    }
    renglonesVentaActual = [];
    renderizarRenglones();
    recalcularResumen();
}

function confirmarVenta() {
    var validacion = validarVentaActual();
    if (!validacion.valido) {
        mostrarMensajeError("Revisá: " + validacion.errores.join("; ") + ".");
        return;
    }
    var selectorCliente = document.getElementById("venta-cliente");
    var cliente = null;
    if (typeof buscarPorId === "function") {
        cliente = buscarPorId(leerClientes(), selectorCliente.value);
    }
    var listaVentas = obtenerVentas();
    var venta = {
        id: typeof generarId === "function" ? generarId("v", listaVentas) : ("v" + (listaVentas.length + 1)),
        fecha: crearFechaLegible(),
        clienteId: cliente ? cliente.id : selectorCliente.value,
        clienteNombre: cliente ? cliente.nombre : "",
        renglones: [],
        total: 0
    };
    var totalVenta = 0;
    for (var i = 0; i < renglonesVentaActual.length; i++) {
        var r = renglonesVentaActual[i];
        var subtotal = redondear2(r.cantidad * r.precioUnitario);
        venta.renglones.push({
            libroId: r.libroId,
            titulo: r.titulo,
            cantidad: r.cantidad,
            precioUnitario: r.precioUnitario,
            subtotal: subtotal
        });
        totalVenta += subtotal;
    }
    venta.total = redondear2(totalVenta);
    listaVentas.push(venta);
    var guardo = guardarVentas(listaVentas);
    limpiarMensajes();
    if (guardo) {
        mostrarMensajeOk("Venta registrada: " + venta.id + " — total " + formatearImporte(venta.total) + ".");
    } else {
        mostrarMensajeError("La venta " + venta.id + " quedó solo en esta sesión: no se pudo guardar en el almacenamiento del navegador; no sobrevivirá a la recarga.");
    }
    resetearFormularioVenta();
}

function inicializarVentas() {
    if (!document.getElementById("form-venta")) {
        return;
    }
    if (typeof libros === "undefined" || typeof clientes === "undefined") {
        return;
    }
    renglonesVentaActual = [];
    poblarSelectorVentaCliente();
    poblarSelectorVentaLibro();
    limpiarMensajes();
    var formulario = document.getElementById("form-venta");
    if (formulario) {
        formulario.noValidate = true;
        formulario.addEventListener("submit", agregarRenglon);
    }
    var btnConfirmar = document.getElementById("venta-confirmar");
    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", confirmarVenta);
    }
    var vacio = document.getElementById("venta-renglones-vacio");
    if (vacio) {
        vacio.hidden = false;
    }
    renderizarRenglones();
    recalcularResumen();
}

function renderizarHistorial(ventas) {
    var tabla = document.getElementById("historial-listado");
    if (!tabla) {
        return;
    }
    var cuerpo = tabla.querySelector("tbody");
    var vacio = document.getElementById("historial-vacio");
    if (!cuerpo) {
        return;
    }
    cuerpo.replaceChildren();
    if (!Array.isArray(ventas) || ventas.length === 0) {
        if (vacio) {
            vacio.hidden = false;
        }
        return;
    }
    if (vacio) {
        vacio.hidden = true;
    }
    for (var i = 0; i < ventas.length; i++) {
        var venta = ventas[i];
        var fila = document.createElement("tr");
        var celdaId = document.createElement("td");
        celdaId.textContent = venta.id;
        fila.appendChild(celdaId);
        var celdaFecha = document.createElement("td");
        celdaFecha.textContent = venta.fecha || "";
        fila.appendChild(celdaFecha);
        var celdaCliente = document.createElement("td");
        celdaCliente.textContent = venta.clienteNombre || "";
        fila.appendChild(celdaCliente);
        var celdaTotal = document.createElement("td");
        celdaTotal.textContent = formatearImporte(venta.total || 0);
        fila.appendChild(celdaTotal);
        var celdaDetalle = document.createElement("td");
        var linkDetalle = document.createElement("a");
        linkDetalle.href = "#historial-detalle";
        linkDetalle.textContent = "Ver detalle de la venta " + venta.id;
        linkDetalle.setAttribute("data-venta-id", venta.id);
        linkDetalle.addEventListener("click", function (evento) {
            evento.preventDefault();
            var ventaId = evento.target.getAttribute("data-venta-id");
            verDetalleVenta(ventaId);
        });
        celdaDetalle.appendChild(linkDetalle);
        fila.appendChild(celdaDetalle);
        cuerpo.appendChild(fila);
    }
}

function verDetalleVenta(id) {
    var detalle = document.getElementById("historial-detalle");
    if (!detalle) {
        return;
    }
    var ventas = obtenerVentas();
    var ventaEncontrada = null;
    for (var i = 0; i < ventas.length; i++) {
        if (ventas[i].id === id) {
            ventaEncontrada = ventas[i];
            break;
        }
    }
    if (!ventaEncontrada) {
        detalle.textContent = "";
        return;
    }
    detalle.replaceChildren();
    var cabecera = document.createElement("p");
    cabecera.textContent = "Venta " + ventaEncontrada.id + " — " + (ventaEncontrada.clienteNombre || "") + ", fecha " + (ventaEncontrada.fecha || "") + ", total " + formatearImporte(ventaEncontrada.total || 0) + ".";
    detalle.appendChild(cabecera);
    var lista = document.createElement("ul");
    var renglones = Array.isArray(ventaEncontrada.renglones) ? ventaEncontrada.renglones : [];
    for (var j = 0; j < renglones.length; j++) {
        var r = renglones[j];
        var item = document.createElement("li");
        item.textContent = (r.titulo || r.libroId) + " — cantidad " + r.cantidad + " — precio unitario " + formatearImporte(r.precioUnitario || 0) + " — subtotal " + formatearImporte(r.subtotal || 0) + ".";
        lista.appendChild(item);
    }
    detalle.appendChild(lista);
}

function inicializarHistorial() {
    if (!document.getElementById("historial-listado")) {
        return;
    }
    limpiarMensajes();
    var ventas = obtenerVentas();
    renderizarHistorial(ventas);
}

document.addEventListener("DOMContentLoaded", function () {
    if (typeof inicializarPersistencia === "function") {
        inicializarPersistencia();
    }
    if (document.getElementById("form-libro") && typeof libros !== "undefined") {
        inicializarLibros();
    }
    if (document.getElementById("form-cliente") && typeof clientes !== "undefined") {
        inicializarClientes();
    }
    if (document.getElementById("form-venta") && typeof libros !== "undefined" && typeof clientes !== "undefined") {
        inicializarVentas();
    }
    if (document.getElementById("historial-listado")) {
        inicializarHistorial();
    }
});
