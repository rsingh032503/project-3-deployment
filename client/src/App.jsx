import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserTypeNavBar from './Router/UserTypeNavBar.jsx';
import Customer from './pages/Customer';
import MenuBoard from './pages/MenuBoard';
import Cashier from './pages/Cashier';
import Manager from './pages/Manager';

function App() {
  return (
    <Router>
      <UserTypeNavBar />
      <Routes>
        <Route path="/" element={<MenuBoard />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/cashier" element={<Cashier />} />
        <Route path="/manager" element={<Manager />} />
      </Routes>
    </Router>
  );
}

export default App;