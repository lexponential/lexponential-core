var Core = require('./core.js');
var coreLogic = new Core();

window.coreLogic = coreLogic;

var v = {
    login: require('./views/login.js'),
    main: require('./views/main.js'),
    table: require('./views/table-view.js'),
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

routes.tableView = function () {
  v.clear();
  console.log('tableView');
  v.table(coreLogic, routes);
};

var app = {
    init: function () {
        var defaultRoute = routes.tableView;
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
