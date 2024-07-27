import React, { useEffect,useState } from 'react'
import './Dashboard.css'
import {Button} from '@mui/material'
import {MiscellaneousServices,Task,AccountCircle, Person} from '@mui/icons-material';
import {jwtDecode} from "jwt-decode"
import { useNavigate ,Link} from 'react-router-dom';
import axios from 'axios'


function Dashboard(){

  const navigate = useNavigate();
  const [userName,setUserName] = useState("");
  const[userId ,setUserID] = useState(null);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token){
        navigate("/login")
    }else{
        try{
            const decodeToken = jwtDecode(token);
            setUserName(decodeToken.name);
            setUserID(decodeToken.id)
        }catch(error){
            console.error("JWT Decode Error:", error);
            localStorage.removeItem("token");
            navigate("/login");
        }
    }

  },[navigate]);

  const handleLogout = async() =>{
    try{
        axios.post("http://localhost:3000/logout",{id:userId})
        localStorage.removeItem("token");
        navigate("/login");
     }catch(error){
        console.error("Error Logging out",error);
     }
    }
    

  return (
    <div className='dash-container'>
        <header className='dash-header'>
            <h2><Link to='/' style={{color:"white"}}><span style={{color:"red"}}>Gear</span> Up</Link></h2>
            <div className='header-profile'>  
                <h4>{userName}</h4>
                <Person fontSize = "medium" /> 
            </div>
        </header>
        <nav className='navigation'>
         <ul>
            <li>
                <AccountCircle style={{marginRight:'8px'}}/>
                Profile
            </li>
            <Link  style={{color:"white"}} to='/dashboard/booking'>
                <li>
                    <MiscellaneousServices style={{marginRight:'8px'}}/>
                    Book Service
                </li>
            </Link>
            <li>
                <Task style={{marginRight:'8px'}}/>
                Previous Service
            </li>
        </ul>
        <div className='dash-logbtn'>
            <Button size="medium" onClick={handleLogout} variant="contained" style={{backgroundColor:"red", width:"10em"}}>Logout</Button>
        </div>
      </nav>
      <div className='dash-content'></div>
    </div>
  )
}

export default Dashboard