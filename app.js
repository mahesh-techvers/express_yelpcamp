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
//const MongoDBStore = require('connect-mongo')(session);
const MongoStore = require('connect-mongo').default;
const ExpressError = require('./Utils/ExpressError');
const app = express();
app.set('query parser', 'extended');
const port = process.env.PORT || 3000;
const path = require('path');

const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/review');
const sanitizeV5 = require('./Utils/mongoSanitizeV5.js');
//const db_url = process.env.DB_URL;
const db_url = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp-maptiler'


//mongodb+srv://maheshr_db_user:<db_password>@cluster0.m238eyb.mongodb.net/?appName=Cluster0

mongoose.connect(db_url)
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
app.use(sanitizeV5({ replaceWith: '_' }));
// app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

const secret = process.env.SECRET;

// const store = new MongoDBStore({
//     url: db_url,
//     secret,
//     touchAfter: 24 * 60 * 60
// })
const store = MongoStore.create({
    mongoUrl: db_url,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    secret,
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

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "blob:",
                "data:",
                "https://res.cloudinary.com",
                "https://images.unsplash.com",
                "https://api.maptiler.com",
                "https://cdn.maptiler.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log("User Query====>", req.query)
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
    console.log("ERROR HANDLER:", err);
    // if (err.name = 'ValidationError') {
    //     return res.render('Error', { statusCode, message })
    // }
    if (!err.message) {
        err.message = "Something went wrong"
    }
    // Fix for ReferenceError: currentUser is not defined
    res.locals.currentUser = res.locals.currentUser || null;
    res.locals.success = res.locals.success || [];
    res.locals.error = res.locals.error || [];
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