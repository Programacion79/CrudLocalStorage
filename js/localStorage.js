// Variables globales
const d = document;
let clienteInput = d.querySelector(".cliente");
let productoInput = d.querySelector(".producto");
let precioInput = d.querySelector(".precio");
let imagenInput = d.querySelector(".imagen");
let observacionInput = d.querySelector(".observacion");
let btnGuardar = d.querySelector(".btnGuardar");

// agregar evento click al boton del formulario
btnGuardar.addEventListener("click", (event) => {
    event.preventDefault();
validarFormulario();

});

// Funcion para validar los campos del formulario
function validarFormulario(){
    let datosForm;
    if (clienteInput.value == "" ||productoInput.value == "" ||precioInput.value == "" || imagenInput.value == "" ) {
      alert("Todos los campos son obligatorios");
    } else {
        datosForm = {
            cliente: clienteInput.value,
            producto: productoInput.value,
            precio: precioInput.value,
            imagen: imagenInput.value,
            observacion: observacionInput.value
        }
    }
    console.log(datosForm);

    clienteInput.value = "";
    productoInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    observacionInput.value = "";

    return datosForm;

}