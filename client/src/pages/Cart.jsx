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
                

            </div>
        );
    }
}