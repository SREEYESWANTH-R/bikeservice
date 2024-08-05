import React,{useEffect,useState} from 'react'
import "./AdminDash.css"
import { useNavigate } from 'react-router-dom'
import { Button, Typography, Card, CardContent,TextField } from '@mui/material';
import {BarChart,AccountCircle,VerifiedUser,Group, Dashboard, People, Settings } from '@mui/icons-material';
import {BarChart as ReBarChart, Bar,XAxis, YAxis,CartesianGrid,Tooltip,Legend,} from 'recharts';

import axios from 'axios'

function AdminDash(){

  //state to store the values
  const[adminName,setAdminName] = useState("");
  const[userCount,setUserCount] = useState(0);
  const[activeUser,setActiveUser] = useState(0);
  const[newService,setNewService] = useState("")
  const[newServicerate, setNewServiceRate] = useState("");
  const [serviceMsg,setServiceMsg] = useState("");
  const [serviceDelMsg,setServiceDelMsg] = useState("");
  const [deleteService, setDeleteService] = useState("");
  const [bookings, setBookings] = useState([]);    //state to store the booking data 
  const [pendingBook, setPendingBook] = useState("");
  const [completeBook,setCompleteBook] = useState("");


  const navigate = useNavigate();

  const fetchUserData = async ()=>{
    try{
      const response  = await axios.get("http://localhost:3000/admin/dashboard");  //route to get the count of user who are active and total users
      setUserCount(response.data.totalUsers) //state to store total user
      setActiveUser(response.data.activeUser); //state to store active user
     
    }catch(error){
      console.error("Error fetching total users:", error); //console log if error
    }
  }

  const fetchBookingStatus = async() =>{
    try{
      const countRes = await axios.get("http://localhost:3000/booking/status"); //route to get the count of booking that are completed and pending from Bookings table
      setPendingBook(countRes.data.pendingBook); //state to store pending Booking
      setCompleteBook(countRes.data.comBooking) //state to store Complete Booking
    }catch(error){
      console.error("Error Fetching Status",error)
    }
  }

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:3000/bookings"); //backend route to get the booking details from the Bookings table 
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error); // console log if error
       }
  };

  // Handle initial data fetching and authentication
  useEffect(()=>{
    const logged = localStorage.getItem("adminLogged");
    if(!logged){
      navigate('/admin/login');
    }else{
      const Adname = localStorage.getItem("adminID");   //useEffect to handle the Function calls and handling the admin 
      setAdminName(Adname);
      fetchUserData();
      fetchBookings();
      fetchBookingStatus()
  }},[navigate]);

   // Handle adding a new service
  const handleNewServices = async(event) =>{
    event.preventDefault();
    try{
      const response = await axios.post("http://localhost:3000/services/add",{newService,newServicerate});
      if(response){
        setServiceMsg("Service updated successfully");
        setTimeout(()=>{
          setServiceMsg("");
          setNewService("");
          setNewServiceRate("");
        },2000)
       
      }
    }catch(error){
      console.error("Error adding service",error)
    }  
  }

  // Handle deleting a service
  const handleDeleteServices = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.delete("http://localhost:3000/services/delete", {
            headers: { 'Content-Type': 'application/json' },
            data: { serviceName: deleteService }
        });
        if (response.status === 200) {
            setTimeout(()=>{
              setServiceDelMsg("Service deleted successfully");
              setDeleteService("");
            },2000);
           
        }
    } catch (error) {
        console.error("Error deleting service:", error);
        setServiceMsg("Error deleting service");
    }
};

// Update booking status
const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    const response = await axios.put("http://localhost:3000/booking/update-status", { booking_id: bookingId, status: newStatus });
    if (response.status === 200) {
      fetchBookings();
    }
  }catch (error) {
    console.error("Error updating status", error);
  }
};


const chartData = [
  { name: 'Users', Total: userCount, Active: activeUser },
];

const bookStatus = [
  {name:'Booking-status', Active:pendingBook,   Completed:completeBook}
]

