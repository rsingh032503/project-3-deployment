import React, { useState, useEffect } from 'react';
import '../styles/Cart.css';
import { getCart, removeFromCart, clearCart, getSubmitable, getTotal } from '../cart';
import { useLanguage } from '../LanguageContext';
import FontSizeIncreaser from '../FontSizeIncreaser';

import { Link, useLocation } from 'react-router-dom';

function Cart() {
  const { language } = useLanguage();
  const [menuItems, setMenuItems] = useState([]);
  let [loading, setLoading] = useState(true);
  let [cart, setCart] = useState([]);
  let [cart_loaded, setCartLoaded] = useState(false);
  let [quantity, setQuantity] = useState([]);
  let [quant_loaded, setQuantLoaded] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [itemFontSize, setItemFontSize] = useState(25);


  useEffect(() => {
    fetch('https://project-3-09m-server.onrender.com/menu_item')
      .then(response => response.json())
      .then(data => setMenuItems(data.menu_item))
      .then(() => setLoading(false))
      .catch(error => console.error('Error:', error));
  }, []);

  const location = useLocation();

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

  useEffect(() => {
    translatePage();
  }, [language, cart, quantity]);

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

  const handleFontSizeChange = (newFontSize) => {
    setFontSize(newFontSize);
    setItemFontSize(newFontSize);
  };

  const handleFontSizeDecrease = () => {
    setFontSize((prevSize) => (prevSize - 2));
    setItemFontSize((prevSize) => (prevSize - 2));
  };


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