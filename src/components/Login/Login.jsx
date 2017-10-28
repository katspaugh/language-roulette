import React from 'react';
import { Link } from 'react-router-dom';
import UserApi from '../../services/UserApi';
import UserStore from '../../services/UserStore';
import styles from './Login.css';

export default class Login extends React.PureComponent {
  constructor() {
    super();

    this.state = { email: '' };

    this._onSubmit = this.onSubmit.bind(this);
  }

  onLogin(data) {
    this.setState({
      email: data.email
    });
  }

  // login callback
  loginCallback(response) {
    if (response.status === 'PARTIALLY_AUTHENTICATED') {
      UserApi.requestLoginToken(response.code, response.state)
        .then(data => {
          this.onLogin(data);
          UserStore.dispatch({ type: 'login', data });
        });
    }
    else if (response.status === 'NOT_AUTHENTICATED') {
      // handle authentication failure
    }
    else if (response.status === 'BAD_PARAMS') {
      // handle bad parameters
    }
  }

  onSubmit(e) {
    e.preventDefault();

    window.AccountKit.login(
      'EMAIL',
      { emailAddress: this.state.email },
      this.loginCallback.bind(this)
    );
  }

  componentDidMount() {
    UserApi.requestLoginAppId().then(data => {
      if (window.AccountKit && window.AccountKit.init) {
        AccountKit.init(data);
      } else {
        window.AccountKit_OnInteractive = () => {
          window.AccountKit.init(data);
        };
      }
    });

    const savedUser = UserStore.getState();
    if (savedUser) {
      if (savedUser.expiresAt > Date.now()) {
        this.onLogin(savedUser);
      } else {
        this.setState({ email: savedUser.email });
      }
    }
  }

  render() {
    return this.state.email ? (
      <div className={ styles.container }>
        <Link to="/dashboard">
          { this.state.email }
        </Link>
      </div>
    ) : (
      <div className={ styles.container }>
        <button onClick={ this._onSubmit }>Login via email</button>
        { ' ' }
      </div>
    );
  }
}
