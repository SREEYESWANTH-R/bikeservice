import React, { useEffect,useState } from 'react'
import './Dashboard.css'
import {Button,Typography, Card, CardContent} from '@mui/material'
import {MiscellaneousServices,Task,AccountCircle, Person} from '@mui/icons-material';
import {jwtDecode} from "jwt-decode"
import { useNavigate ,Link} from 'react-router-dom';
import axios from 'axios'


function Dashboard(){

  //states to hold values
  const navigate = useNavigate();
  const [userName,setUserName] = useState("");
  const[userId ,setUserID] = useState(null);
  const [bookings,setBookings] = useState([]);
  const [dashComplete, setDashComplete] = useState("");

  
  //useEffect to validate user
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token){
        navigate("/login")
    }else{
        try{
            const decodeToken = jwtDecode(token);
            setUserName(decodeToken.name);
            setUserID(decodeToken.id)
            fetchBookings(decodeToken.name);
            fetchAnalytics(decodeToken.name);
        }catch(error){
            console.error("JWT Decode Error:", error);
            localStorage.removeItem("token"); //error handling
            navigate("/login");
        }
    }

  },[navigate]);

  //funvtion to get bookings with username
  const fetchBookings = async (username) => {
    try {
        const encodedUsername = encodeURIComponent(username);
        const response = await axios.get(`http://localhost:3000/customer/bookings/${encodedUsername}`); //backend route to get the booking details 
        setBookings(response.data);
    } catch (error) {
        console.error('Error fetching customer bookings:', error);
    }
};

const fetchAnalytics = async(username) =>{
  try{
    const encodeUsername = encodeURIComponent(username);
    const response = await axios.get(`http://localhost:3000/dashoard/${encodeUsername}/booking-count`); //route to get the count of the completed booking
   
    //response data is stored in state 
    setDashComplete(response.data.CompleteCount);
    }catch(error){
    console.error("Error Fetching Count");
  }
}
  
  //funtion to handle logout
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
            <Link style={{color:"white"}} to="/dashboard/previous">
              <li>
                  <Task style={{marginRight:'8px'}}/>
                  Previous Service
              </li>
            </Link>
        </ul>
        <div className='dash-logbtn'>
            <Button size="medium" onClick={handleLogout} variant="contained" style={{backgroundColor:"red", width:"10em"}}>Logout</Button>
        </div>
      </nav>
      
      <div className='dash-content'>
        <div className='dash-cards'>
          <Card className='dash-card'>
            <CardContent>
              <Typography variant="h5">Completed  Booking</Typography>
              {/* Count of the completed bookings of the user is displayed */}
              <Typography variant="h6">{dashComplete}</Typography>
            </CardContent>
          </Card>
        </div>
        <div className='dash-bookings'>
            <h2>Bookings</h2>
            <div className='dash-card-box'>
            {/* mapping the bookins and displaying the bookings where the status is not complete */}
            {bookings.length > 0 && bookings.some(booking => booking.status !== 'completed') ? (
              bookings.filter(booking => booking.status !== 'completed')
              .map((booking) => (
                <Card key={booking.booking_id} className='dash-card'>
                {/* mapped values */}
                  <CardContent className="dash-booking-details">
                    <div className='dash-status-cont'>
                      <Typography variant="h6">Booking ID: {booking.booking_id}</Typography>
                      <Typography variant="body1"><strong style={{color:"green"}}>{booking.status}</strong></Typography>
                    </div>
                    <Typography variant="body1"><strong>User:</strong> {booking.user_name}</Typography>
                    <Typography variant="body1"><strong>Address:</strong> {booking.address}</Typography>
                    <Typography variant="body1"><strong>Bike Number:</strong> {booking.bike_num}</Typography>
                    <Typography variant="body1"><strong>Phone Number:</strong> {booking.phone_num}</Typography>
                    <Typography variant="body1"><strong>Date:</strong> {booking.booking_date}</Typography>
                    <Typography variant="body1"><strong>Services:</strong> {booking.services}</Typography>
                    <Typography variant="body1"><strong>Total Cost:</strong> {booking.total_cost}</Typography>
                    <Typography variant="body1"><strong>Total Cost:</strong> {booking.email}</Typography>
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

export default Dashboard