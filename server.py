import uuid
from flask import Flask, jsonify, render_template

app = Flask(__name__)

# the base route which renders a template
@app.route('/')
def index ():
    return render_template('index.html')

# this is how to return a simple JSON object
@app.route('/message')
def messages():
	return jsonify({
        'messages':[{'id': uuid.uuid4(), 'message': 'abc'} for x in range(10)]
        })

# routes can be nested, and strings can be grabbed with the <> syntax
@app.route('/message/<name>')
def message(name):
    return jsonify({
        'id': uuid.uuid4(),
        'message': "what's up {0}".format(name)
        })

if __name__ == '__main__':
    app.run()

