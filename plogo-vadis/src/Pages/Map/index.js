import React, {PureComponent} from 'react';
import { withRouter } from 'react-router-dom';
import { TECHNOPARK_COORDS } from '../../Components/PlogMap';

const BACKEND_URL = 'https://loldunnoyet.com/getRoute?';

class MapPage extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isLoadingRoute: false,
      route: null
    }
  }

  componentDidMount() {
    this.getRoute();
  }

  getRoute() {
    const {
      distance,
      lat,
      long
    } = (this.getParameters());

    this.setState({
      isLoadingRoute: true
    }, () => {
      fetch(BACKEND_URL + `?distance=${ distance }&long=${ long }&lat=${ lat }`)
        .then(response => response.json())
        .then(data => this.setState({
          isLoadingRoute: false,
          route: data.route
        }));
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
    const { isLoadingRoute } = this.state;

    if (isLoadingRoute) {
      return (<p>Loading route...</p>);
    }

    return (
        <p>map page</p>
    );
  }
}

MapPage.propTypes = {
};


export default withRouter(MapPage);
