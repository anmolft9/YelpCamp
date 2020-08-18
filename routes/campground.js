var express = require('express'),
    router = express.Router(),
    Campground = require("../models/campgrounds");
    Comment = require("../models/comments"),
    middleware = require("../middleware/index");
    var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);





//show all campgrounds
router.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampground, currentUser: req.user });
        }
    });
});



//CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price= req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;
      var newCampground = {name: name, image: image, price: price, description: desc, author:author, location: location, lat: lat, lng: lng};
      // Create a new campground and save to DB
      Campground.create(newCampground, function(err, newlyCreated){
          if(err){
              console.log(err);
          } else {
              //redirect back to campgrounds page
              console.log(newlyCreated);
              res.redirect("/campgrounds");
          }
      });
    });
  });


//Its a route to CREATE campground route
router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});


//SHOW the campground description
router.get("/campgrounds/:id", function (req, res) {
    //find the campground with the provided id
    Campground.findById(req.params.id).populate("comment").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {

            //render show template with the campground    
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});


//route for EDITTING the campground
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
                Campground.findById(req.params.id, function (err, foundID){
                res.render("campgrounds/edit", { foundID: foundID }); 
              });
});

//EDIT post route..or updating the campground

// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
  
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });
  });


//delete the post plus the comments associated with that particular post
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, middleware.isLoggedIn, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany({ _id: { $in: campgroundRemoved.comment } }, (err) => {
            if (err) {
                console.log(err);
            }
            req.flash("success", "successfully deleted")
            res.redirect("/campgrounds");
        });
    })
});

module.exports = router;