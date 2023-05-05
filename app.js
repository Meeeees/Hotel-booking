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

app.listen(port, () => console.log(`https://localhost:${port}`)) 
