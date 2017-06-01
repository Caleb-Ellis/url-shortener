
var shortid = require('shortid');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Url = new Schema({
    original_url: {type: String, required: true},
    short_id: {type: String, required: true, default: idGen()}
});

function idGen() {
  var num = Math.floor(100000 + Math.random() * 900000);
  return num.toString().substring(0, 4);
};

module.exports = mongoose.model('Url', Url);
