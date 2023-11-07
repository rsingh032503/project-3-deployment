import React, { useState, useEffect } from 'react';
import '../styles/Customer.css';
import { images } from '../images.js';

function Customer() {
    const [menuItems, setMenuItems] = useState([]);
    const [orderSummary, setOrderSummary] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:3000/menu_item')
        .then(response => response.json())
        .then(data => setMenuItems(data.menu_item))
        .catch(error => console.error('Error:', error));
    }, []);

  return (
    <div>
      <h2>Customer View</h2>
      <h3>Drinks:</h3>
      <div className="grid">
        {menuItems.map((item,index) => (
            <a key={item.id} href=""> 
                <button className="item" href="">
                    <img src={images[item.name]} alt={item.name + " image"}/>
                    <p>{item.name}</p>
                    <p>${item.price}</p>
                </button>
            </a>
        ))}
      </div>
    </div>
  );
}

export default Customer;