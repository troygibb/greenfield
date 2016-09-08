const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/ballyDb';

mongoose.connect(mongoURI);

const ballyDb = mongoose.connection;
ballyDb.on('error', console.error.bind(console, 'connection error:'));
ballyDb.once('open', function () {
 console.log('Mongodb connection open');
});

module.exports = ballyDb;