// Set up dependencies
var express = require('express');
var mongodb = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var dotenv = require('dotenv');

// Set up environment variables
dotenv.config();
var url = process.env.MONGOLAB_URI;
var port = process.env.PORT || 3000;

// Configure server
var app = express();
app.use(express.static('./public'));

// Start server
app.listen(port, function() {
  console.log('App is running on port ' + port);
});
