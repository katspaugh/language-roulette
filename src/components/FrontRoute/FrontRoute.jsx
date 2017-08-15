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
          <h1>
            Language
            <span>
              <img src="/images/spin.png" className={ styles.spinningImage } />
              <img src="/images/pointer.png" className={ styles.pointerImage } />
            </span>
            Roulette</h1>
        </div>
      </section>

      <section>
        <div className={ classnames(styles.container, styles.row) }>
          <div className={ styles.column }>
            <h2>
              <span>I'm learning</span>

              <select onChange={ e => User.saveTargetLanguage(e.target.value) } defaultValue={ userData.targetLanguage }>
                { config.languages.map(lang => (
                  <option key={ lang }>{ lang }</option>
                )) }
              </select>
            </h2>
          </div>

          <div className={ styles.column }>
            <h2>
              <span>I speak</span>

              <select onChange={ e => User.saveNativeLanguage(e.target.value) } defaultValue={ userData.nativeLanguage }>
                { config.languages.map(lang => (
                  <option key={ lang }>{ lang }</option>
                )) }
              </select>
            </h2>
          </div>
        </div>
      </section>

      <section>
        <div className={ styles.container }>
          <h3>Join a video chat as a</h3>

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
