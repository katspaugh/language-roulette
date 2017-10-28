import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../Login/Login.jsx';
import Points from '../Points/Points.jsx';
import styles from './Nav.css';

export default class Nav extends React.PureComponent {
  render() {
    return (
      <div className={ styles.container }>
        <nav>
          <div className={ styles.logo }>
            <Link to="/">Language Roulette</Link>
          </div>

          <div className={ styles.info }>
            <Points />
          </div>

          <div className={ styles.login }>
            <Login />
          </div>
        </nav>
      </div>
    );
  }
}
