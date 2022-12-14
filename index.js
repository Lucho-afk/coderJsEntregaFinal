/*----declaro unas globales----*/

let BOTON_CARRITO = document.getElementById("botonCarrito");
let TOTAL = 0;
let TOTAL_EN_CARRITO = 0;
let ARRAY_COMIDAS = [];
let MODAL_CARRITO = document.getElementById("modal-body");
let MODAL_CERRAR = document.getElementById("modalCerrar");
let MODAL_PRECIO_TOTAL = document.getElementById("precioTotal");
let EFECTIVO_TOTAL = document.getElementById("totalAPagarEfectivo");
let MODAL_BOTON_PAGAR = document.getElementById("moverAModalEfectivo");
let EFECTIVO_BOTON_PAGAR = document.getElementById("pagoEnEfectivo");
let QR_BOTON_PAGAR = document.getElementById("moverAModalQr");
let TARJETA_BOTON_VALIDAR = document.getElementById("enviarFormulario");
let MODAL_TARJETA_CREDITO = document.getElementById("moverLmodalPorTarjeta");
let BOTON_PAGAR_TARJETA = document.getElementById("pagarTarjetaDeCredito");

let comidas = [
  {
    id: 1,
    nombre: "Big Mac",
    precio: 1000,
    img: "./resources/Big_Mac.png",
    kcal: 505,
    ingredientes: {
      1: "carne",
      2: "lechua",
      3: "tomate",
    },
    descripcion:
      "Quizás sean las dos hamburguesas de carne 100% vacuna con esa salsa especial y queso derretido, el toque de cebolla y la frescura de la lechuga o el crocante del pepino, lo que la hace la hamburguesa más famosa del mundo. Un sabor único.",
    provedor: "McDonald's®",
  },
  {
    id: 2,
    nombre: "Whopper",
    precio: 1200,
    img: "./resources/Whopper.png",
    kcal: 640,
    ingredientes: {
      1: "carne",
      2: "cebolla",
      3: "tomate",
    },
    descripcion:
      "Ahora nuestra Whopper es sin conservantes, colorantes ni saborizantes artificiales. Con todo el sabor a la parrilla, jugosos tomates, lechuga recién cortada, mayonesa, pepinos y cebollas en rodajas, sobre un suave pan con semillitas de ajonjolí. Pedila así: Whopper y nada más que Whopper, pero con papas y gaseosa ;)",
    provedor: "Burger King®",
  },
  {
    id: 3,
    nombre: "Stacker",
    precio: 1500,
    img: "./resources/Stacker-Triple.png",
    kcal: 829,
    ingredientes: {
      1: "carne",
      2: "baacon",
      3: "cheedar",
    },
    descripcion:
      "3 carnes a la parrilla, salsa stacker, pan, queso cheddar, panceta. Muy potente.",
    provedor: "Burger King®",
  },
  {
    id: 4,
    nombre: "Cuarto de libra",
    precio: 800,
    img: "./resources/Cuarto_de_libra.png",
    kcal: 520,
    ingredientes: {
      1: "carne",
      2: "cheedar",
      3: "ketchup",
    },
    descripcion:
      "La belleza radica en la simpleza de las cosas. Una hamburguesa que no se anda con vueltas. La perfecta combinación entre la mejor carne 100% vacuna y dos quesos que lo rodean, junto con el toque del kétchup, mostaza y la cebolla fresca.",
    provedor: "McDonald's®",
  },
  {
    id: 5,
    nombre: "Milanesa <3",
    precio: 2000,
    img: "./resources/milanesas-a-caballojpg.jpg",
    kcal: "no importa vos comela",
    ingredientes: {
      1: "milanesa",
      2: "huevo frito",
      3: "papitas fritas",
    },
    descripcion: "Si esto no es amor, no se lo que lo sea",
    provedor: "Mama®",
  },
];

/*----------------------------------------LUGAR DE COMPRA-------------------------------------------*/
const lugarDeMuestraDeComida = document.getElementById("muestriaro");
function mostarComida() {
  let array = comidas.map(
    (c) =>
      `
        <div class="card" style="width: 18rem;">
            <img src="${c.img}" class="card-img-top" alt="..." style="height:260px">
            <div class="card-body">
                <h5 class="card-title">${c.nombre}</h5>
                <p class="card-text">${c.precio}$</p>
                <button class="btn btn-primary" onClick='agregar("${c.nombre}",${c.precio})'>Agregar</button>
                <a href="./viewa/infoNutricional.html" class="btn btn-primary" onClick='info(${c.id})'>Info</a>
            </div>
        </div>
        
    `
  );
  lugarDeMuestraDeComida.innerHTML = array.join(``);
}

function validador(numero) {
  return isNaN(numero);
}

/*-------------------------pago con tarjeta-----------------------------------*/
BOTON_PAGAR_TARJETA.setAttribute("disabled", "true");
TARJETA_BOTON_VALIDAR.addEventListener("click", () => {
  pagoConTarjeta();
});

