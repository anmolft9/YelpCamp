var express = require('express')
    router = express.Router(),
    Campground = require("../models/campgrounds"),
    Comment = require("../models/comments"),
    middleware = require("../middleware/index");

//add new comments
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function (req, res) {

    //find campground through id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
})

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {

            Comment.create(req.body.comment, function (err, newComment) {
                if (err) {
                    console.log(err)
                } else {

                    //add the username and id
                    newComment.author.id       = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();

                    campground.comment.push(newComment);
                    campground.save();


                    req.flash("success", "comment added")
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});


//EDIT the comment GET ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    
    Campground.findById(req.params.id, function(err, foundCampground){
        Comment.findById(req.params.comment_id,function(err, foundComment){
            if(err){
                return(err);
            }
            res.render("comments/edit",{foundCampground:foundCampground, foundComment:foundComment});
        }); 
    })
        
});


//EDIT the comment PUT ROUTE
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function (req, res) {
    // res.send("you have reached");

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            // redirect("/campgrounds/"+ req.params.id + "/comments/" + req.params.comment_id);
        }else{
            // console.log(updatedComment);
            req.flash("success", "Successfully edited the comment")
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});


//DELETE the comment route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
            if(err){
                return("back");
            }
            
            req.flash("success", "Successfully deleted the comment")
            res.redirect("/campgrounds/"+req.params.id);
        })
    })
})


module.exports = router;