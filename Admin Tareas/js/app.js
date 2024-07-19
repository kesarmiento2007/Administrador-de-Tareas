let DB;
let tareas = [];
let idTarea = "";
const body = document.querySelector("BODY");
const listaTareas = document.querySelector(".lista-tareas");
const agregarBtn = document.querySelector(".btn-fijo");
const mensajePredetermindado = document.querySelector(".mensaje-predeterminado");


let datosForm = {
    nombre: "",
    descripcion: "",
    fecha: "",
    prioridad: ""
}


document.addEventListener("DOMContentLoaded", () => {

    // Crear DB
    crearDB();

    // Obtener datos de la DB
    setTimeout(() => {
        ejecutarTareas();
    }, 500);
    setTimeout(() => {
        ejecutarTareas();
    }, 2000);

    agregarBtn.addEventListener("click", abrirFormulario);
});


// Interfaces

function abrirFormulario() {

    const div = document.createElement("DIV");
    div.classList.add("overlay");
    
    div.innerHTML = `
        <div class="contenedor-form animacion">

            <h3 class="titulo-form centrar-texto">Agregar Tarea</h3>

            <div data-cy="btn-volver" class="contenedor-volver-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon volver-icon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M244 400L100 256l144-144M120 256h292"/></svg>
            </div>

            <form data-cy="formulario" class="formulario">
                <div class="contenedor-input">
                    <label for="nombre">Nombre</label>
                    <input data-cy="input-nombre" type="text" id="nombre" class="input-form resetear-input" autocomplete="off">
                </div>

                <div class="contenedor-input">
                    <label for="descripcion">Descripción</label>
                    <textarea data-cy="input-descripcion" id="descripcion" cols="30" rows="10" class="input-form resetear-input"></textarea>
                </div>

                <div class="contenedor-input">
                    <label for="fecha">Fecha Entrega</label>
                    <input data-cy="input-fecha" type="date" id="fecha" class="select-form resetear-input">
                </div>

                <div class="contenedor-input">
                    <label for="prioridad">Prioridad</label>
                    <select data-cy="select-prioridad" id="prioridad" class="select-form resetear-input">
                        <option selected value="1">Media</option>
                        <option value="2">Alta</option>
                    </select>
                </div>

                <div class="contenedor-btn">
                    <input data-cy="btn-submit" type="submit" value="Agregar" class="btn-submit">
                </div>
            </form>
        </div>
    `;

    div.onclick = function(e) {
        if(e.target.classList.contains("overlay") || e.target.classList.contains("volver-icon")) {
            div.remove();
            body.classList.remove("overflow");

            idTarea = "";
        }
    }

    body.appendChild(div);
    body.classList.add("overflow");

    const formulario = document.querySelector(".formulario");
    formulario.addEventListener("submit", validacion);
}

