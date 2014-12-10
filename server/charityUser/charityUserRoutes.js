var charityUserController = require('./charityUserController');

module.exports = function(app) {
  app.post('/signup', charityUserController.signup);
  app.post('/profile', charityUserController.profile);
}