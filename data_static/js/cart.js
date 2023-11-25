document.addEventListener("DOMContentLoaded", function(){
    const modoBtn = document.getElementById("mode-btn");
    const content = document.getElementById("containerCart");
    const dropMenu = document.getElementById("dropdownMenu");
    
    // Verifica si el usuario ya ha establecido una preferencia de modo
    const currentMode = localStorage.getItem("modo");
    
    // Si no hay una preferencia previa, usa el "Modo Día" por defecto
    if (!currentMode || currentMode === "day-mode") {
        content.classList.remove("night-mode");
        content.classList.add("day-mode");
        dropMenu.classList.add("day-mode");
    } else {
        // Si hay una preferencia previa, aplica el modo correspondiente
        content.classList.remove("day-mode");
        content.classList.add("night-mode");
        dropMenu.classList.add("night-mode");
    }
    
    // Agrega un evento de clic al botón para cambiar el modo
    modoBtn.addEventListener("click", function () {
        if (content.classList.contains("day-mode")) {
            content.classList.remove("day-mode");
            dropMenu.classList.remove("day-mode");
            dropMenu.classList.add("night-mode");
            content.classList.add("night-mode");
            localStorage.setItem("modo", "night-mode");
        } else {
            content.classList.remove("night-mode");
            dropMenu.classList.remove("night-mode");
            dropMenu.classList.add("day-mode");
            content.classList.add("day-mode");
            localStorage.setItem("modo", "day-mode");
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    let recargo = localStorage.getItem('reloaded');
    // Condicional para recargar la página una única vez y cargar el primer elemento del carrito
    if (!recargo) {
        // La página no se ha recargado todavía, recárgala
        localStorage.setItem('reloaded', 'true');
        window.location.reload();
    }

    const IDinicial = "25801";
    const url = `http://localhost:3001/user_cart/${IDinicial}`;

    

    var arrayItems = JSON.parse(localStorage.getItem('items')) || [];
    // Objeto para almacenar la cantidad de veces que se repite cada ID
    const idContador = {};

    // Función para actualizar los subtotales en tiempo real
    function actualizarPrecioTotal(idProducto, valor) {
        let Total = 0;
        const capturandoTD = document.getElementById("costo" + idProducto);
        const producto = filtrados.find(item => item.id === idProducto);
        const dolar = `<b> $USD</b>`;

        //Volvemos a calcular el total de todos los productos sumados antes de modificar el input
        for (const producto of filtrados) {
            const valor = producto.cantidad;
            const multiplicando = valor * producto.cost;
            Total += multiplicando;
        }

        // Actualizamos la tabla al momento que se modifica el input
        if (producto) {
            const multiplicando = valor * producto.cost;
            capturandoTD.textContent = multiplicando;
            capturandoTD.innerHTML += dolar;
            producto.cantidad = valor;
            localStorage.setItem('items', JSON.stringify(filtrados));

        }

        //Borramos el valor anterior para que no se sume con valores anteriores
        Total = 0;

        //Volvemos a calcular el total de todos los productos sumados luego de modificar el input
        for (const producto of filtrados) {
            const valor = producto.cantidad;
            const multiplicando = valor * producto.cost;
            Total += multiplicando;
        }

        //Seteamos la variable local para que la pueda capturar la funcion que lo incerta en el html
        localStorage.setItem('SumasTotales', Total);
    }
    

    function restaurarValoresDesdeLocalStorage() {
        filtrados.forEach(producto => {
            const idProducto = producto.id;
            const valor = parseFloat(producto.cantidad);
            const input = document.getElementById(idProducto);
            const dolar = `<b> $USD</b>`;
            input.value = valor;
            const precioTotal = valor * producto.cost;
            const capturandoTD = document.getElementById("costo" + idProducto);
            capturandoTD.textContent = precioTotal;
            capturandoTD.innerHTML += dolar;
        });
    }

    function agregandoItems() {
        const contenedor = document.getElementById("tbody");
        filtrados.forEach(producto => {
            const idProducto = producto.id;
            const valor = idContador[idProducto];
            const precioTotal = valor * producto.cost;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <tr>
                    <td><img src="${producto.img}" alt=""></td>
                    <td>${producto.name}</td>
                    <td>${producto.cost} <b>$USD</b></td>
                    <td><input type="number" name="inputQuantity" id="${idProducto}" value="${valor}"></td>
                    <td id="costo${producto.id}">${precioTotal}</td>
                    <td>
                        <!-- Botón de eliminar con ícono -->
                        <button class="btn btn-danger btn-sm delete-product" data-product-id="${idProducto}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            contenedor.appendChild(tr);

            // Agregar evento 'input' a los inputs
            const input = tr.querySelector('input[type="number"]');
            input.addEventListener('input', function () {
                const idProducto = this.id;
                const valor = parseFloat(this.value);
                actualizarPrecioTotal(idProducto, valor);
                CalculosGenerales();
            });

            // Agregar evento de click al botón de eliminar
            const deleteButton = tr.querySelector('.delete-product');
            deleteButton.addEventListener('click', function () {
                const productId = this.getAttribute("data-product-id");
                eliminarProducto(productId);
            });
        });
    }
    
    // Nueva función para eliminar un producto del carrito
    function eliminarProducto(idProducto) {
        filtrados = filtrados.filter(producto => producto.id !== idProducto);
        localStorage.setItem('items', JSON.stringify(filtrados));

        // Actualizar la vista del carrito después de eliminar el producto
        const productoEliminado = document.getElementById(idProducto);
        if (productoEliminado) {
            productoEliminado.parentElement.parentElement.remove();
            actualizarPrecioTotal();
        }

        CalculosGenerales();
    }

    // Filtra y cuenta los elementos
    let filtrados = arrayItems.filter(item => {
        const id = item.id;
        if (!idContador[id]) {
            idContador[id] = 1;
            return true;
        } else {
            idContador[id]++;
            return false;
        }
    });

    function CalculosGenerales() {
        const contenedorTotal = document.getElementById("calculosGenerales");
        const imputs = document.querySelectorAll('#contenedorDeEnvios form input');
        const SumaTotal = JSON.parse(localStorage.getItem('SumasTotales'));

        const OpcionSeleccionada = (e) => {
            switch (e.target.value) {
                case "1":
                    if (e.target.checked) {
                        const premium = SumaTotal * (15 / 100);
                        const sumaOpt1 = SumaTotal + premium;
                        const divPremium = `
                        <h2>Subtotal: $USD ${SumaTotal}</h2>
                        <h2>Costo de envío: $USD ${premium}</h2>
                        <h2>Total: $USD ${sumaOpt1}</h2>
                        `;
                        contenedorTotal.innerHTML = divPremium;
                    }
                    break;
                case "2":
                    if (e.target.checked) {
                        const express = SumaTotal * (7 / 100);
                        const sumaOpt2 = SumaTotal + express;
                        const divExpress = `
                        <h2>Subtotal: $USD ${SumaTotal}</h2>
                        <h2>Costo de envío: $USD ${express}</h2>
                        <h2>Total: $USD ${sumaOpt2}</h2>
                        `;
                        contenedorTotal.innerHTML = divExpress;
                    }
                    break;
                case "3":
                    if (e.target.checked) {
                        const standard = SumaTotal * 0.5;
                        const sumaOpt3 = SumaTotal + standard;
                        const divStandard = `
                        <h2>Subtotal: $USD ${SumaTotal}</h2>
                        <h2>Costo de envío: $USD ${standard}</h2>
                        <h2>Total: $USD ${sumaOpt3}</h2>
                        `;
                        contenedorTotal.innerHTML = divStandard;
                    }
                    break;
            }
        }
        imputs.forEach((imputs) => {
            imputs.addEventListener('keyup', OpcionSeleccionada);
            imputs.addEventListener('blur', OpcionSeleccionada);
        });
    }

    const idcredito = document.getElementById("credito");
    idcredito.addEventListener('click', function () {
        let numCuenta = document.getElementById("numero-cuenta");
        let codigo = document.getElementById("codigo");
        let numTarjeta = document.getElementById("numero-tarjeta");
        let vencimiento = document.getElementById("vencimiento");
        numCuenta.disabled = true;
        codigo.disabled = false;
        numTarjeta.disabled = false;
        vencimiento.disabled = false;
    });

    const tranferenciaBancaria = document.getElementById("transferencia");
    tranferenciaBancaria.addEventListener('click', function () {
        let numCuenta = document.getElementById("numero-cuenta");
        let codigo = document.getElementById("codigo");
        let numTarjeta = document.getElementById("numero-tarjeta");
        let vencimiento = document.getElementById("vencimiento");
        numCuenta.disabled = false;
        codigo.disabled = true;
        numTarjeta.disabled = true;
        vencimiento.disabled = true;
    });

    // Fetch de datos iniciales
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Condicional para que solo agregue una vez el artículo de la consigna
            if (arrayItems.length === 0) {
                // Cargándolo como un objeto
                const item = data.articles[0];
                const img = item.image;
                const name = item.name;
                const cost = item.unitCost;
                var cant = 1;
                const agregandoItem = {
                    "id": IDinicial,
                    "name": name,
                    "img": img,
                    "cost": cost,
                    "cantidad": cant
                }
                // Actualizando array items
                arrayItems.push(agregandoItem);
                localStorage.setItem('items', JSON.stringify(arrayItems));
            } else {
                agregandoItems();
                restaurarValoresDesdeLocalStorage(); // Restaurar valores al cargar la página
                CalculosGenerales();
            }
        })
        .catch(error => {
            console.error('Error', error);
        });

    // Código para el botón de comprar y validación de envío y pago
    const comprarButton = document.getElementById("finalizarCompra");
    const form = document.getElementById("formPago");

    function showErrorMessage(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.color = "red";
        errorElement.style.display = "block";
    }

    function hideErrorMessage(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = "";
        errorElement.style.display = "none";
    }

    function showSnackbar(message, duration) {
        const snackbar = document.getElementById("snackbar");
        snackbar.textContent = message;
        snackbar.classList.add("show");
        snackbar.style.display = 'block';

        setTimeout(function () {
            snackbar.classList.remove("show");
            snackbar.style.display = 'none';
        }, duration);
    }

    comprarButton.addEventListener("click", function (event) {
        event.preventDefault();

        const calleInput = document.getElementById("calle");
        const numeroInput = document.getElementById("numero");
        const esquinaInput = document.getElementById("esquina");
        const formaDeEnvioInputs = document.querySelectorAll('input[name="opcion"]');
        const cantidadInputs = document.querySelectorAll('input[name="inputQuantity"]');
        const formaDePagoInputs = document.querySelectorAll('input[name="op"]');
        const numeroTarjetaInput = document.getElementById("numero-tarjeta");
        const codigoInput = document.getElementById("codigo");
        const vencimientoInput = document.getElementById("vencimiento");
        const numeroCuentaInput = document.getElementById("numero-cuenta");

        let allValid = true;

        if (calleInput.value.trim() === "") {
            showErrorMessage("calleError", "Ingresa una calle");
            allValid = false;
        } else {
            hideErrorMessage("calleError");
        }

        if (numeroInput.value.trim() === "" || isNaN(numeroInput.value) || parseInt(numeroInput.value) < 0) {
            showErrorMessage("numeroError", "Ingresa un número válido");
            allValid = false;
        } else {
            hideErrorMessage("numeroError");
        }

        if (esquinaInput.value.trim() === "") {
            showErrorMessage("esquinaError", "Ingresa una esquina");
            allValid = false;
        } else {
            hideErrorMessage("esquinaError");
        }

        let formaDeEnvioSeleccionada = false;
        formaDeEnvioInputs.forEach((input) => {
            if (input.checked) {
                formaDeEnvioSeleccionada = true;
            }
        });

        if (!formaDeEnvioSeleccionada) {
            showErrorMessage("formaEnvioError", "Selecciona una forma de envío");
            allValid = false;
        } else {
            hideErrorMessage("formaEnvioError");
        }

        cantidadInputs.forEach((input) => {
            const valor = parseFloat(input.value);
            if (isNaN(valor) || valor <= 0) {
                showErrorMessage("cantidadError", "Error");
                allValid = false;
            }
        });

        let formaDePagoSeleccionada = false;
        formaDePagoInputs.forEach((input) => {
            if (input.checked) {
                formaDePagoSeleccionada = true;
            }
        });

        if (!formaDePagoSeleccionada) {
            showErrorMessage("formaPagoError", "Selecciona una forma de pago");
            allValid = false;
        } else {
            hideErrorMessage("formaPagoError");
        }

        if (formaDePagoSeleccionada) {
            const selectedFormaDePago = document.querySelector('input[name="op"]:checked').value;

            if (selectedFormaDePago === "credito") {
                if (numeroTarjetaInput.value.trim() === "" || codigoInput.value.trim() === "" || vencimientoInput.value.trim() === "") {
                    showErrorMessage("tarjetaError", "Los campos de tarjeta no pueden estar vacíos");
                    allValid = false;
                } else {
                    hideErrorMessage("tarjetaError");
                }
            } else if (selectedFormaDePago === "transferencia") {
                if (numeroCuentaInput.value.trim() === "") {
                    showErrorMessage("cuentaError", "El número de cuenta no puede estar vacío");
                    allValid = false;
                } else {
                    hideErrorMessage("cuentaError");
                }
            }
        }

        if (allValid) {
            showSnackbar("Compra realizada con éxito. ¡Gracias por tu compra!", 5000);
            var snackbar = document.getElementById("snackbar");
            if (snackbar) {
                window.scrollTo({ top: snackbar.offsetTop - (window.innerHeight /2), behavior: "smooth" });
                snackbar.style.display = 'block';
            }
        }
    });
});
