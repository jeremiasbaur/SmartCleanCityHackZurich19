import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import DistanceSlider from '../../Components/DistanceSlider';
import { Card } from 'antd';

import './index.css';

import PlogMap, { TECHNOPARK_COORDS } from '../../Components/PlogMap';

export const CARD_STYLE = {"marginBottom": "24px"};
export const CARD_HEAD_STYLE = {"fontSize": "24px", "lineHeight": "1", "textAlign": "center"};

class MainPage extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
        unverifiedRoutes: [],
        previousRoutes: [],
        distance: 1,
        coordinates: TECHNOPARK_COORDS
    };
  }

  render() {
    const {
        distance,
        coordinates,
    } = this.state;

    return (
        <div>
            <Card style={CARD_STYLE} headStyle={CARD_HEAD_STYLE} title="Where are you?">
                <PlogMap
                    coordinates={coordinates}
                    distance={distance}
                    onCoordsChange={(newCoordinates) => this.setState({coordinates: newCoordinates})}
                />
            </Card>

            <Card style={CARD_STYLE} headStyle={CARD_HEAD_STYLE} title="How far would you like to run today?">
                <DistanceSlider distance={distance} onDistanceChange={(newDistance) => this.setState({distance: newDistance})} />
            </Card>

            <div className="box">
                <h1>
                    <Link
                        className="btn btn-white btn-animation-1"
                        to={{
                            pathname: '/go',
                            state: {
                                distance: distance,
                                lat: coordinates[0],
                                long: [1]
                            }
                        }}
                    >Go!</Link>
                </h1>
            </div>
        </div>
    );
  }
}

MainPage.propTypes = {
};


export default MainPage;
