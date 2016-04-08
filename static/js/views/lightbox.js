var domTools = require('../dom.js');
var append = domTools.append;
var remove = domTools.remove;
var getWidth = domTools.getWidth;


var t = {
  lightboxElement: require('../templates/lightbox-element.js'),
  lightbox: require('../templates/lightbox.js'),
  image: require('../templates/image.js')
};


// creates the lightbox DOM nodes and appends them to document.body
// takes advantage of JS closures to handle adding and removing events
var lightboxView = function (imageNode, imageTitle, imageCollection) {
  var shadowbox = t.lightboxElement('shadowbox', '', closeLightbox); 
  var lightbox = t.lightbox(imageTitle, imageNode, closeLightbox);
  var backButton = t.lightboxElement('lightbox-back-button', '<', regress);
  var forwardButton = t.lightboxElement('lightbox-forward-button', '>', progress);

  append(document.body, shadowbox, backButton, forwardButton, lightbox);

  position(); 
  window.onresize = position;
  window.addEventListener('keydown', navigateOnKeyDown);

  // repositions the lightbox and forward and back buttons
  // needed to keep things centered and responsive
  function position () {
    var lightboxWidth = getWidth(lightbox);
    var windowWidth = getWidth(document.body);
    var backButtonWidth = getWidth(backButton);
    var forwardButtonWidth = getWidth(forwardButton);
    var margin = 20;

    var lightboxLeft = (windowWidth - lightboxWidth) / 2;
    lightbox.style.left = lightboxLeft;
    backButton.style.left = lightboxLeft - backButtonWidth - 3 * margin;
    forwardButton.style.left = lightboxLeft + lightboxWidth + margin;
  };

  // for easy keyboard naviation using the arrow keys
  function navigateOnKeyDown (ev) {
    var keys = {rightArrow: 39, leftArrow: 37};
    if (ev.which === keys.rightArrow) {
      progress();
    } else if (ev.which === keys.leftArrow) {
      regress();
    }
  };

  // steps teh lightbox forwards in the collection
  function progress  () {
    for (var i = 0; i < imageCollection.length; i++) {
      if (imageNode.id === imageCollection[i].id && i < imageCollection.length - 1) {
        closeLightbox();
        var image = imageCollection[i + 1];
        lightboxView(
            t.image(image.src, image.id),
            image.title,
            imageCollection
            );
        return;
      }
    }

    closeLightbox();
  };

  // steps the lightbox backwards in the collection
  function regress () {
    for (var i = 0; i < imageCollection.length; i++) {
      if (imageNode.id === imageCollection[i].id && i > 0) {
        closeLightbox();
        var image = imageCollection[i - 1];
        lightboxView(t.image(image.src, image.id), image.title, imageCollection);
        return;
      }
    }

    closeLightbox();
  };

  // removes the lightbox-associated DOM nodes and removes the keydown listener
  function closeLightbox () {
    window.removeEventListener('keydown', navigateOnKeyDown);
    remove(lightbox, backButton, forwardButton, shadowbox);
  };
};

module.exports = lightboxView;
