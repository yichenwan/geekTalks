var bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express(),
    Talk             = require("./models/talk"),
    Tag  			 = require("./models/tag"),
    seedDB           = require("./seeds");

// app config
 mongoose.connect("mongodb://localhost:27017/geek_talk_app", {useNewUrlParser: true});
 app.set("view engine", "ejs");
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(expressSanitizer());
 app.use(methodOverride("_method"));

 seedDB();

// routes
 app.get("/", function(req, res) {
 	res.redirect("/geektalks");
 });

 app.get("/geektalks", function(req, res) {
 	Talk.find({}, function(err, talks) {
 		if (err) {
 			console.log("error");
 		}
 		else {
 			res.render("index", {talks: talks});
 		}
 	})
 });

 app.get("/geektalks/new", function(req, res) {
 	res.render("new");
 });

 app.post("/geektalks", function(req, res) {
 	Talk.create(req.body.talk, function (err, newTalk) {
      if (err) {
      	res.render("new");
      }
      else {
      	res.redirect("/geektalks");     	
      }
 	});
 });

 app.get("/geektalks/:tag/", function(req, res) {
 	Talk.find(
 		{tag: req.params.tag}
 		, function(err, foundTalks) {
 		if (err) {
 			res.redirect("/geektalks");
 		}
 		else {
 			Tag.findOne({tag: req.params.tag}, function (err, foundTag) {
		 		if (err) {
		 			res.redirect("/geektalks");
		 		}
		 		else {
		 			// console.log(foundTag);
 					res.render("showTag", {talks: foundTalks, foundTag: foundTag});
		 		}
 			});
 		}
 	});
 }); 

 app.get("/geektalks/:tag/:id", function(req, res) {
 	Talk.findById(req.params.id, function(err, foundTalk) {
 		if (err) {
 			res.redirect("/geektalks");
 		}
 		else {
 			// console.log(foundTalk);
 			res.render("showTalk", {talk: foundTalk});
 		}
 	});
 });

app.listen(3000, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
});

