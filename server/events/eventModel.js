var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
  e_title: String,
  e_time: String,
  e_end_time: String,
  e_url: String,
  e_location: mongoose.Schema.Types.Mixed,
  e_description: String,
  e_categories: [String],
  e_source: String,
  e_sourceImage: String,
  e_cost: String
});

module.exports = mongoose.model('events', EventSchema);

