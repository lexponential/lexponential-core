var el = require('../dom.js').el;

var t = {
    button: function (innerText, onclick) {
        var b = el('button', 'btn-login');
        b.addEventListener('click', onclick);
        b.innerText = innerText;
        return b;
    }
};


module.exports = function (coreLogic) {
    return t.button('Login', coreLogic.login);
};

