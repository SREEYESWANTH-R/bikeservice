import './App.css';
<<<<<<< HEAD
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
    
=======

function App() {
  return (
    <div className="App">
    </div>
>>>>>>> d1a1541f4ed2457369737b2a84457025efce9c3e
  );
}

export default App;
