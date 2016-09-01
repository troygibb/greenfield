var memCache = require('memory-cache');
var api_handlers = require('./apiPackage.js')

module.exports = (time) => {
  return (req, res, next) => {
    let key = req.url;
    let cachedBody = memCache.get(key);
      if (cachedBody) {
      res.send(cachedBody);
    } else {
      res.sendAndCache = () => {
        api_handlers.getEvents(req, res, function(JSONresponse){
          memCache.put(key, JSONresponse, time * 60 * 1000);
          res.send(JSONresponse);
          res.end();
        });
      }
      next();
    }
  }
}

