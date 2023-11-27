import React, { useState, useEffect } from 'react';
import '../styles/Cart.css';
import { getCart, removeFromCart, clearCart, getSubmitable, getTotal } from '../cart';

import { Link, useLocation } from 'react-router-dom';
function Cart(){
    const [menuItems, setMenuItems] = useState([]);
    let [loading, setLoading] = useState(true);
    let [cart, setCart] = useState([]);
    let [cart_loaded, setCartLoaded] = useState(false);
    let [quantity, setQuantity] = useState([]);
    let [quant_loaded, setQuantLoaded] = useState(false);

    useEffect(()=> {
        fetch('https://project-3-09m-server.onrender.com/menu_item')
            .then(response => response.json())
            .then(data => setMenuItems(data.menu_item))
            .then(setLoading(false))
            .catch(error => console.error('Error:', error));
    },[]);



    const location = useLocation();

    if(loading){
        return(
            <div>
                <p>Loading...</p>
            </div>
        );
    }
    else{
        if(!cart_loaded){
            setCart(getCart()[0]);
            setCartLoaded(true);
        }
        if(!quant_loaded){
            setQuantity(getCart()[1]);
            setQuantLoaded(true);
        }
        
        

        const handleCheckout = () => {
            const name = prompt("Please enter the customer's name:");
            const email = prompt("Please enter the customer's email:");
          
            if (name && email) {
                let submit = getSubmitable();
                const customer = { name, email };
                submitOrder(submit, customer);
            } else {
                alert("Please enter the customer's name and email to proceed with the checkout.");
            }
            clearCart();
            setCart([]);
            setQuantity([]);
        }

        const submitOrder = (items, customer) => {
            fetch('https://project-3-09m-server.onrender.com/submitOrder', {
            // fetch('http://localhost:3000/submitOrder', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items, customer }),
            })
            .then(response => response.json())
            .then(data => {
                alert('Order submitted successfully');
                clearCart(); // Clear the order summary
                setCart([]);
                setQuantity([]);
                setCartLoaded(false);
                setQuantLoaded(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }

        const removeItem = (item) => {
            let index = cart.indexOf(item);
            if(index < 0){
                console.error("item does not exist: ", item);
                return;
            }
            removeFromCart(cart[index]);
            //setCart(getCart[0]);
            //setQuantity(getCart[1]);
            setCartLoaded(false);
            setQuantLoaded(false);
            /*
            if(quantity[index] > 1){
                //quantity[index];
            }
            else{
                //quantity.splice(index,1);
                //cart.splice(index,1);
            }*/
            
        }

        console.log(cart);
        console.log(quantity);

        return(
            <div>
                <h2>Items:</h2>
                <table>
                    <tbody>
                        {cart.map((item) => (
                            <div>
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>${item.price}</td>
                                    <td>{"x" + quantity[cart.indexOf(item)]}</td>
                                    <td><button onClick={ removeItem.bind(this,item)}>X</button></td>
                                </tr>   
                            </div>
                        ))}
                        <tr key="total">
                            <td>Total:</td>
                            <td>${getTotal()}</td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={() => handleCheckout()}>Check Out</button>
            </div>
        );
    }
}

export default Cart;