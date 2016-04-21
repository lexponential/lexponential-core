var Core = require('./core.js');
var coreLogic = new Core();

window.coreLogic = coreLogic;

var v = {
    main: require('./views/main.js')
};

var app = {
    init: function () {
      coreLogic.parseHash();
      v.main(coreLogic);
    },

    coreLogic: coreLogic
};

app.init();

window.app = app;
