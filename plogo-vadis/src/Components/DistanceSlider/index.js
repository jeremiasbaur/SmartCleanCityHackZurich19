import React, { PureComponent } from 'react';
import Slider from 'react-rangeslider'

import 'react-rangeslider/lib/index.css'

import './index.css';

class DistanceSlider extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      distance: 1
    };
  }

  handleOnChange = (value) => {
    this.setState({
      distance: value
    })
  }

  render() {
    const { distance } = this.state;

    return (
        <div className="distance-slider">
            <Slider
                min={1}
                max={21}
                value={distance}
                onChange={this.handleOnChange}
            />
            <div>{distance} km</div>
        </div>
    );
  }
}

DistanceSlider.propTypes = {
};


export default DistanceSlider;
