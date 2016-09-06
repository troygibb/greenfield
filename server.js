'use strict';
const express = require('express');
const api_handlers = require('./api_handlers/apiPackage');
const cache = require('./api_handlers/cache');
const { geocoder } = require('./api_handlers/utils')
const app = express();
const port = process.env.PORT || 8080;

app.set('port', port);
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  // console.log(MEMBER_ID, SIG_ID)
  console.log('Serving /');
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/coords/:lon/:lat', function(req, res) {
  const lat = req.params.lat;
  const lon = req.params.lon;
  geocoder.reverse({lat:lat, lon:lon})
  .then(function(data) {
    let zip = data[0].zipcode.slice(0,5);
    res.send(zip);
    res.end();
  })
  .catch(function(err) {
    console.log(err);
  });
});

// cache takes a time parameter which is the duration of time after which the cache will clear. Cache will also clear if server restarts
// cache(60) => time here in minutes (converted to milliseconds in cache.js) 
// cache is middleware and will call the third parameter (func) as it's 'next'. res.sendAndCache comes from that next in cache.js
app.get('/getEvents?*', cache(60), function(req, res){
  console.log('Serving ', req.url);
  res.sendAndCache(); //moved the getEvents to cache.js
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