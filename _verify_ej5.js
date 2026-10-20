// Verificación Ejercicio 5 (T6.1 + T6.2) por file:// con Edge headless + CDP.
// Sin Playwright ni instalaciones: Node WebSocket nativo + HTTP de Node.
"use strict";

const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9372;
const BASE = "file:///C:/Users/julic/Primer-Parcial-Programacion/";
const DATOS_PATH = "C:\\Users\\julic\\Primer-Parcial-Programacion\\js\\datos.js";
const USER_DATA = "C:\\Users\\julic\\AppData\\Local\\Temp\\opencode\\edge9372-" + Date.now();

const resultados = [];
function check(id, nombre, pass, evidencia) {
    resultados.push({ id, nombre, pass: !!pass, evidencia: evidencia === undefined ? "" : String(evidencia) });
    console.log((pass ? "PASS" : "FAIL") + " [" + id + "] " + nombre + " :: " + (evidencia === undefined ? "" : evidencia));
}
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

function jsonRequest(path, method) {
    return new Promise(function (resolve, reject) {
        const req = http.request({ hostname: "127.0.0.1", port: PORT, path: path, method: method || "GET" }, function (res) {
            let d = "";
            res.on("data", function (x) { d += x; });
            res.on("end", function () { try { resolve(JSON.parse(d)); } catch (e) { resolve(null); } });
        });
        req.on("error", reject);
        req.end();
    });
}

async function waitCdp() {
    for (let i = 0; i < 60; i += 1) {
        try {
            const v = await jsonRequest("/json/version");
            if (v) { return v; }
        } catch (e) { /* todavía no levantó */ }
        await sleep(500);
    }
    throw new Error("CDP no respondió en el puerto " + PORT);
}

function makeConn(ws) {
    let conteo = 0;
    const pendientes = new Map();
    const escuchas = [];
    ws.addEventListener("message", function (msg) {
        const s = typeof msg.data === "string" ? msg.data : msg.data.toString();
        let j;
        try { j = JSON.parse(s); } catch (e) { return; }
        if (j.id && pendientes.has(j.id)) {
            const p = pendientes.get(j.id);
            pendientes.delete(j.id);
            p.resolve(j);
            return;
        }
        escuchas.slice().forEach(function (fn) { fn(j); });
    });
    return {
        send: function (method, params) {
            const id = ++conteo;
            return new Promise(function (resolve, reject) {
                pendientes.set(id, { resolve: resolve });
                ws.send(JSON.stringify({ id: id, method: method, params: params || {} }));
                setTimeout(function () {
                    if (pendientes.has(id)) {
                        pendientes.delete(id);
                        reject(new Error("timeout CDP " + method));
                    }
                }, 15000);
            });
        },
        on: function (fn) { escuchas.push(fn); },
        off: function (fn) { const i = escuchas.indexOf(fn); if (i >= 0) { escuchas.splice(i, 1); } },
        close: function () { try { ws.close(); } catch (e) { /* noop */ } }
    };
}

function connect(url) {
    return new Promise(function (resolve, reject) {
        const ws = new WebSocket(url);
        ws.addEventListener("open", function () { resolve(ws); });
        ws.addEventListener("error", function (e) { reject(new Error("WebSocket error")); });
    });
}

function waitFor(conn, method, timeout) {
    return new Promise(function (resolve, reject) {
        const t = setTimeout(function () {
            conn.off(handler);
            reject(new Error("timeout esperando " + method));
        }, timeout || 20000);
        function handler(j) {
            if (j.method === method) {
                clearTimeout(t);
                conn.off(handler);
                resolve(j.params);
            }
        }
        conn.on(handler);
    });
}

async function ev(conn, expression) {
    const r = await conn.send("Runtime.evaluate", {
        expression: expression,
        returnByValue: true,
        awaitPromise: true
    });
    if (r.error) { throw new Error("CDP error: " + JSON.stringify(r.error)); }
    if (r.result && r.result.exceptionDetails) {
        const det = r.result.exceptionDetails;
        throw new Error("JS exception: " + (det.exception && det.exception.description ? det.exception.description : det.text));
    }
    return r.result.result.value;
}

