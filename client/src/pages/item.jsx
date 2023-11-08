import React, { useState, useEffect } from 'react';
import '../styles/item.css';
import { images } from '../images.js';
import { Link } from 'react-router-dom';

function Item(){
    let [menuItems, setMenuItems] = useState([]);
    let [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetch('https://project-3-09m-server.onrender.com/menu_item')
            .then(response => response.json())
            .then(data => setMenuItems(data.menu_item))
            .then(setLoading(false))
            .catch(error => console.error('Error:', error));
    }, []);
    
    //console.log(loading)
    if(loading || menuItems.length == 0){
        return(
            <div>
                <p>Loading...</p>
            </div>
        )
    }
    else{
        console.log(menuItems);
        let current_item = null;

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
                                <tr><td>{'Ingredient'}</td></tr>
                                <tr><td>{'Quantity'}</td></tr>
                            </thead>
                            
                            <tbody>
                                {/*menu_item.ingredients.map((ingredient)=>(
                                    <tr key={ingredient.id}>
                                        <td>{ingredient.name}</td>
                                        <td>{ingredient.quantity}</td>
                                    </tr>
                                    ))*/
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