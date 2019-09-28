import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import DistanceSlider from '../../Components/DistanceSlider';
import { Card } from 'antd';

import './index.css';

import PlogMap, { TECHNOPARK_COORDS } from '../../Components/PlogMap';

export const CARD_STYLE = {"marginBottom": "24px"};
export const CARD_HEAD_STYLE = {"fontSize": "24px", "lineHeight": "1"};

class MainPage extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
        firstTimeVisitor: false,
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
        firstTimeVisitor
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

            { firstTimeVisitor && (
                <Card style={CARD_STYLE} headStyle={CARD_HEAD_STYLE} title="What is Plogging?">
                    <p>Plogging is a combination of jogging with picking up litter (Swedish: plocka upp). It started as an organised activity in Sweden around 2016 and spread to other countries in 2018, following increased concern about plastic pollution. As a workout, it provides variation in body movements by adding bending, squatting and stretching to the main action of running, hiking, or walking.</p>
                </Card>
            )}
        </div>
    );
  }
}

MainPage.propTypes = {
};


export default MainPage;