function recolectarErrores(conn) {
    const errores = [];
    conn.on(function (j) {
        if (j.method === "Runtime.consoleAPICalled" && j.params.type === "error") {
            errores.push("console.error: " + j.params.args.map(function (a) {
                return a.value !== undefined ? a.value : (a.description || a.type);
            }).join(" "));
        }
        if (j.method === "Runtime.exceptionThrown") {
            const d = j.params.exceptionDetails;
            errores.push("exception: " + (d.exception && d.exception.description ? d.exception.description : d.text));
        }
        if (j.method === "Log.entryAdded" && j.params.entry.level === "error") {
            errores.push("log: " + j.params.entry.text + " @ " + (j.params.entry.url || ""));
        }
    });
    return errores;
}

async function prepararConexion(ws) {
    const conn = makeConn(ws);
    const errores = recolectarErrores(conn);
    await conn.send("Runtime.enable");
    await conn.send("Log.enable");
    await conn.send("Page.enable");
    await conn.send("Network.enable");
    await conn.send("Network.setCacheDisabled", { cacheDisabled: true });
    return { conn: conn, errores: errores };
}

async function navegar(conn, url) {
    const cargado = waitFor(conn, "Page.loadEventFired");
    await conn.send("Page.navigate", { url: url });
    await cargado;
    await sleep(500);
}

async function abrirPagina(url) {
    const target = await jsonRequest("/json/new?" + encodeURIComponent("about:blank"), "PUT");
    const ws = await connect(target.webSocketDebuggerUrl);
    const prep = await prepararConexion(ws);
    await navegar(prep.conn, url);
    return { targetId: target.id, conn: prep.conn, errores: prep.errores };
}

async function navegarPorNav(conn, href) {
    const cargado = waitFor(conn, "Page.loadEventFired");
    await ev(conn, "(function(){var a=document.querySelector('nav a[href=\"" + href + "\"]');if(!a)throw new Error('sin enlace nav " + href + "');a.click();return true;})()");
    await cargado;
    await sleep(600);
}

async function cerrarPagina(page) {
    page.conn.close();
    await jsonRequest("/json/close/" + page.targetId);
}

async function estadoVenta(conn) {
    return ev(conn, "(function(){" +
        "var trs=Array.prototype.slice.call(document.querySelectorAll('#venta-renglones tbody tr'));" +
        "return {rows:trs.map(function(tr){var tds=tr.querySelectorAll('td');var inp=tds[1].querySelector('input');" +
        "return {titulo:tds[0].textContent,cantidad:inp?inp.value:null,precio:tds[2].textContent,subtotal:tds[3].textContent};})," +
        "total:document.getElementById('venta-resumen').textContent," +
        "ok:document.getElementById('msg-ok').textContent,okHidden:document.getElementById('msg-ok').hidden," +
        "err:document.getElementById('msg-error').textContent,errHidden:document.getElementById('msg-error').hidden," +
        "cantidadInput:document.getElementById('venta-cantidad').value," +
        "cliente:document.getElementById('venta-cliente').value," +
        "vacioHidden:document.getElementById('venta-renglones-vacio').hidden," +
        "guardadas:sessionStorage.getItem('libreria-ventas')};})()");
}

async function agregar(conn, libroId, cantidad) {
    return ev(conn, "(function(){var sl=document.getElementById('venta-libro');sl.value=" + JSON.stringify(libroId) + ";" +
        "var si=document.getElementById('venta-cantidad');si.value=" + JSON.stringify(String(cantidad)) + ";" +
        "document.getElementById('form-venta').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));return true;})()");
}

async function confirmar(conn) {
    return ev(conn, "(function(){document.getElementById('venta-confirmar').click();return true;})()");
}

async function quitarTodos(conn) {
    return ev(conn, "(function(){var bs=document.querySelectorAll('#venta-renglones tbody button');for(var i=0;i<bs.length;i++){bs[i].click();}return true;})()");
}

