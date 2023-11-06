import React, { useState, useEffect } from 'react';

function Cashier() {
  const [menuItems, setMenuItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/menu_item')
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
      <div>
        <h3>Order Summary</h3>
        {orderSummary.map((item, index) => (
          <div key={index}>
            <p>{item.name}${item.price}    
              <button onClick={() => removeFromOrder(index)}>Remove</button>
            </p>
          </div>
        ))}
      </div>
      <div>
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