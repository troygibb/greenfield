'use strict';
const request = require('request');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.set('port', port);
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  console.log('Serving /');
  getMeetUpEvents();
  res.sendFile(__dirname + '/client/index.html');
});

const ip = "127.0.0.1";
const server = app.listen(app.get('port'));
console.log('Listening on port ', port);

//call via route /getMeetupEvents 
//next steps, call via user zip code
  //after that, geo location
function getMeetUpEvents() {
  let body = '';
  request.get('https://api.meetup.com/2/open_events?zip=94105&and_text=False&offset=0&format=json&limited_events=False&photo-host=public&page=20&radius=25.0&desc=False&status=upcoming&sig_id=182898232&sig=9081c2e1b4eb4501e5ce797e09a06ed18f4b236c')
  .on('data', function(data) {
    body += data;
  })
  .on('end', function() {
    console.log(JSON.parse(body));
  });
}
