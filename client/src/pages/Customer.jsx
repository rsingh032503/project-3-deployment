import React, { useState, useEffect } from 'react';
import '../styles/Customer.css';
import { images } from '../images.js';
import { Link } from 'react-router-dom';
import { getCartSize } from '../cart.js';


function Customer() {
    const [menuItems, setMenuItems] = useState([]);
    const [menu_ingredient_join, setJoin] = useState([]);
    const [orderSummary, setOrderSummary] = useState([]);
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
    const [translated, setTranslated] = useState(false);

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
        
              const apiKey = 'AIzaSyD2cZ2edFWnb15EsgO2BvfjyJdtP9z7LLQ'; // Replace with your actual API key
              const response = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    q: textToTranslate,
                    target: 'es', // Spanish language code
                  }),
                }
              );
        
              const data = await response.json();
        
              if (data && data.data && data.data.translations && data.data.translations[0]) {
                const translatedText = data.data.translations[0].translatedText;
                element.innerText = translatedText;
        
                // Adjust styles for translated content if needed
                element.style.fontWeight = 'bold'; // Add your style adjustments here
              }
            }
        
            setTranslated(true);
          } catch (error) {
            console.error('Error translating text:', error);
          }
        };
    
      const handleLanguageChange = () => {
        setLanguage('es'); 
        setTranslated(true); 
      };     
    
    return (
        <div>
            <h2 className='Title'data-translate>Customer View</h2>
            <h3 className='DrinkTitle'>
                <p data-translate>Drinks: </p>
                <button className='toCart'>
                    <Link className='cartLink' to="/Cart" data-translate>{"Cart (" + getCartSize() + ")"}</Link>
                </button>
            </h3>
            <div className="grid">
                {menuItems.map((item,index) => (
                    <Link className="itemLink" key={item.id} to="/item" state={item}>
                        <button className="item">   
                            <img src={images[item.name]} alt={item.name + " image"}/>
                            <p data-translate>{item.name}</p>
                            <p>${item.price}</p> 
                        </button>
                    </Link>
                ))}
            </div>
            <button onClick={handleLanguageChange}>espanol</button>
        </div>
    );
}

export default Customer;