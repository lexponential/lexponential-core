var creds = require('./creds.js');

// xhr GET with authorization set to our credentials
function get (url, callback) {
  var req = new XMLHttpRequest();
  req.onload = callback; 
  req.open('GET', url, true);
  req.responseType = 'json';
  req.setRequestHeader(
      'Authorization',
      'Basic ' + btoa(creds.appID + ':' + creds.jsKey)
      );
  req.send();    
};

module.exports = get;