async function mostrarTareas() {

    return new Promise((resolve, reject) => {

        limpiarHTML();

        let fechaAnterior = "";

        tareas.forEach( tarea => {

            const {nombre, descripcion, fecha, prioridad, id} = tarea;

            const divTarea = document.createElement("DIV");
            divTarea.classList.add("contenedor-tarea");
            divTarea.dataset.cy = "contenedor-tarea";
            if(fechaAnterior === fecha) {
                divTarea.classList.add("separacionTareas");
            }
            if(fechaAnterior !== fecha) {
                divTarea.classList.add("separacionFechas");
            }

            const tareaDatos = document.createElement("DIV");
            tareaDatos.classList.add("tarea");

            const contenedorMensaje = document.createElement("DIV");
            contenedorMensaje.classList.add("contenedor-mensaje");
        
            const mensajeTarea = document.createElement("P");
            mensajeTarea.classList.add("mensaje-tarea");
            mensajeTarea.textContent = nombre;

            const contenedorDetalles = document.createElement("DIV");
            contenedorDetalles.classList.add("contenedor-detalles");

            const detallesTarea = document.createElement("DIV");
            detallesTarea.classList.add("detalles-tarea");

            const prioridadTarea = document.createElement("P");
            prioridadTarea.classList.add("prioridad-tarea");
            if(prioridad === "1") {
                prioridadTarea.classList.add("media");
                prioridadTarea.textContent = "Media";
            } else {
                prioridadTarea.classList.add("alta");
                prioridadTarea.textContent = "Alta";
            }

            const fechaTarea = document.createElement("P");
            fechaTarea.classList.add("fecha-tarea");
            fechaTarea.textContent = fecha;

            const contenedorBotones = document.createElement("DIV");
            contenedorBotones.classList.add("contenedor-botones");

            const editarBtn = document.createElement("BUTTON");
            editarBtn.classList.add("editar-btn", "btn");
            editarBtn.dataset.cy = "btn-editar";
            editarBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M364.13 125.25L87 403l-23 45 44.99-23 277.76-277.13-22.62-22.62zM420.69 68.69l-22.62 22.62 22.62 22.63 22.62-22.63a16 16 0 000-22.62h0a16 16 0 00-22.62 0z"/></svg>`;
            editarBtn.onclick = function() {
                abrirFormulario();

                document.querySelector(".titulo-form").textContent = "Editar Tarea";
                document.querySelector(".btn-submit").value = "Editar";

                document.querySelector("#nombre").value = nombre;
                document.querySelector("#descripcion").value = descripcion;
                document.querySelector("#fecha").value = fecha;
                document.querySelector("#prioridad").value = prioridad;

                idTarea = id;
            }

            const eliminarBtn = document.createElement("BUTTON");
            eliminarBtn.classList.add("eliminar-btn", "btn");
            eliminarBtn.dataset.cy = "btn-eliminar";
            eliminarBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352"/><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`;
            eliminarBtn.onclick = function() {
                eliminarTarea(id);
            }

            const descripcionTarea = document.createElement("DIV");
            descripcionTarea.classList.add("descripcion-tarea", "ocultar");
            descripcionTarea.textContent = descripcion;

            const contenedorDescripcion = document.createElement("DIV");
            contenedorDescripcion.classList.add("contenedor-descripcion");

            const descripcionBtn = document.createElement("BUTTON");
            descripcionBtn.classList.add("descripcion-btn");
            descripcionBtn.dataset.cy = "btn-descripcion";
            descripcionBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M112 184l144 144 144-144"/></svg>`;
            descripcionBtn.onclick = function() {
                descripcionBtn.classList.toggle("rotar");
                descripcionTarea.classList.toggle("ocultar");
                divTarea.classList.toggle("verTarea");
            }

            contenedorMensaje.appendChild(mensajeTarea);

            detallesTarea.appendChild(prioridadTarea);
            detallesTarea.appendChild(fechaTarea);

            contenedorBotones.appendChild(editarBtn);
            contenedorBotones.appendChild(eliminarBtn);

            contenedorDetalles.appendChild(detallesTarea);
            contenedorDetalles.appendChild(contenedorBotones);

            tareaDatos.appendChild(contenedorMensaje);
            tareaDatos.appendChild(contenedorDetalles);

            contenedorDescripcion.appendChild(descripcionBtn);

            divTarea.appendChild(tareaDatos);
            divTarea.appendChild(descripcionTarea);
            divTarea.appendChild(contenedorDescripcion);


            listaTareas.appendChild(divTarea);

            fechaAnterior = fecha;
        });

        setTimeout(() => {
            resolve();
        }, 100);
    });
}

function alertaConfirm() {

    const div = document.createElement("DIV");
    div.classList.add("overlay-alerta");
    div.dataset.cy = "overlay-alerta";

    div.innerHTML = `
        <div class="alerta animacion">

            <div class="contenedor-icono">
                <div class="icono-alerta">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M160 164s1.44-33 33.54-59.46C212.6 88.83 235.49 84.28 256 84c18.73-.23 35.47 2.94 45.48 7.82C318.59 100.2 352 120.6 352 164c0 45.67-29.18 66.37-62.35 89.18S248 298.36 248 324" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="40"/><circle cx="248" cy="399.99" r="32"/></svg>
                </div>
            </div>

            <div class="contenedor-alerta">

                <h4 class="mensaje-alerta">¿Estás Seguro?</h4>

                <div class="contenedor-botones-alerta">
                    <button data-cy="btn-rechazar" class="btn-alerta rechazar-alerta">No</button>
                    <button data-cy="btn-aceptar" class="btn-alerta aceptar-alerta">Si</button>
                </div>
            </div>
        </div>
    `;

    return new Promise((resolve, reject) => {

        div.onclick = function(e) {
            if(e.target.classList.contains("overlay-alerta")) {
                div.remove();
                body.classList.remove("overflow");
                resolve(false);
            }
        }

        body.appendChild(div);
        body.classList.add("overflow");

        const rechazarBtn = document.querySelector(".rechazar-alerta");
        const aceptarBtn = document.querySelector(".aceptar-alerta");

        rechazarBtn.onclick = function() {
            div.remove();
            body.classList.remove("overflow");
            resolve(false);
        }

        aceptarBtn.onclick = function() {
            div.remove();
            body.classList.remove("overflow");
            resolve(true);
        }
    });
}

function limpiarHTML() {
    while(listaTareas.firstChild) {
        listaTareas.removeChild(listaTareas.firstChild);
    }
}


// Validación

