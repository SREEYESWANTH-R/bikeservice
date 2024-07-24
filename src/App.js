import './App.css';

import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Landing from './Landing';
import SignIn from './SignIn';
import Login from './Login';
import Dashboard from './customer/Dashboard';

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
          </Routes>
        </div>
      </Router>
    </>
  )}
  

export default App;
