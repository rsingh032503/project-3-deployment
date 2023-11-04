import React, {useState} from 'react';
import axios from 'axios';
import '../styles/Manager.css';

function Manager() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    // Add more items as needed
  ]);

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
      <h2>Manager View</h2>
      <p></p>
      <button className="deleteMenuItemButton" onClick={handleMenuItemDelete(items.name)}>Delete Menu Items</button>
    </div>
  );
}

export default Manager;