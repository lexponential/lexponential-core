var Core = require('./core.js');
var coreLogic = new Core();

window.coreLogic = coreLogic;

var v = {
    login: require('./views/login.js'),
    main: require('./views/main.js'),
    clear: function () {document.body.innerHTML = '';}
};

var routes = {};

routes.main = function () {
  v.clear();
  console.log('main route');
  v.main(coreLogic, routes);
};

routes.login = function () {
  v.clear();
  console.log('login route');
  v.login(coreLogic, routes);
};

routes.logout = function () {
  v.clear()
  coreLogic.logout();
  routes.login();
};

var app = {
    init: function () {
      console.log('app.init');
      coreLogic.parseHash(
          routes.main,
          function (err) {
            if (err) console.log(err);
            coreLogic.getUser(routes.main, routes.login);
      });
    },

    coreLogic: coreLogic
};

app.init();

window.app = app;
