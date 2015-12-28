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

	if (req.body.email == "") {
		res.json("Please enter an email.");
	}
	Follower.findOne({"email":req.body.email}, function (err, follower) {
		console.log(follower);
		if (err) {
			return res.json({info: "There was an error. Please try again in a minute."});
		} else {
			if (follower) {
				res.redirect("http://gustudios.com/nice-try");
			} else {
				var newFollower = new Follower({email: req.body.email,
  									tech: req.body.tech,
  									writing: req.body.writing,
  									philosophy: req.body.philosophy,
  									psychology: req.body.psychology,
  									random: req.body.random
  									});

				newFollower.save(function (err, newFollower) {
         			if (err) {
           				console.error(err);
           				return res.json({info: "There was an error. Please try again in a minute."});
          			} else {
          				console.log(newFollower);

          				sendEmailSinglePerson("willgu29@gmail.com"
          										,"New Follower!"
          										,"You have a new subscriber! Yay!"
          										,newFollower, "Well that's it.."
          										, "newFollower");


          				sendEmailSinglePerson(newFollower.email
          										,"Hi by Will Gu"
          										,"Welcome to the Gu Studios Following!"
          										,"I don't have a surprise, but at least you got this email and saw that picture of me."
          										,"I'm looking forward to keeping updated. Feel free to respond to this email address at any time with feedback, ideas, or ramblings. I'll read them. Cheers!"
          										,"welcomeMessage");

 	        	    	return res.redirect("http://gustudios.com/sweet");
          			}
     			});
			}	
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


function sendEmailSinglePerson(email, subject, headerMessage, bodyMessage, footerMessage, tag) {

          				var format = {
      					"email": email,
      					"type": "to"
      					};

      					var htmlHeader = "<h4>" +headerMessage+ "</h4>";
      					var htmlBody = "<p>" + bodyMessage + "</p>";
      					var htmlFooter = "<p>" + footerMessage + "</p>";
      					var message = {
        					"key": config.MANDRILL_MESSAGE_KEY,
        					"html": htmlHeader + htmlBody + htmlFooter,
        					"subject": subject,
       						"from_email": "will@gustudios.com",
        					"from_name": "Gu Studios",
        					"to": [format],
        					"track_opens": true,
        					"track_clicks": true,
        					"auto_text": true,
        					"preserve_recipients": false,  //display recipients
        					"tags": [tag]

        				};

        				mandrill_client.messages.send({"message": message}, function(result) {
        					console.log(result);
        				}, function(e) {
        					// Mandrill returns the error as an object with name and message keys
        					console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        					// A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
        				});
}

