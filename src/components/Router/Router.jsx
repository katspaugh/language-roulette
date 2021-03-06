import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Nav from '../Nav/Nav.jsx';
import Footer from '../Footer/Footer.jsx';
import BehindLogin from '../BehindLogin/BehindLogin.jsx';
import FrontRoute from '../FrontRoute/FrontRoute.jsx';
import Lobby from '../Lobby/Lobby.jsx';
import Call from '../Call/Call.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';
import styles from './Router.css';

const Routes = () => (
  <Router>
    <div>
      <Nav />

      <Route exact path="/" component={ FrontRoute } />

      <Route exact path="/lobby" component={ () => <BehindLogin><Lobby /></BehindLogin> } />

      <Route exact path="/call/:id" component={ Call } />

      <Route exact path="/dashboard" component={ () => <BehindLogin><Dashboard /></BehindLogin> } />

      <Footer />
    </div>
  </Router>
);

export default Routes;
