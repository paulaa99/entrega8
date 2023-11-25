document.addEventListener("DOMContentLoaded", function(){
    const modeBtn = document.getElementById("mode-btn");
    const content = document.getElementById("containerSup");
    const downMenu = document.getElementById("dropdownMenu");
    
    // Verifica si el usuario ya ha establecido una preferencia de modo
    const currentMode = localStorage.getItem("mode");
    
    // Si no hay una preferencia previa, usa el "Modo Día" por defecto
    if (!currentMode || currentMode === "day-mode") {
        content.classList.add("day-mode");
    } else {
        // Si hay una preferencia previa, aplica el modo correspondiente
        content.classList.add("night-mode");
    }
    
    // Agrega un evento de clic al botón para cambiar el modo
    modeBtn.addEventListener("click", function () {
        if (content.classList.contains("day-mode")) {
            content.classList.remove("day-mode");
            downMenu.classList.remove("day-mode");
            downMenu.classList.add("night-mode");
            content.classList.add("night-mode");
            localStorage.setItem("mode", "night-mode");
        } else {
            content.classList.remove("night-mode");
            downMenu.classList.remove("night-mode");
            downMenu.classList.add("day-mode");
            content.classList.add("day-mode");
            localStorage.setItem("mode", "day-mode");
        }
    });

    // Funcion que guarda los datos del perfil ingresados
    function saveProfileData(){
        const nameProfile = document.getElementById("name-myprofile").value
        const secondNameProfile = document.getElementById("middleName-myprofile").value
        const surnameProfile = document.getElementById("surname-myprofile").value
        const secondSurnameProfile = document.getElementById("secondSurname-myprofile").value
        const phoneProfile = document.getElementById("phone-myprofile").value
        const emailProfile = document.getElementById("email-myprofile").value
        const infoProfile = {
            name: nameProfile,
            secondName: secondNameProfile,
            surname: surnameProfile,
            secondSurname:secondSurnameProfile,
            phone: phoneProfile
        }
        if(nameProfile && surnameProfile && emailProfile){
            localStorage.setItem("infoProfile", JSON.stringify(infoProfile))
            alert("Su informacion se guardo correctamente, usted Sabpe")
        }else {
            alert("Por favor completa los campos requeridos")
        }
    }
    const userProfileForm = document.getElementById("userProfileForm")
        // Aca hacemos uso de la funcion saveProfileData cuando se envia el formulario
    userProfileForm.addEventListener("submit", function (e){
        e.preventDefault()
        saveProfileData()
    })
    // Aca se rellenamos el input email con el email que se loggeo el usuario previamente
    const emailInput = document.getElementById("email-myprofile")
    const loggedEmail = localStorage.getItem("nav_user")
    emailInput.value = loggedEmail
    // Creamos funcion para rellenar los campos en caso que exista la data en el localStorage
    function rellenarInfoFromLocalStorage() {
        const nameProfile = document.getElementById("name-myprofile")
        const secondNameProfile = document.getElementById("middleName-myprofile")
        const surnameProfile = document.getElementById("surname-myprofile")
        const secondSurnameProfile = document.getElementById("secondSurname-myprofile")
        const phoneProfile = document.getElementById("phone-myprofile")
        // obtengo la info en formato json
        const infoFromLocalStorageJson = localStorage.getItem("infoProfile")
        // la convierto usando JSON.parse a un objeto nuevamente
        const infoFromLocalStorage = JSON.parse(infoFromLocalStorageJson)
        console.log(infoFromLocalStorage)
        if(infoFromLocalStorage){
            nameProfile.value = infoFromLocalStorage.name
            secondNameProfile.value = infoFromLocalStorage.secondName
            surnameProfile.value = infoFromLocalStorage.surname
            secondSurnameProfile.value = infoFromLocalStorage.secondSurname
            phoneProfile.value = infoFromLocalStorage.phone
        }
    }
    // Llamamos la funcion 
    rellenarInfoFromLocalStorage()

    //Agregar foto de perfil
    const defaultPic = localStorage.getItem("uploadedPicture") ||
    "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg";
    const img = document.getElementById("img-profile");
    const picture = document.getElementById("picture");
    img.src = defaultPic
    picture.addEventListener("change", e => {
        if(e.target.files[0]){
            const lector = new FileReader();
            lector.onload = function( e ){
            img.src = e.target.result;
            localStorage.setItem("uploadedPicture", e.target.result);
            }
            lector.readAsDataURL(e.target.files[0])
        }else{
            img.src = defaultPic;
        }
    });
});


