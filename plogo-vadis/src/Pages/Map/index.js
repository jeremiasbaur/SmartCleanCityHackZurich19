import React, {PureComponent, Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import { TECHNOPARK_COORDS } from '../../Components/PlogMap';

const BACKEND_URL = 'http://fakerestapi.azurewebsites.net';
const CLEANLINESS_LEVELS =  [
  'very dirty. Bring a wheelbarrow!',
  'quite dirty. Bring a bigger bag!',
  'somewhat dirty, optimal conditions!',
  'quite clean',
  'sqeaky clean'
];

class MapPage extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isLoadingRoute: false,
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
    const { refresh = false} = options;

    this.setState({
      isLoadingRoute: true
    }, () => {
      fetch(BACKEND_URL + `?distance=${ distance }&long=${ long }&lat=${ lat }&refresh=${ refresh }`)
        .then(response => response.json())
        .then(data => this.setState({
          route: data.route ? data.route : null,
          expectedCleanliness: data.cci = data.cci ? data.cci : null
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

  render() {
    const { distance, lat, lang } = this.getParameters();
    const { isLoadingRoute, route, expectedCleanliness } = this.state;

    // Dev
    const cleanliness = expectedCleanliness ? expectedCleanliness : Math.floor(Math.random()*5);

    return (
        <Fragment>
          <h1>Get ready!</h1>

          { isLoadingRoute ? (
            <p>Loading route...</p>
          ) : (
            <Fragment>
              <p>Route: {route}</p>
              <pre>map goes here</pre>
              <p>We expect the route to be {CLEANLINESS_LEVELS[Math.floor(cleanliness)]}</p>
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
