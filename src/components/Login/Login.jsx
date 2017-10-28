import React from 'react';
import { Link } from 'react-router-dom';
import AccountKit from '../../services/AccountKit';
import UserApi from '../../services/UserApi';
import UserStore from '../../services/UserStore';
import styles from './Login.css';

export default class Login extends React.PureComponent {
  constructor() {
    super();

    this.unsubscribe = null;

    this.state = {
      displayedName: ''
    };
  }

  updateDisplay(displayedName) {
    this.setState({ displayedName });
  }

  updateStore(data) {
    UserStore.dispatch({ type: 'login', data });
  }

  clearStore() {
    UserStore.dispatch({ type: 'expire' });
  }

  onStoreUpdate() {
    const state = UserStore.getState();

    if (state.loginNeeded && AccountKit.initialized) {
      this.openLogin();
    }

    this.updateDisplay(state.userId ? state.email : '');
  }

  openLogin() {
    AccountKit.openLogin(UserStore.getState().email)
      .then(data => this.updateStore(data));
  }

  componentWillMount() {
    this.unsubscribe = UserStore.subscribe(() => this.onStoreUpdate());

    const { userId, userAccessToken, expiresAt, email } = UserStore.getState();

    if (userId && userAccessToken && expiresAt > Date.now()) {
      this.updateDisplay(email);

      UserApi.getUserData(userId, userAccessToken)
        .then(data => this.updateStore(data))
        .catch(() => this.clearStore());
    } else {
      this.clearStore();
    }

    AccountKit.init().then(() => {
      if (UserStore.getState().loginNeeded) {
        this.openLogin();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  render() {
    return this.state.displayedName ? (
      <div className={ styles.container }>
        <Link to="/dashboard">
          { this.state.displayedName }
        </Link>
      </div>
    ) : (
      <div className={ styles.container }>
        <button onClick={ () => this.openLogin() }>Login via email</button>
        { ' ' }
      </div>
    );
  }
}
