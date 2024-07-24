import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from '@mui/material'
import "./Landing.css"

export default function Landing(){



  return (
    <div className='land-container'>
        <header className='land-header'>
            <h1 className='land-h1'><span style={{color:"red"}}>GEAR</span> Up</h1>
            <ul className='land-ul'>
                <li className='land-li'>Home</li>
                <li className='land-li'>About Us</li>
                <li className='land-li'>Services</li>
                <li className='land-li'>Contact Us</li>
            </ul>
            <div className='land-button'>
                <Button size="small" variant="contained" style={{backgroundColor:"red"}}><Link  to="/login" style={{color:"white"}}>Login</Link></Button>
            </div>
           
        </header> 
        <div className='land-home'>
           <div className='home-signin'>
                <h2>Gear Up Your Bike with Us !!! </h2>
                <Button size="small" variant="contained" style={{backgroundColor:"red"}} className='sign-btn'><Link to="/signup" style={{color:"white"}}>Sign In</Link></Button>
           </div>
            
        </div>
    </div>
  )
}

<div className='land-home'>

</div>

