import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Nav from '../Nav/Nav.jsx';
import Footer from '../Footer/Footer.jsx';
import FrontRoute from '../FrontRoute/FrontRoute.jsx';
import Lobby from '../Lobby/Lobby.jsx';
import styles from './Router.css';

const Routes = () => (
  <Router>
    <div>
      <Nav />

      <Route exact path="/" component={ FrontRoute } />

      <Route exact path="/lobby" component={ Lobby } />

      <Footer />
    </div>
  </Router>
);

export default Routes;
