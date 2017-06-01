// Set up dependencies
var express = require('express');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var validUrl = require('valid-url');

// Connect to database
dotenv.config();
var url = process.env.MONGOLAB_URI || "mongodb://localhost:27017/url-shortener";
mongoose.connect(url, {db: {safe: true}});
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

// Create new short URL
app.get('/new/*', function(req, res) {
    var original = req.url.replace('/new/', '');
    if (!validUrl.isWebUri(original)) {
        return res.json({error: "URL invalid"});
    }
    Url.create({original_url: original}, function(err, created) {
        if (err) return res.status(500).send(err);
        res.json({
            original_url: created.original_url,
            short_url: 'https://ce-url-shortener.herokuapp.com/' + created.short_id
        });
    });
});

// Lookup existing short URL
app.get('/*', function(req, res) {
    Url.findOne({short_id: req.url.slice(1)}).exec().then(function(found) {
        if (found) {
            res.redirect(found.original_url);
        } else {
            res.send({error: "No short url found for given input"});
        }
    });
});

// Start server
app.listen(port, function() {
  console.log('App is running on port ' + port);
});
