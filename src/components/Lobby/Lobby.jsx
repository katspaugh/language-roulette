import React, { PureComponent } from 'react';
import User from '../../services/User';
import PubSub from '../../services/PubSub';
import VideoChat from '../VideoChat/VideoChat.jsx';
import styles from './Lobby.css';


/**
 * Lobby component
 */
export default class Lobby extends PureComponent {
  constructor() {
    super();

    this.userData = null;
    this.pubSub = null;

    this.state = {
      roomName: null
    };
  }

  componentWillMount() {
    this.userData = User.getUserData();

    const lang = this.userData.student ? this.userData.targetLanguage : this.userData.nativeLanguage
    const ownRole = this.userData.student ? 'student' : 'teacher';
    const lookingFor = this.userData.student ? 'teacher' : 'student';
    const ownRoomName = `${ ownRole }-${ lang }-${ Math.random().toString(32).slice(2) }`;

    this.pubSub = new PubSub();

    this.pubSub.connect()
      .then(client => {
        client.on('connect', () => {
          // Subscribe
          client.subscribe(lang);

          // Announce a new room
          this.pubSub.publish(lang, ownRoomName);
        });

        // When a matching room is available
        client.on('message', (topic, message) => {
          if (topic !== lang) return;

          console.log(`Message received in topic "${ topic }": ${ message }`);

          const messageRoomName = String(message);

          if (!this.state.roomName && messageRoomName.match(lookingFor)) {
            this.setState({ roomName: messageRoomName });
            this.pubSub.publish(lang, `${ messageRoomName }-joined`);
            return;
          }

          if (!this.state.roomName && messageRoomName === `${ ownRoomName }-joined`) {
            this.setState({ roomName: ownRoomName });
            return;
          }
        });
      });
  }

  componentWillUnmount() {
    if (this.pubSub) {
      this.pubSub.close();
    }
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    return (
      <div className={ styles.container }>
        <h1>Learning { this.userData.targetLanguage }</h1>

        <div className={ styles.videoChat }>
          <VideoChat roomName={ this.state.roomName } />
        </div>
      </div>
    );
  }
}
