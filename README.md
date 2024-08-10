### Bike Service Management System
Overview
 This project is a Bike Service Management System designed to manage bike service bookings, user profiles, and administrative tasks. The system includes features for  user signup, login, service bookings, and administrative dashboard for viewing booking statistics and user activities.

EXECUTION PART 

 1. Open New Folder In VSCode
 
 2. Clone Git Repo
    ```
    git clone https://github.com/SREEYESWANTH-R/bikeservice.git
    ```
 
 3.Node Modules Installation
   npm install
 4.Data Base SetUp
   4.1 - Open MySQl Workbench and create a new connection
   4.2 - Change the host name to localhost
   4.3 - Set Your user name
   4.4 - Set Your password
   4.5 - Set the databasename 
   
 4.Open Two Terminal side by side 
  Execute in first terminal
   -> npm run back
  Execute in second terminal
   -> npm run start

6.Enter sample Data from sampleData.txt
     
Features
 User Features
   1.Signup and Login
    ->Users can sign up and log in to their accounts.
    ->Passwords are hashed using bcrypt for security.
    ->JWT tokens are used for session management.
   
   2.Profile Management
    ->Users can view their profile information.
    ->Users can log out, which updates their active status in the database.
   
   3.Service Booking
     ->Users can book bike services by selecting from available services.
     ->Booking details include user information, bike number, phone number, booking date, selected services, total cost, and booking status.
     ->Users receive email notifications upon booking.
   
   4.View Previous Services
     ->Users can view their previous bookings, including detailed information about each booking and the services included.

Admin Features

  1.Admin Login
    ->Admins can log in using their credentials to access the administrative dashboard.
  
  2.Dashboard
    ->The admin dashboard displays statistics, such as the total number of users and active users.
    ->Admins can view all bookings along with detailed information about each booking.
  
  3.Service Management
    ->Admins can add new services to the system.
    ->Admins can delete services from the system.
  
Database Structure
  ->Bookings Table: Stores information about each booking, including user details, booking date, total cost, and status.
  ->BookingServices Table: Stores information about the services associated with each booking, including service details and costs.


Modules Used
  Backend
    ->Express.js: A web application framework for Node.js.
    ->MySQL2: A MySQL client for Node.js, used for database operations.
    ->Cors: A package to enable Cross-Origin Resource Sharing.
    ->Bcrypt: A library to help hash passwords.
    ->Jsonwebtoken (JWT): A package to generate and verify JSON Web Tokens for authentication.
    ->Nodemailer: A module to send emails from Node.js applications.
    
  Frontend
    ->React: A JavaScript library for building user interfaces.
    ->@mui/material: A library for Material-UI components.
    ->@mui/icons-material: A library for Material-UI icons.
    ->ReCharts - a library for react graphs 
  Axios: A promise-based HTTP client for the browser and Node.js.

