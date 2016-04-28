var el = require('../dom.js').el;

module.exports = function (onclick) {
    var b = el('div', 'login-banner');
    var s = el('span');
    s.innerText = 'login';
    s.addEventListener('click', onclick);
    b.appendChild(s);
    return b;
};

