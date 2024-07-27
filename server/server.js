const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
const multer  = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer')

//app setup
const app = express();

app.use(cors({
    origin:["http://localhost:3001"],
    methods:['POST','GET'],
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
        database:"bikeInfo"
    }
)

//connection check of database
db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("MySOL Connected..");
})

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
            return res.status(500).json({error:"Error fetching appoinment details"});
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

//route for handling booking
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

//route for notifying admin
app.post('/notify-admin',(req,res)=>{
    const{userName,address,bikeNum,phoneNum,date,selectedServices,totalCost} = req.body;

    //setting up node mailer
    const transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:'sololeveling24',
            pass:'solo@123'
        }
    });
     // Email options
    const mailOptions = {
    from: 'sololeveling24',
    to: 'sreeyeswanthr@gmail.com',
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