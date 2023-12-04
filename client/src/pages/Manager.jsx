import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Manager.css';

function Manager() {
  const [menuItems, setMenuItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [joinTable, setJoinTable] = useState([]);

  const [selectedingredientName, setSelectedIngredientName] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const ingredientIDs = [];

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMenuItemName, setSelectedMenuItemName] = useState('');
  const [selectedMenuItemIngredients, setSelectedMenuItemIngredients] = useState([]);
  const [selectedMenuItemPrice, setSelectedMenuItemPrice] = useState('');
  const menuItemIDs = [];

  const joinIDs = [];

  const [salesStart, setSalesStart] = useState('');
  const [salesEnd, setSalesEnd] = useState('');
  const [excessStart, setExcessStart] = useState('');

  useEffect(() => {
    fetch('https://project-3-09m-server.onrender.com/menu_item')
      .then(response => response.json())
      .then(data => setMenuItems(data.menu_item))
      .catch(error => console.error('Error:', error));

    fetch('https://project-3-09m-server.onrender.com/ingredient')
      .then(response => response.json())
      .then(data => setIngredients(data.ingredient))
      .catch(error => console.error('Error:', error));

    fetch('https://project-3-09m-server.onrender.com/ingredient_menu_item_join_table')
      .then(response => response.json())
      .then(data => setJoinTable(data.ingredient_menu_item_join_table))
      .catch(error => console.error('Error:', error));
  }, []);

  for(let i = 0; i < ingredients.length; i++){
    ingredientIDs.push(ingredients[i].id);
  }

  for(let i = 0; i < menuItems.length; i++){
    menuItemIDs.push(menuItems[i].id);
  }

  for(let i = 0; i < joinTable.length; i++) {
    joinIDs.push(joinTable[i].join_id)
  }

  //Refresh the ingredients table 
  const LoadIngredientTable = () => {
    fetch('https://project-3-09m-server.onrender.com/ingredient')
    .then(response => response.json())
    .then(data => setIngredients(data.ingredient))
    .catch(error => console.error('Error:', error));
  };

  //Refresh the menu item table
  const LoadMenuItemTable = () => {
    fetch('https://project-3-09m-server.onrender.com/menu_item')
    .then(response => response.json())
    .then(data => setMenuItems(data.menu_item))
    .catch(error => console.error('Error:', error));
  };

  const LoadJoinTable = () => {
    fetch('https://project-3-09m-server.onrender.com/ingredient_menu_item_join_table')
    .then(response => response.json())
    .then(data => setJoinTable(data.ingredient_menu_item_join_table))
    .catch(error => console.error('Error:', error));
  };

  function handleMenuItemAdd(name, usedIngredients, price) {
    try {
        // Input validation
        if (price < 0 || !Number.isFinite(parseFloat(price))) {
            console.log("Invalid inputs");
            return;
        }

        // Generate a new id and table values for a new menu item
        const id = Math.max(...menuItemIDs) + 1;
        menuItemIDs.push(id);

        const menuItemBody = JSON.stringify({ id, price, name });

        fetch('https://project-3-09m-server.onrender.com/menu_item', { // fetch('http://localhost:3000/menu_item', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: menuItemBody,
        })
        .then(response => response.json())
        .then(menuItemResponse => {
            LoadMenuItemTable();
            console.log(menuItemResponse);
            addItemIngredients(id, usedIngredients);
        })
        .catch(error => console.error('Error adding menu item:', error));
    } catch (err) {
        console.log("Error Message");
        console.log('Network error:', err.message);
    }
  }

  function handleMenuItemDelete(name) {
    try {
        // Find the menu item's id with the given name
        const menuItem = menuItems.find(item => item.name === name);

        if (!menuItem) {
            console.warn(`Menu item not found: ${name}`);
            return;
        }

        const menuItemId = menuItem.id;

        deleteItemIngredients(name, menuItemId);

        // Delete the menu item from the menu_item table
        fetch(`https://project-3-09m-server.onrender.com/menu_item/${menuItemId}`, { // fetch(`http://localhost:3000/menu_item/${menuItemId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (response.ok) {
                LoadMenuItemTable(); // Refresh the menu item table after deletion
                console.log(`Menu item deleted: ${name}`);
            } else {
                console.error(`Error deleting menu item: ${response.statusText}`);
            }
        })
        .catch(error => console.error('Error deleting menu item:', error));

    } catch (err) {
        console.log("Error Message");
        console.log('Network error:', err.message);
    }
  }

  function addItemIngredients(menuItemId, usedIngredients) {
    // Create an array to hold all the promises
    const promises = [];
  
    // Iterate through usedIngredients to get the ingredient IDs and add rows to join table
    usedIngredients.forEach(ingredientName => {
      const ingredient = ingredients.find(ingredient => ingredient.name === ingredientName);
  
      const join_id = Math.max(...joinIDs) + 1;
      joinIDs.push(join_id);
  
      if (ingredient) {
        const joinTableBody = JSON.stringify({
          join_id: join_id,
          ingredient_id: ingredient.id,
          menu_item_id: menuItemId,
          quantity: 1.0,
        });
  
        // Create a promise for each fetch operation
        const promise = fetch('https://project-3-09m-server.onrender.com/ingredient_menu_item_join_table', { // fetch('http://localhost:3000/ingredient_menu_item_join_table', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: joinTableBody,
        })
          .then(response => response.json())
          .then(response => {
            LoadJoinTable();
            console.log(response);
          })
          .catch(error => console.error('Error adding row to join table:', error));
  
        promises.push(promise);
      } else {
        console.warn(`Ingredient not found: ${ingredientName}`);
      }
    });
  
    // Return a promise that resolves when all fetch operations are complete
    return Promise.all(promises);
  }

  function deleteItemIngredients(name, menuItemId) {
    // Return a promise for the fetch operation
    return fetch(`https://project-3-09m-server.onrender.com/ingredient_menu_item_join_table/menu-item/${menuItemId}`, { // fetch(`http://localhost:3000/ingredient_menu_item_join_table/menu-item/${menuItemId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(response => {
        if (response.ok) {
          console.log(`Rows deleted from ingredient_menu_item_join_table for menu item: ${name}`);
        } else {
          console.error(`Error deleting rows from ingredient_menu_item_join_table: ${response.statusText}`);
        }
      })
      .catch(error => console.error('Error deleting rows from ingredient_menu_item_join_table:', error));
  }

  async function handleMenuItemUpdate(name, usedIngredients, price) {
    try {
      // Input validation
      if (price < 0 || !Number.isFinite(parseFloat(price))) {
          console.log("Invalid inputs");
          return;
      }
      
      const body = JSON.stringify({name, price});
      fetch('https://project-3-09m-server.onrender.com/menu_item', { // fetch('http://localhost:3000/menu_item', {
        method: "PUT",
        headers: {"Content-Type": "application/json" },
        body: body
      })
      .then(response => response.json())
      .then(response=> {
        console.log(response);
      })

      // Find the menu item's id with the given name
      const menuItem = menuItems.find(item => item.name === name);

      if (!menuItem) {
          console.warn(`Menu item not found: ${name}`);
          return;
      }

      const menuItemId = menuItem.id;

      await deleteItemIngredients(name, menuItemId);
      await addItemIngredients(menuItemId, usedIngredients);
      LoadMenuItemTable();
    } catch (err) {
        console.log("Error Message");
        console.log('Network error:', err.message);
    }
  }

  const handleMenuItemClick = (item) => {
    // Update the state to store the selected item
    setSelectedItem(item);
    setSelectedMenuItemName(item.name);

    // Filter the joinTable for the selected menu item id
    const selectedMenuItemJoinData = joinTable.filter(joinData => joinData.menu_item_id === item.id);

    // Extract ingredient names from the filtered joinTableData
    const selectedMenuItemIngredientNames = selectedMenuItemJoinData.map(joinData => {
      const ingredient = ingredients.find(ingredient => ingredient.id === joinData.ingredient_id);
      return ingredient ? ingredient.name : null;
    });

    // Remove null values (in case an ingredient was not found)
    const filteredIngredientNames = selectedMenuItemIngredientNames.filter(name => name !== null);

    // Update the state with the list of ingredient names
    setSelectedMenuItemIngredients(filteredIngredientNames);

    setSelectedMenuItemPrice(item.price);
  };

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    setSelectedMenuItemIngredients((prevIngredients) =>
    prevIngredients.includes(value)
        ? prevIngredients.filter((ingredient) => ingredient !== value)
        : [...prevIngredients, value]
    );
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
        LoadIngredientTable();
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
        LoadIngredientTable();
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
        LoadIngredientTable();
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
        LoadIngredientTable();
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
      <h2 className='Title'>Manager View</h2>
      <h3>Inventory</h3>
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
                <td>${ingredient.restock_price.toFixed(2)}</td>
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
            <div className="TextboxContainer">
              <label className="TextboxLabel" htmlFor="ingredientNameTextbox">Ingredient Name</label>
              <input
                id="ingredientNameTextbox"
                type="text"
                value={selectedingredientName}
                onChange={e => setSelectedIngredientName(e.target.value)}
              />
            </div>

          <div className="TextboxContainer">
            <label className="TextboxLabel" htmlFor="PriceTextbox">Price</label>
            <input
              id="PriceTextbox"
              type="text"
              value={selectedPrice}
              onChange={e => setSelectedPrice(e.target.value)}
            />
          </div>

          <div className="TextboxContainer">
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
      
      <h3>Menu</h3>
      <div className="ContentContainer">
        <div className="MenuItemsList">
          <label>Menu Items</label>
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

        <div className="CheckboxListContainer">
          <label>Ingredients</label>
          <div className="CheckboxList">
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
          <button onClick={handleMenuItemAdd.bind(this, selectedMenuItemName, selectedMenuItemIngredients, selectedMenuItemPrice)}>Add Menu Item</button>
          <button onClick={handleMenuItemUpdate.bind(this, selectedMenuItemName, selectedMenuItemIngredients, selectedMenuItemPrice)}>Update Menu Item</button>
          <button onClick={handleMenuItemDelete.bind(this, selectedMenuItemName)}>Delete Menu Item</button>
        </div>
      </div>
      
      <h3>Reports</h3>
      <div className="ContentContainer2">
        <div className="ButtonColumn">

          <div className="TextboxContainer">
            <label className="TextboxLabel">Start Date</label>
              <input
                id="salesStartTextbox"
                type="text"
                value={salesStart}
                onChange={e => setSalesStart(e.target.value)}
              />
          </div>
        
          <div className='TextboxContainer'>
            <label className="TextboxLabel">End Date</label>
              <input
                id="salesEndTextbox"
                type="text"
                value={salesEnd}
                onChange={e => setSalesEnd(e.target.value)}
              />
          </div>
          
          <button onClick={() => {
            if (!salesStart || !salesEnd) {
              alert("Please enter both start and end dates before viewing the sales report.");
            }
          }}
          title = "Given a time window, display the sales by menu item from the order history.">
            {(!salesStart || !salesEnd) ? (
              <span>Sales Report</span> /* Render a non-clickable span if conditions are not met */
            ) : (
              <Link
                className={location.pathname === "/sales-report" ? "active" : ""}
                to={{
                  pathname: "/sales-report",
                  search: `?start=${salesStart}&end=${salesEnd}`,
                }}
              >
                Sales Report
              </Link>
            )}
          </button>
        </div>
        
        <div className='ButtonColumn'>
          <div className='TextboxContainer'>
            <label className="TextboxLabel">Start Date</label>
            <input
              id="excessTextbox"
              type="text"
              value={excessStart}
              onChange={e => setExcessStart(e.target.value)}
            />
          </div>
          
          <button onClick={() => {
            if (!excessStart) {
              alert("Please enter the start date before viewing the excess report.");
            }
            }}
            title = "Given a timestamp, display the list of inventory items that only sold less than 10% of their inventory between the timestamp and the current time, assuming no restocks have happened during the window.">
            {(!excessStart) ? (
              <span>Excess Report</span> /* Render a non-clickable span if condition is not met */
            ) : (
              <Link
                className={location.pathname === "/excess-report" ? "active" : ""}
                to={{
                  pathname: "/excess-report",
                  search: `?start=${excessStart}`,
                }}
              >
                Excess Report
              </Link>
            )}
          </button>
        </div>
        
        <div className='ButtonColumn'>
          <button onClick={ e =>{ console.log("Restock Report Button clicked!");}}
            title="Display the list of inventory items whose current inventory is less than the inventory item's minimum amount to have around before needing to restock."> 
            <Link className={((location.pathname === "/restock-report")? "active":"" )} to="/restock-report">Restock Report</Link>
          </button>
        </div>
        
      </div>
      
    </div>
  );
}

export default Manager;