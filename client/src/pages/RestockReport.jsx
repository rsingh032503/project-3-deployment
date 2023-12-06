import React, { useState, useEffect } from 'react';
import '../styles/Manager.css';

/**
 * RestockReport component displays a report of understocked ingredients.
 *
 * @component
 * @returns {JSX.Element} The RestockReport component.
 */
function RestockReport(){
    const [understockedIngredients, setUnderstockedIngredients] = useState([]);

    /**
     * Fetches understocked ingredients from the server and updates state.
     *
     * @function
     * @returns {void}
     */
    useEffect(() => {
        //Fetch understocked ingredients and update state
        fetch('https://project-3-09m-server.onrender.com/understocked')
          .then(response => response.json())
          .then(data => setUnderstockedIngredients(data.understockedIngredients))
          .catch(error => console.error('Error fetching understocked ingredients:', error));
      }, []);

    return(
        <div>
            <h2>Restock Report</h2>
                <table className="reportTable">
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