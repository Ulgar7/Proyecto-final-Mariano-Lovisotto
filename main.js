// Carrito de compras

var cartIcon = document.querySelector('#cart-icon')
var cart = document.querySelector('.cart')
var closeCart = document.querySelector('#close-cart')
var cartList = localStorage.getItem('carrito') ? JSON.parse(localStorage.getItem('carrito')) : [];

cartIcon.onclick = () => {
    cart.classList.add('active')
}

closeCart.onclick = () => {
    cart.classList.remove('active')
}

if (document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready();
}

function ready(){
    var removeCartButtons = document.getElementsByClassName('cart-remove')
    for(var i = 0; i < removeCartButtons.length; i++){
    var button = removeCartButtons[i]
    button.addEventListener('click', removeCartItem)
    }

    let quantityInputs = document.getElementsByClassName('cart-quantity')
    for(var i = 0; i < quantityInputs.length; i++){
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addCart = document.getElementsByClassName('add-cart');
    for(var i = 0; i < addCart.length; i++){
        var button = addCart[i]
        button.addEventListener('click', addCartClicked)
    }
    document.getElementsByClassName('btn-buy')[0].addEventListener('click',buyButtonClicked)
}

function buyButtonClicked(){
    alert('Tu compra se realizó con exito')
    var cartContent = document.getElementsByClassName('cart-content')[0]
    while(cartContent.hasChildNodes()){
        cartContent.removeChild(cartContent.firstChild)
    }
    localStorage.removeItem('carrito')
    updateTotal();
}

function removeCartItem(event){
    let itemId = JSON.parse(event.target.parentElement.id);
    cartList = cartList.filter(item => item.id !== itemId);
    localStorage.setItem('carrito', JSON.stringify(cartList));
    var buttonClicked = event.target
    buttonClicked.parentElement.remove()
    updateTotal();
}

function quantityChanged(event){
    var input = event.target
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1 
    }
    updateTotal()
}

function addCartClicked(_event){
    var button = _event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src;
    addProductToCart(title,price,productImg, JSON.parse(shopProducts.id));
    updateTotal();
}
function saveInLocalStorage(item) {
    let carrito = JSON.parse(localStorage.getItem('carrito'))
    if(carrito) {
        let itemFound = carrito.filter(ob => ob.id === item.id);
        let exist = itemFound.length >= 1 ? true : false;
        if(exist) {
            alert('Ya añadiste este producto a tu carrito');
            return false
        } else {
            cartList.push(item)
            localStorage.setItem(`carrito`, JSON.stringify(cartList));
        }
        return true
    } else {
        cartList.push(item)
        localStorage.setItem(`carrito`, JSON.stringify(cartList));
        return true
    }
}

function addProductToCart(title, price, productImg, id) {
    var item = {id, title, price, productImg};
    if(saveInLocalStorage(item)){

        var cartShopBox = document.createElement('div');
        cartShopBox.classList.add('cart-box');
        cartShopBox.id = id;
        var cartItems = document.getElementsByClassName('cart-content')[0]
        var cartBoxContent = `
            <img src="${(productImg)}" alt="" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${title}</div>
                <div class="cart-price">${price}</div>
                <input type="number" value="1" class="cart-quantity">
            </div>
            <i class='bx bx-trash-alt cart-remove' ></i>`
    
        cartShopBox.innerHTML = cartBoxContent
        cartItems.append(cartShopBox)
        cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem)
        cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', removeCartItem)
    }
}

function updateTotal(){
    var cartContent = document.getElementsByClassName('cart-content')[0]
    var cartBoxes = cartContent.getElementsByClassName('cart-box')
    var total = 0
    for(var i = 0; i < cartBoxes.length; i++){
        var cartBox = cartBoxes[i]
        var priceElement = cartBox.getElementsByClassName('cart-price')[0]
        var quantityElement =  cartBox.getElementsByClassName('cart-quantity')[0]
        var price = parseFloat(priceElement.innerText.replace('US$', ''))
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }
        total = Math.round(total * 100) / 100;


        document.getElementsByClassName('total-price')[0].innerText = 'US$' + total
    
}

function loadStorageCart() {
    if(cartList.length >= 1) {
        cartList.map(item => {
            var cartShopBox = document.createElement('div');
            cartShopBox.classList.add('cart-box');
            cartShopBox.id = item.id;
            var cartItems = document.getElementsByClassName('cart-content')[0];
            var cartBoxContent = `
                <img src="${(item.productImg)}" alt="" class="cart-img">
                <div class="detail-box">
                    <div class="cart-product-title">${item.title}</div>
                    <div class="cart-price">${item.price}</div>
                    <input type="number" value="1" class="cart-quantity">
                </div>
                <i class='bx bx-trash-alt cart-remove' ></i>`
        
            cartShopBox.innerHTML = cartBoxContent
            cartItems.append(cartShopBox)
            cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem)
            cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', removeCartItem)
        })

        updateTotal();
    }
}

loadStorageCart()