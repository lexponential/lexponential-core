var domTools = require('../dom.js');
var el = domTools.el;
var append = domTools.append;

function tableRow (rowData, index, rows) {
    var cell;
    var row = el('tr');
    for (var key in rowData) {
        cell = tableCell(rowData[key], row);
        append(row, cell);
    }
    return row;
};

function tableCell (cellContent, row) {
    var c = el('td');
    c.innerText = cellContent;
    return c;
};

module.exports = function (getTableContents) {
    var container = el('div', 'lexponential-container');
    var table = el('table');
    
    append(container, table);

    getTableContents(success, failure);

    return container;

    function success (lexemes) {
        console.log(lexemes);
        var headerCell, row;

        if (lexemes.length) {
            row = el('tr');
            for (var key in lexemes[0]) {
                headerCell = el('th');
                headerCell.innerText = key;
                append(row, headerCell);
            }
            append(table, row);
        }

        for (var i = 0; i < lexemes.length; i++) {
            row = tableRow(lexemes[i], i, lexemes);
            append(table, row);
        }
    };

    function failure (error) {
        console.log(error);
    };
};

