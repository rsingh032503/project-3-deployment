import React, { useState, useEffect } from 'react';
import '../styles/Cart.css';

import { Link, useLocation } from 'react-router-dom';
function Cart(){
    const [menuItems, setMenuItems] = useState([]);
    let [loading, setLoading] = useState(true);
    let [cart, setCart] = useState([])

    useEffect(()=> {
        fetch('https://project-3-09m-server.onrender.com/menu_item')
            .then(response => response.json())
            .then(data => setMenuItems(data.menu_item))
            .then(setLoading(false))
            .catch(error => console.error('Error:', error));
    },[]);

    if(loading){
        return(
            <div>
                <p>Loading...</p>
            </div>
        );
    }
    else{
        const location = useLocation();

        function handleCheckout() {
            const name = prompt("Please enter the customer's name:");
            const email = prompt("Please enter the customer's email:");
          
            if (name && email) {
                const customer = { name, email };
                submitOrder(cart, customer);
            } else {
                alert("Please enter the customer's name and email to proceed with the checkout.");
            }
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
                setCart([]); // Clear the order summary
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }

        function removeFromCart(item){
            
        }



        return(
            <div>
                <h2>Items:</h2>
                <tbody>
                    {cart.map((item) => {
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{"x" + item.quantity}</td>
                            <td><button onClick={removeFromCart(item)}>X</button></td>
                        </tr>   
                    })}
                </tbody>
                <button onClick={handleCheckout}>Check Out</button>
            </div>
        );
    }
}