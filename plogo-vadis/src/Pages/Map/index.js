import React, {PureComponent} from 'react';
import { withRouter } from 'react-router-dom';

class MapPage extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    // get chosen distance from previous page via location
    let chosenDistance = 1;
    if (this.props && this.props.location && this.props.location.state) {
      const { distance } = this.props.location.state;
      chosenDistance = distance;
    }

    return (
        <p>map page { chosenDistance }</p>
    );
  }
}

MapPage.propTypes = {
};


export default withRouter(MapPage);
