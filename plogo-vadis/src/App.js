import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import MainPage from './Pages/Main/';
import MapPage from './Pages/Map/';
import RouteVerification from './Components/RouteVerification';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Plogo Vadis?</h1>
        </header>

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
