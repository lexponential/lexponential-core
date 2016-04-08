
var dom = {
  // takes a tag and any number of classes to add as extra arguments
  // returns a DOM node of that tag type with those classes
  el: function (tag) {
    var el = document.createElement(tag || 'div');
    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        el.classList.add(arguments[i]);
      }
    }
    return el;
  },

  // takes a target DOM node and any number of additional DOM nodes
  // all DOM nodes after the first will be appended to the target
  append: function (target) {
    for (var i = 1; i < arguments.length; i++) {
      target.appendChild(arguments[i]);
    }
  },

  // removes all DOM nodes passed as arguments
  remove: function () {
    if (!arguments.length) return;
    for (var i = 0; i < arguments.length; i++) {
      var node = arguments[i];
      node.parentNode.removeChild(node);
    }
  },

  // takes a DOM node and returns it's width in pixels
  getWidth: function (node) {
    return parseInt(window.getComputedStyle(node).width, 10);
  }

};

module.exports = dom;
