// Set up dependencies
var express = require('express');
var mongoose = require('mongoose');
var dotenv = require('dotenv');

// Connect to database
dotenv.config();
var url = process.env.MONGOLAB_URI || "mongodb://localhost:27017/url-shortener";
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function() {
  console.log('Connected to: ' + url);
});

// Configure server
var app = express();
app.use(express.static(__dirname + '/public'));

// Get URL model
var Url = require(__dirname + '/models/urlModel.js').Url;

// Set port
var port = process.env.PORT || 3000;

// Start server
app.listen(port, function() {
  console.log('App is running on port ' + port);
});
