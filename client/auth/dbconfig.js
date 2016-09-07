var mongoose = require('mongoose');

mongoURI = 'mongodb://localhost/db';
mongoose.connect(mongoURI);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function(){
  console.log('Mongodb connection is open');
});


module.exports = db;