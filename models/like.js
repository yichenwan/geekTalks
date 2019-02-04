 var mongoose = require("mongoose");

 var likeSchema = new mongoose.Schema ({
 	author: {
 		id : { 		
 			type: mongoose.Schema.Types.ObjectId,
 		    ref: "User"
 		},
 		username: String
 	},
 	talk :{
 		type: mongoose.Schema.Types.ObjectId,
 		ref: "Talk"
 	},
 	state: {
 		type: Boolean,
 		default: false
 	}
 });

 module.exports = mongoose.model("Like", likeSchema);