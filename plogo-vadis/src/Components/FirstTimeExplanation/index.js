import React, { PureComponent, Fragment } from 'react';
import { Card } from 'antd';
import { CARD_STYLE, CARD_HEAD_STYLE } from '../../Pages/Main';
import HERO_IMG from '../../ploggers.jpg';

export const LOCALSTORAGE_KEY_VISITED = 'plogo-vadis.visited';

class FirstTimeExplanation extends PureComponent {
    constructor(props) {
        super(props);

        let hasVisited = false;
        if (localStorage.getItem(LOCALSTORAGE_KEY_VISITED)) {
            hasVisited = true;
        }

        localStorage.setItem(LOCALSTORAGE_KEY_VISITED, JSON.stringify(true));

        this.state = {
            hasVisited: hasVisited
        };
    }

    render() {
        if (this.state.hasVisited) {
            return null;
        }

        return (
            <Fragment>
                <Card
                    style={CARD_STYLE}
                    headStyle={CARD_HEAD_STYLE}
                    title="What is Plogging?"
                    cover={<img alt="A group of people picking up trash while jogging - plogging!" src={HERO_IMG} />}
                >
                    <p>Plogging is a combination of jogging with picking up litter (Swedish: plocka upp). It started as an organised activity in Sweden around 2016 and spread to other countries in 2018, following increased concern about plastic pollution. As a workout, it provides variation in body movements by adding bending, squatting and stretching to the main action of running, hiking, or walking.</p>
                </Card>
            </Fragment>
        );
    }
}

FirstTimeExplanation.propTypes = {
};

export default FirstTimeExplanation;
