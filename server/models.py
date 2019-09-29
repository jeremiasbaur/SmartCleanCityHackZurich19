from app import db
from geoalchemy2 import Geometry

import datetime

class Plog(db.Model):
    __tablename__ = 'plog'
    id = db.Column(db.Integer, primary_key=True)

    # distance
    start = db.Column(Geometry('POINT'), nullable=False)
    radius = db.Column(db.Float, nullable=False)

    # route
    linestring = db.Column(Geometry('LINESTRING'))

    # done


    # user cci after


    #date


class GeoInfo(db.Model):
    """
    Saves all information related to a place/way
    """
    __tablename__ = 'geo_info'
    id = db.Column(db.Integer, primary_key=True)

    city_id = db.Column(db.Integer)
    osm_id = db.Column(db.BigInteger)
    cci_id = db.Column(db.String)

    clean_city_indices = db.relationship("CleanCityIndex", back_populates="geo_info")
    clean_city_indices_predictions = db.relationship("CleanCityIndexPrediction", back_populates="geo_info")

    geometry = db.Column(Geometry())

    place = db.Column(db.String)
    place_name = db.Column(db.String)
    place_type = db.Column(db.String)


class CleanCityIndex(db.Model):
    """
    Information for one CCI index
    """
    __tablename__ = 'clean_city_index'

    id = db.Column(db.Integer, primary_key=True)

    suitcase_id = db.Column(db.Integer)

    geo_info_id = db.Column(db.Integer, db.ForeignKey('geo_info.id'))
    geo_info = db.relationship("GeoInfo", back_populates="clean_city_indices")

    date = db.Column(db.DateTime)
    cci = db.Column(db.Float)
    rateCigarrettes = db.Column(db.Float)
    ratePapers = db.Column(db.Float)
    rateBottles = db.Column(db.Float)
    rateExcrements = db.Column(db.Float)
    rateSyringues = db.Column(db.Float)
    rateGums = db.Column(db.Float)
    rateLeaves = db.Column(db.Float)
    rateGrits = db.Column(db.Float)
    rateGlassDebris = db.Column(db.Float)

    def __repr__(self):
        return f'CCI id: {self.id} geo_info_id: {self.geo_info_id} cci: {self.cci} date: {self.date}'

class CleanCityIndexPrediction(db.Model):
    """
    Information for one predicted CCI index
    """
    __tablename__ = 'clean_city_index_prediction'

    id = db.Column(db.Integer, primary_key=True)

    geo_info_id = db.Column(db.Integer, db.ForeignKey('geo_info.id'))
    geo_info = db.relationship("GeoInfo", back_populates="clean_city_indices_predictions")

    date = db.Column(db.DateTime)
    cci = db.Column(db.Float)
    rateCigarrettes = db.Column(db.Float)
    ratePapers = db.Column(db.Float)
    rateBottles = db.Column(db.Float)
    rateExcrements = db.Column(db.Float)
    rateSyringues = db.Column(db.Float)
    rateGums = db.Column(db.Float)
    rateLeaves = db.Column(db.Float)
    rateGrits = db.Column(db.Float)
    rateGlassDebris = db.Column(db.Float)
