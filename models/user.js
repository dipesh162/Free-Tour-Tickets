var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    // beautifyUnique = require('mongoose-beautiful-unique-validation');

var userSchema = new mongoose.Schema({
	firstName:{type: String},
	lastName:{type: String},
	username:{type: String, unique:true},
	email:{type: String, unique:true},
	password:{type: String},
	events: {
	        type: mongoose.Schema.Types.ObjectId
		    },
	tourIndex: Number,
	uploads: { type: mongoose.Schema.Types.ObjectId }
});

userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(beautifyUnique);

var User = mongoose.model("Users", userSchema);
module.exports  = User;