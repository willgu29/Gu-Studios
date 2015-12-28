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


app.post("/gustudios/api/newFollower", function (req, res) {
	var newFollower = new Follower({email: req.body.email,
  									tech: req.body.tech,
  									writing: req.body.writing,
  									philosophy: req.body.philosophy,
  									random: req.body.random
  									});

	newFollower.save(function (err, newFollower) {
         if (err) {
           console.error(err);
           return res.json({info: "There was an error. Please try again in a minute."});
          } else {

           //TODO: Send welcome email here

           return res.json("You're all set. Check your inbox for a special email!");
          }
     });
});

app.post("/gustudios/api/admin/sendMail", function (req, res) {
	//Send mail
  	 var toArray = req.body.to_email.split(",");
  var formattedArray = []
  for (var i =0; i < toArray.length; i++) {
    var format = {
      "email": toArray[i],
      "type": "to"
    };
    formattedArray.push(format);
  }


  var tagsArray = req.body.tags.split(",");
  console.log(JSON.stringify(toArray));
  var message = {
    "key": config.MANDRILL_MESSAGE_KEY,
    "html": req.body.html,
    "subject": req.body.subject,
    "from_email": req.body.from_email,
    "from_name": req.body.from_name,
    "to": formattedArray,
    "track_opens": true,
    "track_clicks": true,
    "auto_text": true,
    "preserve_recipients": false,  //display recipients
    "tags": tagsArray

  };


  mandrill_client.messages.send({"message": message}, function(result) {
    console.log(result);
    /*
    [{
            "email": "recipient.email@example.com",
            "status": "sent",
            "reject_reason": "hard-bounce",
            "_id": "abc123abc123abc123abc123abc123"
        }]
    */
    res.json(result);
  }, function(e) {
    // Mandrill returns the error as an object with name and message keys
    res.json(e.message);
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
  });
  
});
//***************

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.MANDRILL_KEY);


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



