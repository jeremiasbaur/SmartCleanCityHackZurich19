from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

import math
import random

DEBUG = True

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://postgres:admin@localhost:5432/HackZurich19'
db = SQLAlchemy(app)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

@app.route('/plog', methods=['GET'])
def plog():
    distance = request.args.get('distance', 3.0)
    lat = request.args.get('lat', 47.5596)
    long = request.args.get('log', 7.5886)

    try:
        distance = float(distance)
        lat = float(lat)
        long = float(long)
    except ValueError:
        return "WRONG DATA FORMAT, COULD NOT PARSE DATA"

    angle = random.random()*math.pi*2

    route = {'start': [long, lat]}
    route['point1'] = [long + math.sin(angle)*distance/3,
                        lat + math.cos(angle)*distance/3]
    route['point2'] = [long + math.sin(angle + 2/3 * math.pi)*distance/3,
                       lat + math.cos(angle + 2/3 * math.pi)*distance/3]

    return jsonify(route)

if __name__ == '__main__':
    app.run()
