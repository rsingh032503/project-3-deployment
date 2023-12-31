import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {GoogleOAuthProvider} from '@react-oauth/google';
import UserTypeNavBar from './router/UserTypeNavBar.jsx';
import Customer from './pages/Customer';
import MenuBoard from './pages/MenuBoard';
import Cashier from './pages/Cashier';
import Manager from './pages/Manager';
import Item from './pages/item';
import RestockReport from './pages/RestockReport';
import Cart from './pages/Cart.jsx';
import SalesReport from './pages/SalesReport';
import ExcessReport from './pages/ExcessReport';

/**
 * The main application component.
 *
 * @component
 * @returns {React.ReactNode} The rendered application.
 */
function App() {
  return (
    <GoogleOAuthProvider clientId={'1041949387108-2g75rqvqqc2tt19pp2c884g7gqptgnpf.apps.googleusercontent.com'}>
        <Router>
            <UserTypeNavBar />
            <Routes>
                <Route path="/" element={<MenuBoard />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="/cashier" element={<Cashier />} />
                <Route path="/manager" element={<Manager />} />
                <Route path="/item" element={<Item />} />
                <Route path="/sales-report" element={<SalesReport />} />
                <Route path="/excess-report" element={<ExcessReport />} />
                <Route path="/restock-report" element={<RestockReport />} />
                <Route path="/Cart" element={<Cart />} />
            </Routes>
        </Router>
    </GoogleOAuthProvider>
  );
}

export default App;