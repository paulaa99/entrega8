document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
    const modeBtn = document.getElementById("mode-btn");
    const content = document.getElementById("firstContainer");
    const otherContainer = document.getElementById("super_container");
    const dropMenu = document.getElementById("dropdownMenu");
    
    // Verifica si el usuario ya ha establecido una preferencia de modo
    const currentMode = localStorage.getItem("mode");
    
    // Si no hay una preferencia previa, usa el "Modo Día" por defecto
    if (!currentMode || currentMode === "day-mode") {
        content.classList.remove("night-mode");
        content.classList.add("day-mode");
        otherContainer.classList.add("day-mode");
        dropMenu.classList.add("day-mode");
    } else {
        // Si hay una preferencia previa, aplica el modo correspondiente
        content.classList.add("night-mode");
        otherContainer.classList.add("night-mode");
        dropMenu.classList.add("night-mode");
    }
    
    // Agrega un evento de clic al botón para cambiar el modo
    modeBtn.addEventListener("click", function () {
        if (content.classList.contains("day-mode")) {
            content.classList.remove("day-mode");
            dropMenu.classList.remove("day-mode");
            otherContainer.classList.remove("day-mode");
            otherContainer.classList.add("night-mode");
            dropMenu.classList.add("night-mode");
            content.classList.add("night-mode");
            localStorage.setItem("mode", "night-mode");
        } else {
            content.classList.remove("night-mode");
            dropMenu.classList.remove("night-mode");
            otherContainer.classList.remove("night-mode");
            otherContainer.classList.add("day-mode");
            dropMenu.classList.add("day-mode");
            content.classList.add("day-mode");
            localStorage.setItem("mode", "day-mode");
        }
    });
});