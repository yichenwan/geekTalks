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
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					foundTalk.comments.push(comment);
					comment.save();
					foundTalk.save();
					console.log(foundTalk);
					res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);
				}
			});
		}
	});
});

router.get("/:comment_id/edit", checkTalkOwenership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect("back");
		}
		else {
			res.render("comment/edit", {tag_id: req.params.tag, talk_id: req.params.id, comment: foundComment});
		}
	});	
});

router.put("/:comment_id/", checkTalkOwenership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if (err) {
			res.render("back");
		} 
		else {
			res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);
		}
	});
});

router.delete("/:comment_id/", checkTalkOwenership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect("back");
		}
		else {
			res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);
		}
	})
})

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/login');
	}
};

function checkTalkOwenership(req, res, next) {
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

module.exports = router;