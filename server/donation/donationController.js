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


module.exports = {
	transferToCharity: function(req, res){

		var donor_id = req.body.donor_id;
		var charity_id = req.body.charity_id;
		var amount = req.body.amount;
		var description = req.body.description;

		//TODO - find donorID when implemented
		
		findCharityUser({ '_id': charity_id }).then(function(charity){
			if (!charity){
				//error
				res.status(404).json({error:'no charity found'});
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

					record.save(function(err,data){
						if (err)
							res.send(err);
						res.status(201).json({status: transfer.status})
					});

				});
			}
		});


	}
}