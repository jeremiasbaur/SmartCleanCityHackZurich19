import React, { PureComponent, Fragment } from 'react';

export const LOCALSTORAGE_KEY_UNVERIFIED_ROUTES = 'plogo-vadis.unverified-routes';

class RouteVerification extends PureComponent {
    constructor(props) {
        super(props);

        let routes = [];
        if (localStorage.getItem(LOCALSTORAGE_KEY_UNVERIFIED_ROUTES)) {
            routes = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_UNVERIFIED_ROUTES))
        }

        this.state = {
            routes: routes
        };
    }

    render() {
        const { routes } = this.state;

        if (routes.length === 0) {
            return null;
        }

        return (
            <Fragment>
                <hr />
                <p>Hey, you've been on these routes before, care to quickly give some feedback?</p>
                <ul>
                    {routes.map(route => 
                        <UnverifiedRoute key={route.confirmed} route={route} />
                        )}
                </ul>
            </Fragment>
        );
    }
}

class UnverifiedRoute extends PureComponent {
    render () {
        const { route } = this.props;

        return (
            <li>
                <p>A nice route. How was it?</p>
                <button>Too dirty!</button>
                <button>Just right</button>
                <button>Cleaner than expected</button>
            </li>
        );
    }
}

RouteVerification.propTypes = {
};


export default RouteVerification;