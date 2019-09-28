from app import db
from models import PlogginRoute ,GeoInfo, CleanCityIndex

db.create_all()
db.session.commit()

if __name__ == '__main__':
    try:
        #last = db.session.query(CleanCityIndex).get(1)
        #print(last.geo_info)

        #geoInfo1 = GeoInfo(city_id=12, osm_id=12, cci_id='22_22', geometry='POLYGON((7.6032375 47.5541179, 7.6032147 47.5540952, 7.6032268 47.5540418, 7.6032563 47.5540228, 7.6033421 47.5540314, 7.6033636 47.5540518, 7.6033522 47.5541075, 7.603322 47.5541256, 7.6032375 47.5541179))')
        #cci = CleanCityIndex(cci=1.3)
        #cci.geo_info = geoInfo1

        #db.session.add(geoInfo1)
        #db.session.add(cci)
        db.session.commit()
    except Exception as e:
        print(e)
        pass
