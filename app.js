// Set up dependencies
var express = require('express');
var mongoose = require('mongoose');
var dotenv = require('dotenv');

// Connect to database
dotenv.config();
var url = "mongodb://localhost:27017/url-shortener";
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
var Url = require(__dirname + '/models/urlModel.js');

// Set port
var port = process.env.PORT || 3000;

// Lookup a shortened URL
app.get('/:id', function(req, res) {
  var id = parseInt(req.params.id,10);
  if(Number.isNaN(id)) {
    res.status(404).send("Invalid Short URL");
  } else {
    Url.find({id: id}, function (err, docs) {
      if (err) res.status(404).send(err);
      if (docs && docs.length) {
        res.redirect(docs[0].url);
      } else {
        res.status(404).send("Invalid Short URL");
      }
    });
  }
});

// create a new shortened URL
app.get('/new/*?', function(req,res) {
  console.log(req.params);
  var validUrl = require('valid-url');
  var newUrl = req.params[0];

  // Validate the URL
  if(newUrl && validUrl.isUri(newUrl)) {
    // Search for URL first
    Url.find({url: newUrl}, function (err, docs) {
      if(docs && docs.length) {
        res.status(201).json({
          "original_url": newUrl,
          "short_url": "https://ce-url-shortener.herokuapp.com/" + docs[0].id
        });
      }
    });

    // If it's not found, create a new one
    Url.create({url: newUrl}, function (err, myUrl) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(201).json({
        "original_url": newUrl,
        "short_url": "http://saintpeter-url-shortener.herokuapp.com/" + myUrl.id
      });
    });
  } else {
    res.status(400).json({
      error: "URL Invalid"
    });
  }

});

// Error Handler
function handleError(res, err) {
  return res.status(500).send(err);
}

// Start server
app.listen(port, function() {
  console.log('App is running on port ' + port);
});
