var _ = require('../lib/underscore.js');

var domTools = require('../utils/dom.js');
var el = domTools.el;
var append = domTools.append;
var remove = domTools.remove;

var t = {
    languageCard: function (languageData, addLanguageCallback, selectLanguage, routes) {
        var card = el('div', 'language-card');
        var title = el('h3');
        title.innerText = languageData.name.toUpperCase();
        append(card, title);
        var button = el('button');
        button.innerText = 'study ' + languageData.name;
        
        if (!languageData.active) {
            button.addEventListener('click', function () {
                addLanguageCallback(languageData.abbreviation);
                card.classList.add('active');
                routes.main();
            });
        } else {
            button.addEventListener('click', function () {
                selectLanguage(languageData.name)
                routes.main();
            });
            card.classList.add('active');
        }
        
        append(card, button);
        return card;
    }
};

module.exports = function (coreLogic, routes) {
    var container = el('div', 'lexponential-container');
    coreLogic.getLanguages(success, failure);
    return container;

    function success (languages) {
        _.each(languages, function (languageData) {
            append(
                container,
                t.languageCard(
                    languageData,
                    coreLogic.addLanguage,
                    coreLogic.selectLanguage,
                    routes
                )
            );
        });
    };

    function failure (error) {
        console.log(error)
    };
};

