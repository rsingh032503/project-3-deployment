import React, {useState} from 'react';
import axios from 'axios';
import '../styles/Manager.css';

function Manager() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    // Add more items as needed
  ]);
  const [ingredients, setIngredients] = useState([
    {id: 1, name: 'Ingredient 1', price: 0.49, quantity: 500},
    {id: 2, name: 'Ingredient 2', price: 0.36, quantity: 750}
  ])

  const handleMenuItemDelete = (name) => {
    axios
    .delete(`/menu_item/${name}`)
    .then((response) => {
      if (response.status === 200) {
        // If the deletion is successful, update the state to reflect the changes
        const updatedItems = items.filter(item => item.name !== name);
        setItems(updatedItems);
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
                <td>${ingredient.price}</td>
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
            {items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>

        <div className="ButtonColumn">
          <button>Add Menu Item</button>
          <button>Update Menu Item</button>
          <button onClick={handleMenuItemDelete(items.name)}>Delete Menu Items</button>
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