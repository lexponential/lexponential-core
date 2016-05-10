var config = require('./config.js');
var creds = require('./creds.js');

function deepCopy (obj) {
  return JSON.parse(JSON.stringify(obj));
};

module.exports = function () {
  var state = {
    loggedIn: false,
    points: 0,
    lexemes: [],
    languages: []
  };

  var lock = new Auth0Lock(
      creds.auth0.appID,
      creds.auth0.subdomain
  );

  this.login = function () {
    lock.show({ authParams: { scope: 'openid' } });
  };

  this.logout = function () {
    localStorage.removeItem('id_token');
    window.location.href = '/';
    state.loggedIn = false;
  };

  this.parseHash = function (success, failure) {
    
    var hash = lock.parseHash(window.location.hash);
    if (hash) {
      if (hash.error) {
        if (failure) failure(hash.error);
        console.log("There was an error logging in", hash.error);
        alert('There was an error: ' + hash.error + '\n' + hash.error_description);
      } else {
        //save the token in the session:
        localStorage.setItem('id_token', hash.id_token);
        state.loggedIn = true;
        if (success) success();
      }
    } else {
      if (failure) failure();
    }
  };

  this.getUser = function (success, failure) {
    //retrieve the profile:
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          if (failure) failure(err);
          return alert('There was an error geting the profile: ' + err.message);
        }
        console.log(profile);
        if (success) success(profile)
      });
    } else {
      if (failure) failure();
    }
  };

  this.getFlashcards = function (success, error) {
    var url = config.baseURL + '/flashcards';
    var token = localStorage.getItem('id_token');
    d3.xhr(url)
      .header("Content-Type", "application/json")
      .header("Authorization", "Bearer " + token)
      .get(function(err, rawData){
        if (err) error(err);
        var res = JSON.parse(rawData.responseText);
        state.lexemes = res.flashcards;
        success(res);
      });
  };


  this.addLanguage = function (fromLanguage, toLanguage) {
    url = config.baseURL + '/languages/create';
    var token = localStorage.getItem('id_token');
    var data = JSON.stringify({
        toLanguage: config.defaultLanguage,
        fromLanguage: fromLanguage
    });
    d3.xhr(url)
      .header("Content-Type", "application/json")
      .header("Authorization", "Bearer " + token)
      .post(data, function(err, rawData){
        if (err) console.log(err);
        var res = rawData;
        console.log("got response", res);
      });

  };

  this.getLanguages = function (success, error) {
    var url = config.baseURL + '/languages';
    var token = localStorage.getItem('id_token');
    d3.xhr(url)
      .header("Content-Type", "application/json")
      .header("Authorization", "Bearer " + token)
      .get(function(err, rawData){
        if (err) error(err);
        var res = JSON.parse(rawData.responseText);
        state.languages = res.languages;
        success(res.languages);
      });
  };


  this.getLexemes = function (success, error) {
    var url = config.baseURL + '/lexemes';
    var token = localStorage.getItem('id_token');
    d3.xhr(url)
      .header("Content-Type", "application/json")
      .header("Authorization", "Bearer " + token)
      .get(function(err, rawData){
        if (err) error(err);
        var res = JSON.parse(rawData.responseText);
        state.lexemes = res.lexemes;
        success(res);
      });
  };

  this.addLexeme = function (lexeme) {
    url = config.baseURL + '/lexemes/create';
    var token = localStorage.getItem('id_token');
    var data = JSON.stringify({lexemes: lexeme});
    d3.xhr(url)
      .header("Content-Type", "application/json")
      .header("Authorization", "Bearer " + token)
      .post(data, function(err, rawData){
        if (err) console.log(err);
        var res = rawData;
        console.log("got response", res);
        state.lexemes.push(lexeme);
      });
  };


  this.verifyFlashcards = function (lexemes) {
    url = config.baseURL + '/flashcards';
    var token = localStorage.getItem('id_token');
    var data = JSON.stringify({lexemes: lexemes});
    d3.xhr(url)
      .header("Content-Type", "application/json")
      .header("Authorization", "Bearer " + token)
      .post(data, function(err, rawData){
        if (err) console.log(err);
        var res = rawData;
        console.log("got response", res);
      });
  };

  this.getState = function () {
    return deepCopy(state);
  };

};
