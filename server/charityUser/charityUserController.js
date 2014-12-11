require('dotenv').load();
var Q = require('q');
var charityUserModel = require('./charityUserModel');

// Storing information about the charity in the database
exports.signup = function(req, res, next) {

  var info = req.body;
  var findCharity = Q.nbind(charityUserModel.findOne, charityUserModel);

// Saving the charity if it doesn't exist
  findCharity({name:info.name})
    .then(function(charity) {
      if(charity) {
        res.status(409).send('This charity organization already exists!'));
      } else {
        var newCharity = new charityUserModel(info);
        // Creating recipient for Stripe
        newCharity.createRecipient(info.name, info.bank_account, info.email, function (err, recipient) {
          // Storing charity into database with token id returned by Stripe
          newCharity.recipient_id = recipient.id;
          newCharity.save(function(err) {
            if(err) throw err;
          });
        });
        res.status(201).send('Successful signup!')
      }
    });
}

exports.profile = function(req,res) {

}
