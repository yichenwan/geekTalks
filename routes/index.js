 var express = require("express");
 var router  = express.Router({mergeParams: true});
 var User    = require("../models/user");
 var passport = require("passport");

router.get("/", function(req, res) {
 	res.redirect("/geektalks");
 });

router.get("/register", function(req, res) {
	res.render("register");
});

router.post("/register", function(req, res) {
	User.register(new User({username: req.body.username}),
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

module.exports = router;