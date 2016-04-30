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
    var container = el('div', 'lexeme-table-container');
    var table = el('table');
    
    append(container, table);

    getTableContents(success, failure);

    return container;

    function success (response) {
        console.log(response);
        var headerCell, row;

        if (response.lexemes.length) {
            row = el('tr');
            for (var key in response.lexemes[0]) {
                headerCell = el('th');
                headerCell.innerText = key;
                append(row, headerCell);
            }
            append(table, row);
        }

        for (var i = 0; i < response.lexemes.length; i++) {
            row = tableRow(response.lexemes[i], i, response.lexemes);
            append(table, row);
        }
    };

    function failure (error) {
        console.log(error);
    };
};

