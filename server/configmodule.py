class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'postgres://postgres:admin@localhost:5432/HackZurich19'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAPBOX_APIKEY = 'pk.eyJ1IjoiamVyZW1pYXNiYXVyIiwiYSI6ImNrMTN1eHlsNzBjZmgzaXBmenVzcGJ1OWsifQ.y6DlXuUGKtqeV1cuQWGUGQ'

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = ''

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
