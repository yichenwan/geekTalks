 var mongoose = require("mongoose");

 var talkSchema = new mongoose.Schema({
 	title: String,
 	image: String,
 	body: String,
 	tag: String,
 	created: {type: Date, default: Date.now}
 });

module.exports = mongoose.model("Talk", talkSchema);