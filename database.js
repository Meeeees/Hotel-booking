const mysql = require('mysql2');
const passgen = require('generate-password')
var nodemailer = require("nodemailer")
require('dotenv').config()

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAILUSERNAME,
        pass: process.env.GMAILPASSWORD
    }
})

pool = mysql.createPool({
    host: 'localhost',
    user: 'dijkie',
    password: '7gYjFVGGuA!87',
    database: 'hotelbooking'
}).promise();



async function getHotels() {
    const [result] = await pool.query('SELECT * FROM hotels');
    return result;
}

async function GetBookings(limit) {
    const [result] = await pool.query('SELECT * FROM bookings LIMIT ?', [limit]);
    return result;
}

async function Getbooking(id) {
    const [result] = await pool.query(`
    SELECT 
rooms.name, rooms.roomnumber, customers.id, bookings.date_of_check_in, bookings.date_of_check_out, customers.full_name, customers.email, hotels.name, hotels.city, hotels.price, hotels.phonenumber  FROM rooms
JOIN bookings
	ON bookings.room_id = rooms.id
JOIN customers
	ON bookings.customer_id = customers.id
JOIN hotels
ON hotels.id = rooms.hotelID
WHERE bookings.id = ?
`, [id]);
    return result;
}

const password = passgen.generate({ length: 10, numbers: true })

async function Booking(body) {
    Customer(body).then(customerID => {
        Room(body).then(async (roomID) => {
            const result = await pool.query('INSERT INTO bookings (room_id, customer_id, date_of_check_in, date_of_check_out) VALUES (?, ?, ?, ?)', [roomID, customerID, body.checkInDate, body.checkOutDate]);
            console.log(result);
        })
    })

    const [result] = await pool.query('SELECT * FROM hotels WHERE id = ?', [body.destination]);
    const [roomnumber] = await pool.query(`SELECT * FROM rooms WHERE HotelID = ? AND available = 0 AND name = ?`, [body.destination, body.roomType])

    const mailOptions = {
        from: process.env.GMAILUSERNAME, // sender address
        to: body.email, // list of receivers
        subject: 'Your booking at Onyx', // Subject line
        html: `
        <p>Dear ${body.firstName} ${body.lastName},</p>
        <p>Thank you for booking with us! We are looking forward to seeing you at Onyx Hotels</p>

       <p>Please login to your account with your email and password (see below) to view your booking details.</p>
        <a href="http://localhost:3000/login">Login</a>
        <p>Your password: <strong>${password}</strong></p>

        `
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });

}

async function Customer(body) {
    const [result] = await pool.query('INSERT INTO customers (first_name, last_name, full_name, Passwords, phonenumber, email, address, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [body.firstName, body.lastName, body.firstName + ' ' + body.lastName, password, body.phoneNumber, body.email, body.address, body.gender]);
    return result.insertId;
}

async function Room(body) {
    const [roomnumber] = await pool.query(`SELECT * FROM rooms WHERE HotelID = ? AND available = 0 AND name = ?`, [body.destination, body.roomType])
    return roomnumber[0].id
}

async function Login(email, password) {
    const [result] = await pool.query('SELECT * FROM customers WHERE email = ? AND Passwords = ?', [email, password]);
    for (let i = 0; i < result.length; i++) {
        if (result[i].email === email && result[i].Passwords === password) {
            console.log(result[i].id)
            return result[i].id
        }
    }
}

async function Delete(id) {
    const [result] = await pool.query('DELETE FROM customers WHERE id = ?', [id]);
    return result;
}

module.exports = {
    getHotels,
    GetBookings,
    Getbooking,
    Booking,
    Login,
    Delete
}