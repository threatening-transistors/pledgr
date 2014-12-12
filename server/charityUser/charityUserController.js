require('dotenv').load();
var Q = require('q');
var helpers = require('../config/helpers');
var charityUserModel = require('./charityUserModel');
var findCharity = Q.nbind(charityUserModel.findOne, charityUserModel);
var findMultiple = Q.nbind(charityUserModel.find, charityUserModel);

// Storing information about the charity in the database
exports.signup = function(req, res) {

  var info = req.body;
  // Saving the charity if it doesn't exist
  findCharity({name:info.name})
    .then(function(charity) {
      if(charity) {
        res.status(409).send('This charity organization already exists!');
        return;
      }
      var newCharity = new charityUserModel(info);
      newCharity.password = newCharity.generateHash(info.password);
      // Creating recipient for Stripe

      newCharity.createRecipient(info.name, info.bank_account, info.email, function (err, recipient) {
        // Storing charity into database with token id returned by Stripe
        newCharity.recipient_id = recipient.id;
        newCharity.save(function(err, charity) {
          if(err) throw err;
          var token = helpers.createToken(charity._id, 'charity');
          // Respond success and send token to client
          res.status(201).json({ token : token });
        });
      });
    });
}

exports.profile = function(req, res) {

}

exports.login = function(req, res) {
  findCharity({name: req.body.name}, 'name password')
    .then(function(charity) {
      if(!charity) {
        res.redirect('/login');
      } else if(charity.validatePassword(req.body.password)) {
        var token = helpers.createToken(charity._id, 'charity');
        res.status(201).json({ token : token });
      } else {
        res.redirect('/login');
      }
    });
}

exports.logout = function(req,res) {
  res.json({ token: '0' });
}

exports.listAll = function(req, res){

  findMultiple({}).then(function(data){
    if (!data) {
      res.status(404).send('None found');
    } else {
      res.status(200).json(data);
    }

  });

}

