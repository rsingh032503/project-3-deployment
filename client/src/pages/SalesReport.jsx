import React, { useState, useEffect } from 'react';

function SalesReport() {
  const [menuItemsSales, setMenuItemsSales] = useState([]);

  useEffect(() => {
    // Fetch sales report and update state
    const salesStart = new URLSearchParams(window.location.search).get('start');
    const salesEnd = new URLSearchParams(window.location.search).get('end');

    if (salesStart && salesEnd) {
      fetch(`http://localhost:3000/sales-report?start=${salesStart}&end=${salesEnd}`)
        .then(response => response.json())
        .then(data => setMenuItemsSales(data.sales))
        .catch(error => console.error('Error fetching sales report:', error));
    }
  }, [salesStart, salesEnd]);

  return (
    <div>
      <h2>Sales Report</h2>
      <table className="salesTable">
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
              <td>{menuItem.menu_item_price}</td>
              <td>{menuItem.quantity}</td>
              <td>{menuItem.total_sales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesReport;