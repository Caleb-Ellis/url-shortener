var mongoose = require('mongoose');

// Counter schema for auto-incrementing id
var CounterSchema = mongoose.Schema({
  _id: {type: String, required: true},
  seq: {type: Number, default: 0}
});
var counters = mongoose.model('counters', CounterSchema);

// URL schema
var URLSchema = new mongoose.Schema({
  id: {type: Number, default: 0},
  'url': String
});

// Function to auto-increment id for each new URL
URLSchema.pre('save', function(next) {
  var doc = this;
  counters.findByIdAndUpdate({_id: 'urlid'}, {$inc: {seq: 1}}, function(err, counters) {
    if (err) return next(err);
    doc.id = counters.seq;
    next();
  });
});

module.exports = mongoose.model('URL', URLSchema);
