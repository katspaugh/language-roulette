import React, { PureComponent } from 'react';
import UserStore from '../../services/UserStore';
import styles from './Points.css';


/**
 * Points component
 */
export default class Points extends PureComponent {
  constructor() {
    super();

    this.unsubscribe = null;

    this.state = {
      loggedIn: false,
      points: 0
    };
  }

  updateState() {
    const state = UserStore.getState();

    this.setState({
      loggedIn: Boolean(state.userId),
      points: state.points || 0
    });
  }

  componentWillMount() {
    this.unsubscribe = UserStore.subscribe(() => this.updateState());
    this.updateState();
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  /**
   * @return {?JSX.Element}
   */
  render() {
    if (!this.state.loggedIn) return null;

    return (
      <div className={ styles.container }>
        { this.state.points } ❂
      </div>
    );
  }
}
