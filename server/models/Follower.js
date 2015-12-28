var mongoose = require('mongoose');

var followerSchema = new mongoose.Schema({
  email: String,
  tech: Boolean,
  writing: Boolean,
  philosophy: Boolean,
  random: Boolean,
  dateCreated: {type: Date, default: Date.now},

});

module.exports = Follower = mongoose.model('Follower', followerSchema);
