import React, { useState, useEffect } from 'react';
import '../styles/item.css';
import { images } from '../images.js';
import { Link, useLocation } from 'react-router-dom';

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
        const location = useLocation();
        let item = location.state;
        console.log(item);
        

        if(!item){
            return(
                <div>
                    <p>There is no menu item selected. Please select one from the customer page</p>
                    <Link to="/customer">Customer Page</Link>
                </div>
            )
        }
        else{
            let ingredient_ids = item.ingredients;
            if(typeof ingredient_ids === 'string'){
                console.log("splitting the ids");
                ingredient_ids = ingredient_ids.split(',');
            }
            console.log(ingredient_ids);
            ingredient_ids.map(id => parseInt(id));
            let current_item_ingredients = [];
            //console.log(current_item_ingredients);
            for(let ingredient of ingredients){
                if(ingredient.id in ingredient_ids){
                    current_item_ingredients.push(ingredient);
                }
            }
            for(let join of ingredient_item_join){
                if(join.ingredient_id in ingredient_ids){
                    for(let i = 0 ; i < current_item_ingredients.length; i++){
                        if(current_item_ingredients[i].id == join.ingredient_id){
                            current_item_ingredients[i].quantity = join.quantity;
                        }
                    }
                }
            }
            //console.log(current_item);
            //console.log(typeof(current_item));
            //console.log(menu_item);

            return (
                <div>
                    <h1>{item.name}</h1>
                    <div className="column">
                        <img src={images[item.name]} alt={item.name + " image"}/>
                    </div>
                    <div className="column">
                        <h3>Price: ${item.price}</h3>
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