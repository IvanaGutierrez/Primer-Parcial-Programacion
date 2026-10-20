// js/datos.js — Fuente única de datos compartidos (Ejercicios 3 y 4).
// TODOS LOS REGISTROS SON EJEMPLOS FICTICIOS (datos de ejemplo, no reales).
// Los IDs estables del Ejercicio 3 (ed1..ed2, g1..g2, a1..a3, c1..c3, l1..l6)
// se conservan sin cambios; "isbn" y "precio" en libros y "email" en clientes
// son extensiones ficticias agregadas para el Ejercicio 4.
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

// CLIENTES FICTICIOS (con emails de ejemplo)
const clientes = [
    { id: "c1", nombre: "Lucía Pérez", email: "lucia.perez@correo.ficticio" },
    { id: "c2", nombre: "Mateo Gómez", email: "mateo.gomez@correo.ficticio" },
    { id: "c3", nombre: "Sofía López", email: "sofia.lopez@correo.ficticio" }
];

// LIBROS FICTICIOS (con ISBN y precios de ejemplo)
const libros = [
    {
        id: "l1",
        titulo: "El principito",
        isbn: "978-0000000011",
        editorialId: "ed1",
        autorIds: ["a1"],
        generoId: "g1",
        precio: 8999.99
    },
    {
        id: "l2",
        titulo: "Harry Potter y la piedra filosofal",
        isbn: "978-0000000022",
        editorialId: "ed2",
        autorIds: ["a2"],
        generoId: "g2",
        precio: 12500.50
    },
    {
        id: "l3",
        titulo: "Cien años de soledad",
        isbn: "978-0000000033",
        editorialId: "ed1",
        autorIds: ["a3"],
        generoId: "g1",
        precio: 15999.00
    },
    {
        id: "l4",
        titulo: "Harry Potter y la cámara secreta",
        isbn: "978-0000000044",
        editorialId: "ed2",
        autorIds: ["a2"],
        generoId: "g2",
        precio: 11750.75
    },
    {
        id: "l5",
        titulo: "El amor en los tiempos del cólera",
        isbn: "978-0000000055",
        editorialId: "ed1",
        autorIds: ["a3"],
        generoId: "g1",
        precio: 13200.25
    },
    {
        id: "l6",
        titulo: "Vuelo nocturno",
        isbn: "978-0000000066",
        editorialId: "ed2",
        autorIds: ["a1"],
        generoId: null,
        precio: 9450.00
    }
];

// BUSCA UN ELEMENTO POR SU IDENTIFICADOR
function buscarPorId(lista, id) {
    return lista.find(function (elemento) {
        return elemento.id === id;
    });
}
