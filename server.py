import jwt
import base64
import os
import uuid

from collections import Counter
from datetime import datetime
from functools import wraps

from flask import Flask, jsonify, render_template, request, _request_ctx_stack
from flask_sqlalchemy import SQLAlchemy
from flask.ext.cors import cross_origin
from werkzeug.local import LocalProxy
from dotenv import Dotenv
from auth import authenticate, requires_auth

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.sqlite')
db = SQLAlchemy(app)

env = None

try:
    env = Dotenv('./.env')
    client_id = env["AUTH0_CLIENT_ID"]
    client_secret = env["AUTH0_CLIENT_SECRET"]
except IOError:
  env = os.environ


# Authentication annotation
current_user = LocalProxy(lambda: _request_ctx_stack.top.current_user)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    auth0_id = db.Column(db.Integer)

    def __init__(self, auth0_id):
        self.auth0_id = auth0_id

    @property
    def serialize(self):
        return {
            'id': self.id,
            'auth0_id': self.auth0_id
        }


class Lexeme(db.Model):
    __tablename__ = 'lexicon'
    id = db.Column(db.Integer, primary_key=True)
    lexeme = db.Column(db.Text)
    from_language = db.Column(db.String(80))
    to_language = db.Column(db.String(80))
    translation = db.Column(db.Text)

    def __init__(self, lexeme, from_language, to_language):
        self.lexeme = lexeme
        self.from_language = from_language
        self.to_language = to_language
        self.translation = 'Morgan is Amazing!'

    @property
    def serialize(self):
        return {
            'id': self.id,
            'lexeme': self.lexeme,
            'translation': self.translation,
            'fromLanguage': self.from_language,
            'toLanguage': self.to_language
        }


class User_Lexeme(db.Model):
    __tablename__ = 'user_lexicon'
    id = db.Column(db.Integer, primary_key=True)
    lexeme = db.Column(db.Text)
    from_language = db.Column(db.String(80))
    to_language = db.Column(db.String(80))
    translation = db.Column(db.Text)
    lexeme_count = db.Column(db.Integer)
    success_count = db.Column(db.Integer)
    owner = db.Column(db.Integer)
    created_at = db.Column(db.DateTime)
    active_after = db.Column(db.DateTime)


    def __init__(self, lexeme, from_language, to_language, lexeme_count, owner):
        self.lexeme = lexeme
        self.translation = 'Morgan is Amazing!'
        self.from_language = from_language
        self.to_language = to_language
        self.lexeme_count = lexeme_count
        self.success_count = 0
        self.owner = owner
        self.created_at = datetime.utcnow()
        self.active_after = datetime.utcnow()

    @property
    def serialize(self):
        return {
            'id': self.id,
            'lexeme': self.lexeme,
            'translation': self.translation,
            'fromLanguage': self.from_language,
            'toLanguage': self.to_language,
            'lexemecount': self.lexeme_count,
            'success_count': self.success_count,
            'created_at': self.created_at,
            'active_after': self.active_after
        }

# the base route which renders a template
@app.route('/')
def index ():
    return render_template('index.html')

@app.route('/lexemes')
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def get_lexemes ():
    lexemes = [lexeme.serialize for lexeme in Lexeme.query.all()]
    return jsonify({'lexemes': lexemes})


@app.route('/lexemes/<lexeme_id>')
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def get_lexeme (lexeme_id):
    """Return a Lexeme of a given ID or 404"""
    lexeme = Lexeme.query.get(lexeme_id)
    if lexeme:
        return jsonify({'lexeme': lexeme.serialize})
    # Should actually return a 404 not None
    return jsonify({'lexeme': None})


@app.route('/lexemes/create', methods=['POST'])
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def create_lexeme ():
    payload = request.get_json()
    lexemes = [lex.strip() for lex in payload['lexemes'].split(" ") if lex is not '']
    if not lexemes[0]:
        # Should actually return a 400 or maybe 412
        return jsonify({'success': False})
    objects = [Lexeme(lexeme, 'english', 'spanish') for lexeme in lexemes]
    db.session.bulk_save_objects(objects)
    db.session.commit()
    id_service, user_id = current_user['sub'].split('|')

    owner = User.query.filter_by(auth0_id=user_id).first()
    if owner is None:
        owner = User(user_id)
        db.session.add(owner)
        db.session.commit()

    counted_lexemes = Counter(lexemes)
    user_lexemes = [User_Lexeme(lexeme, 'english', 'spanish', counted_lexemes[lexeme], user_id) for lexeme in counted_lexemes]

    db.session.bulk_save_objects(user_lexemes)
    db.session.commit()

    return jsonify({'success': True})


if __name__ == '__main__':
    app.run(debug=True)

