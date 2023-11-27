let cart = [];
let quantity = [];

export const addToCart = (obj) => {
    let index = cart.indexOf(obj); 
    if(index != -1){
        quantity[index] += 1;
    }
    else{
        cart.push(obj);
        quantity.push(1);
    }
    console.log("added item to cart: ",obj);
}

export const getCart = () => {
    return [cart,quantity];
}

export const removeFromCart = (item) => {
    let index = cart.indexOf(item);
    if(quantity[index] > 1){
        quantity[index] -= 1;
    }
    else if (index == 1){
        cart.splice(index,1);
        quantity.splice(index,1);
    }
    else{
        console.error("could not remove item from cart: ", item);
        return;
    }
    console.log("added item to cart: ",item);
}

export const getCartSize = () => {
    return cart.length;
}

export const clearCart = () => {
    cart = [];
    quantity = [];
}

