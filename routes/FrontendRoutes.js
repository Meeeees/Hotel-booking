const express = require('express');
const router = express.Router();

const { getHotels, GetBookings, Getbooking } = require('../database');

router.get('/', async (req, res) => {
    res.render('index', {
        title: 'Home'
    });
});

router.get('/rooms', async (req, res) => {
    res.render('rooms', {
        title: 'Rooms',
    })
})

router.get('/facilities', (req, res) => {
    res.render('facilities', {
        title: 'Facilities',
    })
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})

router.get('/emailsent', (req, res) => {
    res.render('emailsent', {
        title: 'sent email!'
    })
})

router.get('/booking', async (req, res) => {
    res.render('booking', {
        title: 'Booking',
        hotelsCanada: await Hotelsin("Canada"),
        hotelsGermany: await Hotelsin("Germany"),
        hotelsSouthAfrica: await Hotelsin("SouthAfrica"),
        hotelsFrance: await Hotelsin("France")
    })
})

router.get('/dashboard', async (req, res) => {
    if (req.cookies.userID !== undefined) {
        res.render('dashboard', {
            title: 'Dashboard',
            data: await Getbooking(req.cookies.userID)
        })
    } else {
        res.send('You are not logged in ' + req.cookies.userID)
    }
})

async function Hotelsin(country) {
    const hotels = await getHotels()
    let Canada = [];
    let Germany = [];
    let SouthAfrica = [];
    let France = [];
    hotels.forEach(hotel => {
        switch (hotel.country) {
            case "Canada":
                Canada.push(hotel)
                break;
            case "Germany":
                Germany.push(hotel)
                break;
            case "South Africa":
                SouthAfrica.push(hotel)
                break;
            case "France":
                France.push(hotel)
                break;
            default:
                break;
        }
    })
    switch (country) {
        case "Canada":
            return Canada;
        case "Germany":
            return Germany;
        case "SouthAfrica":
            return SouthAfrica;
        case "France":
            return France;
        default:
            break;

    }
}

module.exports = router;
