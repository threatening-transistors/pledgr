var charityUserController = require('./charityUserController');
var helpers = require('../config/helpers');

module.exports = function(app) {
  app.post('/signup', charityUserController.signup);
  app.post('/profile', helpers.checkToken, charityUserController.profile);
  app.post('/login', charityUserController.login);
  app.post('/logout', charityUserController.logout);
  app.get('/', charityUserController.listAll);
}