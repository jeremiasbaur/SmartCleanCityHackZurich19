import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';

import 'react-rangeslider/lib/index.css'

const TECHNOPARK_COORDS = [47.389274, 8.51553];

const Circle = ({
  mapState: { width, height },
  latLngToPixel,
  centerCoords,
  radius,
  style = { stroke: 'rgb(255,0,0)', strokeWidth: 2, 'fill': 'none' }
}) => {
  if (centerCoords.length !== 2) {
    return null
  }

  let pixel = latLngToPixel(centerCoords);

  return (
    <svg width={width} height={height} style={{ top: 0, left: 0, position: 'absolute' }}>
        <circle cx={pixel[0]} cy={pixel[1]} r={"" + (radius * 20)} style={style} />
    </svg>
  )
}

class PlogMap extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      zoomLevel: 12,
      acquiredLocation: false,
      coordinates: props.coordinates ? props.coordinates : TECHNOPARK_COORDS
    };
  }

  findLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        acquiredLocation: true,
        coordinates: [position.coords.latitude, position.coords.longitude]
      });
    });
  }
  
  onMapEvent(data) {
    const { zoom } = data;

    this.setState({
      zoomLevel: zoom
    });
  }

  render() {
    const { distance = 1} = this.props;
    const {
      acquiredLocation,
      coordinates,
      zoomLevel
    } = this.state;

    // TODO: figure out how to get from "km" to radius depending on the zoom level
    const radius = (distance / 2) * (zoomLevel * .4);

    return (
      <div className="map-container">
        {'geolocation' in navigator && (
          <button onClick={() => this.findLocation()}>
            { acquiredLocation ? 'Find me again' : 'Find my location' }
          </button>
        )}

        <Map center={coordinates} zoom={12} width={600} height={400} onBoundsChanged={(newData) => this.onMapEvent(newData)}>
          <Marker anchor={coordinates} payload={1} onClick={({ event, anchor, payload }) => {}} />

          <Circle centerCoords={coordinates} radius={radius} />
        </Map>
      </div>
    );
  }
}

PlogMap.propTypes = {
  distance: PropTypes.number
};


export default PlogMap;
