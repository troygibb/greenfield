'use strict';
const request = require('request');
const express = require('express');
const { MEMBER_ID, SIG_ID } = require('./config');
const app = express();
const port = process.env.PORT || 8080;

app.set('port', port);
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  console.log(MEMBER_ID, SIG_ID)
  console.log('Serving /');
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/meetupEvents', function(req, res){
  console.log('Serving ', req.url);
  getMeetUpEvents(function(data){
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
function getMeetUpEvents(cb) {
  //TODO: Need error handling here. 
  //TODO: Need to factor in sig_id (i.e. user id here)
  let body = '';
  request.get(`https://api.meetup.com/2/open_events?zip=94105&and_text=False&offset=0&format=json&limited_events=False&photo-host=public&page=20&radius=25.0&desc=False&status=upcoming&sig_id=${MEMBER_ID}&sig=${SIG_ID}`)
  .on('data', function(data) {
    body += data;
  })
  .on('end', function() {
    cb(JSON.parse(body));
  });
}
