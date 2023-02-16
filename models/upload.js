var mongoose = require("mongoose");

var uploadSchema = new mongoose.Schema({
	sketch:String,
	cover:String,
	ownerId:{
		type: mongoose.Schema.Types.ObjectId,
	},
	shortListed: false
});

var Upload = mongoose.model("Upload", uploadSchema);
module.exports  = Upload;
