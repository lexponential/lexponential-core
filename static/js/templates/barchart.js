var domTools = require('../utils/dom.js');
var el = domTools.el;
var append = domTools.append;

var t = {
    lexemeFrequencyBarChart: function (target, data) {
        var now = new moment.utc();
        var dateFormat = 'ddd, DD MMM YYYY HH:mm:ss Z';
        console.log('lexemeFrequencyBarChart');
        console.log(data);
        var barChartColorSequence = data.map(function (lex) {
            return now.isAfter(moment.utc(lex.activeAfter, dateFormat)) ? '#ff0000' : '#000000';
        });
        
        c3.generate({
            bindto: target,
            data: {
                type: 'bar',
                json: data,
                keys: {
                    x: 'lexeme',
                    value: ['lexemeCount'],
                },
                color: function (c, d) {return barChartColorSequence[d.index];}
            },
            axis: {
                x: {
                    type: 'category',
                    show: false
                }
            }
        }).legend.hide('lexemeCount');
    }
};

module.exports = function (getLexemes) {
    var container = el('div', 'lexponential-container');
    var chart = el('div');
    
    append(container, chart);

    getLexemes(success, failure);

    return container;

    function success (lexemes) {
      console.log('lexemes');  
      t.lexemeFrequencyBarChart(chart, lexemes);
    };

    function failure (error) {
        console.log(error);
    };
};

