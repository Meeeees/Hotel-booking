const express = require('express');
const app = express();
const FrontendRoutes = require('./routes/FrontendRoutes');
const BackendRoutes = require('./routes/BackendRoutes');
const morgan = require('morgan');
require('dotenv').config();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser())

app.use(morgan('dev'));

app.use((req, res, next) => {
    res.locals.session = req.session; // make session data available to templates
    next();
});

app.use('/', FrontendRoutes, BackendRoutes);

// page not found
app.get('*', (req, res) => {
    res.render('404', {
        title: 'Page not found',
    })
})

app.listen(port, () => console.log(`https://hotel-booking-production.up.railway.app`)) 
