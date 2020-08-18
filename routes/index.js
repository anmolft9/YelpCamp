var express = require('express'),
    router = express.Router(),
    passport = require("passport"),
    User = require('../models/user');


//root route
router.get("/", function (req, res) {
    res.render("landing");
});


//authenticate routes
//signup get route
router.get("/register", function (req, res) {
    res.render("register");
});

//sign up post route
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            // console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
            
        }else{
            passport.authenticate("local")(req, res, function (err, user) {
                req.flash("success", "welcome to the team "+ req.body.username);
                res.redirect("/campgrounds");
            });
        }
        
    })
});

//login get-route
router.get("/login", function (req, res) {
    res.render("login");
});

//app post-route
//app.post("login",middleware,callback())
router.post("/login", passport.authenticate("local",
{   
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: 'Welcome!',
    failureFlash: 'Invalid Id or Password, Please try again'
}), 
function (req, res) {

});

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "you are logged out!!")
    res.redirect("/campgrounds");
});


//middlewate for checking if logged in
//middleware to authenticate 
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;   