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

    removeUnverifiedRoute(routeToRemove) {
        const filteredRoutes = this.state.routes.filter(route => route !== routeToRemove);

        localStorage.setItem(LOCALSTORAGE_KEY_UNVERIFIED_ROUTES, JSON.stringify(filteredRoutes));

        this.setState({
            routes: filteredRoutes
        });
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
                        <UnverifiedRoute
                            key={route.confirmed}
                            route={route}
                            onDismissRoute={() => this.removeUnverifiedRoute(route)}
                        />
                    )}
                </ul>
            </Fragment>
        );
    }
}

class UnverifiedRoute extends PureComponent {
    render () {
        const { route, onDismissRoute = () => {} } = this.props;

        return (
            <li>
                <p>A nice route. How was it?</p>
                <button>Too dirty!</button>
                <button>Just right</button>
                <button>Cleaner than expected</button>
                <button onClick={() => onDismissRoute(route)}>Dismiss</button>
            </li>
        );
    }
}

RouteVerification.propTypes = {
};

export default RouteVerification;
