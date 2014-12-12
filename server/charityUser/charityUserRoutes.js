var charityUserController = require('./charityUserController');

module.exports = function(app) {
  app.post('/signup', charityUserController.signup);
  app.post('/profile', checkToken(), charityUserController.profile);
  app.post('/login', charityUserController.login);
}