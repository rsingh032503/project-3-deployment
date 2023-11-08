import React, { useState, useEffect } from 'react';
import '../styles/Customer.css';
import { images } from '../images.js';
import { Link } from 'react-router-dom';

function Customer() {
    const [menuItems, setMenuItems] = useState([]);
    const [orderSummary, setOrderSummary] = useState([]);
    
    useEffect(() => {
        fetch('https://project-3-09m-server.onrender.com/menu_item')
            .then(response => response.json())
            .then(data => setMenuItems(data.menu_item))
            .catch(error => console.error('Error:', error));
    }, []);
    console.log(menuItems);

    function traverseToPage(item_id){
        sessionStorage.setItem("Current_Item",item_id);
    }
    
    return (
        <div>
          <h2>Customer View</h2>
          <h3>Drinks:</h3>
          <div className="grid">
            {menuItems.map((item,index) => (
                <Link key={item.id} to="/item" > 
                    <button className="item" onClick={traverseToPage(index)}>
                        <img src={images[item.name]} alt={item.name + " image"}/>
                        <p>{item.name}</p>
                        <p>${item.price}</p>
                    </button>
                </Link>
            ))}
          </div>
        </div>
    );
}

export default Customer;