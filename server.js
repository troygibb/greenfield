'use strict';
const request = require('request');
const express = require('express');
const url = require('url');
const { API_KEY } = require('./config');
const app = express();
const port = process.env.PORT || 8080;

app.set('port', port);
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  console.log(MEMBER_ID, SIG_ID)
  console.log('Serving /');
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/meetupEvents?*', function(req, res){
  const requestUrl = url.parse(req.url);
  //FIXME: Substring method for zip won't account for other queries. 
  const zip = requestUrl.query.substring(4);
  console.log('Serving ', req.url);
  console.log(zip);
  getMeetUpEvents(zip, function(data){
    res.send(data);
    res.end();
  })
});

const ip = "127.0.0.1";
const server = app.listen(app.get('port'));
console.log('Listening on port ', port);

//call via route /getMeetupEvents 
//next steps, call via user zip code
  //after that, geo location
function getMeetUpEvents(zip, cb) {
  //TODO: Need error handling here. 
  //TODO: Need to factor in sig_id (i.e. user id here)
  let body = '';
  request.get(`https://api.meetup.com/2/open_events?key=${API_KEY}&sign=true&photo-host=public&zip=${zip}&page=20`)
  .on('data', function(data) {
    body += data;
  })
  .on('end', function() {
    cb(JSON.parse(body));
  });
}
