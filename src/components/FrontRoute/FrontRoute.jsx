import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import UserStore from '../../services/UserStore';
import UserApi from '../../services/UserApi';
import config from '../../config';
import styles from './FrontRoute.css';

const formValues = {};

const submit = () => {
  UserStore.dispatch({ type: 'update', data: formValues });

  const userData = UserStore.getState();
  if (userData.userId) {
    UserApi.updateUserData(userData.userId, userData.userAccessToken, userData);
  }
};

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
      teacher: null
    };
  }

  setValue(data) {
    UserStore.dispatch({ type: 'update', data });
  }

  updateState() {
    const { language, level, teacher } = UserStore.getState();
    this.setState({ language, level, teacher });
  }

  componentWillMount() {
    this.unsubscribe = UserStore.subscribe(() => this.updateState());
    this.updateState();
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  render() {
    const { language, level, teacher } = this.state;

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
              Roulette</h1>
          </div>
        </section>

        <section>
          <div className={ classnames(styles.container, styles.row) }>
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
        </section>

        <section>
          <div className={ styles.container }>
            <h3>Join a video chat as a</h3>

            <div className={ styles.cta }>
              <Link to="/lobby" onClick={ () => {
                  this.setValue({ teacher: false });
                  submit();
                } }>Student</Link>
              <i>or</i>
              <Link to="/lobby" onClick={ () => {
                  this.setValue({ teacher: true });
                  submit();
                } }>Teacher</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
