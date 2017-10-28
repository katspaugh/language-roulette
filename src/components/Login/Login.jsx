import React from 'react';
import { Link } from 'react-router-dom';
import UserApi from '../../services/UserApi';
import UserStore from '../../services/UserStore';
import styles from './Login.css';

export default class Login extends React.PureComponent {
  constructor() {
    super();

    this.unsubscribe = null;
    this.emailAddress = '';

    this.state = {
      displayedName: ''
    };
  }

  // login callback
  loginCallback(response) {
    if (response.status === 'PARTIALLY_AUTHENTICATED') {
      UserApi.requestLoginToken(response.code, response.state)
        .then(data => UserStore.dispatch({ type: 'login', data }));
    }
    else if (response.status === 'NOT_AUTHENTICATED') {
      // handle authentication failure
    }
    else if (response.status === 'BAD_PARAMS') {
      // handle bad parameters
    }
  }

  onClick() {
    window.AccountKit.login(
      'EMAIL',
      { emailAddress: this.emailAddress },
      resp => this.loginCallback(resp)
    );
  }

  updateState() {
    const { email, expiresAt } = UserStore.getState();

    this.emailAddress = email || '';

    this.setState({
      displayedName: (email && expiresAt > Date.now()) ? email : ''
    });
  }

  componentWillMount() {
    UserApi.requestLoginAppId().then(data => {
      if (window.AccountKit && window.AccountKit.init) {
        AccountKit.init(data);
      } else {
        window.AccountKit_OnInteractive = () => {
          window.AccountKit.init(data);
        };
      }
    });

    this.unsubscribe = UserStore.subscribe(() => this.updateState());
    this.updateState();
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
        <button onClick={ () => this.onClick() }>Login via email</button>
        { ' ' }
      </div>
    );
  }
}