function pagoConTarjeta() {
  let tarjeta = document.getElementById("tarjeta").value;
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let nroTarjeta = document.getElementById("nroTarjeta").value;
  let cvu = document.getElementById("cvu").value;
  console.log(tarjeta, nombre, apellido, nroTarjeta, cvu);

  if (!isValidNombre(nombre)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "El nombre es invalido",
    });
    return;
  }

  if (!isValidNombre(apellido)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "El apellido es invalido",
    });
    return;
  }

  switch (tarjeta) {
    case "visa":
      if (!isValidVisa(nroTarjeta)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "su visa es invalida",
        });
        return;
      }
      break;
    case "masterCard":
      if (!isValidMaster(nroTarjeta)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Su master card es invalida",
        });
        return;
      }
      break;

    default:
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Seleccione una tarjeta valida",
      });
      return;
      break;
  }
  let cantCuotasGlobal = pagoEnCuotas();

  cantCuotasGlobal.addEventListener("change", () => {
    BOTON_PAGAR_TARJETA.removeAttribute("disabled");
    let numeroDeCuotas = document.getElementById("cantCuotas").value;
    calculoInteres(numeroDeCuotas);
  });
}

BOTON_PAGAR_TARJETA.addEventListener("click", () => {
  Swal.fire({
    icon: "success",
    title: "Gracias por su compra.",
    showConfirmButton: false,
    timer: 2500,
  });
  setTimeout(() => {
    recargar();
  }, 2500);
});

function calculoInteres(numeroDeCuotas) {
  let totalInteres = document.getElementById("totalInteres");
  switch (parseInt(numeroDeCuotas)) {
    case 1:
      totalInteres.innerHTML = `<div style="
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-family: fantasy;
      flex-direction: column;
  "><p>Total a pagar: ${TOTAL}</p><p>en 1 cuota de: ${(TOTAL * 1).toFixed(
        2
      )}</p></div>`;
      break;
    case 3:
      totalInteres.innerHTML = `<div style="
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-family: fantasy;
      flex-direction: column;
  "><p>Total a pagar: ${TOTAL}</p><p>en 3 cuota de: ${(
        (TOTAL * 1.15) /
        3
      ).toFixed(2)}</p></div>`;
      break;
    case 6:
      totalInteres.innerHTML = `<div style="
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-family: fantasy;
      flex-direction: column;
  "><p>Total a pagar: ${TOTAL}</p><p>en 6 cuota de: ${(
        (TOTAL * 1.25) /
        6
      ).toFixed(2)}</p></div>`;
      break;
    case 12:
      totalInteres.innerHTML = `<div style="
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-family: fantasy;
      flex-direction: column;
  "><p>Total a pagar: ${TOTAL}</p><p>en 12 cuota de: ${(
        (TOTAL * 1.45) /
        12
      ).toFixed(2)}</p></div>`;
      break;

    default:
      break;
  }
}

function pagoEnCuotas() {
  let cuotas = document.getElementById("cuotas");
  cuotas.innerHTML = `<select
  name="tarjeta"
  id="cantCuotas"
  form="carform"
  class="form-select"
  style="margin-top:1rem"
>
  <option selected>seleccione la cantidad de cuotas</option>
  <option value="1">1</option>
  <option value="3">3</option>
  <option value="6">6</option>
  <option value="12">12</option>
</select>`;
  let cantCuotas = document.getElementById("cantCuotas");
  return cantCuotas;
}

function isValidNombre(nombre) {
  return /^[a-z]+$/.test(nombre);
}

function isValidVisa(visa) {
  let regex = /^4[0-9]{12}(?:[0-9]{3})?$/;
  return regex.test(visa);
}

function isValidMaster(master) {
  let regex = /5[1-5][0-9]{14}$/;
  return regex.test(master);
}

/*----------------------------pago por efectivo-------------------------------*/

MODAL_BOTON_PAGAR.addEventListener("click", () => {
  if (TOTAL == 0) {
    Swal.fire({
      icon: "warning",
      title: "Movimiento invalido",
      text: "Todavia no ordenaste nada",
      showConfirmButton: false,
    });
    setTimeout(() => {
      location.reload();
    }, 2500);
  }
  EFECTIVO_TOTAL.innerHTML =
    TOTAL == 0 ? " Todavia no se selecciono nada." : TOTAL;
});

EFECTIVO_BOTON_PAGAR.addEventListener("click", () => {
  dinero = document.getElementById("inputDinero").value;
  console.log(dinero);
  if (!validador(dinero)) {
    if (TOTAL - dinero <= 0) {
      Swal.fire({
        icon: "success",
        title: calcularVuelto(dinero, TOTAL),
        showConfirmButton: false,
        timer: 2500,
      });
      setTimeout(() => {
        recargar();
      }, 2500);
    } else {
      Swal.fire({
        icon: "error",
        title: calcularVuelto(dinero, TOTAL),
        showConfirmButton: false,
        timer: 2500,
      });
      setTimeout(() => {
        recargar();
      }, 2500);
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ingrese un numero valido por favor",
    });
  }
});
function calcularVuelto(efectivoDelCliente, precio) {
  let pago = efectivoDelCliente;
  let resta = precio - pago;
  if (resta <= 0) {
    return `Muchas gracias por su compra, su vuelto es: ${-1 * resta}$`;
  } else {
    return `Saldo insuficiente`;
  }
}

