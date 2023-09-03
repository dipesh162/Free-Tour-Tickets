var express = require("express");
var mongoose = require("mongoose");

var submissionschema = new mongoose.Schema({
  event :{ 
             type: mongoose.Schema.Types.ObjectId 
          },
//   uploads: [{
//              type: mongoose.Schema.Types.ObjectId 
//           }]    
});

var Submission = mongoose.model("Submission", submissionschema);
module.exports = Submission;