//Handle Admin logout
  const handleAdminLogOut = () =>{
      localStorage.removeItem("adminlogged");
      navigate("/admin/login")
  }

  return (
     <div className='admin-dash-container'>
      <header className='admin-dash-header'>
        <h2><span style={{ color: "red" }}>Gear</span> Up</h2>
        <div className='admin-header-profile'>
          <h2>{adminName}</h2>
          <AccountCircle />
        </div>
      </header>
      <nav className='admin-navigation'>
        <ul>
          <li><Dashboard style={{ marginRight: '8px' }} /> Bookings</li>
          <li><BarChart style={{ marginRight: '8px' }} /> Analytics</li>
          <li><People style={{ marginRight: '8px' }} /> Users</li>
          <li><Settings style={{ marginRight: '8px' }} /> Settings</li>
        </ul>
        <div className='admin-logbtn'>
          <Button size="medium" onClick={handleAdminLogOut} variant="contained" style={{ backgroundColor: "red", width: "10em" }}>Logout</Button>
        </div>
      </nav>
      <div className='admin-dash-content'>
        <div className='admin-dash-cards'>
          <Card className='admin-card'>
            <CardContent className='admin-card-ele'>
              <div>
                <Typography variant="h5">Total Users</Typography>
                <Typography variant="h6">{userCount}</Typography>
              </div>
              <Group fontSize='large' style={{color:"red"}}/>
            </CardContent>
          </Card>
          <Card className='admin-card'>
            <CardContent className='admin-card-ele'>
              <div>
                <Typography variant="h5">Active Users</Typography>
                <Typography variant="h6">{activeUser}</Typography>
              </div>
              <VerifiedUser fontSize='large' style={{color:"red"}}/>
            </CardContent>
          </Card>
          <Card className='admin-card'>
            <CardContent>
              <Typography variant="h5">Active Booking</Typography>
              <Typography variant="h6">{pendingBook}</Typography>
            </CardContent>
          </Card>
          <Card className='admin-card'>
            <CardContent>
              <Typography variant="h5">Completed  Booking</Typography>
              <Typography variant="h6">{completeBook}</Typography>
            </CardContent>
          </Card>
        </div>
        <div className='admin-service'>
          <div className='admin-service-add'>
            <h2 style={{marginBottom:"10px"}}>ADD SERVICES</h2>
            <form onSubmit={handleNewServices}>
              <TextField
                fullWidth
                helperText=""
                id="outlined-basic"
                value={newService}
                label="Service Name"
                variant="outlined"
                onChange={e => { setNewService(e.target.value); }}
                style={{marginBottom:"10px"}}
              />
              <TextField
                fullWidth
                helperText=""
                id="outlined-basic"
                value={newServicerate}
                label="Service Rate"
                variant="outlined"
                onChange={e => { setNewServiceRate(e.target.value); }}
                style={{marginBottom:"10px"}}
              />

              <Button size="small" variant="contained" style={{backgroundColor:"red"}} type='submit'>Add Service</Button>
            </form>       
            <p>{serviceMsg}</p>
          </div>
          <div className='admin-service-delete'>
          <h2 style={{marginBottom:"10px"}}>DELETE SERVICES</h2>
          <form onSubmit={handleDeleteServices}>
              <TextField
                fullWidth
                helperText=""
                id="outlined-basic"
                value={deleteService}
                label="Service Name"
                variant="outlined"
                onChange={e => { setDeleteService(e.target.value); }}
                style={{marginBottom:"10px"}}
              />
              <Button size="small" variant="contained" style={{backgroundColor:"red"}} type='submit'>Delete Service</Button>
            </form>    
            <p>{serviceDelMsg}</p>
          </div>
        </div>
        <div className='admin-dash-graphs'>
         <div >
          <Typography variant="h5" style={{marginBottom:'1em',fontFamily:" Montserrat",textAlign:'center'   }}>Service Analytics</Typography>
          <ReBarChart width={600} height={480} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Active" fill="red" />
            <Bar dataKey="Total" fill="darkred" />
            </ReBarChart>
          </div>
          <div>
            <Typography variant="h5" style={{marginBottom:'1em',fontFamily:" Montserrat",textAlign:'center'}}>Booking Analytics</Typography>
            <ReBarChart width={600} height={480} data={bookStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Active" fill="red" />
              <Bar dataKey="Completed" fill="darkred" />
              </ReBarChart>
          </div>      
        </div>

        <div className='book-details'>
          <h2>Bookings</h2>
          <div className='admin-card-box'>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking.booking_id} className='admin-card'>
                  <CardContent className="booking-details">
                    <div className='status-cont'>
                      <Typography variant="h6">Booking ID: {booking.booking_id}</Typography>
                      <Typography variant="body1"><strong>{booking.status}</strong></Typography>
                    </div>
                    <Typography variant="body1"><strong>User:</strong> {booking.user_name}</Typography>
                    <Typography variant="body1"><strong>Address:</strong> {booking.address}</Typography>
                    
                    <Typography variant="body1"><strong>Bike Number:</strong> {booking.bike_num}</Typography>
                    <Typography variant="body1"><strong>Phone Number:</strong> {booking.phone_num}</Typography>
                    <Typography variant="body1"><strong>Date:</strong> {booking.booking_date}</Typography>
                    <Typography variant="body1"><strong>Total Cost:</strong> {booking.total_cost}</Typography>
                    <Typography variant="body1"><strong>Services:</strong> {booking.services}</Typography>
                    <Typography variant="body1"><strong>Service Total Cost:</strong> {booking.service_total_cost}</Typography>
                    <Typography variant="body1"><strong>Email:</strong> {booking.email}</Typography>
                    <div className='card-btn'>
                      <Button size="small" variant="contained" style={{backgroundColor:"red"}} onClick={()=>updateBookingStatus(booking.booking_id,"ready to deliver")} >Ready</Button>
                      <Button size="small" variant="contained" style={{backgroundColor:"red"}} onClick={()=>updateBookingStatus(booking.booking_id,"completed")} >Completed</Button>
                    </div>
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
};

export default AdminDash