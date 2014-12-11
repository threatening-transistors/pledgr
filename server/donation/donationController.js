/* DONATIONS: handle stripe transfers with this module */

//load ENV
require('dotenv').load()
//db 
var charityUser = require('../charityUser/charityUserModel');
var Donation = require('./donationModel.js');
//initialize stripe node module, passing in our secret from env
var stripe = require("stripe")(process.env.SECRET_KEY);
//q for promises
var Q = require('q');

//promisify function for Charity Search
var findCharityUser = Q.nbind(charityUser.findOne, charityUser);


module.exports = function(){
	transferToCharity: function(donor_id, charity_id, amount, description){

		//TODO - find donorID when implemented
		
		findCharityUser({ '_id': charity_id }).then(function(charity){
			if (!charity){
				//error
			} else {
				stripe.transfers.create({
					amount: amount,
					currency: "usd", //hardcoded for now
					recipient: charity.recipient_id,
					bank_account: charity.bank_account,
					statement_description: description
				}, function(err, transfer){
					//response
					var record = new Donation({
						donor_id: donor_id,
						charity_id: charity_id,
						amount: amount,
						status: transfer.status,
						stripe_transfer_object: transfer
					});

				});
			}
		});


	}
}