import uuid
from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.sqlite')
db = SQLAlchemy(app)


class Lexeme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lexeme = db.Column(db.Text)
    from_language = db.Column(db.String(80))
    to_language = db.Column(db.String(80))

    def __init__(self, lexeme, from_language, to_language):
        self.lexeme = lexeme
        self.from_language = from_language
        self.to_language = to_language

    @property
    def serialize(self):
        return {
            'id': self.id,
            'lexeme': self.lexeme,
            'fromLanguage': self.from_language,
            'toLanguage': self.to_language
        }

# the base route which renders a template
@app.route('/')
def index ():
    return render_template('index.html')


@app.route('/lexemes')
def get_lexemes ():
    lexemes = [lexeme.serialize for lexeme in Lexeme.query.all()]
    return jsonify({'lexemes': lexemes})
   

@app.route('/lexemes/<lexeme_id>')
def get_lexeme (lexeme_id):
    """Return a Lexeme of a given ID or 404"""
    lexeme = Lexeme.query.get(lexeme_id)
    if lexeme:
        return jsonify({'lexeme': lexeme.serialize})
    # Should actually return a 404 not None
    return jsonify({'lexeme': None})


@app.route('/lexemes/create', methods=['POST'])
def create_lexeme ():
    payload = request.get_json()
    lexemes = [lex.strip() for lex in payload['lexemes'].split(" ") if lex is not '']
    if not lexemes[0]:
        # Should actually return a 400 or maybe 412
        return jsonify({'success': False})
    objects = [Lexeme(lexeme, 'english', 'spanish') for lexeme in lexemes]
    db.session.bulk_save_objects(objects)
    db.session.commit()
    return jsonify({'success': True})


if __name__ == '__main__':
    app.run(debug=True)

