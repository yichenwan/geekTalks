 var mongoose = require("mongoose");

 var tagSchema = new mongoose.Schema({
 	tag: String,
 	img: String,
 	description: String
 });

module.exports = mongoose.model("Tag", tagSchema);