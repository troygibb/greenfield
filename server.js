'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
app.use(express.static('.'));
app.set('port', port);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const ip = "127.0.0.1";
const server = app.listen(app.get('port'));
console.log('Listening on port ', port);