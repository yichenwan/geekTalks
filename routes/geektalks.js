 var express = require("express");
 var router  = express.Router({mergeParams: true});
 var Talk    = require("../models/talk");
 var Tag     = require("../models/tag");
 var Comment = require("../models/comment");
 var Like    = require("../models/like");
 var middleware = require("../middleware");
 var mongoose = require("mongoose");

 router.get("/", function(req, res) {
 	Talk.find({}).sort({createdAt: -1}).populate("user").limit(5).exec(function(err, talks) {
 		if (err) {
 			console.log("error");
 		}
 		else {
 			Talk.find({}).sort({countLike: -1}).limit(5).populate("user").exec(function(err, ratingTalks) {
		    	if (err) {
		    		console.log(err);
		    		res.redirect("/");
		    	}
		    	else {
		    		// console.log(talks);
		    		// console.log(ratingTalks);
		    	   	res.render("geekTalks/index", {talks: talks, ratingTalks: ratingTalks});
		    	}
		    });
 		}
 	});
 });

 router.get("/new", middleware.isLoggedIn, function(req, res) {
 	res.render("geekTalks/new");
 });

 router.post("/", middleware.isLoggedIn, function(req, res) {
 	Talk.create(req.body.talk, function (err, newTalk) {
      if (err) {
      	res.render("new");
      }
      else {
		newTalk.user = req.user;
		newTalk.save();	
		req.flash("success", "Successfully added talk");	    	
      	res.redirect("/geektalks");     	
      }
 	});
 });

 router.get("/:tag/", function(req, res) {
 	Talk.find(
 		{tag: req.params.tag}).sort({createdAt: -1}).limit(5).populate("user").exec(function(err, foundTalks) {
 		if (err) {
 			res.redirect("/geektalks");
 		}
 		else {
 			Tag.findOne({tag: req.params.tag}, function (err, foundTag) {
		 		if (err) {
		 			res.redirect("/geektalks");
		 		}
		 		else {
		 			// console.log(foundTalks);
		 			Talk.find({tag: req.params.tag}).sort({countLike: -1}).limit(5).populate("user").exec(function(err, ratingTalks) {
				    	if (err) {
				    		console.log(err);
				    		res.redirect("/");
				    	}
				    	else {
				    		// console.log(talks);
				    		// console.log(ratingTalks);
				    	   	res.render("geekTalks/showTag", {tagTitle:req.params.tag, talks: foundTalks, foundTag: foundTag, ratingTalks: ratingTalks});
				    	}
				    });		 			
		 		}
 			});
 		}
 	});
 }); 

 router.get("/:tag/:id", function(req, res) {
 	Talk.findById(req.params.id).populate("comments").populate("user").populate("likes").exec(function(err, foundTalk) {
 		if (err) {
 			res.redirect("/geektalks");
 		}
 		else {
 			// console.log(foundTalk.user);
 			// console.log(foundTalk.comments);
 			res.render("geekTalks/showTalk", {talk: foundTalk});
 		}
 	});
 });

 router.get("/:tag/:id/edit", middleware.checkTalkOwenership, function(req, res) {
 	Talk.findById(req.params.id, function(err, foundTalk) {
 		res.render("geekTalks/edit", {talk: foundTalk});
 	});
 });

 router.put("/:tag/:id", middleware.checkTalkOwenership, function(req, res) {
 	Talk.findByIdAndUpdate(req.params.id, req.body.talk, function(err, updateTalk){
 		if (err) {
 			res.redirect("/geektalks");
 		}
 		else {
 			res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);
 		}
 	});
 });

 router.delete("/:tag/:id", middleware.checkTalkOwenership,function(req, res) {
 	Like.remove({
 		talk : new mongoose.Types.ObjectId(req.params.id)
 	}, function(err) {
 		Comment.remove({
 			talk : new mongoose.Types.ObjectId(req.params.id)
 		}, function(err) {
		 	Talk.findByIdAndRemove(req.params.id, function(err) {
		 		req.flash("success", "talk deleted");
		 		res.redirect("/geektalks");
		 	});
 		})
 	})
 });

module.exports = router;