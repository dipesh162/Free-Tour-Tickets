var express = require("express");
var mongoose = require("mongoose");

var submissionschema = new mongoose.Schema({
  firstName: String,
  secondName: String,
  email: String,
  sketch: String,
  cover: String,
  comment: String
});

var Submission = mongoose.model("Submission", submissionschema);
module.exports = Submission;


