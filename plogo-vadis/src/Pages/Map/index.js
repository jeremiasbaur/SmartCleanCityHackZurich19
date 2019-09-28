import React, {PureComponent, Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';
import { TECHNOPARK_COORDS } from '../../Components/PlogMap';
import { LOCALSTORAGE_KEY_UNVERIFIED_ROUTES } from '../../Components/RouteVerification';

import { Spin, Card, Button } from 'antd';

import { CARD_STYLE, CARD_HEAD_STYLE } from '../Main';

const BACKEND_URL = 'http://fakerestapi.azurewebsites.net';
const CLEANLINESS_LEVELS =  [
  'very dirty',
  'quite dirty',
  'somewhat dirty',
  'quite clean',
  'spotless'
];
const CLEANLINESS_LEVEL_ADDITIONAL_BLURB =  [
  'Bring a wheelbarrow!',
  'Bring a bigger bag!',
  'Optimal conditions!',
  'Concentrate on your run!',
  "✨"
];

const createFakeRoute = (coordinates) => {
  let getRandomNrBetween = (min, max) => { // min and max included 
        return Math.random() * (max - min + 1) + min;
      },
      jiggle = (original, factor) => {return original * (1 + getRandomNrBetween(-10, 11)/factor)};
      

  const nrOfCoordinates = Math.floor(Math.random()*20 + 3);
  let route = [coordinates];

  for(let i = 0; i < nrOfCoordinates; i++) {
    route.push([jiggle(coordinates[0], 15000), jiggle(coordinates[1], 3000)]);
  }
  route.push(coordinates);

  return route;
};

const Line = ({ mapState: { width, height }, latLngToPixel, coordsArray, style = { stroke: 'rgb(255,0,0)', strokeWidth: 2, fill: 'none' } }) => {
  if (coordsArray.length < 2) {
    return null
  }

  let lines = []
  let pixel = latLngToPixel(coordsArray[0])

  for (let i = 1; i < coordsArray.length; i++) {
    let pixel2 = latLngToPixel(coordsArray[i])
    lines.push(<line key={i} x1={pixel[0]} y1={pixel[1]} x2={pixel2[0]} y2={pixel2[1]} style={style} />)
    pixel = pixel2
  }

  return (
    <svg width={width} height={height} style={{ top: 0, left: 0 }}>
      {lines}
    </svg>
  )
}

class MapPage extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isLoadingRoute: false,
      routeAccepted: false,
      route: null,
      expectedCleanliness: null
    }
  }

  componentDidMount() {
    this.getRoute();
  }

  getRoute(options = {}) {
    const {
      distance,
      latitude,
      longitude
    } = this.getParameters();
    const { refresh = false } = options;

    this.setState({
      isLoadingRoute: true,
      routeAccepted: false
    }, () => {
      fetch(BACKEND_URL + `?distance=${ distance }&long=${ longitude }&lat=${ latitude }&refresh=${ refresh }`)
        .then(response => response.json())
        .then(data => this.setState({
          route: data.route ? data.route : null,
          expectedCleanliness: data.cci = data.cci ? data.cci : Math.random()*5
        }))
        .catch((e) => console.error(e))
        .finally(() => this.setState({ isLoadingRoute: false }));
    })
  }

  getParameters() {
    // get chosen parameters from previous page via props.location or use default value
    let parameters = {
      distance: 1,
      latitude: TECHNOPARK_COORDS[0],
      longitude: TECHNOPARK_COORDS[1]
    };

    if (this.props && this.props.location && this.props.location.state) {
      const { distance, latitude = parameters.latitude, longitude = parameters.longitude } = this.props.location.state;
      parameters = {
        distance: distance,
        latitude: latitude,
        longitude: longitude
      };
    }

    return parameters;
  }

  confirmRoute() {
    let allUnverifiedRoutes = [];

    if (localStorage.getItem(LOCALSTORAGE_KEY_UNVERIFIED_ROUTES)) {
      allUnverifiedRoutes = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_UNVERIFIED_ROUTES));
    }

    allUnverifiedRoutes.push({
      confirmed: Date.now(),
      route: this.state.route
    });

    localStorage.setItem(LOCALSTORAGE_KEY_UNVERIFIED_ROUTES, JSON.stringify(allUnverifiedRoutes));

    this.setState({
      routeAccepted: true
    });
  }

  render() {
    const { latitude, longitude } = this.getParameters();
    const {
      isLoadingRoute,
      //route,
      expectedCleanliness,
      routeAccepted
    } = this.state;

    const route = createFakeRoute([latitude, longitude]);

    return (
        <Fragment>
          { isLoadingRoute && (
            <Spin />
          )}
          
          { !isLoadingRoute && (
            <Fragment>

              <Card style={CARD_STYLE} headStyle={CARD_HEAD_STYLE} title="Get ready!">
                <p>How about this route?</p>
                <Map
                  center={[latitude, longitude]}
                  height={400}
                  zoom={12}
                >
                  <Marker anchor={[latitude, longitude]} payload={1} />
                  <Line coordsArray={route} />
                </Map>
              
                <p style={{"marginTop": "8px", "marginBottom": "16px"}}>We expect the route to be <span style={{"fontWeight": "bold"}}>{CLEANLINESS_LEVELS[Math.floor(expectedCleanliness)]}</span>. {CLEANLINESS_LEVEL_ADDITIONAL_BLURB[Math.floor(expectedCleanliness)]}</p>

                {!routeAccepted && (
                  <div className="map__buttons">
                    <Button onClick={() => this.getRoute({refresh: true})}>Get another route</Button>
                    <Button type="primary" onClick={() => this.confirmRoute()}>I'll take it!</Button>
                  </div>
                )}

                {routeAccepted && (
                  <p>Go forth and clean this wretched place!</p>
                )}
              </Card>

            </Fragment>
          )}

        </Fragment>
    );
  }
}

MapPage.propTypes = {
};


export default withRouter(MapPage);
