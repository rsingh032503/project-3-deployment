import React, {useState} from 'react';
import '../styles/Cashier.css';

function Cashier() {
  const [items] = useState([
    { id: 1, name: 'Item 1', price: 4.99},
    { id: 2, name: 'Item 2', price: 5.99},
    { id: 3, name: 'Item 3', price: 6.99},
    // Add more items as needed
  ]);
  const [orders] = useState([
    { id: 1, name: 'Item 1', price: 4.99},
    { id: 3, name: 'Item 3', price: 6.99},
    // Add more items as needed
  ]);

  return (
    <div>
      <h2>Cashier</h2>
      <div className="ContentContainer">
        <div className="MenuItemsList">
          <h3>Order List</h3>
          <ul>
            {orders.map((order) => (
              <li key={order.id}>{order.name} - ${order.price}</li>
            ))}
          </ul>
        </div>
      
        <div className="item-grid">
          {items.map((item) => (
            <button key={item.id}>
              {item.name} - ${item.price}
            </button>
          ))}
        </div>
      </div>

      <div className="OrderButtons">
        <button>Checkout</button>
        <button>Clear</button>
      </div>
      
    </div>
  );
}

export default Cashier;