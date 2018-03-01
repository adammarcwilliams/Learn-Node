const passport = require('passport');

exports.login = passport.authenticate('local', {
  failerRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});
