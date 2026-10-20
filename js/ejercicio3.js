
"use strict";

// Los arrays de datos (editoriales, generos, autores, clientes, libros) y la
// función buscarPorId viven ahora en js/datos.js (fuente única compartida).

// ELEMENTOS DE LA PAGINA
const buscador = document.getElementById("buscador-titulo");
const listado = document.getElementById("catalogo-listado");
const mensaje = document.getElementById("catalogo-mensaje");

// GENERA EL CATALOGO DE LIBROS
function mostrarLibros(listaLibros) {
    listado.replaceChildren();

    if (listaLibros.length === 0) {
        mensaje.textContent = "No se encontraron libros con ese título.";
        return;
    }

    mensaje.textContent = "Libros encontrados: " + listaLibros.length;

    listaLibros.forEach(function (libro) {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("libro");

        const titulo = document.createElement("h3");
        titulo.textContent = libro.titulo;
        tarjeta.appendChild(titulo);

        const editorial = buscarPorId(editoriales, libro.editorialId);
        const textoEditorial = document.createElement("p");
        textoEditorial.textContent = "Editorial: " + editorial.nombre;
        tarjeta.appendChild(textoEditorial);

        const nombresAutores = libro.autorIds.map(function (autorId) {
            return buscarPorId(autores, autorId).nombre;
        });

        const textoAutores = document.createElement("p");
        textoAutores.textContent = "Autor(es): " + nombresAutores.join(", ");
        tarjeta.appendChild(textoAutores);

        const genero = libro.generoId
            ? buscarPorId(generos, libro.generoId)
            : null;

        const textoGenero = document.createElement("p");
        textoGenero.textContent = "Género: " + (genero ? genero.nombre : "Sin género asignado");
        tarjeta.appendChild(textoGenero);

        listado.appendChild(tarjeta);
    });
}

// FILTRA POR TITULO, IGNORANDO MAYUSCULAS Y ESPACIOS EXTERIORES
function filtrarLibros() {
    const busqueda = buscador.value.trim().toLowerCase();

    const resultadoBusqueda = libros.filter(function (libro) {
        return libro.titulo.toLowerCase().includes(busqueda);
    });

    mostrarLibros(resultadoBusqueda);
}

// ESCUCHA LOS CAMBIOS EN EL BUSCADOR
buscador.addEventListener("input", filtrarLibros);

// MUESTRA TODOS LOS LIBROS AL ABRIR LA PAGINA
mostrarLibros(libros);
