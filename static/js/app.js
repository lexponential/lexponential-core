var Core = require('./core.js');
var coreLogic = new Core();

var v = {
    main: require('./views/main.js')
};

var app = {
    init: function () {
        v.main(coreLogic);
    },

    coreLogic: coreLogic
};

app.init();

window.app = app;
