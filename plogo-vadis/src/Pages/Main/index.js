import React, {PureComponent} from 'react';
import { Link } from 'react-router-dom';
import DistanceSlider from '../../Components/DistanceSlider';

import './index.css';

import PlogMap from '../../Components/PlogMap';


class MainPage extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
        distance: 1,
    };
  }

  render() {
    const { distance } = this.state;

    return (
        <div>
            <p>main page</p>

            <h3>Where are you?</h3>

            <PlogMap distance={distance} />


            <h3>How far would you like to run today?</h3>
            <DistanceSlider distance={distance} onDistanceChange={(newDistance) => this.setState({distance: newDistance})} />

            <div className="box">
                <Link
                    className="btn btn-white btn-animation-1"
                    to='/go'
                >Go!</Link>
            </div>


            <h2>What is Plogging?</h2>
            <p>Plogging is a combination of jogging with picking up litter (Swedish: plocka upp). It started as an organised activity in Sweden around 2016 and spread to other countries in 2018, following increased concern about plastic pollution. As a workout, it provides variation in body movements by adding bending, squatting and stretching to the main action of running, hiking, or walking.</p>
        </div>
    );
  }
}

MainPage.propTypes = {
};


export default MainPage;