async function estadoHistorial(conn) {
    return ev(conn, "(function(){" +
        "var trs=Array.prototype.slice.call(document.querySelectorAll('#historial-listado tbody tr'));" +
        "return {rows:trs.map(function(tr){var tds=tr.querySelectorAll('td');return {id:tds[0].textContent,fecha:tds[1].textContent,cliente:tds[2].textContent,total:tds[3].textContent};})," +
        "vacioHidden:document.getElementById('historial-vacio').hidden," +
        "detalle:document.getElementById('historial-detalle').textContent," +
        "htmlMarcas:document.querySelectorAll('#historial-listado b,#historial-listado i,#historial-detalle b,#historial-detalle i').length};})()");
}

function restaurarDatos(original) {
    fs.writeFileSync(DATOS_PATH, original, "utf8");
}

async function main() {
    const originalDatos = fs.readFileSync(DATOS_PATH, "utf8");
    let browserVersion = null;
    let mainPage = null;
    try {
        spawn(EDGE, ["--headless=new", "--remote-debugging-port=" + PORT, "--user-data-dir=" + USER_DATA,
            "--disable-gpu", "--no-first-run", "--no-default-browser-check",
            "--allow-file-access-from-files", "about:blank"], { detached: true, stdio: "ignore" }).unref();
        browserVersion = await waitCdp();

        // ---------- T6.2 / caso 8: las 6 páginas abren por file:// sin errores ----------
        const paginas = [
            { archivo: "index.html", comprobar: "(function(){return {nav:document.querySelectorAll('nav a').length,h2:!!document.getElementById('titulo-catalogo')};})()" },
            { archivo: "ejercicio3.html", comprobar: "(function(){return {buscador:!!document.getElementById('buscador-titulo'),mensaje:!!document.getElementById('catalogo-mensaje'),filas:document.querySelectorAll('#catalogo-listado article').length};})()" },
            { archivo: "libros.html", comprobar: "(function(){return {filas:document.querySelectorAll('#libros-listado tbody tr').length,vacioHidden:document.getElementById('libros-vacio').hidden};})()" },
            { archivo: "clientes.html", comprobar: "(function(){return {filas:document.querySelectorAll('#clientes-listado tbody tr').length,vacioHidden:document.getElementById('clientes-vacio').hidden};})()" },
            { archivo: "ventas.html", comprobar: "(function(){return {clientes:document.getElementById('venta-cliente').options.length,libros:document.getElementById('venta-libro').options.length,filas:document.querySelectorAll('#venta-renglones tbody tr').length,total:document.getElementById('venta-resumen').textContent};})()" },
            { archivo: "historial.html", comprobar: "(function(){return {filas:document.querySelectorAll('#historial-listado tbody tr').length,vacioHidden:document.getElementById('historial-vacio').hidden};})()" }
        ];
        const regresion = {};
        for (const p of paginas) {
            const page = await abrirPagina(BASE + p.archivo);
            await sleep(700);
            const estado = await ev(page.conn, p.comprobar);
            regresion[p.archivo] = { estado: estado, errores: page.errores };
            check("T6.2-" + p.archivo, "Abre por file:// sin servidor", page.errores.length === 0, JSON.stringify(estado) + " errores=" + JSON.stringify(page.errores));
            await cerrarPagina(page);
        }
        const regresionOk =
            regresion["index.html"].estado.nav === 5 && regresion["index.html"].estado.h2 === true &&
            regresion["ejercicio3.html"].estado.buscador === true && regresion["ejercicio3.html"].estado.filas > 0 &&
            regresion["libros.html"].estado.filas === 6 &&
            regresion["clientes.html"].estado.filas === 3 &&
            regresion["ventas.html"].estado.clientes === 3 && regresion["ventas.html"].estado.libros === 6 &&
            regresion["ventas.html"].estado.filas === 0 && regresion["ventas.html"].estado.total === "Total: 0.00." &&
            regresion["historial.html"].estado.filas === 0 && regresion["historial.html"].estado.vacioHidden === false;
        check("T6.2-regresion", "Regresión Ej1-Ej4 (catálogo/filtro, libros y clientes renderizados)", regresionOk, JSON.stringify(regresion));

        // ---------- T6.1: pestaña principal ventas.html ----------
        mainPage = await abrirPagina(BASE + "ventas.html");
        const conn = mainPage.conn;
        await ev(conn, "(function(){sessionStorage.clear();return true;})()");
        await navegar(conn, BASE + "ventas.html");

        let s = await estadoVenta(conn);
        check("T6.1-init", "Selectores poblados desde datos.js y venta vacía", s.rows.length === 0 && s.total === "Total: 0.00." && s.vacioHidden === false,
            JSON.stringify({ filas: s.rows.length, total: s.total, vacioHidden: s.vacioHidden }));
        const opciones = await ev(conn, "(function(){return {c:Array.prototype.map.call(document.getElementById('venta-cliente').options,function(o){return o.value;}),l:Array.prototype.map.call(document.getElementById('venta-libro').options,function(o){return o.value;}),ana:document.querySelector('#venta-cliente option[value=ana]')!==null,jardin:document.querySelector('#venta-libro option[value=jardin]')!==null};})()");
        check("T6.1-selectores", "Opciones generadas (c1..c3/l1..l6), sin opciones de ejemplo", opciones.c.join(",") === "c1,c2,c3" && opciones.l.join(",") === "l1,l2,l3,l4,l5,l6" && !opciones.ana && !opciones.jardin, JSON.stringify(opciones));

        // Caso 1 — venta válida con precios reales del catálogo (equivalente autorizado)
        await ev(conn, "(function(){document.getElementById('venta-cliente').value='c1';return true;})()");
        await agregar(conn, "l1", 2);
        await agregar(conn, "l2", 1);
        s = await estadoVenta(conn);
        const c1ok = s.rows.length === 2 &&
            s.rows[0].precio === "8999.99" && s.rows[0].subtotal === "17999.98" && s.rows[0].cantidad === "2" &&
            s.rows[1].precio === "12500.50" && s.rows[1].subtotal === "12500.50" && s.rows[1].cantidad === "1" &&
            s.total === "Total: 30500.48.";
        check("T6.1-1", "Venta válida 2x8999.99 + 1x12500.50 -> 17999.98/12500.50/total 30500.48", c1ok, JSON.stringify({ rows: s.rows, total: s.total }));

        // Caso 2 — cantidades inválidas (0, negativa, decimal, vacía)
        const filasAntes = s.rows.length;
        const cantAntes = s.rows[0].cantidad;
        const intentos = [
            { v: "0", etiqueta: "cero" },
            { v: "-1", etiqueta: "negativa" },
            { v: "1.5", etiqueta: "decimal" },
            { v: "", etiqueta: "vacía" }
        ];
        const resultadosC2 = [];
        for (const it of intentos) {
            await agregar(conn, "l3", it.v);
            const st = await estadoVenta(conn);
            resultadosC2.push({
                caso: it.etiqueta,
                filas: st.rows.length,
                cant: st.rows.length ? st.rows[0].cantidad : null,
                err: st.err,
                errVisible: st.errHidden === false
            });
        }
        const c2ok = resultadosC2.every(function (r) {
            return r.filas === filasAntes && r.cant === cantAntes && r.errVisible && /cantidad/.test(r.err);
        });
        check("T6.1-2", "Cantidad 0/negativa/decimal/vacía rechazada con mensaje y sin mutación", c2ok, JSON.stringify(resultadosC2));

        // Caso 3 — confirmar sin cliente y sin renglones
        await quitarTodos(conn);
        await ev(conn, "(function(){document.getElementById('venta-cliente').value='';return true;})()");
        await confirmar(conn);
        s = await estadoVenta(conn);
        const c3ok = s.guardadas === null && s.rows.length === 0 && s.errHidden === false &&
            /seleccione un cliente/.test(s.err) && /agregue al menos un renglón/.test(s.err);
        check("T6.1-3", "Confirmar sin cliente y sin renglones no registra y muestra #msg-error", c3ok,
            JSON.stringify({ guardadas: s.guardadas, filas: s.rows.length, error: s.err, errHidden: s.errHidden }));
        await ev(conn, "(function(){document.getElementById('venta-cliente').value='c1';return true;})()");

        // Caso 4 — mismo libro dos veces: un renglón con cantidad sumada
        await agregar(conn, "l1", 2);
        await agregar(conn, "l2", 1);
        await agregar(conn, "l1", 3);
        s = await estadoVenta(conn);
        const filasL1 = s.rows.filter(function (r) { return r.titulo === "El principito"; });
        const c4ok = filasL1.length === 1 && filasL1[0].cantidad === "5" &&
            filasL1[0].subtotal === "44999.95" && s.total === "Total: 57500.45." &&
            /Libro ya presente: cantidad actualizada a 5\./.test(s.ok) && s.okHidden === false;
        check("T6.1-4", "Mismo libro dos veces -> 1 renglón, cantidad sumada 5, subtotal 44999.95, total 57500.45, mensaje", c4ok,
            JSON.stringify({ rows: s.rows, total: s.total, ok: s.ok }));

        // Caso 6 (parte 1) — confirmar: form limpio, mensaje ok, venta guardada
        await confirmar(conn);
        s = await estadoVenta(conn);
        const ventasGuardadas = s.guardadas ? JSON.parse(s.guardadas) : [];
        const c6ok = s.rows.length === 0 && s.total === "Total: 0.00." && s.cantidadInput === "1" &&
            s.vacioHidden === false && /Venta registrada: v1 — total 57500\.45\./.test(s.ok) &&
            ventasGuardadas.length === 1 && ventasGuardadas[0].id === "v1" &&
            ventasGuardadas[0].total === 57500.45 &&
            ventasGuardadas[0].renglones.length === 2 &&
            ventasGuardadas[0].renglones[0].precioUnitario === 8999.99 &&
            ventasGuardadas[0].renglones[1].precioUnitario === 12500.5;
        check("T6.1-6a", "Tras confirmar: form limpio, total 0.00, mensaje de éxito y venta v1 en sessionStorage", c6ok,
            JSON.stringify({ rows: s.rows.length, total: s.total, cant: s.cantidadInput, ok: s.ok, ventas: ventasGuardadas.map(function (v) { return { id: v.id, total: v.total, renglones: v.renglones.length }; }) }));

        // Caso 5 — precio histórico: cambiar precio en datos.js (copia de prueba) y recargar historial
        let c5ok = false;
        let c5ev = "";
        try {
            const datosMod = originalDatos.replace("precio: 8999.99", "precio: 1.00");
            if (datosMod === originalDatos) { throw new Error("no se pudo sustituir el precio de l1 en datos.js"); }
            fs.writeFileSync(DATOS_PATH, datosMod, "utf8");

            await navegarPorNav(conn, "historial.html");
            let h = await estadoHistorial(conn);
            const filaV1 = h.rows.filter(function (r) { return r.id === "v1"; })[0];
            const listadoOk = !!filaV1 && filaV1.total === "57500.45" && filaV1.cliente === "Lucía Pérez" && /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(filaV1.fecha);

            await ev(conn, "(function(){var a=document.querySelector('#historial-listado a[data-venta-id=v1]');if(!a)throw new Error('sin enlace detalle v1');a.click();return true;})()");
            const detalle = await ev(conn, "document.getElementById('historial-detalle').textContent");
            const detalleOk = /precio unitario 8999\.99/.test(detalle) && /precio unitario 12500\.50/.test(detalle) &&
                /subtotal 44999\.95/.test(detalle) && /subtotal 12500\.50/.test(detalle) && /total 57500\.45/.test(detalle);
            c5ok = listadoOk && detalleOk;
            c5ev = JSON.stringify({ filaV1: filaV1, detalle: detalle });
        } finally {
            restaurarDatos(originalDatos);
        }
        check("T6.1-5", "Precio histórico: catálogo l1=1.00 tras confirmar; historial conserva 8999.99/44999.95/57500.45", c5ok, c5ev);

        // Volver a ventas y confirmar que el catálogo revertido no altera el historial
        await navegarPorNav(conn, "ventas.html");
        const catalogoRevertido = await ev(conn, "(function(){return typeof libros!=='undefined'?libros[0].precio:null;})()");
        check("T6.1-5b", "datos.js revertido (l1 vuelve a 8999.99)", catalogoRevertido === 8999.99, "precio l1=" + catalogoRevertido);

        // Caso 7 — marcas HTML en título/cliente se muestran literales (textContent)
        await ev(conn, "(function(){" +
            "libros.push({id:'ltest',titulo:'<b>Título Prueba</b>',isbn:'978-TEST',editorialId:'ed1',autorIds:['a1'],generoId:'g1',precio:100});" +
            "clientes.push({id:'ctest',nombre:'<i>Cliente Prueba</i>',email:'prueba@correo.ficticio'});" +
            "poblarSelectorVentaLibro();poblarSelectorVentaCliente();" +
            "document.getElementById('venta-cliente').value='ctest';return true;})()");
        await agregar(conn, "ltest", 2);
        await confirmar(conn);
        await navegarPorNav(conn, "historial.html");
        const h7 = await estadoHistorial(conn);
        const filaV2 = h7.rows.filter(function (r) { return r.id === "v2"; })[0];
        await ev(conn, "(function(){var a=document.querySelector('#historial-listado a[data-venta-id=v2]');if(!a)throw new Error('sin enlace detalle v2');a.click();return true;})()");
        const detalle7 = await ev(conn, "document.getElementById('historial-detalle').textContent");
        const c7ok = !!filaV2 && filaV2.cliente === "<i>Cliente Prueba</i>" && filaV2.total === "200.00" &&
            h7.htmlMarcas === 0 && /<b>Título Prueba<\/b>/.test(detalle7);
        check("T6.1-7", "Título/cliente con marcas HTML se muestran literales (sin nodos b/i)", c7ok,
            JSON.stringify({ filaV2: filaV2, marcasDOM: h7.htmlMarcas, detalle: detalle7 }));

        // Caso 6 (parte 2) — la venta aparece en el historial al navegar; el detalle usa la venta guardada
        const h6 = await estadoHistorial(conn);
        const filaV1h = h6.rows.filter(function (r) { return r.id === "v1"; })[0];
        check("T6.1-6b", "La venta v1 aparece en historial.html tras navegar por el nav", !!filaV1h && filaV1h.total === "57500.45", JSON.stringify(filaV1h));

        // Caso 8 — errores de consola de toda la interacción de la pestaña principal
        const errMain = mainPage.errores;
        check("T6.1-8", "0 errores de consola en todas las interacciones (pestaña principal)", errMain.length === 0, JSON.stringify(errMain));
    } catch (e) {
        check("HARNESS", "Ejecución del harness", false, e && e.stack ? e.stack : String(e));
    } finally {
        try { restaurarDatos(originalDatos); } catch (e) { /* noop */ }
        if (mainPage) { try { await cerrarPagina(mainPage); } catch (e) { /* noop */ } }
        try {
            if (browserVersion && browserVersion.webSocketDebuggerUrl) {
                const ws = await connect(browserVersion.webSocketDebuggerUrl);
                const bc = makeConn(ws);
                await bc.send("Browser.close");
                bc.close();
            }
        } catch (e) { /* noop */ }
    }

    const fallidos = resultados.filter(function (r) { return !r.pass; });
    console.log("\n=== RESUMEN ===");
    console.log(JSON.stringify({ total: resultados.length, pasaron: resultados.length - fallidos.length, fallaron: fallidos.length, fallidos: fallidos }, null, 2));
    process.exit(fallidos.length === 0 ? 0 : 1);
}

main().catch(function (e) {
    console.error("ERROR FATAL", e);
    process.exit(1);
});
