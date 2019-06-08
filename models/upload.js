var mongoose = require("mongoose");

var uploadSchema = new mongoose.Schema({
	sketch:String,
	cover:String
});

var Upload = mongoose.model("Upload", uploadSchema);
module.exports  = Upload;
