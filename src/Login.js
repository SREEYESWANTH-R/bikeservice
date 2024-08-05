import React,{useState} from 'react'
import './Login.css'
import {TextField,Button} from "@mui/material" //import mui materials
import axios from 'axios' //import axios
import { useNavigate } from 'react-router-dom';

function Login(){
  //states to store variable  
  const[identifer,setIdentifer] = useState("")
  const[logpass,setLogPass] = useState("");
  const[logmsg,setLogMsg] = useState("");
  
  // use navigate to navigate b/w pages
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  //function to handle authenticated user 
  async function handleLogin(e){
   e.preventDefault();
   try{
    const response = await axios.post("http://localhost:3000/login",{identifer,logpass});
    if(response.status === 200){
        const {token,name,userId} = response.data
        setLogMsg("Login in Successfully");
        localStorage.setItem("token",token);
        localStorage.setItem("name",name);
        localStorage.setItem("userId",userId);
        navigate("/dashboard")
        
    }
   }catch(error){
    setLogMsg(error.response ? error.response.data.Error : error.message);
    setTimeout(()=>{
      setLogMsg("");
      setIdentifer("");
      setLogPass("");
    },1000)
    
  }
}
  return (
    <div className='log-container'>
      <div className='log'> 
          <div className='log-head'>
            <h2>Ready to <span style={{color:"red"}}>Ride?</span></h2>
            <p>Log in to manage your services and track your bike's progress.</p>
          </div>
          <form onSubmit={handleLogin} className='bike-login-form'>
              <TextField
                        fullWidth
                        helperText="" 
                        id="outlined-basic"
                        value={identifer}
                        label="Email/Mobile Number" 
                        variant="outlined"
                        onChange={e=>{setIdentifer(e.target.value)}}
                        style={{marginBottom:"1em"}}
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
                        style={{marginBottom:"1em"}}
                  />
              <Button size="small" variant="contained" style={{backgroundColor:"red",marginBottom:"1em"}} type='submit'> Login</Button>
          </form>
            <p className='log-p'>{logmsg}</p>  
          </div>
    </div>
  )
}

export default Login