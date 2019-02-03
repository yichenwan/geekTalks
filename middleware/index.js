var Talk = require("../models/talk");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn =  function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect("/login");
	}
};

middlewareObj.checkTalkOwenership = function (req, res, next) {
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

middlewareObj.checkTalkOwenership = function(req, res, next) {
	if (req.isAuthenticated()) {	
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect("back");
			}
			else {
				if (foundComment.author.id.equals(req.user._id)) {
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

module.exports = middlewareObj;