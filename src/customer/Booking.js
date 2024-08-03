import React ,{useState,useEffect} from 'react'
import {TextField,Button,MenuItem,Select,InputLabel,FormControl} from "@mui/material"
import {MiscellaneousServices,Task,AccountCircle, Person} from '@mui/icons-material';
import { useNavigate ,Link} from 'react-router-dom';
import {jwtDecode} from "jwt-decode"
import axios from 'axios'
import "./Booking.css"

function Booking(){
  
  const [userName,setUserName] = useState("");
  const [address,setAddress] = useState("");
  const [bikeNum, setBikeNum] = useState();
  const [phoneNum, setPhoneNum] = useState("");
  const [services,setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [date,setDate] = useState('');
  const [userEmail,setUserEmail] = useState('');

  const navigate = useNavigate();


  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
        try{
          const decodeToken = jwtDecode(token);
          setUserName(decodeToken.name);
          
          axios.get("http://localhost:3000/services")
          .then((response)=>{
            setServices(response.data)
            console.log(services);
          })
          .catch(error =>{
            console.error("Error fetching Services",error)
          });
      }catch(error){
          console.error("JWT Decode Error:", error);
          localStorage.removeItem("token");
          navigate("/login");
      }
    }
  }, [navigate]);

  const handleServiceChange = (event) => {
    setSelectedServices(event.target.value);
  };
  

  const handleBooking = () =>{
    
    const totalCost = selectedServices.reduce((acc, serviceName) => {
      const service = services.find(s => s.service_name === serviceName);
      if (service) {
          return acc + service.service_rate * (1 + service.tax_rate / 100);
      }
      return acc;
    }, 0);

    const status = 'pending';

    axios.post("http://localhost:3000/bookings",{
      userName,address,bikeNum,phoneNum,userEmail,date,selectedServices,totalCost,status
    })
    .then(response=>{
      console.log("Booking Successful",response.data);
      setTimeout(()=>{
        setAddress("");
        setBikeNum("");
        setPhoneNum("");
        setDate("");
        setSelectedServices("");
        setUserEmail("");
      },1000)
      
      axios.post("http://localhost:3000/notify-admin",{
        userName,address,bikeNum,phoneNum,userEmail,date,selectedServices,totalCost
      })
      .then(adminResponse=>{
        console.log('Admin notified:', adminResponse.data);
      }).catch(adminError =>{
          console.error("Error notifying admin",adminError);
      })
    }).catch(error=>{
      console.error("Error creatring booking",error);
    })

  }

  return (
    <div className='book-container'>
    <header className='book-header'>
      <h2><Link to='/' style={{ color: "white" }}><span style={{ color: "red" }}>Gear</span> Up</Link></h2>
      <div className='bookhead-profile'>
        <h4>{userName}</h4>
        <Person fontSize="medium" />
      </div>
    </header>
    <nav className='book-navigation'>
      <ul>
        <Link to="/dashboard" style={{color:"white"}}>
          <li>
            <AccountCircle style={{ marginRight: '8px' }} />
            Profile
          </li>
        </Link>
       
        <Link style={{ color: "white" }} to='/dashboard/booking'>
          <li>
            <MiscellaneousServices style={{ marginRight: '8px' }} />
            Book Service
          </li>
        </Link>
        <Link  style={{color:"white"}} to='/dashboard/previous'>
          <li>
            <Task style={{ marginRight: '8px' }} />
            Previous Service
          </li>
        </Link>
      </ul>
    </nav>
    <div className="book-content">
      <h1>Pick Your Services With Us</h1>
      <div className="bookin-section">
        <h2>{userName}</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
          <TextField
            fullWidth
            helperText=""
            id="outlined-basic"
            value={bikeNum}
            label="Bike Number"
            variant="outlined"
            onChange={e => { setBikeNum(e.target.value); }}
            style={{marginBottom:"1em"}}
          />
          <TextField
            fullWidth
            helperText=""
            id="outlined-basic"
            value={address}
            label="address"
            variant="outlined"
            onChange={e => { setAddress(e.target.value); }}
            style={{marginBottom:"1em"}}
          />
          <TextField
            fullWidth
            helperText=""
            id="outlined-basic"
            value={phoneNum}
            label="Phone Number"
            variant="outlined"
            onChange={e => { setPhoneNum(e.target.value); }}
            style={{marginBottom:"1em"}}
          />
           <TextField
            fullWidth
            helperText=""
            id="outlined-basic"
            value={userEmail}
            label="Email"
            variant="outlined"
            onChange={e => { setUserEmail(e.target.value); }}
            style={{marginBottom:"1em"}}
          />
           <FormControl fullWidth variant="outlined" margin="normal" style={{marginBottom:"1em",maxWidth:"100%"}}>
              <InputLabel id="services-label">Services</InputLabel>
              <Select
                labelId="services-label"
                id="service-select"
                style={{minWidth:"80%"}}
                multiple
                value={selectedServices}
                label="Services"
                onChange={handleServiceChange}
                renderValue={(selected) => selected.join(', ')}
              >
                {services.map(service => (
                  <MenuItem key={service.service_id} value={service.service_name} style={{minWidth:"80%"}}>
                    {service.service_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="date"
              fullWidth
              helperText=""
              id="outlined-basic"
              value={date}
              variant="outlined"
              onChange={e => { setDate(e.target.value); }}
              style={{marginBottom:"1em"}}
            />
          <Button size="medium" variant="contained" type="submit" style={{backgroundColor:"red", width:"10em"}}>Book</Button>
        </form>
      </div>
    </div>
  </div>
);
}

export default Booking