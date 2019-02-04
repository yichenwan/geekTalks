 var express = require("express");
 var router  = express.Router({mergeParams: true});
 var Talk    = require("../models/talk");
 var Like     = require("../models/like");
 var middleware = require("../middleware");

 router.post("/", middleware.isLoggedIn, function(req, res) {
 	Talk.findById(req.params.id).populate("likes").exec(function(err, foundTalk){
		if (err) {
			return res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);
		}
		var like = {
			author: {
				id: req.user._id,
				username: req.user.username
			},
			talk: foundTalk._id,
			state: true
		}
		Like.create(like, function(err, newLike){
			if (err) {
				res.redirect("back");
			}
			else {
				foundTalk.likes.push(newLike);
				foundTalk.countLike = calculateCount(foundTalk.likes);
				foundTalk.save();
				// console.log(foundTalk);
				console.log(foundTalk.countLike);
				res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);
			}
		}); 		
 	});
 });

 router.put("/:like_id", middleware.isLoggedIn, function(req, res) {
	Like.findById(req.params.like_id, function(err, foundLike){
		if (err) {

		} else {
		    foundLike.state = !foundLike.state;
		    foundLike.save();
		    Talk.findById(req.params.id).populate("likes").exec(function (err, foundTalk) {
				foundTalk.countLike = calculateCount(foundTalk.likes);
				foundTalk.save();		  
				res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);				  	
		    });
		}
	});	
 });

 function calculateCount(likes) {
 	if (likes.length === 0) {
 		return 0;
 	}
 	else {
 		var count = 0;
 		likes.forEach(function(like){
 			// console.log(like.state);
 			if (like.state === true)
 				count++; 
 		});
 		return count;
 	}
 }

 module.exports = router;