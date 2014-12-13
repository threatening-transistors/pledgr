// Helper functions
var jwt  = require('jwt-simple');
var moment = require('moment');
var charityUserModel = require('../charityUser/charityUserModel')
var app = require('../server');
// var donorModel =

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
    res.status(500).send({error: error.message });
    next(error);
  },

  createToken: function(iss, model) {
    // Calculate token expiration
    var expiry = moment().add(7, 'days').valueOf();

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
    var token = req.headers['x-access-token'];
    if(token) {
      var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
      // Make user log-in again if token is expired
      if(decoded.exp <= Date.now()) {
        res.json({ token : 'undefined' });
        return;
      }
      // Check if token belongs to charity or donor
      else if(decoded.model === 'charity') {
        model = charityUserModel;
      } else if(decoded.model === 'donor') {
        // model = donorModel;
      }
      // Attaching user to request
      model.findById(decoded.iss, function(err, user) {
        if(err) {
          res.json({ token : 'undefined' });
          return;
        }
        req.body.user = user;
        next();
      });
    }
  }
};
