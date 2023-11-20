import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserTypeNavBar from './router/UserTypeNavBar.jsx';
import Customer from './pages/Customer';
import MenuBoard from './pages/MenuBoard';
import Cashier from './pages/Cashier';
import Manager from './pages/Manager';
import Item from './pages/item';
import RestockReport from './pages/RestockReport';

function App() {
  return (
    <Router>
      <UserTypeNavBar />
      <Routes>
        <Route path="/" element={<MenuBoard />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/cashier" element={<Cashier />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/item" element={<Item />} />
        <Route path="/restock-report" element={<RestockReport />} />
      </Routes>
    </Router>
  );
}

export default App;