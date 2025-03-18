// Variables globales
const d = document;
let clienteInput = d.querySelector(".cliente");
let productoInput = d.querySelector(".producto");
let precioInput = d.querySelector(".precio");
let imagenInput = d.querySelector(".imagen");
let observacionInput = d.querySelector(".observacion");
let btnGuardar = d.querySelector(".btnGuardar");
let tabla = d.querySelector(".table > tbody");
let buscadorInput = d.querySelector("#buscador");
let mensajeVacio = d.querySelector("#mensajeVacio");
let btnExportar = d.querySelector(".btnExportar");

// Agregamos el evento click al botón del formulario
btnGuardar.addEventListener("click", () => {
    let datos = validarFormulario();
    if (datos) {
        guardarDatos(datos);
        borrarTabla();
        mostrarDatos();
    }
});

// Función para validar los campos del formulario
function validarFormulario() {
    if (
        clienteInput.value === "" || precioInput.value === "" || productoInput.value === ""
    ) {
        alert("Todos los campos son obligatorios");
        return null;
    }

    let datosForm = {
        cliente: clienteInput.value,
        producto: productoInput.value,
        precio: precioInput.value,
        imagen: imagenInput.value,
        observacion: observacionInput.value,
    };

    // Limpiar los campos del formulario
    clienteInput.value = "";
    productoInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    observacionInput.value = "";

    return datosForm;
}

// Función para guardar los datos en el localStorage
const listadoPedidos = "Pedidos";
function guardarDatos(datos) {
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos)) || [];

    // Agregar el nuevo pedido al array
    pedidosPrevios.push(datos);

    // Guardar en el localStorage
    localStorage.setItem(listadoPedidos, JSON.stringify(pedidosPrevios));

    alert("Datos guardados con éxito");
}

// Función para extraer los datos guardados en el localStorage
function mostrarDatos() {
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];

    // Mostrar los datos en la tabla
    pedidos.forEach((p, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${p.cliente}</td>
            <td>${p.producto}</td>
            <td>${p.precio}</td>
            <td><img src="${p.imagen}" width="100"></td>
            <td>${p.observacion}</td>
            <td>
        <div class="acciones">
            <span class="btn-editar btn btn-warning btn-sm d-inline-flex align-items-center gap-1 shadow-sm">✏️</span>
            <span data-id="${i}" class="btn-eliminar btn btn-danger btn-sm d-inline-flex align-items-center gap-1 shadow-sm">🗑️</span>
        </div>
            </td>
            <p id="mensaje-vacio class="text-center text-muted mt-3" style="display:none"></p>
        `;
        tabla.appendChild(fila);
    });
    //ASIGNAR EVENTOS DESPUES DE AGREGAR FILAS A LA TABLA
    d.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", function () {
            let index = this.getAttribute("data-id");
            eliminarPedido(parseInt(index));
        });
    });
}

// Función para quitar los datos de la tabla
function borrarTabla() {
    let filas = d.querySelectorAll(".table tbody tr");
    filas.forEach((f) => f.remove());
}
// Función para mostrar un mensaje cuando no hay pedidos
function mostrarMensajeVacio() {
    let tabla = d.querySelector("tbody");
    let mensaje = document.createElement("tr");
    mensaje.id = "mensaje-vacio";
    mensaje.innerHTML = `<td colspan="7" class="text-center text-danger">No se encontraron pedidos</td>`;
    tabla.appendChild(mensaje);
}
// Función para eliminar un pedido de la tabla
function eliminarPedido(pos) {
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos)) || [];

    // Validar que la posición existe en el array
    if (pos < 0 || pos >= pedidosPrevios.length) {
        alert("Error: El pedido no existe.");
        return;
    }

    // Confirmar eliminación
    let confirmar = confirm(
        `¿Deseas eliminar el pedido de: ${pedidosPrevios[pos].cliente}?`
    );
    if (confirmar) {
        let pedidoEliminado = pedidosPrevios.splice(pos, 1)[0];

        alert(
            `Pedido del cliente: ${pedidoEliminado.cliente} eliminado con éxito.`
        );

        // Guardar los datos actualizados en localStorage
        localStorage.setItem(listadoPedidos, JSON.stringify(pedidosPrevios));

        // Actualizar la tabla
        borrarTabla();
        mostrarDatos();
        //console.log(borrarTabla);
    }
}
// Implementación del buscador
const buscador = document.getElementById("buscador");

buscador.addEventListener("input", buscarPedido);

function buscarPedido() {
    const terminoBusqueda = buscador.value.toLowerCase().trim();
    const filas = document.querySelectorAll("tbody tr");
    let hayResultados = false;

    filas.forEach((fila) => {
        // Omitir la fila del mensaje de "No se encontraron pedidos"
        if (fila.id === "no-resultados") return;

        const cliente = fila.children[1].textContent.toLowerCase();
        const producto = fila.children[2].textContent.toLowerCase();
        const precio = fila.children[3].textContent.toLowerCase();
        if (cliente.includes(terminoBusqueda) || producto.includes(terminoBusqueda) || precio.includes(terminoBusqueda)){
            fila.style.display = "";
            hayResultados = true;
        } else {
            fila.style.display = "none";
        }
    });

    let mensajeNoResultados = document.getElementById("no-resultados");

    if (!hayResultados && terminoBusqueda !== "") {
        if (!mensajeNoResultados) {
            mensajeNoResultados = document.createElement("tr");
            mensajeNoResultados.id = "no-resultados";
            mensajeNoResultados.innerHTML = `<td colspan="7" class="text-center text-danger">No se encontraron pedidos</td>`;
            document.querySelector("tbody").appendChild(mensajeNoResultados);
        }
    } else if (mensajeNoResultados) {
        mensajeNoResultados.remove();
    }

    // Si el input está vacío, mostrar todos los pedidos y eliminar el mensaje de error sin recargar la página
    if (terminoBusqueda === "") {
        filas.forEach((fila) => (fila.style.display = ""));
        if (mensajeNoResultados) mensajeNoResultados.remove();
    }
}

// Mostrar los datos de localStorage al recargar la página
d.addEventListener("DOMContentLoaded", function () {
    borrarTabla();
    mostrarDatos();
    buscadorInput();
});

//FUNCION PARA EXPORTAR A PDF
// Función para cargar un script de forma asíncrona
function cargarScript(url, callback) {
    const script = document.createElement("script");
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Verifica si jsPDF y autoTable están cargados, si no, los carga
if (!window.jspdf) {
    cargarScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", () => {
        console.log("jsPDF cargado");
    });
}
if (!window.jspdfAutoTable) {
    cargarScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js", () => {
        console.log("autoTable cargado");
    });
}

// Esperar a que el DOM cargue antes de asignar el evento
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("exportarPDF").addEventListener("click", function () {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert("jsPDF aún no está cargado. Intenta de nuevo en unos segundos.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Agregar título
        doc.text("Listado de Pedidos", 14, 10);

        // Seleccionar la tabla
        const tabla = document.querySelector(".table");

        if (!tabla) {
            alert("No se encontró la tabla.");
            return;
        }

        // Esperar a que autoTable esté disponible
        setTimeout(() => {
            if (!doc.autoTable) {
                alert("autoTable aún no está disponible.");
                return;
            }
            doc.autoTable({ html: tabla, startY: 20 });
            doc.save("Pedidos.pdf");
        }, 500);
    });
});
