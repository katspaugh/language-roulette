import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import UserStore from '../../services/UserStore';
import UserApi from '../../services/UserApi';
import config from '../../config';
import styles from './FrontRoute.css';

/**
 * FrontRoute component
 */
export default class FrontRoute extends PureComponent {
  constructor() {
    super();

    this.unsubscribe = null;

    this.state = {
      language: '',
      level: '',
      loggedIn: false
    };
  }

  setValue(data) {
    UserStore.dispatch({ type: 'update', data });
  }

  submit(e) {
    const userData = UserStore.getState();

    if (userData.userId) {
      UserStore.dispatch({ type: 'update', data: this.state });
      UserApi.updateUserData(userData.userId, userData.userAccessToken, userData);
    } else {
      e.preventDefault();
      UserStore.dispatch({ type: 'loginNeeded' });
    }
  }

  updateState() {
    const { userId, language, level } = UserStore.getState();
    this.setState({ language, level, loggedIn: Boolean(userId) });
  }

  toggleHomeLinks(toggle) {
    const links = document.querySelectorAll('a[href="/"]');
    [].forEach.call(links, link => link.style.visibility = toggle ? '' : 'hidden');
  }

  componentWillMount() {
    this.unsubscribe = UserStore.subscribe(() => this.updateState());
    this.updateState();
  }

  componentDidMount() {
    this.toggleHomeLinks(false);
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();

    this.toggleHomeLinks(true);
  }

  render() {
    const { language, level, loggedIn } = this.state;

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
        <section>
          <div className={ styles.container }>
            <h1>
              Language
              <span>
                <img src="/images/spin.png" className={ styles.spinningImage } />
                <img src="/images/pointer.png" className={ styles.pointerImage } />
              </span>
              Roulette
            </h1>
          </div>
        </section>

        <section>
          <div className={ styles.container }>
            <div className={ styles.row }>
              <div className={ styles.column }>
                <h2>
                  <span>I want to speak</span>

                  <select value={ language || config.defaultLang }
                          onChange={ e => this.setValue({ language: e.target.value }) }>
                    { langOptions }
                  </select>
                </h2>
              </div>

              <div className={ styles.column }>
                <h2>
                  <span>My level is</span>

                  <select value={ level || config.levels[0] }
                          onChange={ e => this.setValue({ level: e.target.value }) }>
                    { levelOptions }
                  </select>
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className={ styles.container }>
            <h3>
              Learn a language through a video conversation
            </h3>

            <p>
              Earn <b>❂ points</b> chatting in your native language. Spend the points to chat with natives in your target language.
            </p>

            <p>
              One minute is <b>1 ❂ point</b>.

              { !this.state.loggedIn ? (
                <span> You get your first <b>50 ❂ points</b> for free.</span>
              ) : '' }

              <span> Make each count!</span>
            </p>
          </div>
        </section>

        <section>
          <div className={ styles.container }>
            <div className={ styles.cta }>
              <Link to="/lobby" onClick={ (e) => {
                  this.submit(e);
                } }>Get started</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
