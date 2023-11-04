import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserTypeNavBar.css';

function UserTypeNavBar() {
  return (
    <div className="navbar">
      <Link to="/">MenuBoard</Link>
      <Link to="/customer">Customer</Link>
      <Link to="/cashier">Cashier</Link>
      <Link to="/manager">Manager</Link>
    </div>
  );
}

export default UserTypeNavBar;