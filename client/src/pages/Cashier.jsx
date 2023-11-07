import React, { useState, useEffect } from 'react';
import '../styles/Cashier.css';

function Cashier() {
  const [menuItems, setMenuItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState([]);

  useEffect(() => {
    fetch('https://project-3-09m-server.onrender.com/menu_item')
      .then(response => response.json())
      .then(data => setMenuItems(data.menu_item))
      .catch(error => console.error('Error:', error));
  }, []);

  function addToOrder(item) {
    setOrderSummary(prevOrder => [...prevOrder, item]);
  }

  function removeFromOrder(index) {
    setOrderSummary(prevOrder => prevOrder.filter((item, i) => i !== index));
  }

  return (
    <div>
      <h2>Cashier View</h2>
      <div class="column">
        <h3>Order Summary</h3>
        {orderSummary.map((item, index) => (
          <div key={index} className="orderItem">
            <p>{item.name} - ${item.price}</p>
            <button onClick={() => removeFromOrder(index)}>Remove</button>
          </div>
        ))}
      </div>
      <div class="column">
        <h3>Menu Items</h3>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => addToOrder(item)}>
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Cashier;