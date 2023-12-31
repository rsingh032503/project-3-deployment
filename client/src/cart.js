/**
 * @module CartFunctions
 * @description A module containing functions for managing a shopping cart.
 */

/**
 * The shopping cart.
 * @type {Array<Object>}
 */
let cart = [];

/**
 * The quantities of items in the cart.
 * @type {Array<number>}
 */
let quantity = [];

/**
 * The IDs of items in the cart.
 * @type {Array<number>}
 */
let ids = [];

/**
 * The total size of the cart.
 * @type {number}
 */
let size = 0;

/**
 * Adds an item to the shopping cart.
 * @param {Object} obj - The item to add to the cart.
 * @param {number} obj.id - The ID of the item.
 * @param {string} obj.name - The name of the item.
 * @param {number} obj.price - The price of the item.
 * @param {number} obj.quantity - The quantity of the item.
 */
export const addToCart = (obj) => {
    let index = ids.indexOf(obj.id); 
    if(index !== -1){
        quantity[index] += 1;
    }
    else{
        cart.push(obj);
        quantity.push(1);
        ids.push(obj.id);
    }
    size++;
    console.log("added item to cart: ",obj);
};

/**
 * Gets the contents of the shopping cart.
 * @returns {Array<Array<Object>>} An array containing the cart items and their quantities.
 */
export const getCart = () => {
    return [cart, quantity];
};

/**
 * Removes an item from the shopping cart.
 * @param {Object} item - The item to remove from the cart.
 * @param {number} item.id - The ID of the item.
 * @param {string} item.name - The name of the item.
 * @param {number} item.price - The price of the item.
 * @param {number} item.quantity - The quantity of the item.
 */
export const removeFromCart = (item) => {
    let index = ids.indexOf(item.id);
    if(quantity[index] > 1){
        quantity[index]--;
        console.log("decreases quantity of item: ", item);
    }
    else if (quantity[index] === 1){
        cart.splice(index, 1);
        quantity.splice(index, 1);
        ids.splice(index, 1);
        console.log("removed item from cart: ", item);
    }
    else{
        console.error("could not remove item from cart: ", item);
        return;
    }
    size--;
};

/**
 * Gets the total size of the shopping cart.
 * @returns {number} The total size of the cart.
 */
export const getCartSize = () => {
    return size;
};

/**
 * Clears the shopping cart.
 */
export const clearCart = () => {
    console.warn("clearing the cart");
    cart = [];
    quantity = [];
    ids = [];
    size = 0;
};

/**
 * Gets an array of items that are ready for submission.
 * @returns {Array<Object>} An array of items to be submitted.
 */
export const getSubmitable = () => {
    let ret = [];
    for(let i = 0 ; i < cart.length; i++){
        for(let j = 0; j < quantity[i]; j++){
            ret.push(cart[i]);
        }
    }
    return ret;
};

/**
 * Gets the total cost of the items in the shopping cart.
 * @returns {number} The total cost of the items in the cart.
 */
export const getTotal = () => {
    let total = 0.0;
    for(let i = 0 ; i < cart.length; i++){
        total += (cart[i].price * quantity[i]);
    }
    return total;
};
