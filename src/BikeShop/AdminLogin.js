import React,{useState} from 'react'
import {TextField,Button} from "@mui/material"
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function AdminLogin(){
//   const[adminName,setAdminName] = useState("");
  const [adminId,setAdminID] = useState("");
  const [adminPass,setAdminPass] = useState("");
  const [adLogMsg, setAdLogMsg] = useState("");
  const navigate = useNavigate();
  
  async function handleAdminLogin(e){
    e.preventDefault();
    try{
        const response = await axios.post("http://localhost:3000/admin/login",{adminId,adminPass});
        if(response.status === 200){
            setAdLogMsg("Logged in successfully");
            localStorage.setItem("adminID",response.data.adminID)
            localStorage.setItem("adminLogged" ,true);
            navigate('/admin/dashboard')
        }
    }catch(error){
        setAdLogMsg("Invalid Credentials");
    }
  }
  
  return (
    <div className='admin-log-container'>
        <div className='log-head'>
            <h2>Ready to Ride?</h2>
            <p>Log in to manage your services and track your bike's progress.</p>
        </div>
        <form onSubmit={handleAdminLogin}>
            <TextField
                fullWidth
                helperText="" 
                id="outlined-basic"
                value={adminId}
                label="Admin ID" 
                variant="outlined"
                onChange={e=>{setAdminID(e.target.value)}}
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
            />
            <Button size="small" variant="contained" style={{backgroundColor:"red"}} type='submit'> Login</Button>
        </form>
        <p>{adLogMsg}</p>
    </div>
  )
}

export default AdminLogin