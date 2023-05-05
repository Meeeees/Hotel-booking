const express = require('express');
const router = express.Router();
const session = require('express-session');
const { Booking, Login, Delete } = require('../database');
const cookieParser = require('cookie-parser');

router.use(cookieParser())


router.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: 'none', maxAge: 3600000 },
    sameSite: 'none'
}));



router.post('/book', (req, res) => {
    Booking(req.body)
    res.redirect('/emailsent')
})

router.post('/login', (req, res) => {
    Login(req.body.email, req.body.password).then(result => {
        if (result.length !== 0) {
            res.cookie('userID', result, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
            res.redirect('/dashboard');
        } else {
            res.send("wrong password or email");
        }
    });
});

router.delete('/booking/:id', (req, res) => {
    Delete(req.params.id)
    res.send("deleted")
})


module.exports = router;