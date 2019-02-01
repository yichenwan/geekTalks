 var express = require("express");
 var router  = express.Router({mergeParams: true});
 var Talk    = require("../models/talk");
 var Comment     = require("../models/comment");

router.get("/new",isLoggedIn, function(req, res) {
	Talk.findById(req.params.id, function(err, foundTalk) {
		if (err) {
			res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);
		}
		else {
			res.render("comment/new", {talk: foundTalk});
		}
	})
});

router.post("/",isLoggedIn, function(req, res) {
	Talk.findById(req.params.id, function(err, foundTalk) {
		if (err) {
			res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);
		}
		else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);
				}
				else {
					foundTalk.comments.push(comment);
					foundTalk.save();
					console.log(foundTalk);
					res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);
				}
			});
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/login');
	}
};

module.exports = router;