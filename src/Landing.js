import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from '@mui/material'
import {Facebook,X,Instagram} from '@mui/icons-material'
import "./Landing.css"
import abtUs from './assests/abtUs.jpg'
import Engine from './assests/Engine.jpg'
import waterwash from './assests/waterwash.jpg'
import oilchnage from './assests/oilchnage.jpg'
import breaking from './assests/breaking.jpg'
import tyre from './assests/tyre.jpg'


export default function Landing(){



  return (
    <div className='land-container'>
    {/* Navigation*/}
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
        <div className='land-details'>
          <h2>About Us</h2>
          <div className='abt-container'>
            <img src={abtUs} alt="abtPic"/>
            <div className='abtus'>
              <p>
                Welcome to <strong>Gear Up Bike Service</strong>, your premier destination for comprehensive bike care and maintenance. Established with a passion for cycling, we understand the joy and freedom that comes with a well-maintained bike. Our team of expert technicians is dedicated to providing top-quality repairs, routine maintenance, and personalized service to keep your bike in perfect condition.
              </p>
              <p>
                At Gear Up Bike Service, we pride ourselves on our attention to detail, using only the highest quality parts and the latest tools to ensure your bike's performance and safety. Whether you are a daily commuter, a weekend warrior, or an avid cyclist, we cater to all your biking needs with a friendly and professional approach.
              </p>
              <p>
                Our mission is to enhance your biking experience by offering reliable, efficient, and affordable services. We believe in building lasting relationships with our customers through trust, transparency, and exceptional service. Your satisfaction is our top priority, and we are committed to going the extra mile to exceed your expectations.
              </p>
              <p>
                Thank you for choosing Gear Up Bike Service. We look forward to being your trusted partner on every ride. Ride safe and gear up for a better biking experience!
              </p>
              <Button size="large" variant="contained" style={{backgroundColor:"red"}} className='sign-btn'><Link to="/signup" style={{color:"white"}}>Sign Up</Link></Button>
            </div>
          </div>
        </div>
        <div className='land-services'>
          <h2>Our Services</h2>
          <div className='service-container'>
             <div className='cards'>
                <img src={Engine} alt="engine service"/>
                <div className='ser-img-desc'><span>Engine</span> Service</div>
             </div>
             <div className='cards'>
                <img src={waterwash} alt="water wash"/>
                <div className='ser-img-desc'><span>Water</span> Wash</div>
             </div>
             <div className='cards'>
                <img src={oilchnage} alt="engine service"/>
                <div className='ser-img-desc'><span>Oil</span> Change</div>
             </div>
             <div className='cards'>
                <img src={breaking} alt="engine service"/>
                <div className='ser-img-desc'><span>Breaking</span> Service</div>
             </div>
             <div className='cards'>
                <img src={Engine} alt="engine service"/>
                <div className='ser-img-desc'><span>General</span> Service</div>
             </div>
             <div className='cards'>
                <img src={tyre} alt="engine service"/>
                <div className='ser-img-desc'><span>Tyre</span> Change</div>
             </div>
          </div>
        </div>
        <footer className='footer-container'>
          <div className='footer-links'>
            <Link to="/" />Home
            <Link to="/" />About Us
            <Link to="/" />Service
            <Link to="/" />Contact Us
          </div>
          <div className='footer-social'>
              <a href='https://www.facebook.com' target="_blank" rel="oopener noreferrer">
                <Facebook/>
              </a>
              <a href='https://www.X.com' target="_blank" rel="oopener noreferrer">
                <X/>
              </a>
              <a href='https://www.instagram.com' target="_blank" rel="oopener noreferrer">
                <Instagram/>
              </a>
          </div>
          {/* footer section */}
          <div className='footer-contact'>
            <p>Email: info@gearupbikeservice.com</p>
            <p>Phone: (123) 456-5432</p>
          </div>
          <div className='footer-copy'>
            <p>&copy; 2024 Gear Up Bike Service. All rights reserved.</p>
          </div>
        </footer>
    </div>
  )
}


