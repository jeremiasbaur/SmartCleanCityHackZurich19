from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from configmodule import ProductionConfig, DevelopmentConfig, TestingConfig

from mapbox import Directions

import math
import random
import datetime

from copy import deepcopy

# instantiate the app
app = Flask(__name__)
app.config.from_object(ProductionConfig())

db = SQLAlchemy(app)

import models

# enable CORS
CORS(app, resources={r'/plog*': {'origins': '*'}})


def coord_list_to_linestring(coordinates):
    linestring = "LINESTRING("
    len_coords = len(coordinates)
    counter = 0
    for coord in coordinates:
        if counter == len_coords-1:
            linestring += f'{coord[0]} {coord[1]}'
        else:
            linestring += f'{coord[0]} {coord[1]},'
        counter += 1
    linestring += ')'
    return linestring


def parsing_plog(args):
    distance = args.get('distance', 3.0)
    lat = args.get('lat', 47.5596)
    long = args.get('long', 7.5886)

    distance = float(distance) / 110.57
    lat = float(lat)
    long = float(long)

    return distance, long, lat


def point_selector(distance, long, lat):
    angle = random.random()*math.pi*2

    template = {
            'type': 'Feature',
            'properties': {'name': None},
            'geometry': {
                'type': 'Point',
                'coordinates': list()}}

    pointA = deepcopy(template)
    pointA['geometry']['coordinates'] = [long, lat]

    pointB = deepcopy(template)
    pointB['geometry']['coordinates'] = [long + math.sin(angle)*distance/3, lat + math.cos(angle)*distance/3]

    pointC = deepcopy(template)
    pointC['geometry']['coordinates'] = [long + math.sin(angle + 2/3 * math.pi)*distance/3, lat + math.cos(angle + 2/3 * math.pi)*distance/3]

    pointAC = deepcopy(pointA)
    pointAC['geometry']['coordinates'] = [long + (math.sin(angle + 2/3 * math.pi)*distance/3)/2,
                                          lat + (math.cos(angle + 2/3 * math.pi)*distance/3)/2]

    return [pointA, pointB, pointC, pointAC, pointA]


@app.route('/plog', methods=['GET'])
def plog():
    try:
        distance, long, lat = parsing_plog(request.args)
    except ValueError:
        return jsonify("WRONG DATA FORMAT, COULD NOT PARSE DATA")

    points = point_selector(distance, long, lat)

    path = service.directions(points,
                              profile='mapbox/walking',
                              steps=True,
                              language='de',
                              overview='full',
                              geometries='geojson')

    if path.status_code != 200:
        return jsonify("An error has occured")

    path_json = path.json()

    coordinates = path_json['routes'][0]['geometry']['coordinates']

    today = datetime.datetime(year=2019, month=6, day=9)
    augmented_coords = AugmentedCoordinates(coordinates, today)

    print(augmented_coords)

    response = augmented_coords.to_response()
    response['distance'] = path_json['routes'][0]['distance']
    return jsonify(response)
    return path.json()

class AugmentedCoordinates:
    def __init__(self, coordinates, day):
        self.coordinates = coordinates
        self.augmented_coordinates = list()
        self.day = day
        self.construct_ccis()

    def construct_ccis(self):
        i = 0
        for coord in self.coordinates:
            geo_infos = db.session.query(models.GeoInfo).filter(models.GeoInfo.geometry.contains(f'POINT({coord[0]} {coord[1]})')).all()
            node = Coordinate(coord, geo_infos)
            node.day_cci(self.day)
            self.augmented_coordinates.append(node)
            if i != 0:
                self.augmented_coordinates[-1].ccis_with_next = self.augmented_coordinates[-1].ccis & node.ccis
            i += 1

    def to_response(self):
        response = {}
        response['coordinates'] = []
        for ac in self.augmented_coordinates:
            sum_cci_w = 0
            for cci_entry in ac.ccis_with_next:
                sum_cci_w += cci_entry.cci
            if len(ac.ccis_with_next) != 0:
                sum_cci_w /= len(ac.ccis_with_next)
            else:
                sum_cci_w = None

            sum_cci = 0
            for cci_entry in ac.ccis:
                sum_cci += cci_entry.cci
            if len(ac.ccis) != 0:
                sum_cci /= len(ac.ccis)
            else:
                sum_cci = None

            data = {'long': ac.coordinate[0],
                    'lat': ac.coordinate[1],
                    'cci_neighbor': sum_cci_w,
                    'cci': sum_cci}
            response['coordinates'].append(data)

        return response


    def __repr__(self):
        return f'AC day:{self.day} acs: {self.augmented_coordinates}'


class Coordinate:
    def __init__(self, coordinate, geo_infos):
        self.coordinate = coordinate
        self.geo_infos = geo_infos
        self.ccis = set()
        self.ccis_with_next = set()

    def day_cci(self, day):
        for geo_info in self.geo_infos:
            if geo_info.osm_id is not None:
                self.ccis.update(db.session.query(models.CleanCityIndex).filter(models.CleanCityIndex.geo_info == geo_info,
                                                                models.CleanCityIndex.date >= day,
                                                                models.CleanCityIndex.date <= day+datetime.timedelta(days=1)).all())

    def __repr__(self):
        resp1 = f'\nCoordinate: {self.coordinate[0]} {self.coordinate[1]} CCIS: {self.ccis_with_next}'
        return resp1


def analysis():

    dates = dict()
    for entry in db.session.query(models.CleanCityIndex).all():
        today = datetime.datetime(entry.date.year, entry.date.month, entry.date.day)
        if today in dates:
            dates[today] += 1
        else:
            dates[today] = 1

    print(sorted(dates.items(), key=lambda x:x[1]))


if __name__ == '__main__':
    #analysis()
    service = Directions(access_token=DevelopmentConfig().MAPBOX_APIKEY)
    app.run()
