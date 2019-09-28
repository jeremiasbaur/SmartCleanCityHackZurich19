import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import DistanceSlider from '../../Components/DistanceSlider';

import './index.css';

import PlogMap, { TECHNOPARK_COORDS } from '../../Components/PlogMap';


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
            <h3>Where are you?</h3>

            <PlogMap
                coordinates={coordinates}
                distance={distance}
                onCoordsChange={(newCoordinates) => this.setState({coordinates: newCoordinates})}
            />


            <h3>How far would you like to run today?</h3>
            <DistanceSlider distance={distance} onDistanceChange={(newDistance) => this.setState({distance: newDistance})} />

            <div className="box">
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
            </div>

            { firstTimeVisitor && (
                <Fragment>
                    <h2>What is Plogging?</h2>
                    <p>Plogging is a combination of jogging with picking up litter (Swedish: plocka upp). It started as an organised activity in Sweden around 2016 and spread to other countries in 2018, following increased concern about plastic pollution. As a workout, it provides variation in body movements by adding bending, squatting and stretching to the main action of running, hiking, or walking.</p>
                </Fragment>
            )}
        </div>
    );
  }
}

MainPage.propTypes = {
};


export default MainPage;
