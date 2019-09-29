import React, { PureComponent } from 'react';
import { List, Button, Card, Avatar, Alert } from 'antd';

export const LOCALSTORAGE_KEY_UNVERIFIED_ROUTES = 'plogo-vadis.unverified-routes';
const ROUTE_TITLES = [
    "A nice route",
    "Cleanup extravaganza",
    "Plogging galore",
    "Prelude to a relaxing session",
    "A short hike",
    "A route so nice you should take it twice",
    "The one with the flowers on the side of the street",
    "Hopefully cleaner now",
    "The best one yet"
];

class RouteVerification extends PureComponent {
    constructor(props) {
        super(props);

        let routes = [];
        if (localStorage.getItem(LOCALSTORAGE_KEY_UNVERIFIED_ROUTES)) {
            routes = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_UNVERIFIED_ROUTES))
        }

        this.state = {
            routes: routes,
            showingHint: false
        };
    }

    removeUnverifiedRoute(routeToRemove) {
        const filteredRoutes = this.state.routes.filter(route => route !== routeToRemove);

        localStorage.setItem(LOCALSTORAGE_KEY_UNVERIFIED_ROUTES, JSON.stringify(filteredRoutes));

        this.setState({
            routes: filteredRoutes
        });
    }

    verifyRoute(routeToVerify) {
        this.setState({
            showingHint: true
        });
    }

    render() {
        const { routes, showingHint } = this.state;

        if (routes.length === 0) {
            return null;
        }

        return (
            <Card style={{"marginTop": "24px", "marginBottom": "24px"}}>
                <p>Hey, you've been on { routes.length > 1 ? 'these routes' : 'this route' } before, care to quickly give some feedback?</p>
                { showingHint && (
                    <Alert
                    style={{"marginTop": "16px"}}
                    message="Sorry, that's a post-hackday feature :)"
                    type="info"
                    closable
                    onClose={() => this.setState({showingHint: false})}
                    />
                )}
                <List
                    itemLayout="horizontal"
                    style={{"textAlign": "left"}}
                    dataSource={routes}
                    renderItem={route => (
                        <UnverifiedRoute
                            key={route.confirmed}
                            route={route}
                            onDismissRoute={() => this.removeUnverifiedRoute(route)}
                            onVerifyRoute={() => this.verifyRoute(route)}
                        />
                    )}
                />
            </Card>
        );
    }
}

class UnverifiedRoute extends PureComponent {
    render () {
        const {
            route,
            onDismissRoute = () => {},
            onVerifyRoute = () => {}
        } = this.props;

        const randomDate = new Date(+(new Date()) - Math.floor(Math.random()*10000000000));
        const dateString = randomDate.toLocaleDateString("de-CH")

        return (
            <List.Item>
                <List.Item.Meta
                    title={ ROUTE_TITLES[Math.floor(Math.random() * ROUTE_TITLES.length - 1)] }
                    avatar={<Avatar src="https://picsum.photos/100/100" />}
                    description={`How was it? (${dateString})`}
                />
                <div>
                    <Button type="link" onClick={() => onVerifyRoute(route)}>Tell us about it</Button>
                    <Button type="link" onClick={() => onDismissRoute(route)}>Dismiss</Button>
                </div>
            </List.Item>
        );
    }
}

RouteVerification.propTypes = {
};

export default RouteVerification;
