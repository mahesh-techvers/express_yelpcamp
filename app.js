if (process.env.NODE_ENV !== 'production') {
    console.log("We are in development mode");
    require('dotenv').config();
}


const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const Joi = require('joi');
const ExpressError = require('./Utils/ExpressError');
const app = express();
const port = 3000;
const path = require('path');

const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp-maptiler')
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.log("MongoDB connection error:");
        console.log(err);
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    //res.send('Hello YepCamp!');
    res.render('Home')
})


app.all(/(.*)/, (req, res, next) => {
    //res.send("Page Not Found")
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    // if (err.name = 'ValidationError') {
    //     return res.render('Error', { statusCode, message })
    // }
    if (!err.message) {
        err.message = "Something went wrong"
    }
    res.status(statusCode).render('Error', { statusCode, message, err })
})


// app.get('/makecampground', async(req,res) =>{
//     const camp = new Campground({ title: 'My Backyard', description: 'POV: Cheap camping!' });
//     await camp.save()
//     res.send(camp);
// })

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})