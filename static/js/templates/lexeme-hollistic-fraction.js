var domTools = require('../dom.js');
var el = domTools.el;
var append = domTools.append;


module.exports = function (getTableContents) {
    var container = el('div', 'lexponential-container');
    var fraction = el('h3');
    var subtext = el('p');    
    append(container, fraction, subtext);

    getTableContents(success, failure);

    return container;

    function success (lexemes) {
        var activeCount = 0;
        var inactiveCount = 0;
        var now = new moment.utc();
        var dateFormat = 'ddd, DD MMM YYYY HH:mm:ss Z';
        
        for (var i = 0; i < lexemes.length; i++) {
          if (now.isAfter(moment.utc(lexemes[i].activeAfter, dateFormat))) {
            inactiveCount += lexemes[i].lexemeCount;
          } else {
            activeCount += lexemes[i].lexemeCount;
          }
        }
        
        fraction.innerText = '' + (Math.round(100 * (activeCount / (activeCount + inactiveCount)))) + '%';
        subtext.innerText = 'You know ' + activeCount + ' of ' + (activeCount + inactiveCount) + ' lexemes as they\'re used.';
    };

    function failure (error) {
        console.log(error);
    };
};

