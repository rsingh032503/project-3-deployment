import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/UserTypeNavBar.css';



function UserTypeNavBar() {
    let location = useLocation();
    //console.log(location.pathname === "/");
    return (
        <div className="navbar">
            <Link className={((location.pathname === "/")? "active":"" )} to="/">MenuBoard</Link>
            <Link className={((location.pathname === "/customer")? "active":"" )} to="/customer">Customer</Link>
            <Link className={((location.pathname === "/cashier")? "active":"" )} to="/cashier">Cashier</Link>
            <Link className={((location.pathname === "/manager")? "active":"" )} to="/manager">Manager</Link>
        </div>
     );
}

export default UserTypeNavBar;