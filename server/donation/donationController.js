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
var findCharityUser = Q.nbind(charityUser.findById, charityUser);


module.exports = {
	transferToCharity: function(req, res){

		console.log("xfer route");

		var donor_id = req.body.donor_id;
		var charity_id = req.body.charity_id;
		var amount = req.body.amount;
		var description = req.body.description;

		//TODO - find donorID when implemented
		
		findCharityUser(charity_id).then(function(charity){
			if (!charity){
				//error
				console.log("no charity found - server");
				res.status(404).json({error:'no charity found'});
			} else {
				console.log('hitting stripe route');
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
						// date: transfer.date,
						// status: transfer.status,
						stripe_transfer_object: transfer
					});

					record.save(function(err,data){
						if (err)
							res.send(err);
						res.status(201).json({status: "saved"})
					});

				});
			}
		}).catch(function(err){
			console.log(err);
		});
	},

	statsForCharity: function(req, res){
		var charity_id = req.params.charityId;

		var testData = {
			past12months: [13000,34000,24000,40000,60343,46783,57384,47585,67564,56485,69903,81007],
			allTimeTotal: 34000000
		}

		res.status(200).json(testData);
	},

	globalStats: function(req, res){
		var testData = {
			past12months: [130000,340000,240000,400000,603430,467830,573840,475850,675640,564850,699030,810070],
			allTimeTotal: 34000000000
		};

		// Load Chance.js
		var Chance = require('chance');

		// Instantiate Chance so it can be used
		var chance = new Chance();
		testData.zips = {};
		var sum = 0;

		// Generating approx 2000 donations spread across random zips
		while(sum < testData.allTimeTotal) {
			var randomAmount = Math.ceil(Math.random()*34000000);
			sum += randomAmount;
			var zip = chance.zip();  // Generate random zip code
			var zips = testData.zips; 

			if(!zips[zip]) {zips[zip] = 0;}

			zips[zip] += randomAmount;
		}

		res.status(200).json(testData);
	}
}