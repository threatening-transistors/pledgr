require('dotenv').load();
var Q = require('q');
var helpers = require('../config/helpers');
var charityUserModel = require('./charityUserModel');

// Storing information about the charity in the database
exports.signup = function(req, res) {

  var info = req.body;
  var findCharity = Q.nbind(charityUserModel.findOne, charityUserModel);
  info.password = charityUserModel.generateHash(info.password);
  // Saving the charity if it doesn't exist
  findCharity({name:info.name})
    .then(function(charity) {
      if(charity) {
        res.status(409).send('This charity organization already exists!');
      } else {
        var newCharity = new charityUserModel(info);
        // Creating recipient for Stripe
        newCharity.createRecipient(info.name, info.bank_account, info.email, function (err, recipient) {
          // Storing charity into database with token id returned by Stripe
          newCharity.recipient_id = recipient.id;
          newCharity.save(function(err, charity) {
            if(err) throw err;
            var token = helpers.createToken(charity._id, 'charity');
            // Respond success and send token to client
            res.status(201).json({ token : token }).redirect('/profile');
          });
        });
      }
    });
}

exports.profile = function(req, res) {

}

exports.login = function(req, res) {
  var findCharity = Q.nbind(charityUserModel.findOne, charityUserModel);
  findCharity({name: req.body.name}, 'name password')
    .then(function(charity) {
      if(!charity) {
        res.redirect('/login');
      }
      if(charity.validatePassword(req.body.password)) {
        var token = helpers.createToken(charity._id, 'charity');
        res.status(201).json({ token : token}).redirect('/profile');
      }
      res.redirect('/login');
    })
}
