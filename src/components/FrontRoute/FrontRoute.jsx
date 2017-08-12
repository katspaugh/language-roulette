import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import User from '../../services/User';
import config from '../../config';
import styles from './FrontRoute.css';

/**
 * FrontRoute component
 */
export default ({ match }) => {
  const userData = User.getUserData();

  return (
    <div className={ styles.front }>
      <section className={ styles.hilite }>
        <div className={ styles.container }>
          <h1>Language Roulette</h1>
        </div>
      </section>

      <section>
        <div className={ styles.container }>
          <h2>
            <span>I speak</span>

            <select onChange={ e => User.saveNativeLanguage(e.target.value) } defaultValue={ userData.nativeLanguage }>
              { config.languages.map(lang => (
                <option key={ lang }>{ lang }</option>
              )) }
            </select>
          </h2>

          <h2>
            <span>I'm learning</span>

            <select onChange={ e => User.saveTargetLanguage(e.target.value) } defaultValue={ userData.targetLanguage }>
              { config.languages.map(lang => (
                <option key={ lang }>{ lang }</option>
              )) }
            </select>
          </h2>
        </div>
      </section>

      <section>
        <div className={ styles.container }>
          <h3>Join a video chat as:</h3>

          <div className={ styles.cta }>
            <Link to="/lobby" onClick={ () => User.saveStudent(true) }>Student</Link>
            <i>or</i>
            <Link to="/lobby" onClick={ () => User.saveStudent(false) }>Teacher</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
