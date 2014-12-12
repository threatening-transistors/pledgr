// Helper functions
var jwt  = require('jwt-simple');
var moment = require('moment');

module.exports = {
  errorLogger: function(error, req, res, next) {
    // log the error then send it to the next middleware in
    // middleware.js

    console.error(error.stack);
    next(error);
  },
  errorHandler: function(error, req, res, next) {
    // send error message to client
    // message for graceful error handling on app
    res.send(500, { error: error.message });
    next(error);
  },

  createToken: function(iss, model) {
    // Calculate token expiration
    var expiry = moment().add('days', 7).valueOf();

    // Generate JWT token based on charity id
    var token = jwt.encode({
      iss: iss,
      exp: expiry,
      model: model
    }, app.get('jwtTokenSecret'));

    return token;
  },

  checkToken: function(req, res, next) {
    var model;
    if(token) {
      var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
      // Make user log-in again if token is expired
      if(decoded.exp <= Date.now()) {
        res.redirect('/login');
      }
      // Check if token belongs to charity or donor
      if(decoded.model === 'charity') {
        model = charityUserModel;
      } else if(decoded.model === 'donor') {
        // model = donorModel;
      }
      // Attaching user to request
      model.findById(decoded.iss, function(err, user) {
        if(err) {
          res.redirect('/login');
        }
        req.body.user = user;
        next();
      });
    }
  }
};