async function validacion(e) {
    e.preventDefault();

    const nombre = document.querySelector("#nombre");
    const descripcion = document.querySelector("#descripcion");
    const fecha = document.querySelector("#fecha");
    const prioridad = document.querySelector("#prioridad");

    // Validar
    if(nombre.value === "" || descripcion.value === "" || fecha.value === "" || prioridad.value === "") {
        
        if(nombre.value === "") {
            nombre.classList.add("error-input");
        }
        if(descripcion.value === "") {
            descripcion.classList.add("error-input");
        }
        if(fecha.value === "") {
            fecha.classList.add("error-input");
        }
        if(prioridad.value === "") {
            prioridad.classList.add("error-input");
        }

        return;
    }

    if( idTarea ) {

        datosForm = {
            nombre: nombre.value.trim(),
            descripcion: descripcion.value.trim(),
            fecha: fecha.value,
            prioridad: prioridad.value
        }
        datosForm.id = Number( idTarea );

        editarTarea(datosForm);

        idTarea = "";

    } else {

        // Agregar a objeto
        datosForm = {
            nombre: nombre.value.trim(),
            descripcion: descripcion.value.trim(),
            fecha: fecha.value,
            prioridad: prioridad.value
        }
        datosForm.id = Date.now();

        // Agregar objeto a la BD
        crearTarea(datosForm);
    }

    // Cerrar overlay
    document.querySelector(".overlay").remove();
    body.classList.remove("overflow");

    // Ejecutar tareas
    setTimeout(() => {
        ejecutarTareas();
    }, 100);
}

function ordenarTareas() {

    return new Promise((resolve, reject) => {
        
        // Ordenar por prioridad
        tareas.sort((a, b) => b.prioridad - a.prioridad);

        // Ordenar por fecha
        tareas.sort((a, b) => {
            const dateA = new Date(a.fecha);
            const dateB = new Date(b.fecha);

            return dateA - dateB;
        });

        setTimeout(() => {
            resolve();
        }, 100);
    });
}

async function ejecutarTareas() {
    try {
        // Obtener tareas de la BD
        await obtenerTareas();

        // Ordenar tareas
        await ordenarTareas();

        // Mostrar tareas
        await mostrarTareas();

        // Vaciar datos del objeto
        vaciarObjeto();

        // Vaciar array de tareas
        tareas = [];

        console.log("Todas las funciones han sido ejecutadas en orden");
    } catch (error) {
        console.error("Error: ", error);
    }
}


function vaciarObjeto() {
    datosForm.nombre = "";
    datosForm.descripcion = "";
    datosForm.fecha = "";
    datosForm.prioridad = "";
    datosForm.id = "";
}


// Base de datos

function crearDB() {
    const crearDB = window.indexedDB.open("Tareas", 1);

    crearDB.onerror = function() {
        console.log("Hubo un error creando la base de datos");
    }

    crearDB.onsuccess = function() {
        DB = crearDB.result;
    }

    crearDB.onupgradeneeded = function(e) {
        const db = e.target.result;

        // Crear tabla de tareas
        const objectStoreClientes = db.createObjectStore("tareas", { keyPath: "id", autoIncrement: true });

        objectStoreClientes.createIndex("nombre", "nombre", { unique: false });
        objectStoreClientes.createIndex("descripcion", "descripcion", { unique: false });
        objectStoreClientes.createIndex("fecha", "fecha", { unique: false });
        objectStoreClientes.createIndex("prioridad", "prioridad", { unique: false });
        objectStoreClientes.createIndex("id", "id", { unique: true });

        console.log("Base de datos Creada y Lista");
    }
}

function crearTarea(tarea) {
    const transaction = DB.transaction(["tareas"], "readwrite");

    const objectStore = transaction.objectStore("tareas");

    objectStore.add(tarea);

    transaction.onerror = function() {
        console.log("Hubo un error");
    }

    transaction.oncomplete = function() {
        console.log("Tarea Agregada");
    }
}

async function obtenerTareas() {

    return new Promise(resolve => {

        const objectStore = DB.transaction("tareas").objectStore("tareas");
  
        objectStore.openCursor().onsuccess = function(e) {
            const cursor = e.target.result;
  
            if(cursor) {
                tareas.push(cursor.value);
                cursor.continue();
            } else {
                console.log("No hay más registros");
            }
        }

        setTimeout(() => {
            resolve();
        }, 100);
    });
}

// Editar tarea
function editarTarea(tareaEditada) {
    const transaction = DB.transaction(["tareas"], "readwrite");
    const objectStore = transaction.objectStore("tareas");

    objectStore.put(tareaEditada);

    transaction.oncomplete = function() {
        console.log("Editado Correctamente");
    }

    transaction.onerror = function() {
        imprimirAlerta("Hubo un error", "error");
    }
}

// Eliminar tarea
async function eliminarTarea(id) {

    const confirmacion = await alertaConfirm();
    
    if( !confirmacion ) {
        return;
    }

    const transaction = DB.transaction(["tareas"], "readwrite");
    const objectStore = transaction.objectStore("tareas");

    objectStore.delete( Number(id) );

    transaction.oncomplete = function() {
        ejecutarTareas();
    }

    transaction.onerror = function(){
        console.log("Hubo un error");
    }
}