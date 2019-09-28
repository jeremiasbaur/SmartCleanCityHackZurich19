import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-rangeslider'

import 'react-rangeslider/lib/index.css'
import './index.css';

class DistanceSlider extends PureComponent {
  render() {
    const {
      distance = 1,
      onDistanceChange = () => {}
    } = this.props;

    return (
        <div className="distance-slider">
            <Slider
                min={1}
                max={21}
                value={distance}
                onChange={(value) => onDistanceChange(value)}
            />
            <h1>{distance} km</h1>
        </div>
    );
  }
}

DistanceSlider.propTypes = {
  distance: PropTypes.number,
  onDistanceChange: PropTypes.func
};


export default DistanceSlider;
