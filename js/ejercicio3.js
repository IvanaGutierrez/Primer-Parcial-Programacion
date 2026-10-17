
"use strict";

// EDITORIALES
const editoriales = [
    { id: "ed1", nombre: "Editorial Planeta" },
    { id: "ed2", nombre: "Penguin Random House" }
];

// GENEROS
const generos = [
    { id: "g1", nombre: "Novela" },
    { id: "g2", nombre: "Fantasía" }
];

// AUTORES
const autores = [
    { id: "a1", nombre: "Antoine de Saint-Exupéry" },
    { id: "a2", nombre: "J. K. Rowling" },
    { id: "a3", nombre: "Gabriel García Márquez" }
];

// CLIENTES FICTICIOS
const clientes = [
    { id: "c1", nombre: "Lucía Pérez" },
    { id: "c2", nombre: "Mateo Gómez" },
    { id: "c3", nombre: "Sofía López" }
];

// LIBROS
const libros = [
    {
        id: "l1",
        titulo: "El principito",
        editorialId: "ed1",
        autorIds: ["a1"],
        generoId: "g1"
    },
    {
        id: "l2",
        titulo: "Harry Potter y la piedra filosofal",
        editorialId: "ed2",
        autorIds: ["a2"],
        generoId: "g2"
    },
    {
        id: "l3",
        titulo: "Cien años de soledad",
        editorialId: "ed1",
        autorIds: ["a3"],
        generoId: "g1"
    },
    {
        id: "l4",
        titulo: "Harry Potter y la cámara secreta",
        editorialId: "ed2",
        autorIds: ["a2"],
        generoId: "g2"
    },
    {
        id: "l5",
        titulo: "El amor en los tiempos del cólera",
        editorialId: "ed1",
        autorIds: ["a3"],
        generoId: "g1"
    },
    {
        id: "l6",
        titulo: "Vuelo nocturno",
        editorialId: "ed2",
        autorIds: ["a1"],
        generoId: null
    }
];

// ELEMENTOS DE LA PAGINA
const buscador = document.getElementById("buscador-titulo");
const listado = document.getElementById("catalogo-listado");
const mensaje = document.getElementById("catalogo-mensaje");

// BUSCA UN ELEMENTO POR SU IDENTIFICADOR
function buscarPorId(lista, id) {
    return lista.find(function (elemento) {
        return elemento.id === id;
    });
}

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

    const librosFiltrados = libros.filter(function (libro) {
        return libro.titulo.toLowerCase().includes(busqueda);
    });

    mostrarLibros(librosFiltrados);
}

// ESCUCHA LOS CAMBIOS EN EL BUSCADOR
buscador.addEventListener("input", filtrarLibros);

// MUESTRA TODOS LOS LIBROS AL ABRIR LA PAGINA
mostrarLibros(libros);

// Estos datos quedan disponibles para las siguientes etapas del proyecto.
console.log("Clientes cargados:", clientes.length);
