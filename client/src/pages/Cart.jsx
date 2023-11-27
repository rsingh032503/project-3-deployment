import React, { useState, useEffect } from 'react';
import '../styles/Cart.css';
import { getCart, removeFromCart, clearCart } from '../cart';

import { Link, useLocation } from 'react-router-dom';
function Cart(){
    const [menuItems, setMenuItems] = useState([]);
    let [loading, setLoading] = useState(true);
    let [cart, setCart] = useState([]);
    let [quantity, setQuantity] = useState([]);

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
        let [cart,quantity] = getCart();

        function handleCheckout() {
            const name = prompt("Please enter the customer's name:");
            const email = prompt("Please enter the customer's email:");
          
            if (name && email) {
                for(let i = 0; i < quantity.length(); i++){
                    for(let j = 1; j < quantity[i]; j++){
                        cart.push(cart[i]);
                    }
                }
                const customer = { name, email };
                submitOrder(cart, customer);
            } else {
                alert("Please enter the customer's name and email to proceed with the checkout.");
            }
            clearCart();
            setCart([]);
            setQuantity([]);
        }

        function submitOrder(items, customer) {
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
                [cart,quantity] = getCart();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
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
                                    <td><button onClick={removeFromCart.bind(this,item)}>X</button></td>
                                </tr>   
                            </div>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleCheckout.bind(this)}>Check Out</button>
            </div>
        );
    }
}

export default Cart;