import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';

import React, {PureComponent} from 'react';

import 'react-rangeslider/lib/index.css'

const TECHNOPARK_COORDS = [47.389274, 8.51553];

class PlogMap extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: props.coordinates ? props.coordinates : TECHNOPARK_COORDS
    };
  }
  render() {
    const { coordinates } = this.state;

    return (
      <Map center={coordinates} zoom={12} width={600} height={400}>
        <Marker anchor={coordinates} payload={1} onClick={({ event, anchor, payload }) => {}} />
      </Map>
    );
  }
}

PlogMap.propTypes = {
};


export default PlogMap;
