require('dotenv').load();
var Q = require('q');
var jwt  = require('jwt-simple');
var moment = require('moment');
var charityUserModel = require('./charityUserModel');

// Storing information about the charity in the database
exports.signup = function(req, res, next) {

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

            //calculate token expiration
            var expiry = moment().add('days', 7).valueOf();

            //generate JWT token based on charity id
            var token = jwt.encode({
              iss: charity._id,
              exp: expiry
            }, app.get('jwtTokenSecret'));


            //respond success and send token to client
            res.status(201).json({ token : token });
          });
        });
      }
    });
}

exports.profile = function(req,res) {

}
