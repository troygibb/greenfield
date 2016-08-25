'use strict';
const request = require('request');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.set('port', port);
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  console.log('Serving /');
  //Demonstrating that we can call an https api with
  //the request module. Works! Console should show
  //stuff about a potentially habitable planet
  callNasaAPI();
  res.sendFile(__dirname + '/client/index.html');
});

const ip = "127.0.0.1";
const server = app.listen(app.get('port'));
console.log('Listening on port ', port);

function callNasaAPI() {
  const options = {
    url: 'https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo',
    headers: {
      'User-Agent': 'request'
    },
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      console.log(info.title);
      console.log(info.explanation);
    }
  }

  request(options, callback);
};