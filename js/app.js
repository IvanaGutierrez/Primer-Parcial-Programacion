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

    libros.forEach(function (libro) {
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
        if (libros.length === 0) {
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

    clientes.forEach(function (cliente) {
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
        if (clientes.length === 0) {
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
function validarLibro(datos) {
    const errores = [];

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
        const duplicado = libros.some(function (libro) {
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
function validarCliente(datos) {
    const errores = [];

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
        const duplicado = clientes.some(function (cliente) {
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

// AGREGA EL LIBRO YA VALIDADO AL ARRAY COMPARTIDO
function agregarLibro(datos) {
    const libro = {
        id: generarId("l", libros),
        titulo: String(datos.titulo).trim(),
        isbn: String(datos.isbn).trim(),
        editorialId: datos.editorialId,
        autorIds: datos.autorIds.slice(),
        generoId: datos.generoId,
        precio: Number(datos.precio)
    };

    libros.push(libro);
    return libro;
}

// AGREGA EL CLIENTE YA VALIDADO AL ARRAY COMPARTIDO
function agregarCliente(datos) {
    const cliente = {
        id: generarId("c", clientes),
        nombre: String(datos.nombre).trim(),
        email: String(datos.email).trim()
    };

    clientes.push(cliente);
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

    const resultado = validarLibro(datos);

    if (!resultado.valido) {
        mostrarMensajeError("Revisá: " + resultado.errores.join("; ") + ".");
        return;
    }

    const libro = agregarLibro(datos);
    refrescarListados();
    mostrarMensajeOk("Libro registrado: «" + libro.titulo + "».");
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

    const resultado = validarCliente(datos);

    if (!resultado.valido) {
        mostrarMensajeError("Revisá: " + resultado.errores.join("; ") + ".");
        return;
    }

    const cliente = agregarCliente(datos);
    refrescarListados();
    mostrarMensajeOk("Cliente registrado: «" + cliente.nombre + "».");
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

// ---------- Arranque ----------

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("form-libro") && typeof libros !== "undefined") {
        inicializarLibros();
    }
    if (document.getElementById("form-cliente") && typeof clientes !== "undefined") {
        inicializarClientes();
    }
});
