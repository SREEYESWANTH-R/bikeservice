import React,{useEffect,useState} from 'react'
import "./AdminDash.css"
import { useNavigate } from 'react-router-dom'
import { Button, Typography, Card, CardContent } from '@mui/material';
import { BarChart, AccountCircle,VerifiedUser,Group, Dashboard, People, Settings } from '@mui/icons-material';
import axios from 'axios'

function AdminDash(){

  const[adminName,setAdminName] = useState("");
  const[userCount,setUserCount] = useState(0);
  const[activeUser,setActiveUser] = useState(0);
  const navigate = useNavigate();

  const fetchUserData = async ()=>{
    try{
      const response  = await axios.get("http://localhost:3000/admin/dashboard");
      setUserCount(response.data.totalUsers)
      setActiveUser(response.data.activeUser);
    }catch(error){
      console.error("Error fetching total users:", error);
    }
  }

  useEffect(()=>{
    const logged = localStorage.getItem("adminLogged");
    if(!logged){
      navigate('/admin/login');
    }else{
      const Adname = localStorage.getItem("adminID");
      setAdminName(Adname);
      fetchUserData();
    }
  },[navigate]);

  

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
              <Typography variant="h5">Active Services</Typography>
              <Typography variant="h6">105</Typography>
            </CardContent>
          </Card>
          <Card className='admin-card'>
            <CardContent>
              <Typography variant="h5">Completed Services</Typography>
              <Typography variant="h6">105</Typography>
            </CardContent>
          </Card>
        </div>
        <div className='admin-dash-graphs'>
          <Card className='admin-graph-card'>
            <CardContent>
              <Typography variant="h5">Service Analytics</Typography>
              {/* Include your graph component here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
};

export default AdminDash