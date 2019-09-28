import pandas as pd
import datetime

from app import db
from models import GeoInfo, CleanCityIndex

def try_parse_int(string_to_int):
    # I thought there was a problem with nan values but in the end it was biginteger.. python...
    try:
        return int(string_to_int)
    except ValueError:
        return None

def parse_geo_info():
    for index, row in geoinfo.iterrows():
        if index == 0: continue
        db.session.add(GeoInfo(city_id=int(row['city_id']), osm_id=try_parse_int(row['osm_id']), cci_id=row['cci_id'], place=row['type'], geometry=row['coordinates']))
        print(index)
    db.session.commit()

def parse_measures():
    for index, row in measures.iterrows():
        if index == 0: continue
        geo_info = db.session.query(GeoInfo).filter(GeoInfo.osm_id == try_parse_int(row['osm_id'])).first()
        clean_city_index = CleanCityIndex(suitcase_id=row['suitcase_id'], date=datetime.datetime.strptime(row['date'], '%Y-%m-%d %H:%M:%S'),
                                          cci=row['cci'],
                                          rateCigarrettes=row['rateCigarrettes'],
                                          ratePapers=row['ratePapers'],
                                          rateBottles=row['rateBottles'],
                                          rateExcrements=row['rateExcrements'],
                                          rateSyringues=row['rateSyringues'],
                                          rateGums=row['rateGums'],
                                          rateLeaves=row['rateLeaves'],
                                          rateGrits=row['rateGrits'],
                                          rateGlassDebris=row['rateGlassDebris'])

        clean_city_index.geo_info = geo_info
        geo_info.place_name = row['place_name']
        geo_info.place_type = row['place_type']

        print(index)
    db.session.commit()


if __name__ == '__main__':
    file_measures = r'../data/2019-09-27-basel-measures-cleaned.csv'
    file_geoinfo = r'../data/2019-09-27-basel-collections.csv'

    measures = pd.read_csv(file_measures, sep=';')
    geoinfo = pd.read_csv(file_geoinfo, sep=',')
    parse_geo_info()
    parse_measures()
