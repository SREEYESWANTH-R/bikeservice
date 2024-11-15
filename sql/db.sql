-- creating database
create database bikeInfo;

-- use data base
use bikeInfo;

-- creating table signup
CREATE TABLE signup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    address TEXT,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM signup;

-- creating table admin
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adminId VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
INSERT INTO admin (adminId, password)
VALUES ('AD01', '123@AD');

-- creating table Services
CREATE TABLE Services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_rate DECIMAL(10, 2) NOT NULL,
    tax_rate DECIMAL(4, 2) DEFAULT 5.00
);

-- creating a view to calculte the total cost
CREATE VIEW ServicesWithTotalCost AS
SELECT 
    service_id,
    service_name,
    service_rate,
    tax_rate,
    (service_rate + (service_rate * tax_rate / 100)) AS total_cost
FROM Services;

-- INSERT INTO Services (service_name, service_rate)
-- VALUES 
-- ('Engine Service', 100.00),
-- ('Water Wash', 50.00),
-- ('Brake Service', 80.00);
SELECT * FROM ServicesWithTotalCost;

-- creating table Bookings
CREATE TABLE Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    bike_num VARCHAR(50) NOT NULL,
    phone_num VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    booking_date DATE NOT NULL,
    status ENUM('pending', 'ready to deliver', 'completed') DEFAULT 'pending',
    total_cost DECIMAL(10, 2) NOT NULL
);
SELECT * FROM Bookings;

-- creating table BookingServices
CREATE TABLE BookingServices (
    booking_id INT,
    service_id INT,
    service_name VARCHAR(255),
    service_rate DECIMAL(10, 2),
    tax_rate DECIMAL(4, 2),
    total_cost DECIMAL(10, 2),
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id),
    PRIMARY KEY (booking_id, service_id)
);

SELECT * FROM  BookingServices ;

-- creating table CompletedBookings
CREATE TABLE CompletedBookings (
    booking_id INT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    bike_num VARCHAR(50) NOT NULL,
    phone_num VARCHAR(50) NOT NULL,
    booking_date DATE NOT NULL,
    status ENUM('pending', 'ready to deliver', 'completed') DEFAULT 'completed',
    total_cost DECIMAL(10, 2) NOT NULL
);
SELECT * FROM CompletedBookings;

