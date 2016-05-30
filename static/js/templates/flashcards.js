var _ = require('../lib/underscore.js');

var domTools = require('../utils/dom.js');
var el = domTools.el;
var append = domTools.append;


var t = {
    button: function (innerText, onClick) {
        var b = el('button');
        b.innerText = innerText;
        b.addEventListener('click', onClick);
        return b;
    }
};

function Flashcard (flashcardData, correct, incorrect) {
    var flashcard = el('div', 'flashcard')
        flashcard.innerText = flashcardData.lexeme;
    var translations = [];

    for (var i = 0; i < flashcardData.correctTranslations.length; i++) {
        var translation = el('div', 'flashcard-answer');
        translation.innerText = flashcardData.correctTranslations[i];
        translation.addEventListener('click', function () {
                console.log('correct!');
                correct();
                });
        translations.push(translation);
    }

    for (var i = 0; i < flashcardData.incorrectTranslations.length; i++) {
        var translation = el('div', 'flashcard-answer');
        translation.innerText = flashcardData.incorrectTranslations[i];
        translation.addEventListener('click', function () {
                console.log('incorrect!');
                incorrect();
                });
        translations.push(translation);
    }

    // later we'll shuffle these
    append.apply(null, [flashcard].concat(translations));

    return flashcard;
};



module.exports = function (coreLogic, routes) {
    var container = el('div', 'flashcards-container');
    coreLogic.getFlashcards(success, failure);
    return container;

    function success (response) {
        // make 3x the number of lexemes you get from the back-end
        var flashcardData, i, incorrectTranslations, lex;
        var flashcardsData = [];
        var flashcards = response.flashcards;
        var numberOfIncorrectTranslationsDisplayed = 3;
        
        for (i = 0; i < flashcards.length; i++) {
            lex = flashcards[i];
            
            incorrectTranslations = _.sample(
                _.without(_.pluck(flashcards, 'translation'), lex.translation),
                numberOfIncorrectTranslationsDisplayed
            );
            
            flashcardData = {
              lexeme: lex.lexeme,
              correctTranslations: [lex.translation],
              incorrectTranslations: incorrectTranslations
            };
            
            flashcardsData.push(flashcardData);
        };

        flashcardsData = _.shuffle(flashcardsData);
        
        next();

        function correct () {
            flashcardsData.shift();
            next();
        };

        function incorrect () {
            var flashcardData = flashcardsData.shift();
            flashcardsData.push(flashcardData);
            next();
        };

        function next () {
            container.innerHTML = '';
            if (flashcardsData.length < 1) {
                container.innerText = 'You Win!';
                coreLogic.verifyFlashcards(response.flashcards);
                // fire a method from coreLogic to send verification of the cards to the server
                // which on success would retrieve another deck
                append(container, t.button('More!', routes.flashcards));
            } else {
                append(container, Flashcard(flashcardsData[0], correct, incorrect));
            }
        };

    };

    function failure (error) {
        console.log(error);
    };
};

