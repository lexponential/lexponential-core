/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Core = __webpack_require__(1);
	var coreLogic = new Core();
	
	var v = {
	    main: __webpack_require__(3)
	};
	
	var app = {
	    init: function () {
	        v.main(coreLogic);
	    },
	
	    coreLogic: coreLogic
	};
	
	app.init();
	
	window.app = app;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(2);
	
	function deepCopy (obj) {
	    return JSON.parse(JSON.stringify(obj));
	};
	
	function Node (nodeValue) {
	    this.value = nodeValue;
	};
	
	function Edge (from, to) {
	    this.from = from;
	    this.to = to;
	};
	
	module.exports = function () {
	    var state = {
	        nodes: [],
	        edges: [],
	        lexemes: []
	    };
	
	    this.getLexemes = function () {
	        return deepCopy(state.lexemes);
	    };
	
	    this.addLexeme = function (lexeme) {
	        url = config.baseURL + '/lexemes/create';
	        var data = JSON.stringify({lexemes: lexeme});
	        d3.xhr(url)
	            .header("Content-Type", "application/json")
	            .post(data, function(err, rawData){
	                if (err) console.log(err);
	                var res = rawData;
	                console.log("got response", res);
	                state.lexemes.push(lexeme);
	             });
	    };
	
	    this.getNodes = function () {
	        return deepCopy(state.nodes);
	    };
	
	    this.getEdges = function () {
	        return deepCopy(state.edges);
	    };
	
	    this.addNode = function (nodeValue) {
	        var node = new Node(nodeValue);
	        state.nodes.push(node);
	
	        var url = config.baseURL + '/nodes/create';
	        var data = JSON.stringify({value: node.value});
	        d3.xhr(url)
	            .header("Content-Type", "application/json")
	            .post(data, function(err, rawData){
	                if (err) console.log(err);
	                console.log("got response", rawData);
	             });
	
	        return node;
	    };
	
	    this.addEdge = function (fromNodeID, toNodeID) {
	        var edge = new Edge(from, to);
	        state.edges.push(edge);
	        return edge;
	    };
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	
	module.exports = {
	  baseURL: 'http://localhost:5000'
	};
	


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var domTools = __webpack_require__(4);
	var append = domTools.append;
	var remove = domTools.remove;
	
	var t = {
	  header: __webpack_require__(5),
	  inputArea: __webpack_require__(6)
	};
	
	var main = function (coreLogic) {
	  append(document.body, t.header(), t.inputArea(coreLogic));
	};
	
	module.exports = main;


/***/ },
/* 4 */
/***/ function(module, exports) {

	
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var el = __webpack_require__(4).el;
	
	module.exports = function () {
	  var header = el('div', 'header');
	  header.textContent = 'Edutomic';
	  return header;
	};
	


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var uuid = __webpack_require__(7);
	var el = __webpack_require__(4).el;
	var append = __webpack_require__(4).append;
	
	var t = {
	    lexemeInput: function () {
	        return  el('input', 'lexeme-input');
	    },
	
	    button: function (innerText, onclick) {
	        var b = el('button');
	        b.addEventListener('click', onclick);
	        b.innerText = innerText;
	        return b;
	    }
	};
	
	
	module.exports = function (coreLogic) {
	    var inputArea = el('div', 'input-area');
	    var lexemeInput = t.lexemeInput();
	    var saveButton = t.button('Save', save);
	
	    append(inputArea, lexemeInput, saveButton);
	    return inputArea;
	
	    function save () {
	        coreLogic.addLexeme(lexemeInput.value);
	        lexemeInput.value = '';
	    };
	};
	


/***/ },
/* 7 */
/***/ function(module, exports) {

	// returns a uuid string
	// taken from stackoverflow (http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript) 
	module.exports = function uuid () {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	  }); 
	};
	


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map