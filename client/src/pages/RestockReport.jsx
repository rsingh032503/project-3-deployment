import React, { useState, useEffect } from 'react';
import '../styles/Manager.css';

function RestockReport(){
    const [understockedIngredients, setUnderstockedIngredients] = useState([]);

    useEffect(() => {
        //Fetch understocked ingredients and update state
        fetch('http://localhost:3000/understocked')
          .then(response => response.json())
          .then(data => setUnderstockedIngredients(data.understockedIngredients))
          .catch(error => console.error('Error fetching understocked ingredients:', error));
      }, []);

    return(
        <div>
            <h2>Restock Report</h2>
                <table className="restockTable">
                    <thead> 
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Threshold</th>
                    </tr>
                    </thead>
                    <tbody>
                    {understockedIngredients.map((ingredient) => (
                        <tr key={ingredient.id}>
                        <td>{ingredient.name}</td>
                        <td>{ingredient.quantity}</td>
                        <td>{ingredient.threshold}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
        </div>
    );
}

export default RestockReport;