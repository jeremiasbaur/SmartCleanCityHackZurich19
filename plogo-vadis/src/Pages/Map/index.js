import React, {PureComponent, Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import { TECHNOPARK_COORDS } from '../../Components/PlogMap';
import { LOCALSTORAGE_KEY_UNVERIFIED_ROUTES } from '../../Components/RouteVerification';

const BACKEND_URL = 'http://fakerestapi.azurewebsites.net';
const CLEANLINESS_LEVELS =  [
  'very dirty. Bring a wheelbarrow!',
  'quite dirty. Bring a bigger bag!',
  'somewhat dirty, optimal conditions!',
  'quite clean',
  'spotless! ✨'
];

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
      lat,
      long
    } = this.getParameters();
    const { refresh = false } = options;

    this.setState({
      isLoadingRoute: true,
      routeAccepted: false
    }, () => {
      fetch(BACKEND_URL + `?radius=${ distance/2 }&long=${ long }&lat=${ lat }&refresh=${ refresh }`)
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
      lat: TECHNOPARK_COORDS[0],
      long: TECHNOPARK_COORDS[1]
    };

    if (this.props && this.props.location && this.props.location.state) {
      const { distance, lat, long } = this.props.location.state;
      parameters = {
        distance: distance,
        lat: lat,
        long: long
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
    const { distance, lat, lang } = this.getParameters();
    const {
      isLoadingRoute,
      route,
      expectedCleanliness,
      routeAccepted
    } = this.state;

    return (
        <Fragment>
          <h1>Get ready!</h1>

          { isLoadingRoute && (
            <p>Loading route...</p>
          )}
          
          { !isLoadingRoute && (
            <Fragment>
              <p>How about this route?</p>
              <pre>map goes here, with {distance/2}km around [{lat}, {lang}]</pre>
              <p>We expect the route to be {CLEANLINESS_LEVELS[Math.floor(expectedCleanliness)]}</p>
    
              {!routeAccepted && (
                <button onClick={() => this.confirmRoute()}>I'll take it!</button>
              )}
            </Fragment>
          )}

          <button onClick={() => this.getRoute({refresh: true})}>Get another route</button>

        </Fragment>
    );
  }
}

MapPage.propTypes = {
};


export default withRouter(MapPage);
