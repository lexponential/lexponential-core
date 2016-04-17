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


# the base route which renders a template
@app.route('/')
def index ():
    return render_template('index.html')


@app.route('/lexemes/<lexeme>')
def get_lexemes (lexeme):
    # will return a list of all lexemes of a given lexeme
    lexemes = Lexeme.query.all()
    return jsonify({'lexemes': []})


# create a lexeme
@app.route('/lexemes/create', methods=['POST'])
def create_lexeme ():
    payload = request.get_json()
    # guard clause to  ensure value is valid
    lexemes = [lex.strip() for lex in payload['lexemes'].split(" ") if lex is not '']
    if not lexemes[0]:
        return jsonify(payload)
    objects = [Lexeme(lexeme, 'english', 'spanish') for lexeme in lexemes]
    db.session.bulk_save_objects(objects)
    db.session.commit()
    return jsonify(payload)


if __name__ == '__main__':
    app.run(debug=True)

