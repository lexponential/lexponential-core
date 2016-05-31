var Core = require('./core.js');
var Routes = require('./routes.js');

var coreLogic = new Core();
var routes = Routes(coreLogic);

// only for dev
window.coreLogic = coreLogic;

var app = {
init: function () {
              var defaultRoute = routes.main;
              coreLogic.parseHash(
                              defaultRoute,
                              function (err) {
                              if (err) console.log(err);
                              coreLogic.getUser(defaultRoute, routes.login);
                              });
      },

coreLogic: coreLogic
};

app.init();

window.app = app;
