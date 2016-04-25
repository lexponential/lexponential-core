var config = require('./config.js');
var creds = require('./creds.js');

function deepCopy (obj) {
  return JSON.parse(JSON.stringify(obj));
};

module.exports = function () {
  var state = {
    loggedIn: false,
    nodes: [],
    edges: [],
    lexemes: []
  };

  var lock = new Auth0Lock(creds.auth0.appID, creds.auth0.subdomain);

  this.login = function () {
    lock.show({ authParams: { scope: 'openid' } });
  };

  this.parseHash = function () {
    var hash = lock.parseHash(window.location.hash);
    if (hash) {
      if (hash.error) {
        console.log("There was an error logging in", hash.error);
        alert('There was an error: ' + hash.error + '\n' + hash.error_description);
      } else {
        //save the token in the session:
        localStorage.setItem('id_token', hash.id_token);
      }
    }
  };

  this.getUser = function () {
    //retrieve the profile:
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          return alert('There was an error geting the profile: ' + err.message);
        }
        console.log(profile);
      });
    }
  };

  this.getLexemes = function (callback) {
    var url = config.baseURL + '/lexemes';
    d3.xhr(url)
      .header("Content-Type", "application/json")
      .header("Authorization", "Bearer " + localStorage.getItem('id_token'))
      .get(function(err, rawData){
        if (err) console.log(err);
        var res = JSON.parse(rawData.responseText);
        state.lexemes = res.lexemes;
        console.log("got response", state.lexemes);
      });
  };

  this.addLexeme = function (lexeme) {
    url = config.baseURL + '/lexemes/create';
    var data = JSON.stringify({lexemes: lexeme});
    d3.xhr(url)
      .header("Content-Type", "application/json")
      .post(data, function(err, rawData){
        if (err) console.log(err);
        var res = rawData;
        console.log("got response", res);
        state.lexemes.push(lexeme);
      });
  };

};
