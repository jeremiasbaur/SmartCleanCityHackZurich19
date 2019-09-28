import React, { PureComponent } from 'react';
import { List, Button, Card } from 'antd';

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
            <Card style={{"marginTop": "24px", "marginBottom": "24px"}}>
                <p>Hey, you've been on these routes before, care to quickly give some feedback?</p>
                <List
                    itemLayout="horizontal"
                    style={{"textAlign": "left"}}
                    dataSource={routes}
                    renderItem={route => (
                        <UnverifiedRoute
                            key={route.confirmed}
                            route={route}
                            onDismissRoute={() => this.removeUnverifiedRoute(route)}
                        />
                    )}
                />
            </Card>
        );
    }
}

class UnverifiedRoute extends PureComponent {
    render () {
        const { route, onDismissRoute = () => {} } = this.props;

        return (
            <List.Item>
                <List.Item.Meta
                    title="A nice route"
                    description="How was the route you did yesterday?"
                />
                <div>
                    <Button type="link" onClick={() => onDismissRoute(route)}>Dismiss</Button>
                </div>
            </List.Item>
        );
    }
}

RouteVerification.propTypes = {
};

export default RouteVerification;
