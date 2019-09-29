import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';
import { Button, Icon } from 'antd';

import 'react-rangeslider/lib/index.css'
import './index.css';

export const TECHNOPARK_COORDS = [47.389274, 8.51553];
export const BASEL_COORDS = [ 47.554484, 7.594161 ];
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
    return null;
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
    };
  }

  findLocation() {
    const { onCoordsChange = () => {}} = this.props;

    navigator.geolocation.getCurrentPosition((position) => {
      // we only have data for basel, so you're in basel now. Sorry.
      onCoordsChange(BASEL_COORDS);
      //onCoordsChange([position.coords.latitude, position.coords.longitude]);

      this.setState({
        acquiredLocation: true
      });
    });
  }
  
  onMapEvent(data) {
    const { zoom, initial } = data;

    // ignore initial callback
    if (initial) {
      return false;
    }

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
    const { distance = 1 } = this.props;
    const { zoomLevel}  = this.state;
    const toDegrees = (angle) => {
      return angle * (180 / Math.PI);
    };

    const earthCircumference = 40075.016686;
    // for some reason using the actual coordinates gets very weird real quick - use hardcoded coordinates for now
    const Stile = earthCircumference * Math.cos(toDegrees(TECHNOPARK_COORDS[0])) / Math.pow(2, zoomLevel);

    // distance per pixel in KM
    const distPerPx = Stile / 256;

    const radius = (distance / 2) * (1 / distPerPx);

    return radius;
  }

  render() {
    const { coordinates } = this.props;
    const {
      acquiredLocation,
      zoomLevel
    } = this.state;

    return (
      <div className="map-container">
        <Map
          center={coordinates}
          zoom={zoomLevel}
          height={400}
          onBoundsChanged={(newData) => this.onMapEvent(newData)}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onClick={(event) => this.props.onCoordsChange(event.latLng)}
        >
          <Circle centerCoords={coordinates} radius={this.calcRadius()} />
          <Marker anchor={coordinates} payload={1} />
        </Map>

        <div className="map__buttons">
          {'geolocation' in navigator && (
            <Button type="primary" size="large" onClick={() => this.findLocation()}>
              <Icon type="environment" />
              { acquiredLocation ? 'Find me again' : 'Find my location' }
            </Button>
          )}

          <Button.Group size="large">
            <Button onClick={() => this.changeZoom(-1)}>
              <Icon type="zoom-out" />
              Zoom out
            </Button>
            <Button onClick={() => this.changeZoom(1)}>
            <Icon type="zoom-in" />
              Zoom in
            </Button>
          </Button.Group>
        </div>
      </div>
    );
  }
}

PlogMap.propTypes = {
  coordinates: PropTypes.array,
  distance: PropTypes.number,
  onCoordsChange: PropTypes.func
};


export default PlogMap;
