import jwt
import base64
import os
import uuid
from collections import Counter
from functools import wraps

from flask import Flask, jsonify, render_template, request, _request_ctx_stack
from flask_sqlalchemy import SQLAlchemy
from flask.ext.cors import cross_origin
from werkzeug.local import LocalProxy
from dotenv import Dotenv


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

# Authentication attribute/annotation
def authenticate(error):
  resp = jsonify(error)

  resp.status_code = 401

  return resp

def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None)
    if not auth:
      return authenticate({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'})

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return {'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}
    elif len(parts) == 1:
      return {'code': 'invalid_header', 'description': 'Token not found'}
    elif len(parts) > 2:
      return {'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}

    token = parts[1]
    try:
        payload = jwt.decode(
            token,
            base64.b64decode('-ZqDCugBJMderO-UiXhSLV1CT3eQLU-_EWo02WAAbKLTUXvsrByKEpmMuLzuCObz'.replace("_","/").replace("-","+")),
            audience='J0tgrJBTPGNCIG6zVHDIYBTkaemFAkTT'
        )
    except jwt.ExpiredSignature:
        return authenticate({'code': 'token_expired', 'description': 'token is expired'})
    except jwt.InvalidAudienceError:
        return authenticate({'code': 'invalid_audience', 'description': 'incorrect audience, expected: J0tgrJBTPGNCIG6zVHDIYBTkaemFAkTT'})
    except jwt.DecodeError:
        return authenticate({'code': 'token_invalid_signature', 'description': 'token signature is invalid'})

    _request_ctx_stack.top.current_user = user = payload
    return f(*args, **kwargs)

  return decorated




class User(db.Model):
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


class User_Lexeme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lexeme = db.Column(db.Text)
    from_language = db.Column(db.String(80))
    to_language = db.Column(db.String(80))
    lexeme_count = db.Column(db.Integer)
    success_count = db.Column(db.Integer)
    owner = db.Column(db.Integer)

    def __init__(self, lexeme, from_language, to_language, lexeme_count, owner):
        self.lexeme = lexeme
        self.from_language = from_language
        self.to_language = to_language
        self.lexeme_count = lexeme_count
        self.success_count = 0
        self.owner = owner

    @property
    def serialize(self):
        return {
            'id': self.id,
            'lexeme': self.lexeme,
            'fromLanguage': self.from_language,
            'toLanguage': self.to_language,
            'lexemecount': self.lexeme_count,
            'success_count': self.success_count
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

