
// like underscore's sample, takes an array or string
// and returns a randomly selected element from the collection
function sample (arrayOrString) {
  return arrayOrString[Math.floor(Math.random() * arrayOrString.length)];
};

// returns a uuid string
// taken from stackoverflow (http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript) 
function uuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  }); 
};

// returns a fake title for our images
function fakeTitle () {
  var consonants = 'bcdfghjklmnpqrstvwxyz';
  var vowels = 'aeiou';
  var patterns = 'CVC VC CV CVVCV CVCV VCVVC CVCCVC';

  var n = 1 + Math.floor(Math.random() * 3);
  var words = [];
  for (var i = 0; i < n; i++) {
    words.push(sample(patterns.split(' ')));
  }

  return words.join(' ').replace(/[CV]/g, function(x) {
    return x === 'C' ? sample(consonants) : sample(vowels);
  });
};

// Constructor for image instances
function Image (src) {
  this.src = src;
  this.id = uuid();
  this.title = fakeTitle();
};


module.exports = Image;
