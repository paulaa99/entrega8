const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

//Hacemos un sort para arreglar el orden de las categorias alfabeticamente y por cantidad de productos
document.addEventListener("DOMContentLoaded", function(){
    const modeBtn = document.getElementById("mode-btn");
    const content = document.getElementById("mainContent");
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
        dropMenu.classList.add("day-mode");
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

function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

//Mostramos la lista de categorias por la cantidad de productos

function showCategoriesList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentCategoriesArray.length; i++){
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
function clasificacion(dato){
   if(dato == '0'){
    sortAndShowCategories(ORDER_ASC_BY_NAME);
    }else if(dato == '1'){
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    }else if(dato == '2'){
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    }
    
}
document.addEventListener("DOMContentLoaded", function(e){

    

    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentCategoriesArray = resultObj.data
            showCategoriesList()
        }
    });


    //Limpiamos y mostramos la lista sin filtros
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showCategoriesList();
    });
});