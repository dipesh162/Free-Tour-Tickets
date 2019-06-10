var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    // beautifyUnique = require('mongoose-beautiful-unique-validation');

var userSchema = new mongoose.Schema({
	firstName:String,
	lastName:String,
	username:String,
	password:String,
	events: {
	        type: mongoose.Schema.Types.ObjectId
		    },
    tourIndex: String
});

userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(beautifyUnique);

var User = mongoose.model("Users", userSchema);
module.exports  = User;