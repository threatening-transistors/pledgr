/* Routes for donations */

var donationController = require('./donationController');

module.exports = function(app){
	app.post('/send', donationController.transferToCharity);
}