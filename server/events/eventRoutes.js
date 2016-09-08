var eventController = require('./eventController.js');


module.exports = function (app) {
  app.post('/', eventController.saveEvent);
  app.get('/', eventController.all);
};
