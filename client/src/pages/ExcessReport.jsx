import React, { useState, useEffect } from 'react';
import '../styles/Manager.css';

/**
 * React component representing an excess report for managing ingredient quantities.
 * @component
 */
function ExcessReport() {
  /**
   * State variable for storing excess ingredient data fetched from the server.
   * @type {Array}
   */
  const [excessIngredients, setExcessIngredients] = useState([]);

  /**
   * Fetches excess ingredient data from the server on component mount.
   * @function
   * @memberof ExcessReport
   * @name useEffect
   * @inner
   */
  useEffect(() => {
    // Fetch excess report and update state
    const excessStart = new URLSearchParams(window.location.search).get('start');

    if (excessStart) {
        fetch(`https://project-3-09m-server.onrender.com/excess-report?start=${excessStart}`) // http://localhost:3000
            .then(response => response.json())
            .then(data => setExcessIngredients(data.excessIngredients))
            .catch(error => console.error('Error fetching excess report:', error));
    }
  }, []);

  /**
   * Renders the ExcessReport component with a table displaying excess ingredient data.
   * @returns {JSX.Element} JSX representation of the ExcessReport component.
   */
  return (
    <div>
      <h2>Excess Report</h2>
      <table className="reportTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Sold</th>
            <th>% Sold</th>
          </tr>
        </thead>
        <tbody>
          {excessIngredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td>{ingredient.name}</td>
              <td>{ingredient.quantityAtTimestamp}</td>
              <td>{ingredient.amountSoldSinceTimestamp}</td>
              <td>{ingredient.percentageSold.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExcessReport;