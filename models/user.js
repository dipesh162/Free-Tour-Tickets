var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    // beautifyUnique = require('mongoose-beautiful-unique-validation');

var userSchema = new mongoose.Schema({
	firstName:{type: String, required:'First Name can\'t be blank'},
	lastName:{type: String, required:'Last Name can\'t be blank'},
	username:{type: String, unique:true, required:'Username can\'t be blank'},
	email:{type: String, unique:true, required:'Email can\'t be blank'},
	password:{type: String, required:'Password can\'t be blank'},
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