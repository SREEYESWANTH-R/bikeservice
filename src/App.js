import './App.css';

import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Landing from './Landing';
import SignIn from './SignIn';
import Login from './Login';
import Dashboard from './customer/Dashboard';
import AdminLogin from './BikeShop/AdminLogin';
import AdminDash from './BikeShop/AdminDash';
import Booking from './customer/Booking';

function App() {
  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="/signup" element={<SignIn/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/dashboard/booking" element={<Booking/>}/>
            <Route path="/admin/login" element={<AdminLogin/>}/>
            <Route path="/admin/dashboard" element={<AdminDash/>}/>
          </Routes>
        </div>
      </Router>
    </>
  )}
  

export default App;
