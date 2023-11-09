import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Manager.css';

function Manager() {
  const [menuItems, setMenuItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch('https://project-3-09m-server.onrender.com/menu_item')
      .then(response => response.json())
      .then(data => setMenuItems(data.menu_item))
      .catch(error => console.error('Error:', error));
    
    fetch('https://project-3-09m-server.onrender.com/ingredient')
      .then(response => response.json())
      .then(data => setIngredients(data.ingredient))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleMenuItemDelete = (name) => {
    axios
    .delete(`/menu_item/${name}`)
    .then((response) => {
      if (response.status === 200) {
        // If the deletion is successful, update the state to reflect the changes
        const updatedItems = menuItems.filter(item => item.name !== name);
        setMenuItems(updatedItems);
      } else {
        console.error('Error deleting menu item');
      }
    })
    .catch((error) => {
      console.error('Error deleting menu item:', error);
    });
  };


  return (
    <div>
      <h2>Manager</h2>
      <div className="ContentContainer">
        <table className="ingredientsTable">
          <thead>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr key={ingredient.id}>
                <td>{ingredient.name}</td>
                <td>${ingredient.restock_price}</td>
                <td>{ingredient.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ButtonColumn">
          <button>Restock Ingredient</button>
          <button>Add Ingredient</button>
          <button>Update Ingredient</button>
          <button>Delete Ingredient</button>
        </div>
      </div>
      
      <div className="ContentContainer">
        <div className="MenuItemsList">
          <h3>Menu Items</h3>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>

        <div className="ButtonColumn">
          <button>Add Menu Item</button>
          <button>Update Menu Item</button>
          <button onClick={handleMenuItemDelete(menuItems.name)}>Delete Menu Item</button>
        </div>
      </div>

      <div className="ReportButtons">
        <button>Sales Report</button>
        <button>Excess Report</button>
        <button>Restock Report</button>
      </div>
      
    </div>
  );
}

export default Manager;