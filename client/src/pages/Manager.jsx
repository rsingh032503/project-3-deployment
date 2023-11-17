import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Manager.css';

function Manager() {
  const [menuItems, setMenuItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [selectedingredientName, setSelectedIngredientName] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const ingredientIDs = [];

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMenuItemName, setSelectedMenuItemName] = useState('');
  const [selectedMenuItemIngredients, setSelectedMenuItemIngredients] = useState([]);
  const [selectedMenuItemPrice, setSelectedMenuItemPrice] = useState('');

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

  for(let i = 0; i < ingredients.length; i++){
    ingredientIDs.push(ingredients[i].id);
  }

  const handleMenuItemDelete = async (name) => {
    axios
    .delete(`https://project-3-09m-server.onrender.com/menu_item/${name}`)
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

  //Creates a new ingredient when the add ingredient button is pressed
  function handleIngredientItemAdd(name, price, quantity) {
    try{
      //Input validation
      if(price < 0 || quantity < 0 || !Number.isInteger(parseInt(quantity)) || !Number.isFinite(parseFloat(price))){
        console.log(typeof quantity);
        console.log("Invalid inputs");
        return;
      }
      //Generate a new id and table values for a new ingredient
      const id = Math.max(...ingredientIDs) + 1;
      ingredientIDs.push(id);
      const threshold = 50;
      const body = JSON.stringify({id, quantity, price, name, threshold});

      fetch('https://project-3-09m-server.onrender.com/ingredient', {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: body
      })
      .then(response => response.json())
      .then(response=> {
        console.log(response);
      })
    }
    catch(err){
      console.log("Error Message");
      console.log('Network error:', err.message);
    }
  }

  //Deletes ingredient (name) after the select ingredient button is clicked
  function handleIngredientItemDelete(name) {
    try{
      //Generate a new id and table values for a new ingredient
      const body = JSON.stringify({name});
      fetch('https://project-3-09m-server.onrender.com/ingredient', {
        method: "DELETE",
        headers: {"Content-Type": "application/json" },
        body: body
      })
      .then(response => response.json())
      .then(response=> {
        console.log(response);
      })
    }
    catch(err){
      console.log("Error Message");
      console.log('Network error:', err.message);
    }
  }

  //Updates the ingredient "name" with new values price and quantity
  function handleIngredientItemUpdate(price, quantity, name) {
    try{

      //Input validation
      if(price < 0 || quantity < 0 || !Number.isInteger(parseInt(quantity)) || !Number.isFinite(parseFloat(price))){
        console.log(typeof quantity);
        console.log("Invalid inputs");
        return;
      }

      //Generate a new id and table values for a new ingredient
      const body = JSON.stringify({price, quantity, name});
      fetch('https://project-3-09m-server.onrender.com/ingredient', {
        method: "PUT",
        headers: {"Content-Type": "application/json" },
        body: body
      })
      .then(response => response.json())
      .then(response=> {
        console.log(response);
      })
    }
    catch(err){
      console.log("Error Message");
      console.log('Network error:', err.message);
    }
  }

  //Restocks the ingredient "name" when the restock button is clicked
  function handleIngredientItemRestock(quantity, name) {
    try{
      //Generate a new id and table values for a new ingredient
      const body = JSON.stringify({quantity, name});
      fetch('https://project-3-09m-server.onrender.com/ingredient', {
        method: "PUT",
        headers: {"Content-Type": "application/json" },
        body: body
      })
      .then(response => response.json())
      .then(response=> {
        console.log(response);
      })
    }
    catch(err){
      console.log("Error Message");
      console.log('Network error:', err.message);
    }
  }


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
          <button onClick={handleIngredientItemRestock.bind(this, selectedQuantity, selectedingredientName)}>Restock Ingredient</button>
          <button onClick={handleIngredientItemAdd.bind(this, selectedingredientName, selectedPrice, selectedQuantity)}>Add Ingredient</button>
          <button onClick={handleIngredientItemUpdate.bind(this, selectedPrice, selectedQuantity, selectedingredientName)}>Update Ingredient</button>
          <button onClick={handleIngredientItemDelete.bind(this, selectedingredientName)}>Delete Ingredient</button>
        </div>

        <div className="ingredientColumn">
            <div className="ingredientTextboxes">
              <label className="TextboxLabel" htmlFor="ingredientNameTextbox">Ingredient Name</label>
              <input
                id="ingredientNameTextbox"
                type="text"
                value={selectedingredientName}
                onChange={e => setSelectedIngredientName(e.target.value)}
              />
            </div>

          <div className="PriceTextboxes">
            <label className="TextboxLabel" htmlFor="PriceTextbox">Price</label>
            <input
              id="PriceTextbox"
              type="text"
              value={selectedPrice}
              onChange={e => setSelectedPrice(e.target.value)}
            />
          </div>

          <div className="QuantityTextboxes">
            <label className="TextboxLabel" htmlFor="QuantityTextboxes">Quantity</label>
            <input
              id="QuantityTextbox"
              type="text"
              value={selectedQuantity}
              onChange={e => setSelectedQuantity(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="ContentContainer">
        <div className="MenuItemsList">
          <h3>Menu Items</h3>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id} onClick={() => handleMenuItemClick(item)} className={selectedItem === item ? 'selected' : ''}
              >{item.name}</li>
            ))}
          </ul>
        </div>
        
        <div className="TextboxContainer">
          <label className="TextboxLabel">Name</label>
          <input
            id="menuItemTextbox"
            type="text"
            value={selectedMenuItemName}
            onChange={e => setSelectedMenuItemName(e.target.value)}
          />
        </div>

        <div className="CheckboxList">
          <label>Ingredients</label>
          {ingredients.map((ingredient) => (
            <label key={ingredient.id} className="CheckboxLabel">
              <input
                type="checkbox"
                value={ingredient.name}
                checked={selectedMenuItemIngredients.includes(ingredient.name)}
                onChange={handleCheckboxChange}
              />
              {ingredient.name}
            </label>
          ))}
        </div>

        <div className="TextboxContainer">
          <label className="TextboxLabel">Price</label>
          <input
            id="menuItemPriceTextbox"
            type="text"
            value={selectedMenuItemPrice}
            onChange={e => setSelectedMenuItemPrice(e.target.value)}
          />
        </div>

        <div className="ButtonColumn">
          <button>Add Menu Item</button>
          <button>Update Menu Item</button>
          <button onClick={handleMenuItemDelete.bind(this,menuItems.name)}>Delete Menu Item</button>
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