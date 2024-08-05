import React,{useState} from 'react'
//importing react components
import {TextField,Button} from "@mui/material"
//import axios 
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'

function AdminLogin(){

  //state to store the data
  const [adminId,setAdminID] = useState("");
  const [adminPass,setAdminPass] = useState("");
  const [adLogMsg, setAdLogMsg] = useState("");
  const navigate = useNavigate();
  
  //function to authenticate admin 
  async function handleAdminLogin(e){
    e.preventDefault();
    try{
        const response = await axios.post("http://localhost:3000/admin/login",{adminId,adminPass});
        if(response.status === 200){
            setAdLogMsg("Logged in successfully");
            localStorage.setItem("adminID",response.data.adminID) //setting adminId to local storage 
            localStorage.setItem("adminLogged" ,true); 
            navigate('/admin/dashboard')
        }
    }catch(error){
        setAdLogMsg("Invalid Credentials");
    }
  }
  
  return (
    <div className='admin-log-container'>
        <div className='admin-log'>
            <div className='admin-log-head'>
                <h2>Ready to  <span style={{color:"red"}}>Ride?</span></h2>
                <p>Log in to manage your services and track your bike's progress.</p>
            </div>
            <form onSubmit={handleAdminLogin} className='admin-login-form'>
                <TextField
                    fullWidth
                    helperText="" 
                    id="outlined-basic"
                    value={adminId}
                    label="Admin ID" 
                    variant="outlined"
                    onChange={e=>{setAdminID(e.target.value)}}
                    style={{marginBottom:"1em"}}
                />
                <TextField
                    fullWidth
                    helperText="" 
                    id="outlined-basic"
                    value={adminPass}
                    label="Password" 
                    variant="outlined"
                    type="password"
                    onChange={e=>{setAdminPass(e.target.value)}}
                    style={{marginBottom:"1em"}}
                />
                <Button size="small" variant="contained" style={{backgroundColor:"red"}} type='submit'> Login</Button>
            </form>
            <p>{adLogMsg}</p>
        </div>
        
    </div>
  )
}

export default AdminLogin