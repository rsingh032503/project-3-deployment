let cart = [];
let quantity = [];
let ids = [];
let size = 0;

export const addToCart = (obj) => {

    let index = ids.indexOf(obj.id); 
    if(index != -1){
        quantity[index] += 1;
    }
    else{
        cart.push(obj);
        quantity.push(1);
        ids.push(obj.id);
    }
    size++;
    console.log("added item to cart: ",obj);
}

export const getCart = () => {
    return [cart,quantity];
}

export const removeFromCart = (item) => {
    let index = ids.indexOf(item.id);
    if(quantity[index] > 1){
        quantity[index] -= 1;
    }
    else if (index == 1){
        cart.splice(index,1);
        quantity.splice(index,1);
        ids.splice(index,1);
    }
    else{
        console.error("could not remove item from cart: ", item);
        return;
    }
    size--;
    console.log("removed item to cart: ",item);
}

export const getCartSize = () => {
    return size;
}

export const clearCart = () => {
    cart = [];
    quantity = [];
    ids = [];
    size = 0;
}

