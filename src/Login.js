import React,{useState} from 'react'
import './Login.css'
import {TextField,Button} from "@mui/material"
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function Login(){

  
  const[identifer,setIdentifer] = useState("")
  const[logpass,setLogPass] = useState("");
  const[logmsg,setLogMsg] = useState("");
   
  const navigate = useNavigate();

  async function handleLogin(e){
   e.preventDefault();
   try{
    const response = await axios.post("http://localhost:3000/login",{identifer,logpass});
    if(response.status === 200){
        setLogMsg("Login in Successfully");
        localStorage.setItem("token",response.data.token)
        navigate("/dashboard")
        
    }
   }catch(error){
    setLogMsg(error.response ? error.response.data.Error : error.message);
  }
}
  return (
    <div className='log-container'>
      <div className='log-img'></div>
      <div className='log-section'>

          <div className='log-head'>
            <h2>Ready to Ride?</h2>
            <p>Log in to manage your services and track your bike's progress.</p>
          </div>
          <form onSubmit={handleLogin}>
              <TextField
                        fullWidth
                        helperText="" 
                        id="outlined-basic"
                        value={identifer}
                        label="Email/Mobile Number" 
                        variant="outlined"
                        onChange={e=>{setIdentifer(e.target.value)}}
                    />
              <TextField
                        fullWidth
                        helperText="" 
                        id="outlined-basic"
                        value={logpass}
                        label="Password" 
                        variant="outlined"
                        type="password"
                        onChange={e=>{setLogPass(e.target.value)}}
                  />
              <Button size="small" variant="contained" style={{backgroundColor:"red"}} type='submit'> Login</Button>
          </form>
          <p className='log-p'>{logmsg}</p>  
          </div>
    </div>
  )
}

export default Login