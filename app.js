var bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express(),
    Talk             = require("./models/talk"),
    Tag  			 = require("./models/tag"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    seedDB           = require("./seeds"),
    session          = require("express-session"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");


// app config
 mongoose.connect("mongodb://localhost:27017/geek_talk_app", {useNewUrlParser: true});
 app.set("view engine", "ejs");
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(expressSanitizer());
 app.use(methodOverride("_method"));

 seedDB();

// authentication config
app.use(session({
	secret: `welcome to the geek`,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 app.use(function(req, res, next) {
 	res.locals.currentUser = req.user;
 	next();
 });

// routes
 app.get("/", function(req, res) {
 	res.redirect("/geektalks");
 });

 app.get("/geektalks", function(req, res) {
 	Talk.find({}).populate("user").exec(function(err, talks) {
 		if (err) {
 			console.log("error");
 		}
 		else {
 			res.render("geekTalks/index", {talks: talks});
 		}
 	});
 });

 app.get("/geektalks/new", isLoggedIn, function(req, res) {
 	res.render("geekTalks/new");
 });

 app.post("/geektalks", isLoggedIn, function(req, res) {
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

 app.get("/geektalks/:tag/", function(req, res) {
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

 app.get("/geektalks/:tag/:id", function(req, res) {
 	Talk.findById(req.params.id).populate("comments").populate("user").exec(function(err, foundTalk) {
 		if (err) {
 			res.redirect("/geektalks");
 		}
 		else {
 			console.log(foundTalk.user);
 			console.log(foundTalk.comments);
 			res.render("geekTalks/showTalk", {talk: foundTalk});
 		}
 	});
 });

app.get("/geektalks/:tag/:id/comments/new",isLoggedIn, function(req, res) {
	Talk.findById(req.params.id, function(err, foundTalk) {
		if (err) {
			res.redirect(`/geektalks/${req.params.tag}/${req.params.id}/`);
		}
		else {
			res.render("comment/new", {talk: foundTalk});
		}
	})
});

app.post("/geektalks/:tag/:id/comments",isLoggedIn, function(req, res) {
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

app.get("/register", function(req, res) {
	res.render("register");
});

app.post("/register", function(req, res) {
	User.register(new User({username: req.body.username}),
		req.body.password, function(err, user) {
			if (err) {
				console.log(err);
				return res.redirect("/register");
			}
			passport.authenticate("local")(req, res, function() {
				res.redirect("/geektalks");
			});
		});
});

app.get("/login", function(req, res) {
	res.render("login");
});

app.post("/login", passport.authenticate("local",{
	successRedirect: "geektalks/",
	failureRedirect: "/login"
}), function(req, res) {});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/login');
	}
};

app.listen(3000, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
});

