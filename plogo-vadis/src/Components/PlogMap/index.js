import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';

import 'react-rangeslider/lib/index.css'

const TECHNOPARK_COORDS = [47.389274, 8.51553];
const MAX_ZOOM = 18;
const MIN_ZOOM = 1;
const DEFAULT_ZOOM = 12;

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
        <circle cx={pixel[0]} cy={pixel[1]} r={"" + radius} style={style} />
    </svg>
  )
}

class PlogMap extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      zoomLevel: DEFAULT_ZOOM,
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

    const clampedZoom = Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);

    this.setState({
      zoomLevel: clampedZoom
    });
  }

  changeZoom(change) {
    this.setState({
      zoomLevel: this.state.zoomLevel + change
    });
  }

  calcRadius() {
    const { distance = 1} = this.props;
    const {
      coordinates,
      zoomLevel
    } = this.state;
    const toDegrees = (angle) => {
      return angle * (180 / Math.PI);
    };

    const earthCircumference = 40075.016686;
    const Stile = earthCircumference * Math.cos(toDegrees(coordinates[0])) / Math.pow(2, zoomLevel);

    // distance per pixel in KM
    const distPerPx = Stile / 256;

    const radius = (distance / 2) * (1 / distPerPx);

    return radius;
  }

  render() {
    const {
      acquiredLocation,
      coordinates,
      zoomLevel
    } = this.state;

    return (
      <div className="map-container">
        {'geolocation' in navigator && (
          <button onClick={() => this.findLocation()}>
            { acquiredLocation ? 'Find me again' : 'Find my location' }
          </button>
        )}

          <button onClick={() => this.changeZoom(1)}>Zoom in</button>
          <button onClick={() => this.changeZoom(-1)}>Zoom out</button>

        <Map
          center={coordinates}
          zoom={zoomLevel}
          width={600}
          height={400}
          onBoundsChanged={(newData) => this.onMapEvent(newData)}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
        >
          <Marker anchor={coordinates} payload={1} onClick={({ event, anchor, payload }) => {}} />

          <Circle centerCoords={coordinates} radius={this.calcRadius()} />
        </Map>
      </div>
    );
  }
}

PlogMap.propTypes = {
  distance: PropTypes.number
};


export default PlogMap;
