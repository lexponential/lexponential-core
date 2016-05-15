var domTools = require('../dom.js');
var el = domTools.el;
var append = domTools.append;


var t = {
    paymentExposition: function () {
        var n = el('div');
        var title = el('h3');
        title.innerText = 'Payment Settings';

        var expositionParagraph = el('p');
        expositionParagraph.innerText = 'This is where Stripe payments will be handled... later...';
        
        append(n, title, expositionParagraph);
        return n;
    }
};

module.exports = function (getTableContents) {
    var container = el('div', 'lexponential-container');
    
    append(container, t.paymentExposition);

    return container;
};

