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
    passportLocalMongoose = require("passport-local-mongoose"),
    flash            = require("connect-flash");

var geektalkRoutes   = require("./routes/geektalks"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes      = require("./routes/index");


// app config
 mongoose.connect("mongodb://localhost:27017/geek_talk_app", {useNewUrlParser: true});
 app.set("view engine", "ejs");
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(expressSanitizer());
 app.use(methodOverride("_method"));
 app.use(flash());

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
 	res.locals.error = req.flash("error");
 	res.locals.success = req.flash("success");
 	next();
 });

// routes
app.use("/geektalks", geektalkRoutes);
app.use("/geektalks/:tag/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(3000, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
});

