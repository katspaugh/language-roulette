import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import UserStore from '../../services/UserStore';
import styles from './BehindLogin.css';

/**
 * BehindLogin component
 */
export default class BehindLogin extends PureComponent {
  constructor() {
    super();

    this.unsubscribe = null;

    this.state = {
      loggedIn: false
    };
  }

  updateState() {
    const userData = UserStore.getState();

    if (userData.userId) {
      this.setState({ loggedIn: true });
    }
  }

  onLoginClick() {
    UserStore.dispatch({ type: 'loginNeeded' });
  }

  componentWillMount() {
    this.unsubscribe = UserStore.subscribe(() => this.updateState());
    this.updateState();
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    if (this.state.loggedIn) {
      return (
        <div>{ this.props.children }</div>
      );
    }

    return (
      <div className={ styles.container }>
        <div className={ styles.center }>
          <button onClick={ () => this.onLoginClick() }>Login via email</button>

          <p>Press the button to sign up or sign in (if you are already a member)</p>
        </div>
      </div>
    );
  }
}
