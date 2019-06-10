var express = require("express");
var router = express.Router();


router.get("/", function(req,res){
	res.render("home");
});

router.get("/events/:id", function(req,res){
	res.render("events");
});

router.get("/register", function(req,res){
	res.send("HELLO");
});

router.get("/greetings", function(req,res){
	res.render("greetings");
});


router.get("/", function(req,res){
	res.send("HELLO");
});

module.exports = router;

