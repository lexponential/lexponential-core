var domTools = require('../dom.js');
var el = domTools.el;
var append = domTools.append;

module.exports = function (getLexemes) {
    var container = el('div', 'lexeme-table-container');
    var chart = el('div');
    
    append(container, chart);

    getLexemes(success, failure);

    return container;

    function success (response) {
        var lexemeCounts = response.lexemes.map(function (lex) {
            return lex.lexemeCount;
        });

        console.log(response.lexemes);

        c3.generate({
            bindto: chart,
            data: {
                type: 'bar',
                json: response.lexemes,
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

