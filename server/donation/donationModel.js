/* DONATION MODEL: Defines a schema for holding donation information for transfer's we've processed.
Currently stores the object returned form a transfer along with our associated xfer info */

var mongoose = require('mongoose');

var DonationSchema = new mongoose.Schema({
	donor_id: String,
	charity_id: String,
	date: Date,
	amount: Number,
	status: String,
	stripe_transfer_object: Object
});

module.exports = mongoose.model('Donation', DonationSchema);