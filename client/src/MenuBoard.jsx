import { useState, useEffect } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import { images } from './images.js'; // path to the images.js file
import './MenuBoard.css';
import './index.css';

function MenuBoard() {
  const [count, setCount] = useState(0);
  // const [credentialsData, setCredentialsData] = useState(null);
  // const [customersData, setCustomersData] = useState(null);
  const [menuItemsData, setMenuItemsData] = useState(null);

  useEffect(() => {
      fetch('http://localhost:3000/menu_item')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              setMenuItemsData(data);
          })
          .catch(error => {
              console.error('Error:', error);
          });
  }, []);

  return (
    <>
    <h1 className="text-3xl font-bold underline" id="homepage">
      Welcome to Sharetea!
    </h1>
      {menuItemsData && (
        <div className="menu-items-container">
            {menuItemsData.menu_item.map(item => (
                <div key={item.id} className="menu-item">
                    <img src={images[item.name]} alt={item.name} />
                    <p>{item.name}</p>
                </div>
            ))}
        </div>
      )}
    </>
  );
}

export default MenuBoard;
