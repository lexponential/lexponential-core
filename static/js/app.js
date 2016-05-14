var Core = require('./core.js');
var coreLogic = new Core();

window.coreLogic = coreLogic;

var v = {
    login: require('./views/login.js'),
    main: require('./views/main.js'),
    dashboard: require('./views/dashboard.js'),
    flashcards: require('./views/flashcards.js'),
    languages: require('./views/languages.js'),
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
  v.clear();
  coreLogic.logout();
  routes.login();
};

routes.languages = function () {
  v.clear();
  console.log('languages');
  v.languages(coreLogic, routes);
};

routes.dashboard = function () {
  v.clear();
  console.log('dashboard');
  v.dashboard(coreLogic, routes);
};

routes.flashcards = function () {
  v.clear();
  console.log('flashcards');
  v.flashcards(coreLogic, routes);
};

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
