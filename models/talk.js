 var mongoose = require("mongoose");

 var talkSchema = new mongoose.Schema({
 	title: String,
 	image: String,
 	body: String,
 	tag: String,
 	comments: [{
 		type: mongoose.Schema.Types.ObjectId,
 		ref: "Comment"
 	}],
 	created: {type: Date, default: Date.now}
 });

module.exports = mongoose.model("Talk", talkSchema);