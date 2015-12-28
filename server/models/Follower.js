var mongoose = require('mongoose');

var followerSchema = new mongoose.Schema({

  email: String,
  firstName: String,
  lastName: String,
  fullName: String,
  interests : {
  	tech: Boolean,
  	writing: Boolean,
  	philosophy: Boolean,
  	random: Boolean
  },
  dateCreated: {type: Date, default: Date.now},

});

module.exports = Follower = mongoose.model('Follower', followerSchema);
