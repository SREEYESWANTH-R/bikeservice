const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
const multer  = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const { count } = require("console");

dotenv.config();

//app setup
const app = express();

app.use(cors({
    origin:["http://localhost:3001"],
    methods:['POST','GET','DELETE'],
    credentials : true
}));
app.use(express.json());
const port = 3000

//database connection
const db = mysql2.createConnection(
    {
        host:"localhost",
        user:"root",
        password:"root",
        database:"bikeinfo"
    }
)

//connection check of database
db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("MySOL Connected..");
})

// Middleware to authenticate token and extract user info
// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
  
//     if (token == null) return res.sendStatus(401);
  
//     jwt.verify(token, 'your_jwt_secret', (err, user) => {
//       if (err) return res.sendStatus(403);
//       req.user = user;
//       next();
//     });
//   };
  


//route for user signup
app.post("/signup",async(req,res)=>{
    const{name,gender,mobile,email,address,password} = req.body;
    const hashPass = await bcrypt.hash(password,10); 
    const user = {name,gender,mobile,email,address,password: hashPass};
    const query = "INSERT INTO signup SET ?";
    db.query(query,user,(err,result)=>{
        if(err){
            return res.status(500).send(err);
        }
        res.status(200).send("User Registered");
    });
});

//route for user login
app.post('/login',(req,res)=>{
    const{identifer,logpass} = req.body;
    const query = "SELECT * FROM signup WHERE email = ? OR mobile = ?";
    db.query(query,[identifer,identifer],(err,result)=>{
        if(err) return res.json({status:"error", Error:"Error executing query"});
        if(result.length > 0){
            const user = result[0]
            
            bcrypt.compare(logpass.toString(),user.password,(err,response)=>{
                if(err) return res.json({status:"Error"});
                if(response){
                    const token = jwt.sign({id:user.id, name:user.name},"Jwt_Secret",{expiresIn:'1h'});
                    const updateQuery = "UPDATE signup SET active = ? WHERE id=?";
                   
                    db.query(updateQuery,[true,user.id],(err,updateResult)=>{
                        if(err) return res.status(500).json({Error:"Error updating active status"});
                        return res.status(200).json({message:"Successfull",token:token,name:user.name});
                    })   
                }else{
                    return res.status(500).json({Error:"wrong email or password"});
                }
            });
        }else{
            return res.json({status:"Error" , message:"Wrong Email"})
        }
    });
});

//route for admin login
app.post("/admin/login",(req,res)=>{
    const {adminId , adminPass} = req.body;
    const sql = "SELECT * FROM admin WHERE adminId = ? AND password = ?";
    db.query(sql,[adminId,adminPass],(err,result)=>{
        if(err) return res.status(500).json({Error:"Error fetching admin data"});
        if(result.length > 0){
            const admin = result[0];
            res.status(200).json({message:" Login successfull" , adminID:admin.adminId });
        }else{
            res.status(401).json({ Error: "Invalid credentials" });
        }
    });
});

