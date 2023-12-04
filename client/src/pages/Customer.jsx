import React, { useState, useEffect } from 'react';
import '../styles/Customer.css';
import { images } from '../images.js';
import { Link } from 'react-router-dom';
import { getCartSize } from '../cart.js';
import { useLanguage } from '../LanguageContext';
import FontSizeIncreaser from '../FontSizeIncreaser';

function Customer() {
    const [menuItems, setMenuItems] = useState([]);
    const [menu_ingredient_join, setJoin] = useState([]);
    const [orderSummary, setOrderSummary] = useState([]);
    const { language, setLanguage } = useLanguage();
    const [translated, setTranslated] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [drinkFontSize, setDrinkFontSize] = useState(18);
    const [customerViewFontSize, setCustomerViewFontSize] = useState(20);

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
    
        const handleLanguageChange = () => {
            const newLanguage = language === 'es' ? 'en' : 'es';
            setLanguage(newLanguage);
            setTranslated((prevTranslated) => !prevTranslated);
        };

        const handleFontSizeChange = (newFontSize) => {
            setFontSize(newFontSize);
            setDrinkFontSize(newFontSize);
            setCustomerViewFontSize(newFontSize);
          };
    
          const handleFontSizeDecrease = () => {
            setFontSize((prevSize) => (prevSize - 2));
            setDrinkFontSize((prevSize) => (prevSize - 2));
            setCustomerViewFontSize((prevSize) => (prevSize - 2));
          };
    
    return (
        <div>
            <h2 style={{ fontSize: `${customerViewFontSize}px` }} className='Title'data-translate>Customer View</h2>
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
            <button onClick={handleLanguageChange}>
                {language === 'es' ? 'English' : 'Español'}
            </button>
            <FontSizeIncreaser onFontSizeChange={handleFontSizeChange} />
			<button onClick={handleFontSizeDecrease}>Decrease Font Size</button>
        </div>
    );
}

export default Customer;