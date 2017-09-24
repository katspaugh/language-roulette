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

  const levelOptions = config.levels.map(item => (
    <option key={ item.level } value={ item.level }>{ item.title }</option>
  ));

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
              <span>I want to speak</span>

              <select defaultValue={ userData.language || config.defaultLang }
                      onChange={ e => User.saveLanguage(e.target.value) }>
                { langOptions }
              </select>
            </h2>
          </div>

          <div className={ styles.column }>
            <h2>
              <span>My level is</span>

              <select defaultValue={ userData.level || config.levels[0] }
                      onChange={ e => User.saveLevel(e.target.value) }>
                { levelOptions }
              </select>
            </h2>
          </div>
        </div>
      </section>

      <section>
        <div className={ styles.container }>
          <h3>Join a video chat as a</h3>

          <div className={ styles.cta }>
            <Link to="/lobby" onClick={ () => User.saveTeacher(false) }>Student</Link>
            <i>or</i>
            <Link to="/lobby" onClick={ () => User.saveTeacher(true) }>Teacher</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
