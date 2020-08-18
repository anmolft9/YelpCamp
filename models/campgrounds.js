var mongoose    = require("mongoose");
// var Campground = require("./models/campgrounds");


//schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    price:String,
    image:String,
    description:String,
    location:String,
    lat:Number,
    lng:Number,
    createAt:{type:Date, default:Date.now},
    author: {
        id:{
           type : mongoose.Schema.Types.ObjectId,
           ref  : "User"
        },
        username:String
    },
    comment:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ]
    });
    
    //create database model and send
 module.exports = mongoose.model("campground", campgroundSchema);