
//Variables Globales
const d = document;
let clienteInput = d.querySelector(".cliente");
let productoInput = d.querySelector(".producto");
let precioInput = d.querySelector(".precio");
let imagenInput = d.querySelector(".imagen");
let observacioneInput = d.querySelector(".observaciones");
let btnGuardar = d.querySelector(".btnGuardar");

//agregar el evento click al boton del formulario
btnGuardar.addEventListener("click", ()=>{
     //alert(clienteInput.value);
});

//Funcion para validar los campos del formulario
function validarFormulario(){
    if(clienteInput.value == ""){
        alert("Todos los campos del formulario son obligatorios")
    }else{
        alert("clienteInput.value")
    }
}