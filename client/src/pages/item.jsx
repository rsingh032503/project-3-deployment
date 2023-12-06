import React, { useState, useEffect } from 'react';
import '../styles/item.css';
import { images } from '../images.js';
import { Link, useLocation } from 'react-router-dom';
import { addToCart } from '../cart.js';
import { useLanguage } from '../LanguageContext';
import FontSizeIncreaser from '../FontSizeIncreaser';

/**
 * React component representing a detailed view of a menu item.
 * @component
 */
function Item() {
  /**
   * Custom hook for accessing and setting the language context.
   * @type {Object}
   */
  const { language } = useLanguage();

  /**
   * State variable for storing menu items fetched from the server.
   * @type {Array}
   */
  const [menuItems, setMenuItems] = useState([]);

  /**
   * State variable for storing ingredients fetched from the server.
   * @type {Array}
   */
  let [ingredients, setIngredients] = useState([]);

  /**
   * State variable for storing associations between ingredients and menu items.
   * @type {Array}
   */
  const [ingredient_item_join, setJoin] = useState([]);

  /**
   * State variable for tracking loading status.
   * @type {boolean}
   */
  let [loading, setLoading] = useState(true);

  /**
   * State variable for controlling the font size of text elements.
   * @type {number}
   */
  const [fontSize, setFontSize] = useState(16);

  /**
   * State variable for controlling the font size of labels.
   * @type {number}
   */
  const [LabelfontSize, setLabelFontSize] = useState(18);

  /**
   * React Router hook for accessing the current location.
   * @type {Object}
   */
  const location = useLocation();

  /**
   * Fetches menu items, ingredients, and ingredient-menu item associations from the server on component mount.
   * Translates the page content based on the selected language.
   * @function
   * @memberof Item
   * @name useEffect
   * @inner
   */
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
      .then(() => {
        setLoading(false);
        if (language === 'es') {
          translatePage();
        }
      })
      .catch(error => console.error('Error:', error));
  }, [language]);

   /**
   * Translates the page content using Google Translate API.
   * @function
   * @memberof Item
   * @name translatePage
   */
  const translatePage = async () => {
    try {
      const elementsToTranslate = document.querySelectorAll('[data-translate]');

      for (const element of elementsToTranslate) {
        const textToTranslate = element.innerText;

        const apiKey = 'AIzaSyD2cZ2edFWnb15EsgO2BvfjyJdtP9z7LLQ';
        const targetLanguage = language === 'es' ? 'es' : 'en';
        const response = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: textToTranslate,
              target: targetLanguage,
            }),
          }
        );

        const data = await response.json();

        if (data && data.data && data.data.translations && data.data.translations[0]) {
          const translatedText = data.data.translations[0].translatedText;
          element.innerText = translatedText;
        }
      }
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

   /**
   * Handles the change of font size for text elements.
   * @function
   * @memberof Item
   * @name handleFontSizeChange
   * @param {number} newFontSize - The new font size.
   */
  const handleFontSizeChange = (newFontSize) => {
    setFontSize(newFontSize);
    setLabelFontSize(newFontSize);
  };

   /**
   * Decreases the font size for text elements by 2 units.
   * @function
   * @memberof Item
   * @name handleFontSizeDecrease
   */
  const handleFontSizeDecrease = () => {
    setFontSize((prevSize) => (prevSize - 2));
    setLabelFontSize((prevSize) => (prevSize - 2));
  };

  /**
   * Renders the Item component with details of the selected menu item.
   * @returns {JSX.Element} JSX representation of the Item component.
   */
  if (loading || menuItems.length === 0 || ingredients.length === 0 || ingredient_item_join.length === 0) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  } else {
    let item = location.state;

    if (!item) {
      return (
        <div>
          <p>There is no menu item selected. Please select one from the customer page</p>
          <Link to="/customer">Customer Page</Link>
        </div>
      );
    } else {
      let ingredient_ids = item.ingredients;

      if (typeof ingredient_ids === 'string') {
        ingredient_ids = ingredient_ids.split(',');
      }

      ingredient_ids.map(id => parseInt(id));
      let current_item_ingredients = [];

      for (let ingredient of ingredients) {
        if (ingredient.id in ingredient_ids) {
          current_item_ingredients.push(ingredient);
        }
      }

      for (let join of ingredient_item_join) {
        if (join.ingredient_id in ingredient_ids) {
          for (let i = 0; i < current_item_ingredients.length; i++) {
            if (current_item_ingredients[i].id === join.ingredient_id) {
              current_item_ingredients[i].quantity = join.quantity;
            }
          }
        }
      }

      return (
        <div>
          <h1 data-translate>{item.name}</h1>
          <div className="column">
            <img src={images[item.name]} alt={item.name + " image"} />
            <button onClick={() => {
                addToCart(item);
                window.alert(`${item.name} added to cart!`);
            }} data-translate>Add To Cart</button>
          </div>
          <div className="column">
            <h3 style={{ fontSize: `${LabelfontSize}px` }} data-translate>Price: ${item.price}</h3>
            <h3 style={{ fontSize: `${LabelfontSize}px` }} data-translate>Ingredients</h3>
            <table>
              <thead>
                <tr>
                  <td style={{ fontSize: `${fontSize}px` }} data-translate>{'Ingredient'}</td>
                  <td style={{ fontSize: `${fontSize}px` }} data-translate>{'Quantity'}</td>
                </tr>
              </thead>

              <tbody>
                {current_item_ingredients.map((ingredient) => (
                  <tr key={ingredient.id}>
                    <td style={{ fontSize: `${fontSize}px` }} data-translate>{ingredient.name}</td>
                    <td style={{ fontSize: `${fontSize}px` }}>{ingredient.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <FontSizeIncreaser onFontSizeChange={handleFontSizeChange} />
		<button onClick={handleFontSizeDecrease}>Decrease Font Size</button>
        </div>
      );
    }
  }
}
export default Item;
