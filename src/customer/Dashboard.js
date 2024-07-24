import React, { useEffect } from 'react'
import './Dashboard.css'
import {Button} from '@mui/material'
import {MiscellaneousServices,Task,AccountCircle} from '@mui/icons-material';
import {jwtDecode} from "jwt-decode"
import { useNavigate } from 'react-router-dom';


function Dashboard(){

  const navigate = useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token){
        navigate("/login")
    }else{
        try{
            jwtDecode(token);
        }catch(error){
            localStorage.removeItem("token");
            navigate("/login");
        }
    }

  },[navigate]);

  const handleLogout = () =>{
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className='dash-container'>
        <header className='dash-header'>
            <h2><span style={{color:"red"}}>Gear</span> Up</h2>
            <div className='header-profile'>
                <h2>Name</h2>
            </div>
        </header>
        <nav className='navigation'>
         <ul>
            <li>
                <AccountCircle style={{marginRight:'8px'}}/>
                Profile
            </li>
            <li>
                <MiscellaneousServices style={{marginRight:'8px'}}/>
                Book Service
            </li>
            <li>
                <Task style={{marginRight:'8px'}}/>
                Previous Service
            </li>
        </ul>
        <div className='dash-logbtn'>
            <Button size="medium" onClick={handleLogout} variant="contained" style={{backgroundColor:"red", width:"10em"}}>Login</Button>
        </div>
      </nav>
      <div className='dash-content'></div>
    </div>
  )
}

export default Dashboard