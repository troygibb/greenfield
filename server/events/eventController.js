var Event = require('./eventModel.js');
var User = require('../users/userModel.js');
var Q = require('q');
var jwt  = require('jwt-simple');

module.exports = {
  saveEvent: function(req, res, next) {
    // var findOne = Q.nbind(Event.findOne, Event);
    var create = Q.nbind(Event.create, Event);
    create(req.body)
      .then(function(event) {
        var token = req.headers['x-access-token'];
        var user = jwt.decode(token, 'secret');
        var findUser = Q.nbind(User.findOne, User);
        findUser({_id: user._id})
          .then(function(foundUser) {
            foundUser.events.push(event._id);
            var save = Q.nbind(foundUser.save, foundUser)
            foundUser.save()
              .then(function() {
                res.end();        
              });
          })
      })
      .fail(function (error) {
        next(error);
      });
  }, 

  all: function(req, res, next) {
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'secret');
    var findUser = Q.nbind(User.findOne, User);
    findUser({_id: user._id})
      .then(function(foundUser) {
        var eventIds = foundUser.events;
        var findEvents = Q.nbind(Event.find, Event);
        findEvents({
          '_id': { $in: eventIds}
        })
          .then(function(foundEvents) {
            res.json(foundEvents);
          })
      })
  }
}