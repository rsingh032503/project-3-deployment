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

  function handleCheckout() {
    const name = prompt("Please enter your name:");
    const email = prompt("Please enter your email:");
  
    if (name && email) {
      const customer = { name, email };
      submitOrder(orderSummary, customer);
    } else {
      alert("Please enter your name and email to proceed with the checkout.");
    }
  }

  function submitOrder(items, customer) {
    fetch('https://project-3-09m-server.onrender.com/submitOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, customer }),
    })
    .then(response => response.json())
    .then(data => {
      alert('Order submitted successfully');
      setOrderSummary([]); // Clear the order summary
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <div>
      <h2>Cashier View</h2>
      <div className="column">
        <h3>Order Summary</h3>
        {orderSummary.map((item, index) => (
          <div key={index} className="orderItem">
            <p>{item.name} - ${item.price}</p>
            <button onClick={() => removeFromOrder(index)}>Remove</button>
          </div>
        ))}
      </div>
        <div className="column">
            <div id="cashierMenuItems">
                <h3>Menu Items</h3>
                <div className="items">
                    {menuItems.map(item => (
                        <button key={item.id} onClick={() => addToOrder(item)}>
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    </div>
  );
}

export default Cashier;