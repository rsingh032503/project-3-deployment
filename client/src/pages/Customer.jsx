import React, { useState, useEffect } from 'react';
import '../styles/Customer.css';
import { images } from '../images.js';
import { Link } from 'react-router-dom';
import { getCartSize } from '../cart.js';
import { useLanguage } from '../LanguageContext';
import FontSizeIncreaser from '../FontSizeIncreaser';

/**
 * React component representing the customer view for browsing menu items.
 * @component
 */
function Customer() {
    /**
   * State variable for storing menu items fetched from the server.
   * @type {Array}
   */
  const [menuItems, setMenuItems] = useState([]);

  /**
   * State variable for storing menu item and ingredient associations.
   * @type {Array}
   */
  const [menu_ingredient_join, setJoin] = useState([]);

  /**
   * State variable for maintaining the order summary.
   * @type {Array}
   */
  const [orderSummary, setOrderSummary] = useState([]);

  /**
   * Custom hook for accessing and setting the language context.
   * @type {Object}
   */
  const { language, setLanguage } = useLanguage();

  /**
   * State variable for tracking translation status.
   * @type {boolean}
   */
  const [translated, setTranslated] = useState(false);

  /**
   * State variable for controlling the font size of text elements.
   * @type {number}
   */
  const [fontSize, setFontSize] = useState(16);

  /**
   * State variable for controlling the font size of drink titles.
   * @type {number}
   */
  const [drinkFontSize, setDrinkFontSize] = useState(18);

  /**
   * State variable for controlling the font size of customer view titles.
   * @type {number}
   */
  const [customerViewFontSize, setCustomerViewFontSize] = useState(20);

    /**
   * Fetches menu items and ingredient associations from the server on component mount.
   * @function
   * @memberof Customer
   * @name useEffect
   * @inner
   */
    useEffect(() => {
        // Check for saved language on component mount
        const savedLanguage = localStorage.getItem('language');
        console.log('Saved Language:', savedLanguage);
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }

        fetch('https://project-3-09m-server.onrender.com/menu_item')
            .then(response => response.json())
            .then(data => {
            setMenuItems(data.menu_item);
            
            // If the language is 'es' and translation hasn't occurred, translate the page
            if (savedLanguage === 'es' && !translated) {
                translatePage();
                setTranslated(true);
            }
            })
            .catch(error => console.error('Error:', error));

        fetch('https://project-3-09m-server.onrender.com/ingredient_menu_item_join_table')
            .then(response => response.json())
            .then(data => setJoin(data.ingredient_menu_item_join_table))
            .catch(error => console.error("Error: ", error));
        }, []);
      
       /**
   * Saves the selected language to localStorage when it changes.
   * Calls the translation function when the language changes and the page is translated.
   * @function
   * @memberof Customer
   * @name useEffect
   * @inner
   */
      useEffect(() => {
        // Save the language to localStorage whenever it changes
        localStorage.setItem('language', language);
      
        // Call the translation function when the language changes and the page is translated
        if (language === 'es' && translated) {
          translatePage();
        }
      }, [language, translated]);
      
      useEffect(() => {
        if (translated) {
          translatePage();
        }
      }, [translated]);

      /**
   * Retrieves the ingredients associated with a menu item.
   * @function
   * @memberof Customer
   * @name traverseToPage
   * @param {number} item_id - The ID of the menu item.
   * @returns {string} Comma-separated list of ingredient IDs.
   */
    function traverseToPage(item_id){
        //console.log(item_id);
        console.log('Translating page...');
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

     /**
   * Translates the page content using Google Translate API.
   * @function
   * @memberof Customer
   * @name translatePage
   */
    const translatePage = async () => {
        try {
            const elementsToTranslate = document.querySelectorAll('[data-translate]');
        
            for (const element of elementsToTranslate) {
              const textToTranslate = element.innerText;
        
              const apiKey = 'AIzaSyD2cZ2edFWnb15EsgO2BvfjyJdtP9z7LLQ'; //API KEY
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
        
            setTranslated(!translated);
          } catch (error) {
            console.error('Error translating text:', error);
          }
        };
    
        /**
   * Handles the change of language and triggers translation.
   * @function
   * @memberof Customer
   * @name handleLanguageChange
   */
        const handleLanguageChange = () => {
            const newLanguage = language === 'es' ? 'en' : 'es';
            setLanguage(newLanguage);
            setTranslated((prevTranslated) => !prevTranslated);
        };

         /**
   * Handles the change of font size for text elements.
   * @function
   * @memberof Customer
   * @name handleFontSizeChange
   * @param {number} newFontSize - The new font size.
   */
        const handleFontSizeChange = (newFontSize) => {
            setFontSize(newFontSize);
            setDrinkFontSize(newFontSize);
            setCustomerViewFontSize(newFontSize);
          };
    
                 /**
   * Decreases the font size for text elements by 2 units.
   * @function
   * @memberof Customer
   * @name handleFontSizeDecrease
   */
          const handleFontSizeDecrease = () => {
            setFontSize((prevSize) => (prevSize - 2));
            setDrinkFontSize((prevSize) => (prevSize - 2));
            setCustomerViewFontSize((prevSize) => (prevSize - 2));
          };
    
     /**
   * Renders the Customer component with menu items, language toggle, font size controls, and links.
   * @returns {JSX.Element} JSX representation of the Customer component.
   */
    return (
        <div>
            <h2 style={{ fontSize: `${customerViewFontSize}px` }} className='Title'data-translate>Customer View</h2>
            <div className="buttons">
              <button id="language" onClick={handleLanguageChange}>
                  {language === 'es' ? 'English' : 'Español'}
              </button>
              <div className="right-buttons">
                <FontSizeIncreaser onFontSizeChange={handleFontSizeChange} />
                <button onClick={handleFontSizeDecrease}>Decrease Font Size</button>
              </div>
            </div>
            <h3 className='DrinkTitle'>
                <p style={{ fontSize: `${drinkFontSize}px` }} data-translate>Drinks</p>
                <button className='toCart'>
                    <Link className='cartLink' to="/Cart" data-translate>{"Cart (" + getCartSize() + ")"}</Link>
                </button>
            </h3>
            <div className="grid">
                {menuItems.map((item,index) => (
                    <Link className="itemLink" key={item.id} to="/item" state={item}>
                        <button className="item">   
                            <img src={images[item.name]} alt={item.name + " image"}/>
                            <p style={{ fontSize: `${fontSize}px` }} data-translate>{item.name}</p>
                            <p style={{ fontSize: `${fontSize}px` }} >${item.price}</p> 
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Customer;