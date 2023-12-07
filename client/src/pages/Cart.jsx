import React, { useState, useEffect } from 'react';
import '../styles/Cart.css';
import { getCart, removeFromCart, clearCart, getSubmitable, getTotal } from '../cart';
import { useLanguage } from '../LanguageContext';
import FontSizeIncreaser from '../FontSizeIncreaser';

import { Link, useLocation } from 'react-router-dom';

/**
 * Functional component representing the Cart page.
 * @component
 */
function Cart() {

  /**
   * Language context for translation.
   * @type {Object}
   * @property {string} language - The current language.
   */
  const { language } = useLanguage();

  /**
   * State hook for menu items.
   * @type {[Object[], function]}
   */
  const [menuItems, setMenuItems] = useState([]);

  /**
   * State hook for loading indicator.
   * @type {[boolean, function]}
   */
  let [loading, setLoading] = useState(true);

  /**
   * State hook for the cart.
   * @type {[Object[], function]}
   */
  let [cart, setCart] = useState([]);

   /**
   * State hook for tracking cart loading status.
   * @type {[boolean, function]}
   */
  let [cart_loaded, setCartLoaded] = useState(false);

  /**
   * State hook for quantity of items in the cart.
   * @type {[number[], function]}
   */
  let [quantity, setQuantity] = useState([]);

  /**
   * State hook for tracking quantity loading status.
   * @type {[boolean, function]}
   */
  let [quant_loaded, setQuantLoaded] = useState(false);

  /**
   * State hook for the base font size.
   * @type {[number, function]}
   */
  const [fontSize, setFontSize] = useState(16);

  /**
   * State hook for the font size of items in the cart.
   * @type {[number, function]}
   */
  const [itemFontSize, setItemFontSize] = useState(25);

  /**
   * Fetch menu items from the server and update state.
   */
  useEffect(() => {
    fetch('https://project-3-09m-server.onrender.com/menu_item')
      .then(response => response.json())
      .then(data => setMenuItems(data.menu_item))
      .then(() => setLoading(false))
      .catch(error => console.error('Error:', error));
  }, []);

  /**
   * React Router hook for obtaining the current location.
   * @type {Object}
   */
  const location = useLocation();

  /**
   * Effect hook to initialize the cart and quantity states.
   */
  useEffect(() => {
    if (!cart_loaded) {
      setCart(getCart()[0]);
      setCartLoaded(true);
    }
    if (!quant_loaded) {
      setQuantity(getCart()[1]);
      setQuantLoaded(true);
    }
  }, [cart_loaded, quant_loaded]);

  /**
   * Effect hook for translating the page content based on the language.
   */
  useEffect(() => {
    translatePage();
  }, [language, cart, quantity]);

  /**
   * Translates the page content using the Google Translate API.
   * @async
   */
  const translatePage = async () => {
    try {
      const elementsToTranslate = document.querySelectorAll('[data-translate]');

      for (const element of elementsToTranslate) {
        const textToTranslate = element.innerText;

        const apiKey = 'AIzaSyD2cZ2edFWnb15EsgO2BvfjyJdtP9z7LLQ'; // API KEY
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
   * Handles the checkout process by prompting the user for name and email,
   * submitting the order, and updating the cart state.
   * @function
   */
  const handleCheckout = () => {
    const name = prompt("Please enter the customer's name:");
    const email = prompt("Please enter the customer's email:");

    if (name && email) {
      let submit = getSubmitable();
      const customer = { name, email };
      submitOrder(submit, customer);
    } else {
      alert("Please enter the customer's name and email to proceed with the checkout.");
    }
    clearCart();
    setCart([]);
    setQuantity([]);
  };

   /**
   * Submits the order by sending a POST request to the server.
   * @function
   * @param {Array} items - The items to be submitted.
   * @param {Object} customer - The customer information.
   */
  const submitOrder = (items, customer) => {
    fetch('https://project-3-09m-server.onrender.com/submitOrder', {
      // fetch('http://localhost:3000/submitOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, customer }),
    })
      .then(response => response.json())
      .then(data => {
        alert('Order submitted successfully!');
        clearCart(); // Clear the order summary
        setCart([]);
        setQuantity([]);
        setCartLoaded(false);
        setQuantLoaded(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  /**
   * Removes an item from the cart and updates the cart state.
   * @function
   * @param {Object} item - The item to be removed from the cart.
   */
  const removeItem = (item) => {
    let index = cart.indexOf(item);
    if (index < 0) {
      console.error("item does not exist: ", item);
      return;
    }
    removeFromCart(cart[index]);
    setCartLoaded(false);
    setQuantLoaded(false);
  };

  /**
   * Handles the change of font size by updating the font size state.
   * @function
   * @param {number} newFontSize - The new font size.
   */
  const handleFontSizeChange = (newFontSize) => {
    setFontSize(newFontSize);
    setItemFontSize(newFontSize);
  };

   /**
   * Decreases the font size by 2 units and updates the font size state.
   * @function
   */
  const handleFontSizeDecrease = () => {
    setFontSize((prevSize) => (prevSize - 2));
    setItemFontSize((prevSize) => (prevSize - 2));
  };


  /**
   * Renders the shopping cart component with item details, total, and checkout button.
   * @returns {JSX.Element} JSX representation of the cart component.
   */
        return(
            <div>
               <div className="cart-container">
                  <h2 className="cart-title" data-translate>Items:</h2>
                  <table className="cart-table">
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>${item.price}</td>
                          <td>{"x" + quantity[cart.indexOf(item)]}</td>
                          <td><button onClick={removeItem.bind(this, item)}>X</button></td>
                        </tr>
                      ))}
                      <tr className="total-row" key="total">
                        <td data-translate>Total:</td>
                        <td>${getTotal()}</td>
                      </tr>
                    </tbody>
                  </table>

                  <button className="checkout-button" onClick={() => handleCheckout()} data-translate>Check Out</button>
                </div>
                <FontSizeIncreaser onFontSizeChange={handleFontSizeChange} />
			    <button onClick={handleFontSizeDecrease}>Decrease Font Size</button>
            </div>
        );
}

export default Cart;