import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import User from '../../services/User';
import config from '../../config';
import YoutubeList from '../YoutubeList/YoutubeList.jsx';
import styles from './FrontRoute.css';

/**
 * FrontRoute component
 */
export default ({ match }) => {
  const userData = User.getUserData();

  const otherLanguages = Object.keys(config.languages)
    .filter(key => !(key in config.popularLanguages));

  const langOptions = Object.keys(config.popularLanguages).map(lang => (
    <option key={ lang } value={ lang }>{ config.languages[lang] }</option>
  )).concat([ (
    <option disabled>───────</option>
  ) ]).concat(otherLanguages.map(lang => (
    <option key={ lang } value={ lang }>{ config.languages[lang] }</option>
  )));

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

              <select defaultValue={ userData.targetLanguage || config.defaultLang }
                      onChange={ e => User.saveTargetLanguage(e.target.value) }>
                { langOptions }
              </select>
            </h2>
          </div>

          <div className={ styles.column }>
            <h2>
              <span>I speak</span>

              <select defaultValue={ userData.nativeLanguage || config.defaultLang }
                      onChange={ e => User.saveNativeLanguage(e.target.value) }>
                { langOptions }
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
