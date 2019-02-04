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
 	likes: [{
 		type: mongoose.Schema.Types.ObjectId,
 		ref : "Like"
 	}],
 	countLike : {
 		type: Number,
 		default: 0
 	},
 	createdAt: {type: Date, default: Date.now}
 });

module.exports = mongoose.model("Talk", talkSchema);