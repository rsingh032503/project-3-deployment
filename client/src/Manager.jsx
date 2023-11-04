import { useState, useEffect } from 'react';
import './index.css';

function Manager(){
    const [count, setCount] = useState(0);
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
  
}