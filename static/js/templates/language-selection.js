var _ = require('../underscore.js');

var domTools = require('../dom.js');
var el = domTools.el;
var append = domTools.append;
var remove = domTools.remove;

var t = {
    languageCard: function (languageData, addLanguageCallback) {
        var card = el('div', 'language-card');
        var title = el('h3');
        title.innerText = languageData.name.toUpperCase();
        append(card, title);
        
        if (!languageData.active) {
            var button = el('button');
            button.innerText = 'study ' + languageData.name;
            button.addEventListener('click', function () {
                // at some point add a check to make sure the call succeeded
                addLanguageCallback(languageData.abbreviation);
                card.classList.add('active');
                remove(button);
            });
            append(card, button);
        } else {
            card.classList.add('active');
        }
        
        return card;
    }
};

module.exports = function (coreLogic, routes) {
    var container = el('div', 'lexponential-container');
    coreLogic.getLanguages(success, failure);
    return container;

    function success (languages) {
        _.each(languages, function (languageData) {
            append(container, t.languageCard(languageData, coreLogic.addLanguage));
        });
    };

    function failure (error) {
        console.log(error)
    };
};

