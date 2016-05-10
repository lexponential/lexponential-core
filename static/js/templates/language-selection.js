var _ = require('../underscore.js');

var domTools = require('../dom.js');
var el = domTools.el;
var append = domTools.append;


var t = {
    button: function (innerText, onClick) {
        var b = el('button');
        b.innerText = innerText;
        b.addEventListener('click', onClick);
        return b;
    }
};


module.exports = function (coreLogic, routes) {
    var container = el('div', 'lexponential-container');
    coreLogic.getLanguages(success, failure);
    return container;

    function success (languages) {
        console.log('success!');
        console.log(languages);
        _.each(languages, function (lang) {
            var button = t.button(lang.name, function () {
                coreLogic.addLanguage(lang.abbreviation);
            });
            append(container, button);
        });
    };

    function failure (error) {
        console.log(error)
    };
};

