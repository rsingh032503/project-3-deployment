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



        return(
            <div>
                <div className="column">
                    <h2>Items:</h2>
                    <tbody>
                        {cart.map((item) => {
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{"x" + item.quantity}</td>
                            </tr>   
                        })}
                    </tbody>
                </div>
                <div className="column">

                </div>

            </div>
        );
    }
}