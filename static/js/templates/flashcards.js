var domTools = require('../dom.js');
var el = domTools.el;
var append = domTools.append;

module.exports = function (coreLogic, routes) {
    var container = el('div', 'flashcards-container');
    var chart = el('div');
    
    append(container, chart);

    coreLogic.getFlashcards(success, failure);

    return container;

    function success (response) {
        var lexemeCounts = response.flashcards.map(function (lex) {
            return lex.lexemeCount;
        });

        c3.generate({
            bindto: chart,
            data: {
                type: 'bar',
                json: response.flashcards,
                keys: {
                    x: 'lexeme', // it's possible to specify 'x' when category axis
                    value: ['lexemeCount'],
                },
                colors: {
                    'lexemeCount': '#ffffff'
                }
            },
            axis: {
                x: {
                    type: 'category',
                    show: false
                }
            }
        }).legend.hide('lexemeCount');

    };

    function failure (error) {
        console.log(error);
    };
};

