var express = require('express'),
	hbs = require('hbs'),
	basicAuth = require("basic-auth-connect"),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser');
	session = require('express-session'),
	config = require('./config.json'),
	Follower = require('./models/Follower.js');

var app = express();


app.set('views', __dirname + '/templates/views/');
app.set('view engine', 'hbs');


app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: 'baeMaxLoving'}))
app.use(express.static("public"));
app.use("/node_modules/", express.static(__dirname + '/node_modules'));


app.listen(config.PORT || 3000);


//**********************************

//ROUTING VIEWS

var auth = basicAuth(config.USERNAME, config.PASSWORD);


app.get("/gustudios/api/admin", auth, function (req, res) {
	res.render('adminPanel', {layout: "/layouts/main"});
});


//***************



/// MONGOOOSE Database Linking ****

var mongoose = require('mongoose');

var connectDBLink = config.MONGO_DB;

mongoose.connect(connectDBLink);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	console.log("DB opened");
});

//***********************

