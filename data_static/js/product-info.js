
document.addEventListener("DOMContentLoaded", function(){
  const modoBtn = document.getElementById("mode-btn");
  const content = document.getElementById("container-info");
  const comment = document.getElementById("div_comment");
  const dropMenu = document.getElementById("dropdownMenu");
  const productsSimilar = document.getElementById("productosRelacionados");

  // Verifica si el usuario ya ha establecido una preferencia de modo
  const currentMode = localStorage.getItem("modo");
  
  // Si no hay una preferencia previa, usa el "Modo Día" por defecto
  if (!currentMode || currentMode === "day-mode") {
      content.classList.remove("night-mode");
      content.classList.add("day-mode");
      comment.classList.add("day-mode");
      dropMenu.classList.add("day-mode");
      productsSimilar.classList.add("day-mode");
  } else {
      // Si hay una preferencia previa, aplica el modo correspondiente
      content.classList.remove("day-mode");
      content.classList.add("night-mode");
      comment.classList.add("night-mode");
      dropMenu.classList.add("night-mode");
      productsSimilar.classList.add("night-mode");
  }
  
  // Agrega un evento de clic al botón para cambiar el modo
  modoBtn.addEventListener("click", function () {
      if (content.classList.contains("day-mode")) {
          content.classList.remove("day-mode");
          comment.classList.remove("day-mode");
          dropMenu.classList.remove("day-mode");
          productsSimilar.classList.remove("day-mode");
          productsSimilar.classList.add("night-mode");
          dropMenu.classList.add("night-mode");
          comment.classList.add("night-mode");
          content.classList.add("night-mode");
          localStorage.setItem("modo", "night-mode");
      } else {
          content.classList.remove("night-mode");
          comment.classList.remove("night-mode");
          dropMenu.classList.remove("night-mode");
          productsSimilar.classList.remove("night-mode");
          productsSimilar.classList.add("day-mode");
          dropMenu.classList.add("day-mode");
          comment.classList.add("day-mode");
          content.classList.add("day-mode");
          localStorage.setItem("modo", "day-mode");
      }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const idProducto = localStorage.getItem("id_producto") || "";
  const URLProduct = `http://localhost:3001/products/${idProducto}`;
  const URLComentarios = `http://localhost:3001/products_comments/${idProducto}`;
  const containerInfo = document.getElementById("container-info");
  const btn_comprar = document.getElementById("btnComprar");
  const btn_publish_comment = document.getElementById("publish_comment");

  let selectedRating = 1;
  // Funcion para renderizar la info seleccionada en pantalla
  function mostrarInfoProducto(obj) {
    containerInfo.innerHTML += `<h1>${obj.name} </h1>`;
    containerInfo.innerHTML += `<img src="${obj.images[1]}" alt="imagen auto">`;
    const divTexto = document.createElement("div");
    divTexto.classList.add("div-texto");
    divTexto.innerHTML += `<p>Precio ${obj.currency} ${obj.cost}</p>`;
    divTexto.innerHTML += `<p>Categoria ${obj.category}</p>`;
    divTexto.innerHTML += `<p>Vendidos ${obj.soldCount}</p>`;
    containerInfo.appendChild(divTexto);
    containerInfo.innerHTML += `<p>${obj.description}</p>`;
    const divImagenes = `
    <div id="carouselIMG" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="${obj.images[0]}" alt="imagen auto">
    </div>
    <div class="carousel-item">
      <img src="${obj.images[1]}" alt="imagen auto">
    </div>
    <div class="carousel-item">
      <img src="${obj.images[2]}" alt="imagen auto">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselIMG" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselIMG" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
  </div>
    `;
  
    containerInfo.innerHTML += divImagenes;
  }
  //Hacemos el fetch para acceder a la info del producto segun su ID
  fetch(URLProduct)
    .then((response) => response.json())
    .then((data) => {
      mostrarInfoProducto(data);
      fetch(URLComentarios) //Segundo fetch en el .then del primero para asegurarnos de que siempre haga las solicitudes en este orden
        .then((response) => response.json())
        .then((data) => {
          mostrarComentarios(data);
        })
        fetch(URLRelacionados)
        .then((response) => response.json())
        .then((data) => {
          productos(data.products);
    });

    })
    //Retornamos el error por consola
    .catch((error) => {
      console.error("Error:", error);
    });

  //Empieza codigo para renderizado de comentarios
  const estrellas = [
    '<span class="fa fa-star"></span>',
    '<span class="fa fa-star"></span>',
    '<span class="fa fa-star"></span>',
    '<span class="fa fa-star"></span>',
    '<span class="fa fa-star"></span>',
  ];
  function rellenarEstrellas(estrellas, calificacion) {
    for (let i = 0; i < estrellas.length; i++) {
      if (i >= calificacion) {
        estrellas[i] = '<span class="fa fa-star"></span>';
      } else {
        estrellas[i] = '<span class="fa fa-star checked"></span>';
      }
    }
    estrellas = estrellas.join(""); //usamos el metodo join para convertir el array en una sola cadena de texto
    return estrellas;
  }
  function mostrarComentarios(lista) {
    const divContenedorComentarios = document.createElement("div");
    divContenedorComentarios.classList.add("contenedor-comentarios");
    const tituloComentarios = document.createElement("h2");
    tituloComentarios.innerText = "Comentarios";
    divContenedorComentarios.appendChild(tituloComentarios);
    for (let comentario of lista) {
      const divComentario = document.createElement("div");
      divComentario.classList.add("div-comentario");
      const usuario = comentario.user;
      const fecha = comentario.dateTime;
      const description = comentario.description;
      const calificacion = rellenarEstrellas(estrellas, comentario.score);
      divComentario.innerHTML += `<p>${usuario} - ${fecha} - ${calificacion}</p>`;
      divComentario.innerHTML += `<p>${description}</p>`;
      divContenedorComentarios.appendChild(divComentario);
    }
    containerInfo.appendChild(divContenedorComentarios);
  }

  //Evento click para agregar el comentario de manera ficticia junto a los otros comentarios



document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-rating'));
        highlightStars(selectedRating);
    });
});

function highlightStars(rating) {
    document.querySelectorAll('.star').forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.style.color = 'gold';
        } else {
            star.style.color = 'black';
        }
    });
}
//Creamos el comentario y lo insertamos localmente
btn_publish_comment.addEventListener('click', function() {
    const user = localStorage.getItem('nav_user');
    const description = document.getElementById('comentario').value;
    const f = new Date();
    const fechaFormateada = `${f.getFullYear()}-${(f.getMonth() + 1).toString().padStart(2, '0')}-${f.getDate().toString().padStart(2, '0')} ${f.getHours().toString().padStart(2, '0')}:${f.getMinutes().toString().padStart(2, '0')}:${f.getSeconds().toString().padStart(2, '0')}`;
    const comentarioDiv = `
          <div class="div-comentario nuevo">
          <p>${user} - ${fechaFormateada} - ${rellenarEstrellas(estrellas, selectedRating)}</p>
          <p>${description}</p>
          </div>
    `;
    containerInfo.innerHTML += comentarioDiv;
    // Limpiar los campos del formulario después de publicar el comentario
    document.getElementById('comentario').value = '';
    selectedRating = 1;
    highlightStars(selectedRating);

  });
  
  //Productos relacionados

  let item = localStorage.getItem("catID");
  const URLRelacionados = `https://japceibal.github.io/emercado-api/cats_products/${item}.json`;
  const divRelacionados = document.getElementById("productosRelacionados");
  function productos(listaDeProductos) {
    for (let producto of listaDeProductos) {
        const divNuevoItem = `
        <div id = "${producto.id}">
          <h2>${producto.name}</h2>
          <img src="${producto.image}" alt="" onclick='localStorage.setItem("id_producto", ${producto.id}); window.location.href = "product-info.html";'>
          <h3>U$D ${producto.cost}</h3>
        `;
        divRelacionados.innerHTML += divNuevoItem;
    }
  }
  //Agregando compras al carrito

  btn_comprar.addEventListener('click', function(){
  //Obteniendo el array de items, el cual si no existe lo crea
  let arrayObjetosComprados = JSON.parse(localStorage.getItem('items')) || [];
    fetch(URLProduct)
    .then((response) => response.json())
    .then((data) => {
    //Cargando la respuesta del fetch como objeto en el array items
    const img = data.images[0];
    const name = data.name;
    const cost = data.cost;
    const agregandoItem = {
      "id" : idProducto,
      "name" : name,
      "img" : img,
      "cost" : cost,
      "cantidad" : "1"
    };
    //Actualizando el array items
    arrayObjetosComprados.push(agregandoItem);
    localStorage.setItem('items', JSON.stringify(arrayObjetosComprados));
  });
});
})



