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

from translation.random_translation import translate

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
def verify_or_create_user():
    id_service, user_id = current_user['sub'].split('|')

    user = User.query.filter_by(auth0_id=user_id).first()
    if user is None:
        user = User(user_id)
        db.session.add(user)
        db.session.commit()

    return user



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
            'auth0Id': self.auth0_id
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
        self.translation = translate(lexeme, from_language, to_language)

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
    last_success = db.Column(db.DateTime)


    def __init__(self, lexeme, from_language, to_language, translation, lexeme_count, owner):
        utc_now = datetime.utcnow()
        self.lexeme = lexeme
        self.translation = translation
        self.from_language = from_language
        self.to_language = to_language
        self.lexeme_count = lexeme_count
        self.success_count = 0
        self.owner = owner
        self.created_at = utc_now
        self.last_success = utc_now
        self.active_after = utc_now

    @property
    def serialize(self):
        return {
            'id': self.id,
            'lexeme': self.lexeme,
            'translation': self.translation,
            'fromLanguage': self.from_language,
            'toLanguage': self.to_language,
            'lexemeCount': self.lexeme_count,
            'successCount': self.success_count,
            'createdAt': self.created_at,
            'lastSuccess': self.last_success,
            'activeAfter': self.active_after
        }

# the base route which renders a template
@app.route('/')
def index ():
    return render_template('index.html')

@app.route('/lexemes')
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def get_lexemes ():
    user = verify_or_create_user()
    lexemes = [lexeme.serialize for lexeme in User_Lexeme.query.filter_by(owner=user.id).order_by(User_Lexeme.lexeme_count.desc()).all()]
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
    owner = verify_or_create_user()
    payload = request.get_json()
    lexemes = [lex.strip() for lex in payload['lexemes'].split(" ") if lex is not '']
    counted_lexemes = Counter(lexemes)

    if not lexemes[0]:
        # Should actually return a 400 or maybe 412
        return jsonify({'success': False})

    objects = [Lexeme(lexeme, 'english', 'spanish') for lexeme in counted_lexemes]
    db.session.bulk_save_objects(objects)
    db.session.commit()

    #user_lexemes = [User_Lexeme(lexeme, 'english', 'spanish', 'word', counted_lexemes[lexeme], user_id) for lexeme in counted_lexemes]
    user_lexemes = [User_Lexeme(lex.lexeme, lex.to_language, lex.from_language, lex.translation, counted_lexemes[lex.lexeme], owner.id) for lex in objects]

    db.session.bulk_save_objects(user_lexemes)
    db.session.commit()

    return jsonify({'success': True})


if __name__ == '__main__':
    app.run(debug=True)

