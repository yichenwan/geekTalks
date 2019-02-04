 var mongoose = require("mongoose");

 var talkSchema = new mongoose.Schema({
 	title: String,
 	image: String,
 	body: String,
 	tag: String,
 	user: {
 		type: mongoose.Schema.Types.ObjectId,
 		ref: "User"
 	},	
 	comments: [{
 		type: mongoose.Schema.Types.ObjectId,
 		ref: "Comment"
 	}],
 	createdAt: {type: Date, default: Date.now}
 });

module.exports = mongoose.model("Talk", talkSchema);