/*------------------------------pago con qr-------------------------------------*/
QR_BOTON_PAGAR.addEventListener("click", () => pagoConQR());
function pagoConQR() {
  let QR_BODY = document.getElementById("qr");
  QR_BODY.innerHTML = `<img src="./resources/loading-waiting.gif"></img>`;
  fetch(
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${TOTAL}`
  )
    .then((res) => {
      QR_BODY.innerHTML = `<img src="${res.url}">`;
    })
    .catch(() => {
      QR_BODY.innerHTML = `No Se pudo procesar este codigo`;
    });
  if (validador(TOTAL)) {
    TOTAL = 0;
  }
}

/*--------------------------------------carrito de compras---------------------------------------*/

class Compra {
  constructor(productos, monto) {
    this.producto = productos;
    this.cantidad = productos.lenth;
    this.pago = monto;
  }
}

function agregar(comida, monto) {
  TOTAL = TOTAL + monto;
  ARRAY_COMIDAS.push(comida);
  numerosDeItemsEnCarrito();
  console.log(TOTAL_EN_CARRITO);
}

function itemCarrito(objetoComida) {
  return `<div class="card mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${objetoComida.img}" style="max-height: 100px;min-height: 100px;" class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body" style="padding:0">
        <h5 class="card-title">${objetoComida.nombre}</h5>
        <div style="display:flex; justify-content: space-between;">
          <p class="card-text">Precio:${objetoComida.precio}$</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

function cuentaDeCarrito() {
  borrarCarrito();
  if (ARRAY_COMIDAS.length > 0) {
    MODAL_BOTON_PAGAR.removeAttribute("disabled");
    MODAL_TARJETA_CREDITO.removeAttribute("disabled");
    QR_BOTON_PAGAR.removeAttribute("disabled");
    ARRAY_COMIDAS.forEach((c) => {
      let objetoComida = comidas.find((element) => element.nombre == c);
      MODAL_CARRITO.innerHTML += itemCarrito(objetoComida);
    });
  } else {
    console.log(ARRAY_COMIDAS.length);
    MODAL_CARRITO.innerHTML = `No seleccionaste ningun producto por ahora`;
    MODAL_BOTON_PAGAR.setAttribute("disabled", "true");
    MODAL_TARJETA_CREDITO.setAttribute("disabled", "true");
    QR_BOTON_PAGAR.setAttribute("disabled", "true");
  }
  MODAL_PRECIO_TOTAL.innerHTML = `<div style="font-size:40px;display: flex;justify-content: flex-end;margin-right: 20px;">Total:${TOTAL}</div>`;
}

function borrarCarrito() {
  MODAL_CARRITO.innerHTML = "";
}

BOTON_CARRITO.addEventListener("click", () => {
  cuentaDeCarrito();
});

function numerosDeItemsEnCarrito() {
  TOTAL_EN_CARRITO = TOTAL_EN_CARRITO + 1;
  const carro = document.getElementById("carrito");
  carro.innerHTML = TOTAL_EN_CARRITO;
}

/*----------------------------------funciones utiles-------------------------------------------*/
function recargar() {
  location.reload();
}

/*----------------------------------info nutricional--------------------------------------------*/

function info(id) {
  localStorage.setItem("id", id);
}
function traerSeleccion() {
  return comidas.find((e) => e.id == localStorage.getItem("id"));
}
const cartaDeInfo = document.querySelector(".cartaDeInfo");
function mostarInfoComida() {
  let comidaFiltrada = traerSeleccion();
  let info = `
    <div class="card mb-3" style="margin-top: 2rem">
        <div class="row g-0">
          <div class="col-md-4">
            <img
              src=".${comidaFiltrada.img}"
              class="img-fluid rounded-start"
              alt="..."
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${comidaFiltrada.nombre}</h5>
              <p class="card-text">
                ${comidaFiltrada.descripcion}
              </p>
              <p class="card-text">
                <small class="text-muted">${comidaFiltrada.provedor}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
  `;
  cartaDeInfo.innerHTML = info;
}

const infoDetallada = document.querySelector(".infoDetallada");
function mostarInfoDetalladaComida() {
  let arrayDeIngredientes = [];
  let comidaFiltrada = traerSeleccion();
  let listaIngredientes = comidaFiltrada.ingredientes;
  for (const key in listaIngredientes) {
    arrayDeIngredientes.push(listaIngredientes[key]);
  }
  let info = `
    <div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button
        class="accordion-button"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseOne"
        aria-expanded="true"
        aria-controls="collapseOne"
      >
        Info Detallada
      </button>
    </h2>
    <div
      id="collapseOne"
      class="accordion-collapse collapse"
      aria-labelledby="headingOne"
      data-bs-parent="#accordionExample"
    >
      <div class="accordion-body">
        <p>kcal: ${comidaFiltrada.kcal}</p>
        <p>Ingredientes: ${arrayDeIngredientes}</p>
      </div>
    </div>
  </div>
</div>
  `;
  infoDetallada.innerHTML = info;
}
