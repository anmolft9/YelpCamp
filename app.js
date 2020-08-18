require('dotenv').config();
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash = require("connect-flash"),
    methodOverride   = require("method-override"),
    User = require("./models/user"),
    campgroundRoute = require("./routes/campground"),
    commentRoute = require("./routes/comment"),
    indexRoute = require("./routes/index");
    app.locals.moment = require('moment'),

 //error handler   
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

//db connect
mongoose.connect("mongodb://localhost/yelp_camp_db4");
// seedDB = require("./seeds");   //seeding the datas

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash()); 

// seedDB();
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");

//passport
app.use(require("express-session")({
    secret: "maya nai ho sansaar ko anmol chij",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error    = req.flash("error");
    res.locals.success    = req.flash("success");

    next();
});

//using the routes
app.use("/", indexRoute);
app.use(campgroundRoute);
app.use(commentRoute);

app.listen(3000, "127.0.0.1", function () {
    console.log("server has started")
})