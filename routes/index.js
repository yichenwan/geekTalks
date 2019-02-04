 var express = require("express");
 var router  = express.Router({mergeParams: true});
 var User    = require("../models/user");
 var Talk    = require("../models/talk");
 var passport = require("passport");
 var mongoose = require("mongoose");

router.get("/", function(req, res) {
 	res.redirect("/geektalks");
 });

router.get("/register", function(req, res) {
	res.render("register");
});

router.post("/register", function(req, res) {
	User.register(new User({
		username: req.body.username,
		avatar: req.body.avatar,
		github: req.body.github,
		description: req.body.description
	}),
		req.body.password, function(err, user) {
			if (err) {
				console.log(err);
				req.flash("error", err.message);
				return res.redirect("/register");
			}
			passport.authenticate("local")(req, res, function() {
				req.flash("success", "Welcome to Geektalks, " + user.username);
				res.redirect("/geektalks");
			});
		});
});

router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/login", passport.authenticate("local",{
	successRedirect: "geektalks/",
	failureRedirect: "/login"
}), function(req, res) {});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out.");		
	res.redirect("/geektalks");
});

router.get("/user/:user_id", function(req, res) {
	User.findById(req.params.user_id, function(err, foundUser) {
		if (err) {
			console.log(err);
			res.render("/");
		}
		else {
			Talk.find({
				user: new mongoose.Types.ObjectId(req.params.user_id)
			}).sort({createdAt: -1}).limit(5).exec(function(err, foundTalks) {
				if (err) {
					console.log(err);
					res.render("/");
				}
				else {
					res.render("users/show", {user: foundUser, talks: foundTalks});
				}
			})
					
		}
	});
});

module.exports = router;