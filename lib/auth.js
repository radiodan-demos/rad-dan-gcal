var config       = require('../config/oauth.json').web,
    google       = require('googleapis'),
    promise      = require('radiodan-client').utils.promise,
    OAuth2       = google.auth.OAuth2;

module.exports.create = function(port) {
  var instance    = {},
      tokens      = {},
      callbackURL = 'http://127.0.0.1:'+port+'/oauth2callback',
      client      = new OAuth2(
        config.client_id, config.client_secret, callbackURL
      );

  instance.isValid = function() {
    return tokens.hasOwnProperty('access_token');
  };

  instance.generateURL = function() {
    return client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/calendar'
    });
  };

  instance.requestTokens = function(code) {
    var dfd = promise.defer();

    client.getToken(code, function(err, tokens) {
      if(err) {
        return dfd.reject(err);
      } else {
        dfd.resolve(tokens);
      }
    });

    return dfd.promise;
  };

  instance.setTokens = function(newTokens) {
    tokens = newTokens;

    client.setCredentials(tokens);
  };

  instance.client = client;

  return instance;
}
