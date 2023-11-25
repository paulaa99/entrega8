const CAT_ID = localStorage.getItem("catID");
const PROD_ID = localStorage.getItem("id_producto");

const CATEGORIES_URL = "http://localhost:3001/cats";
const PUBLISH_PRODUCT_URL = "http://localhost:3001/sell/publish";
const PRODUCTS_URL = `http://localhost:3001/cats_products/${CAT_ID}`;
const PRODUCT_INFO_URL = `http://localhost:3001/products/${PROD_ID}`;
const PRODUCT_INFO_COMMENTS_URL = `http://localhost:3001/products_comments/${PROD_ID}`;
const CART_INFO_URL = "http://localhost:3001/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}
//let getJSONData = function(url){
async function getJSONData (url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}