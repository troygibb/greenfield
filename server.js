'use strict';
const express = require('express');
const api_handlers = require('./api_handlers/apiPackage');
const config = require('./config.js');
const app = express();
const port = process.env.PORT || 8080;
module.exports = {};

app.set('port', port);
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  // console.log(MEMBER_ID, SIG_ID)
  console.log('Serving /');
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/meetupEvents?*', function(req, res){
  console.log('Serving ', req.url);
  api_handlers.getEvents(req, res, function(JSONresponse){
    res.send(JSONresponse);
    res.end();
  });
});

app.get('/test*', function(req, res) {
  api_handlers.testApiCall(req, res, function(JSONresponse){
    res.send(JSONresponse);
    res.end();
  });
});

const ip = "127.0.0.1";
const server = app.listen(app.get('port'));
console.log('Listening on port ', port);