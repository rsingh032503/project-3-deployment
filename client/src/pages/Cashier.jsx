import React, { useState, useEffect } from 'react';
import '../styles/Cashier.css';

/**
 * React component representing a cashier view for managing orders.
 * @component
 */
function Cashier() {
  /**
   * State variable for storing menu items fetched from the server.
   * @type {Array}
   */
  const [menuItems, setMenuItems] = useState([]);

  /**
   * State variable for maintaining the order summary.
   * @type {Array}
   */
  const [orderSummary, setOrderSummary] = useState([]);

   /**
   * Fetches menu items from the server and updates the state.
   * @function
   * @memberof Cashier
   * @name useEffect
   * @inner
   */
  useEffect(() => {
    fetch('https://project-3-09m-server.onrender.com/menu_item')
    // fetch('http://localhost:3000/menu_item')
      .then(response => response.json())
      .then(data => setMenuItems(data.menu_item))
      .catch(error => console.error('Error:', error));
  }, []);

  /**
   * Adds an item to the order summary.
   * @function
   * @memberof Cashier
   * @name addToOrder
   * @param {Object} item - The menu item to be added to the order.
   */
  function addToOrder(item) {
    setOrderSummary(prevOrder => [...prevOrder, item]);
  }

  /**
   * Removes an item from the order summary based on its index.
   * @function
   * @memberof Cashier
   * @name removeFromOrder
   * @param {number} index - The index of the item to be removed.
   */
  function removeFromOrder(index) {
    setOrderSummary(prevOrder => prevOrder.filter((item, i) => i !== index));
  }

  /**
   * Removes an item from the order summary based on its index.
   * @function
   * @memberof Cashier
   * @name removeFromOrder
   * @param {number} index - The index of the item to be removed.
   */
  function handleCheckout() {
    const name = prompt("Please enter the customer's name:");
    const email = prompt("Please enter the customer's email:");
    let notes = "";
    if (name && email) {
      notes = prompt("Please enter any additional notes for the order (leave blank if none):");
      const customer = { name, email };
      submitOrder(orderSummary, customer);
    } else {
      alert("Please enter the customer's name and email to proceed with the checkout.");
    }
  }

  /**
   * Submits the order by sending a POST request to the server.
   * @function
   * @memberof Cashier
   * @name submitOrder
   * @param {Array} items - The items to be submitted.
   * @param {Object} customer - The customer information.
   */
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
      setOrderSummary([]); // Clear the order summary
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

   /**
   * Renders the Cashier component with order summary, menu items, and checkout button.
   * @returns {JSX.Element} JSX representation of the Cashier component.
   */
  return (
    <div>
        <h2 className='Title'>Cashier View</h2>
        <div className="column">
            <h3>Order Summary</h3>
            <div className="order_items">
                {orderSummary.map((item, index) => (
                    <div key={index} className="orderItem">
                        <p>{item.name} - ${item.price}</p>
                        <button onClick={() => removeFromOrder(index)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
        <div className="column">
          <h3>Menu Items</h3>
            <div id="cashierMenuItems">
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