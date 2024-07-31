import React, { useState } from 'react'
import {TextField,Button,FormControl,InputLabel,MenuItem,Select} from "@mui/material"
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import './SignIn.css'

function SignIn(){
    const[regname,setRegName] = useState("");
    const[reggender,setRegGender] = useState("");
    const[regmobile,setRegMobile] = useState("");
    const[regemail,setRegEmail] = useState("");
    const[regadd,setRegAdd] = useState("");
    const[regnewpass,setRegNewPass] = useState("");
    const[regcmpass,setRegcmPass] = useState("");
    const[message,setMessage] = useState("")
     
    const navigate = useNavigate()

    async function handleRegSubmit(e){
        e.preventDefault();
        if(regnewpass === regcmpass){
            const userData = {
                name:regname,
                gender:reggender,
                mobile:regmobile,
                email:regemail,
                address:regadd,
                password:regnewpass,
                active:true
            };
            try{
                const response = await axios.post("http://localhost:3000/signup",userData);
                if(response.status === 200){
                    setMessage("User registration Successful");
                    setTimeout(()=>{
                        navigate('/login');
                    },2000)
                }
            }catch(error){
                setMessage("There was an error registering");  
            }
        }else{
            setMessage("Password mismatch");
        }
    }

  return (
    <div className='sign-container'>
        <h2>Gear Up for Great Service – Sign Up Now!</h2>
        <p>Create your account to book services, track your bike’s status, and receive timely updates. It’s quick and easy!</p>
        <form type="submit" onSubmit={handleRegSubmit}>
            <TextField
                fullWidth
                helperText="" 
                id="outlined-basic"
                value={regname}
                label="Name" 
                variant="outlined"
                onChange={e=>{setRegName(e.target.value)}}
                style={{marginBottom:"10px"}}
            />
            <FormControl fullWidth  style={{marginBottom:"10px"}}>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={reggender}
                        label="Gender"
                        onChange={e=>{setRegGender(e.target.value)}}
                    >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">other</MenuItem>
                    </Select>
            </FormControl>
            <TextField
                fullWidth
                helperText="" 
                id="outlined-basic"
                value={regmobile}
                label="Mobile" 
                variant="outlined"
                onChange={e=>{setRegMobile(e.target.value)}}
                style={{marginBottom:"10px"}}
            />
            <TextField
                fullWidth
                helperText="" 
                value={regemail}
                id="outlined-basic"
                label="Email" 
                variant="outlined"
                onChange={e=>{setRegEmail(e.target.value)}}
                style={{marginBottom:"10px"}}
            />
            <TextField
                fullWidth
                id="outlined-multiline-static"
                label="Address"
                value={regadd}
                multiline
                rows={4}
                onChange={e=>{setRegAdd(e.target.value)}}
                style={{marginBottom:"10px"}}
            />
            <TextField
                fullWidth
                helperText="" 
                id="outlined-basic"
                value={regnewpass}
                label="New password" 
                variant="outlined"
                type="password"
                onChange={e=>{setRegNewPass(e.target.value)}}
                style={{marginBottom:"10px"}}
            />
            <TextField
                fullWidth
                helperText="" 
                id="outlined-basic"
                label="confirm Password" 
                value={regcmpass}
                variant="outlined"
                type="password"
                onChange={e=>{setRegcmPass(e.target.value)}}
                style={{marginBottom:"10px"}}
            />
            <Button size="small" variant="contained" style={{backgroundColor:"red",marginBottom:"10px"}} type='submit'> Sign Up</Button>
        </form>    
        <p id="reg-p">{message}</p>
        <div className='sign-foot'>
            <p>Already Have an Account?<a href='/login'><span style={{color:"red"}}>Login</span></a></p>
        </div>
    </div>
  )
}

export default SignIn