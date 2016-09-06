const memCache = require('memory-cache');
const api_handlers = require('./apiPackage.js')

module.exports = (minutes) => {
  return (req, res, next) => {
    const zip = req.url.substring(req.url.length - 5);
    const key = zip;
    const cachedBody = memCache.get(key);
      if (cachedBody) {
        res.send(cachedBody);
      } else {
      res.sendAndCache = () => {
        api_handlers.getEvents(req, res, function(JSONresponse){
          memCache.put(key, JSONresponse, minutes * 60 * 1000);
          res.send(JSONresponse);
          res.end();
        });
      }
      next();
    }
  }
}