import React, { useState, useEffect } from 'react';
import '../styles/item.css';
import { images } from '../images.js';
import { Link } from 'react-router-dom';

function Item(){
    const [menuItems, setMenuItems] = useState([]);
    let [ingredients, setIngredients] = useState([]);
    const [ingredient_item_join,setJoin] = useState([]);
    let [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetch('https://project-3-09m-server.onrender.com/menu_item')
            .then(response => response.json())
            .then(data => setMenuItems(data.menu_item))
            .catch(error => console.error('Error:', error));
        fetch('https://project-3-09m-server.onrender.com/ingredient_menu_item_join_table')
            .then(response => response.json())
            .then(data => setJoin(data.ingredient_menu_item_join_table))
            .catch(error => console.error("Error: ", error));
        fetch('https://project-3-09m-server.onrender.com/ingredient')
            .then(response => response.json())
            .then(data => setIngredients(data.ingredient))
            .then(setLoading(false))
            .catch(error => console.error('Error:', error));
        
    }, []);
    
    //console.log(loading)
    if(loading || menuItems.length == 0 || ingredients.length == 0 || ingredient_item_join.length == 0){
        return(
            <div>
                <p>Loading...</p>
            </div>
        )
    }
    else{
        //console.log(menuItems);
        let current_item = null;
        let current_item_ingredients = [];
        let ingredient_ids = sessionStorage.getItem("Current_Item_Ingredients").split(',');
        ingredient_ids.map((str) => parseInt(str));
        for(let ingredient of ingredients){
            if(ingredient.id in ingredient_ids){
                console.log(ingredient);
                current_item_ingredients.push(ingredient);
            }
        }
        for(let join of ingredient_item_join){
            if(join.ingredient_id in ingredient_ids){
                let index = -1;
                for(let i = 0; i < current_item_ingredients.length; i++){
                    if(current_item_ingredients[i].id == join.ingredient_id){
                        current_item_ingredients[i].quantity = parseFloat(join.quantity);
                    }
                }
                
            }
        }
        console.log(current_item_ingredients);

        current_item = parseInt(sessionStorage.getItem("Current_Item"));
        if(!current_item){
            return(
                <div>
                    <p>There is no menu item selected. Please select one from the customer page</p>
                    <Link to="/customer">Customer Page</Link>
                </div>
            )
        }
        else{
            //console.log(current_item);
            //console.log(typeof(current_item));
            let menu_item = menuItems[current_item];
            //console.log(menu_item);

            return (
                <div>
                    <h1>{menu_item.name}</h1>
                    <div className="column">
                        <img src={images[menu_item.name]} alt={menu_item.name + " image"}/>
                    </div>
                    <div className="column">
                        <h3>Price: ${menu_item.price}</h3>
                        <h3>Ingredients</h3>
                        <table>
                            <thead>
                                <tr>
                                    <td>{'Ingredient'}</td>
                                    <td>{'Quantity'}</td>
                                </tr>
                            </thead>
                            
                            <tbody>
                                {current_item_ingredients.map((ingredient)=>(
                                    <tr key={ingredient.id}>
                                        <td>{ingredient.name}</td>
                                        <td>{ingredient.quantity}</td>
                                    </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    }
}

export default Item;