import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import MainPage from './Pages/Main/';
import MapPage from './Pages/Map/';
import RouteVerification from './Components/RouteVerification';

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './App.css';
import { PageHeader } from 'antd';

function App() {
  return (
    <Router>
      <div className="App">
        <PageHeader title="Plogo Vadis?" />
        
        <main className="main-container">
          <Switch>
            <Route path="/go">
              <MapPage />
            </Route>
            <Route path="/">
              <MainPage />
            </Route>
          </Switch>

          <RouteVerification />
        </main>
      </div>
    </Router>
  );
}

export default App;
