var append = require('../dom.js').append;

var t = {
  header: require('../templates/header.js'),
  navBanner: require('../templates/nav-banner.js'),
  flashcards: require('../templates/flashcards.js')
};

var main = function (coreLogic, routes) {
  append(
      document.body,
      t.header(),
      t.navBanner(coreLogic, routes),
      t.flashcards(coreLogic, routes)
  );
};

module.exports = main;
