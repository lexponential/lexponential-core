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
            #'id': self.id,
            'lexeme': self.lexeme,
            #'translation': self.translation,
            'fromLanguage': self.from_language,
            'toLanguage': self.to_language,
            'lexemeCount': self.lexeme_count,
            'successCount': self.success_count,
            #'createdAt': self.created_at,
            #'lastSuccess': self.last_success,
            #'activeAfter': self.active_after
        }

# the base route which renders a template
@app.route('/')
def index ():
    return render_template('index.html')

@app.route('/flashcards')
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def get_flashcards ():
    user = verify_or_create_user()
    now = datetime.utcnow()
    flashcards = [lexeme.serialize for lexeme in User_Lexeme.query.filter(User_Lexeme.owner==user.id).filter(User_Lexeme.active_after<=now).order_by(User_Lexeme.lexeme_count.desc()).limit(3)]
    return jsonify({'flashcards': flashcards})


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
    user = verify_or_create_user()
    payload = request.get_json()
    lexemes = [lex.strip().lower() for lex in payload['lexemes'].replace('.', '').split(" ") if lex is not '']
    counted_lexemes = Counter(lexemes)
    to_language = 'english'
    from_language = 'spanish'

    if not lexemes[0]:
        # Should actually return a 400 or maybe 412
        return jsonify({'success': False})

    for lex in counted_lexemes:
        prior = Lexeme.query.filter_by(lexeme=lex, from_language=from_language, to_language=to_language).first()
        if not prior:
            new_lexeme = Lexeme(lex, from_language, to_language)
            db.session.add(new_lexeme)
            db.session.commit()

    user_lexemes = [User_Lexeme(lex, to_language, from_language, None, counted_lexemes[lex], user.id) for lex in counted_lexemes]

    # this is about the worst way imaginable to do this, but it'll work for the time being
    # do not deploy to prod before rewriting this db interaction!
    for lex in user_lexemes:
        prior = User_Lexeme.query.filter_by(lexeme=lex.lexeme, owner=user.id, from_language=lex.from_language, to_language=lex.to_language).first()
        if not prior:
            # we should actually pull the lexeme table query into this conditional branch
            db.session.add(lex)
        else:
            prior.lexeme_count = prior.lexeme_count + lex.lexeme_count

        db.session.commit()

    return jsonify({'success': True})


if __name__ == '__main__':
    app.run(debug=True)

