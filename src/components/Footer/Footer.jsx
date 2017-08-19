import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.css';

export default class Footer extends React.PureComponent {
  render() {
    return (
      <div className={ styles.container }>
        <footer>
          <div>
            Language is a virus from outer space <cite>― William S. Burroughs</cite>
          </div>

          <div>
            Language Roulette, 2017
          </div>
        </footer>
      </div>
    );
  }
}
