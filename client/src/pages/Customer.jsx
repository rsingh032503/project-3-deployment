import React, { useState, useEffect } from 'react';
import '../styles/Customer.css';
import { images } from '../images.js';
import { Link } from 'react-router-dom';

function Customer() {
    const [menuItems, setMenuItems] = useState([]);
    const [menu_ingredient_join, setJoin] = useState([]);
    const [orderSummary, setOrderSummary] = useState([]);
    
    useEffect(() => {
        fetch('https://project-3-09m-server.onrender.com/menu_item')
            .then(response => response.json())
            .then(data => setMenuItems(data.menu_item))
            .catch(error => console.error('Error:', error));
        fetch('https://project-3-09m-server.onrender.com/ingredient_menu_item_join_table')
            .then(response => response.json())
            .then(data => setJoin(data.ingredient_menu_item_join_table))
            .catch(error => console.error("Error: ", error));
    }, []);
    
    

    function traverseToPage(item_id){
        let ingredients = "";
        let item_ingredients = menu_ingredient_join.filter( (join) => (join.menu_item_id == (item_id + 1)));
        for(let i = 0; i < item_ingredients.length; i++){
            let join = item_ingredients[i];
            if(i == item_ingredients.length - 1){
                ingredients += join.ingedient_id;
            }
            else{
                ingredients += join.ingedient_id + ',';
            }
        }
        sessionStorage.setItem("Current_Item_Ingredients",ingredients);
        sessionStorage.setItem("Current_Item",item_id);
    }
    
    return (
        <div>
          <h2>Customer View</h2>
          <h3>Drinks:</h3>
          <div className="grid">
            {menuItems.map((item,index) => (
                <Link key={item.id} to="/item" > 
                    <button className="item" onClick={traverseToPage(index)}>
                        <img src={images[item.name]} alt={item.name + " image"}/>
                        <p>{item.name}</p>
                        <p>${item.price}</p>
                    </button>
                </Link>
            ))}
          </div>
        </div>
    );
}

export default Customer;