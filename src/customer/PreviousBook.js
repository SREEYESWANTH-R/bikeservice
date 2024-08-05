import React,{useState,useEffect} from 'react'
import {MiscellaneousServices,Task,AccountCircle, Person} from '@mui/icons-material';
import {Typography, Card, CardContent} from '@mui/material'
import { useNavigate ,Link} from 'react-router-dom';
import {jwtDecode} from "jwt-decode"
import axios from 'axios'
import './PreviousBook.css'

function PreviousBook(){
  //states to store values
  const [userName,setUserName] = useState("");
  const [completedBook, setCompletedBooking] = useState([]);
  //navigate to navigate b/w routes
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem("token"); //accessing token from localStorage for authentication
    if(!token){
      navigate("/login");
    }else{
      try{
        const decodeToken = jwtDecode(token); //decoding token
        setUserName(decodeToken.name)
        fetchCompletedBooking(decodeToken.name)
      }catch(error){
          console.error("JWT Decode Error:", error);
          localStorage.removeItem("token");
          navigate("/login");
      }
    }
  },[navigate])

 const fetchCompletedBooking = async(username) =>{     //function to fetch booking that is completed and display it in the component
  try{
    const encodedUsername = encodeURIComponent(username);
    const response = await axios.get(`http://localhost:3000/completed/${encodedUsername}`); //backend route to get the data 
    setCompletedBooking(response.data.result); //storing result in the state
  }catch(error){
    console.log("Error Fectching completed data",error);  // Error handling
  }
 }


  return (
    <div className='previous-container'>
       <header className='previous-header'>
            <h2><Link to='/' style={{color:"white"}}><span style={{color:"red"}}>Gear</span> Up</Link></h2>
            <div className='previous-profile'>  
                <h4>{userName}</h4>
                <Person fontSize = "medium" /> 
            </div>
        </header>
        <nav className='previous-navigation'>
         <ul>
            <Link style={{color:"white"}} to='/dashboard'>
                <li>
                    <AccountCircle style={{marginRight:'8px'}}/>
                    Profile
                </li>
            </Link>
            <Link  style={{color:"white"}} to='/dashboard/booking'>
                <li>
                    <MiscellaneousServices style={{marginRight:'8px'}}/>
                    Book Service
                </li>
            </Link>
            <Link style={{color:"white"}} to="/dashboard/previous">
              <li>
                  <Task style={{marginRight:'8px'}}/>
                  Previous Service
              </li>
            </Link>
        </ul>
      </nav>
      <div className='previous-content'>
        <div className='previous-book'>
            <h2>Completed Booking</h2>
            <div className='previous-book-box'>
              {completedBook.length > 0 ? (      //mapping the data to individual card components
                completedBook.map((bookings) => (
                  <Card key={bookings.booking_id} className='previous-card'>
                    <CardContent className="dash-booking-details">
                      <div className='dash-status-cont'>
                        <Typography variant="h6">Booking ID: {bookings.booking_id}</Typography>
                        <Typography variant="body1"><strong style={{ color: "green" }}>{bookings.status}</strong></Typography>
                      </div>
                      {/* mapped value */}
                      <Typography variant="body1"><strong>User:</strong> {bookings.user_name}</Typography>
                      <Typography variant="body1"><strong>Address:</strong> {bookings.address}</Typography>
                      <Typography variant="body1"><strong>Bike Number:</strong> {bookings.bike_num}</Typography>       
                      <Typography variant="body1"><strong>Phone Number:</strong> {bookings.phone_num}</Typography>
                      <Typography variant="body1"><strong>Date:</strong> {bookings.booking_date}</Typography>
                      <Typography variant="body1"><strong>Services:</strong> {bookings.services}</Typography>
                      <Typography variant="body1"><strong>Total Cost:</strong> {bookings.total_cost}</Typography>
                      <Typography variant="body1"><strong>Email:</strong> {bookings.email}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body1">No bookings available</Typography>
              )}
            </div>
          </div>
      </div>
    </div>
  )
}

export default PreviousBook