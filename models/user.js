var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	firstName:String,
	lastName:String,
	userName:String,
	password:String,
	events: {
	        type: mongoose.Schema.ObjectId,
	        ref: "Events"
		    },
    tourIndex: String
});

var User = mongoose.model("Users", userSchema);
module.exports  = User;