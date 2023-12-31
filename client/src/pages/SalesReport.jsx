import React, { useState, useEffect } from 'react';

/**
 * SalesReport component displays a report of menu items sales within a given time range.
 *
 * @component
 * @returns {JSX.Element} The SalesReport component.
 */
function SalesReport() {
  const [menuItemsSales, setMenuItemsSales] = useState([]);

   /**
   * Fetches sales report data based on the provided start and end dates.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    // Fetch sales report
    const salesStart = new URLSearchParams(window.location.search).get('start');
    const salesEnd = new URLSearchParams(window.location.search).get('end');

    if (salesStart && salesEnd) {
      fetch(`https://project-3-09m-server.onrender.com/sales-report?start=${salesStart}&end=${salesEnd}`)
        .then(response => response.json())
        .then(data => setMenuItemsSales(data.sales))
        .catch(error => console.error('Error fetching sales report:', error));
    }
  }, []);

  return (
    <div>
      <h2>Sales Report</h2>
      <table className="reportTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {menuItemsSales.map((menuItem) => (
            <tr key={menuItem.menu_item_name}>
              <td>{menuItem.menu_item_name}</td>
              <td>${menuItem.menu_item_price.toFixed(2)}</td>
              <td>{menuItem.total_quantity}</td>
              <td>${menuItem.total_sales.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesReport;