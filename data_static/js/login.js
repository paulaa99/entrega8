document.addEventListener("DOMContentLoaded", function(){
  const modeBtn = document.getElementById("mode-btn");
  const content = document.getElementById("loginContent");
  const dropMenu = document.getElementById("dropdownMenu");

  // Verifica si el usuario ya ha establecido una preferencia de modo
  const currentMode = localStorage.getItem("mode");
  
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
  modeBtn.addEventListener("click", function () {
      if (content.classList.contains("day-mode")) {
        content.classList.remove("day-mode");
        dropMenu.classList.remove("day-mode");
        dropMenu.classList.add("night-mode");
        content.classList.add("night-mode");
          localStorage.setItem("mode", "night-mode");
      } else {
        content.classList.remove("night-mode");
        dropMenu.classList.remove("night-mode");
        dropMenu.classList.add("day-mode");
        content.classList.add("day-mode");
          localStorage.setItem("mode", "day-mode");
      }
  });
});

const form = document.getElementById('loginForm');
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Previene el envío automático del formulario

  // Muestra la pantalla de carga
  const loadingOverlay = document.getElementById('loadingOverlay');
  loadingOverlay.style.display = 'flex';

  setTimeout(function () {
    // Resto de tu código aquí
    const user = document.getElementById("name").value;
    const pass = document.getElementById("password").value;
    const captcha = document.getElementById("captcha").checked;

    if (user == '' || pass == '' || captcha == false) {
      alert('Email, contraseña y captcha son obligatorios');
      loadingOverlay.style.display = 'none'; // Oculta la pantalla de carga
      return false;
    } else if (user != '' && pass != '' && captcha) {
      localStorage.setItem('nav_user', user);
      console.log(localStorage.getItem('nav_user'));
      localStorage.setItem('isLoggedIn', 'true');
      window.location = "index.html"
    }

    // Oculta la pantalla de carga después de completar la operación asíncrona
    loadingOverlay.style.display = 'none';
  }, 2000); // Simula una operación asíncrona de 2 segundos
});

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('nav_user');
    localStorage.removeItem('items');
    localStorage.setItem('reloaded', 'false');
    const login = document.getElementById("login");
    login.textContent = "Login";
  }
  document.addEventListener('click', function(event) {
    if (event.target.id === 'logout') {
      logout();
    }
  });

  const imputs = document.querySelectorAll('#loginForm input');
  const formValidation = (e) => {
    switch (e.target.name) {
      case "user":
        if(e.target.value !== ""){
          document.getElementById("email").classList.remove("incorrect");
        }else{
          document.getElementById("email").classList.add("incorrect");
        }
      break;
      case "pass":
        if(e.target.value !== ""){
          document.getElementById("password").classList.remove("incorrect");
        }else{
          document.getElementById("password").classList.add("incorrect");
        }
      break;
      case "captcha":
      break;
    }
  }
  imputs.forEach((imputs) => {
    imputs.addEventListener('keyup', formValidation);
    imputs.addEventListener('blur', formValidation);
  });