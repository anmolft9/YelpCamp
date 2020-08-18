var middlewareObj={};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
     
    if (req.isAuthenticated()) {  //if user is logged in?
        Campground.findById(req.params.id, function (err, foundID) {
            if (err) {
                console.log("back");
            } else {
                if (foundID.author.id.equals(req.user._id)) {  //check if the particular user allowed to use manipulate the post?
                    return next();

                }else{
                   res.redirect("/campgrounds/" + req.params.id);
                }
                
            }
        })   
    }else{
        req.flash("error", "Sorry,You donot have permission to do that");
        res.redirect("/campgrounds/" + req.params.id);
    }

}


middlewareObj.checkCommentOwnership = function(req, res, next) {
     
    if (req.isAuthenticated()) {  //if user is logged in?
        Comment.findById(req.params.comment_id, function (err, foundID) {
            if (err) {
                req.flash("error", "Campground not found");
                console.log("back");
            } else {
                if (foundID.author.id.equals(req.user._id)) {  //check if the particular user allowed to use manipulate the post?
                    next();

                }else{
                      
                      res.redirect("back");
            }
        }
        });
    }else{
        req.flash("error","Login please!!");
        res.redirect("back");
    }

}


middlewareObj.isLoggedIn = function(req, res, next) {
  
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please, Login First.Thank you")
    res.redirect("/login");

}


module.exports = middlewareObj;

