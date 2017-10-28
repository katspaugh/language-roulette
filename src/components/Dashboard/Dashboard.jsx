import React, { PureComponent } from 'react';
import UserStore from '../../services/UserStore';
import config from '../../config';
import styles from './Dashboard.css';


/**
 * Dashboard component
 */
export default class Dashboard extends PureComponent {
  constructor() {
    super();

    this.unsubscribe = null;

    this.state = {
      userData: {}
    };
  }

  logout() {
    UserStore.dispatch({ type: 'logout' });
  }

  componentWillMount() {
    const onUpdate = () => {
      this.setState({ userData: UserStore.getState() });
    };

    this.unsubscribe = UserStore.subscribe(onUpdate);

    onUpdate();
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    const { userData } = this.state;

    return (
      <div className={ styles.container }>
        <h1>Dashboard</h1>

        <div className={ styles.row }>
          <div className={ styles.col }>
            <div className={ styles.field }>
              <b>Email:</b> { userData.email }
            </div>

            <div className={ styles.field }>
              <b>{ userData.teacher ? 'Teaching language' : 'Learning language' }:</b>
              { ' ' }
              { config.languages[userData.language] }
            </div>

            <div className={ styles.field }>
              <b>Level:</b> { userData.level }
            </div>

            <div className={ styles.field }>
              <button onClick={ () => this.logout() }>Log out</button>
            </div>
          </div>

          <div className={ styles.col }>
          </div>
        </div>
      </div>
    );
  }
}
