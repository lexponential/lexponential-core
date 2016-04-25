var el = require('../dom.js').el;

var t = {
    button: function (innerText, onclick) {
        var b = el('button', 'btn-login');
        b.addEventListener('click', onclick);
        b.innerText = innerText;
        return b;
    }
};


module.exports = function (onclickCB) {
    return t.button('Login', onclickCB);
};

