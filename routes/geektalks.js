 var express = require("express");
 var router  = express.Router({mergeParams: true});
 var Talk    = require("../models/talk");
 var Tag     = require("../models/tag");


 router.get("/", function(req, res) {
 	Talk.find({}).populate("user").exec(function(err, talks) {
 		if (err) {
 			console.log("error");
 		}
 		else {
 			res.render("geekTalks/index", {talks: talks});
 		}
 	});
 });

 router.get("/new", isLoggedIn, function(req, res) {
 	res.render("geekTalks/new");
 });

 router.post("/", isLoggedIn, function(req, res) {
 	Talk.create(req.body.talk, function (err, newTalk) {
      if (err) {
      	res.render("new");
      }
      else {
		newTalk.user = req.user;
		newTalk.save();		    	
      	res.redirect("/geektalks");     	
      }
 	});
 });

 router.get("/:tag/", function(req, res) {
 	Talk.find(
 		{tag: req.params.tag}).populate("user").exec(function(err, foundTalks) {
 		if (err) {
 			res.redirect("/geektalks");
 		}
 		else {
 			Tag.findOne({tag: req.params.tag}, function (err, foundTag) {
		 		if (err) {
		 			res.redirect("/geektalks");
		 		}
		 		else {
		 			console.log(foundTalks);
 					res.render("geekTalks/showTag", {talks: foundTalks, foundTag: foundTag});
		 		}
 			});
 		}
 	});
 }); 

 router.get("/:tag/:id", function(req, res) {
 	Talk.findById(req.params.id).populate("comments").populate("user").exec(function(err, foundTalk) {
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

 router.get("/:tag/:id/edit", checkTalkOwenership, function(req, res) {
 	Talk.findById(req.params.id, function(err, foundTalk) {
 		res.render("geekTalks/edit", {talk: foundTalk});
 	});
 });

 router.put("/:tag/:id", checkTalkOwenership, function(req, res) {
 	Talk.findByIdAndUpdate(req.params.id, req.body.talk, function(err, updateTalk){
 		if (err) {
 			res.redirect("/geektalks");
 		}
 		else {
 			res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);
 		}
 	});
 });

 router.delete("/:tag/:id", checkTalkOwenership,function(req, res) {
 	Talk.findByIdAndRemove(req.params.id, function(err) {
 		res.redirect("/geektalks");
 	});
 });

 function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect("/login");
	}
};

function checkTalkOwenership(req, res, next) {
	if (req.isAuthenticated()) {	
		Talk.findById(req.params.id, function(err, foundTalk) {
			if (err) {
				res.redirect("back");
			}
			else {
				if (foundTalk.user.equals(req.user._id)) {
					next();
				}
				else {
					res.redirect("back");
				}
			}
		});
	}
	else {
		res.redirect("back");
	}	
};

module.exports = router;