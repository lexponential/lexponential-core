import uuid
from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.sqlite')
db = SQLAlchemy(app)

class Node(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    node_type = db.Column(db.String(80))
    value = db.Column(db.Text)

    def __init__(self, node_type, value):
        self.node_type = node_type
        self.value = value

class Edge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    edge_type = db.Column(db.String(80))
    from_node = db.Column(db.Text)
    to_node = db.Column(db.Text)

    def __init__(self, edge_type, from_node, to_node):
        self.edge_type = edge_type
        self.from_node = from_node
        self.to_node = to_node

# the base route which renders a template
@app.route('/')
def index ():
    return render_template('index.html')

@app.route('/nodes/<node_type>')
def get_nodes (node_type):
    # will return a list of all nodes of a given node_type
    nodes = Node.query.all()
    return jsonify({'nodes': []})

# create a node
@app.route('/nodes/create', methods=['POST'])
def create_node ():
    payload = request.get_json()
    # guard clause to  ensure value is valid
    node = Node('knowleton', payload['value'])
    db.session.add(node)
    db.session.commit()
    return jsonify(payload)

@app.route('/edges/<edge_type>')
def get_edges (edge_type):
    # will return a list of all edges of a given edge_type
    edges = Edge.query.all()
    return jsonify({'edges': []})

# create a node
@app.route('/edges/create', methods=['POST'])
def create_edge ():
    payload = request.get_json()
    # guard clause to  ensure values are valid
    from_node = payload['from_node']
    to_node = payload['to_node']
    edge = Edge('depends_on', from_node, to_node)
    db.session.add(edge)
    db.session.commit()
    return jsonify(payload)


# create an edge



if __name__ == '__main__':
    app.run(debug=True)