app.get("/admin/dashboard",(req,res)=>{
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM signup) AS totalUsers,
            (SELECT COUNT(*) FROM signup WHERE active = 1) AS activeUser
        `
    db.query(sql,(err,result)=>{
        if(err){
            console.error("Error fetching Conut",err);
            res.status(500).json({error:"Error fetching appoinment details"});
        }
        res.status(200).json({message:"successful", totalUsers:result[0].totalUsers,activeUser:result[0].activeUser});
    })
})

app.post('/logout',(req,res)=>{
    const {id} = req.body;
    const logoutSql = "UPDATE signup SET active = 0 WHERE id = ?";
    db.query(logoutSql,id,(err,logoutRes)=>{
        if(err) return res.status(500).json({Error:"Error updating active status"});
        res.status(200).json({message:"Logout successful"});
    })
})

//route to get data from the Services table
app.get("/services",(req,res)=>{
    const sql = "SELECT * FROM Services";
    db.query(sql,(err,result)=>{
        if(err) return res.status(500).json({Error:"Error Fetching services"});
        res.status(200).json(result);
    })
})

//route to add new services 
app.post('/services/add',(req,res)=>{
    const {newService,newServicerate} = req.body;
    const insertSQL = "INSERT INTO Services (service_name,service_rate) VALUES (?,?)";
    db.query(insertSQL,[newService,newServicerate],(err,result)=>{
        if(err) return res.status(500).json({Error:"Error updating new services"});
        res.sendStatus(200).json(result);
    });
});

app.delete('/services/delete', (req, res) => {
    const { serviceName} = req.body;

    // Query to find the service_id by service_name
    const getServiceIdQuery = "SELECT service_id FROM Services WHERE service_name = ?";
    db.query(getServiceIdQuery, [serviceName], (err, result) => {
        if (err) {
            console.error('Error fetching service ID:', err);
             res.status(500).json({ error: 'Error fetching service ID' });
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Service not found' });
        }
        const serviceId = result[0].service_id;

        // Query to delete the service by service_id
        const deleteServiceQuery = "DELETE FROM Services WHERE service_id = ?";
        db.query(deleteServiceQuery, [serviceId], (err) => {
            if (err) {
                console.error('Error deleting service:', err);
                return res.status(500).json({ error: 'Error deleting service' });
            }
            res.status(200).json({ message: 'Service deleted successfully' });
        });
    });
});



//route for booking
app.post("/bookings",(req,res)=>{
    const { userName,address,bikeNum,phoneNum,date,selectedServices,totalCost,status} = req.body

    const bookSql = "INSERT INTO Bookings (user_name, address,bike_num,phone_num,booking_date,total_cost, status) VALUES (?,?,?,?,?,?,?) "
    db.query(bookSql,[userName,address,bikeNum,phoneNum,date,totalCost,status],(err,results)=>{
        if(err){
            console.error('Error inserting booking:',err);
            return res.status(500).send('Error creating booking');
        }
        const booking_Id = results.insertId;
        selectedServices.forEach(serviceName =>{
            db.query("SELECT service_id, service_rate, tax_rate FROM Services WHERE service_name = ?", [serviceName],
            (err,serviceResult)=>{
                if(err){
                    console.error('Error fetching service',err);
                    return;
                }
                if(serviceResult.length > 0){
                const service = serviceResult[0];
                const { service_id, service_rate, tax_rate } = service;
                const totalServiceCost = service_rate * (1 + tax_rate / 100);
                
                db.query("INSERT INTO BookingServices (booking_id, service_id, service_name,service_rate,tax_rate,total_cost) VALUES (?,?,?,?,?,?)",
                    [booking_Id,service_id,serviceName,service_rate,tax_rate,totalServiceCost],
                    (err)=>{
                        if(err){
                            console.error("Error inserting booking services:",err);
                        }
                    });
                }
            });
        });
        res.send('Booking created successfully');
    })
})


//route to get the booking          
app.get("/bookings", (req, res) => {
    const bookSql = `
        SELECT 
            B.booking_id, B.user_name, B.address, B.bike_num, B.phone_num, B.booking_date, B.total_cost, B.status,
            GROUP_CONCAT(S.service_name SEPARATOR ', ') AS services,
            SUM(BS.total_cost) AS service_total_cost
        FROM 
            Bookings B
        LEFT JOIN 
            BookingServices BS ON B.booking_id = BS.booking_id
        LEFT JOIN
            Services S ON BS.service_id = S.service_id
        GROUP BY 
            B.booking_id
        ORDER BY 
            B.booking_id
    `;

    db.query(bookSql, (err, results) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            res.status(500).send('Error fetching bookings');
        }

        res.send(results);
    });
});


//route to count the booking active and completed details

app.get('/booking/status',(req,res)=>{
    const sql = `
    SELECT
            (SELECT COUNT(*) FROM Bookings WHERE status = 'pending') AS pendingBooking,
            (SELECT COUNT(*) FROM Bookings WHERE status = 'completed') AS CompleteBook
    `

    db.query(sql,(err,countres)=>{
        if(err) {res.status(404).json("Error sending count");}
        else{
           
            res.status(200).json({message:"Count Sent Successfully",pendingBook:countres[0].pendingBooking,comBooking:countres[0].completeBooking});
        }
    })
});


//route get the details of booking of the user 
app.get('/customer/bookings/:username', (req, res) => {
    const username = req.params.username;
    const query = `
        SELECT 
            B.booking_id, 
            B.user_name, 
            B.address, 
            B.bike_num, 
            B.phone_num, 
            B.booking_date, 
            B.total_cost, 
            B.status,
            GROUP_CONCAT(BS.service_name SEPARATOR ', ') AS services,
            SUM(BS.total_cost) AS service_total_cost
        FROM 
            Bookings B
        INNER JOIN 
            BookingServices BS ON B.booking_id = BS.booking_id
        WHERE 
            B.user_name = ?
        GROUP BY 
            B.booking_id
        ORDER BY 
            B.booking_id
    `;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            res.status(500).send('Error fetching bookings');
        }
        if (results.length === 0) {
             res.status(404).send(`No bookings found for username: ${username}`);
        }
        res.json(results);
    });
});




//route for notifying admin
app.post('/notify-admin',(req,res)=>{
    const{userName,address,bikeNum,phoneNum,date,selectedServices,totalCost} = req.body;

    //setting up node mailer
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'sreeyeswanthr@gmail.com', //your mail
            pass:'tqpb lden jcwh uigf' //your 2 step verification -> app password
        }
    });
     // Email options
    const mailOptions = {
    from: 'sreeyeswanthr@gmail.com',
    to: 'sololevelingrise24@gmail.com',
    subject: 'New Booking Received',
    text: `New booking details:
    \nUser Name: ${userName}
    \nAddress: ${address}
    \nBike Number: ${bikeNum}
    \nPhone Number: ${phoneNum}
    \nDate: ${date}
    \nSelected Services: ${selectedServices.join(', ')}
    \nTotal Cost: ${totalCost}
    \nStatus: pending`  // Add the initial status here
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error notifying admin');
    }
    res.send('Admin notified');
  });
});

app.listen(port,()=>{
    console.log(`Server is running on Port ${port}`)
})