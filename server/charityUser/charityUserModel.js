//load ENV
require('dotenv').load()
//db and crypt modules
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
//initialize stripe node module, passing in our secret from env
var stripe = require("stripe")(process.env.SECRET_KEY);

var CharityUserSchema = new mongoose.Schema({
	name: String, //Org name
	type: String, //Category of charity
	email: String,
	password: String,
	representative: String, //Optional, only useful in corp
	website: String,
	//images?
	//stripe info
	description: String,
	recipient_id: String, //returned from createRecipient
	bank_account: String, //stripe bank
	card: String, //stripe - not currently used
	transfers: Array

});

// Uses Stripe's API to generate a recipient on our account to receive payments. Use callback param to grab the recipient returned from the Stripe call.

CharityUserSchema.methods.createRecipient = function(name, bank_account, email, callback){
	stripe.recipients.create({
	  name: name,
	  type: "corporation", //hardcoded as we're dealing with org charities
	  bank_account: bank_account,
	  email: email
	}, function(err, recipient) {
		if (err) {
			console.log(err);
		}
	  callback(err, recipient);
	});
};

//Generates and returns a hashed password using bcrypt

CharityUserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Checks password candidate against saved hash by using bcrypt compare

CharityUserSchema.methods.validatePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('CharityUser', CharityUserSchema);



