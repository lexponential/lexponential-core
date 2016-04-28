var uuid = require('../uuid.js');
var el = require('../dom.js').el;
var append = require('../dom.js').append;

var t = {
    lexemeInput: function () {
        return  el('input', 'lexeme-input');
    },

    button: function (innerText, onclick) {
        var b = el('button');
        b.addEventListener('click', onclick);
        b.innerText = innerText;
        return b;
    }
};


module.exports = function (coreLogic) {
    var inputArea = el('div', 'input-area');
    var lexemeInput = t.lexemeInput();
    var saveButton = t.button('Save', save);

    append(
        inputArea, 
        lexemeInput,
        saveButton
    );
    return inputArea;

    function save () {
        coreLogic.addLexeme(lexemeInput.value);
        lexemeInput.value = '';
    };
};

