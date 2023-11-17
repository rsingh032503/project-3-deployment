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
        //console.log(item_id);
        let ingredients = "";
        let item_ingredients = menu_ingredient_join.filter( (join) => (join.menu_item_id == (item_id + 1)));
        //console.log(item_ingredients);
        for(let i = 0; i < item_ingredients.length; i++){
            let join = item_ingredients[i];
            //console.log(join);
            //console.log(join.ingredient_id);
            if(i == item_ingredients.length - 1){
                ingredients += "" + join.ingredient_id.toString();
            }
            else{
                ingredients += "" + join.ingredient_id.toString() + ',';
            }
        }
        return ingredients;
    }

    for(let item of menuItems){
        item["ingredients"] = traverseToPage(item.id-1);
    }
    
    return (
        <div>
          <h2 className='Title'>Customer View</h2>
          <h3 className='DrinkTitle'>Drinks:</h3>
          <div className="grid">
            {menuItems.map((item,index) => (
                <Link className="itemLink" key={item.id} to="/item" state={item}>
                    <button className="item">   
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