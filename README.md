# SmartCleanCityHackZurich19

# Inspiration
Plogging means picking up litter while jogging. It may sound weird, but since you're jogging anyway, why not get rid of some trash and make the city a tiny bit nicer? And you'll be doing some stretching and squats in addition to the cardio!

![Plogging Plogging Plogging](https://github.com/jeremiasbaur/SmartCleanCityHackZurich19/blob/master/pics/gallery.jpg)

*Choose your location and how far you want to plog - we'll suggest a route through some dirty streets around you!*

# What it does? 
Based on historical data Plogo Vadis tries to predict the cleanliness of the streets around you and it'll generate a route of your desired length along the dirtier parts of your area.

# How we built it?
Three-pronged approach:

* Create a model to predict the cleanliness for a given street junction from:
	- Bucher-provided street dirtyness data
	- frequency of Twitter mentions for a given street or landmark to estimate its human traffic and pollution
	- MeteoMatics temperature and precipitation forecasts for a give date-time

* Website/Web-App where users can enter from where and how far they want to "plog"
* Backend which queries the predictions and figures out a route that's not too clean but also not too dirty - the ratio of jogging to picking up litter should still be enjoyable.


# How to run

## Frontend

* `git clone git@github.com:jeremiasbaur/SmartCleanCityHackZurich19.git`
* `cd plogo-vadis`
* `npm install`
* `npm start`
* optionally, change BACKEND_URL in `src/Pages/Map/index.js`

## Backend

* `git clone git@github.com:jeremiasbaur/SmartCleanCityHackZurich19.git`
* `pip3 install -r requirements.txt`
* upon first run: `python create_db.py`
* `python app.py`
