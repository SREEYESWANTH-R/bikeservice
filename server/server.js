const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
const multer  = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser")

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

//route for signup
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

//route for login
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
                    return res.status(200).json({message:"Successfull",token});   
                }else{
                    return res.status(500).json({Error:"wrong email or password"});
                }
            });
        }else{
            return res.json({status:"Error" , message:"Wrong Email"})
        }
    });
});

app.listen(port,()=>{
    console.log(`Server is running on Port ${port}`)
})