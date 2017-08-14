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
    this.advertising = false;

    this.state = {
      roomName: null
    };

    this._onUnmount = () => null;
    this._onDisconnect = () => null;
    this._onUnload = () => this._onUnmount();
  }

  componentWillMount() {
    // Check for WebRTC
    if (navigator.getUserMedia && !navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
      alert('WebRTC is not available in your browser.');
      return;
    }

    this.userData = User.getUserData();

    if (window.location.hash) {
      this.setState({ roomName: window.location.hash.slice(1) });
      return;
    }

    const lang = this.userData.student ? this.userData.targetLanguage : this.userData.nativeLanguage
    const ownRole = this.userData.student ? 'student' : 'teacher';
    const lookingFor = this.userData.student ? 'teacher' : 'student';
    const ownRoomName = `${ ownRole }-${ Math.random().toString(32).slice(2) }`;
    let currentRooms;

    this.pubSub = new PubSub();

    this.pubSub.connect()
      .then(client => {
        const announce = () => {
          this.announced = true;

          client.update(lang, {
            state: { desired: { rooms: currentRooms.concat([ ownRoomName ]) } }
          });

          window.location.hash = ownRoomName;
        };

        // On change
        const onChange = (topic, message, clientToken, stateObject) => {
          if (topic !== lang) return;

          console.log('Current status of %s: %o', topic, stateObject, message);

          currentRooms = stateObject && stateObject.state ? stateObject.state.desired.rooms : [];
          const othersRoomName = currentRooms[0] || '';

          // Connected to a matching room
          if (!this.state.roomName && othersRoomName.match(lookingFor)) {
            this.setState({ roomName: othersRoomName });

            // Remove the room from the list
            client.update(lang, {
              state: { desired: { rooms: currentRooms.filter(item => item !== othersRoomName) } }
            });

            return;
          }

          // Join or announce own room
          if (!this.state.roomName && !currentRooms.includes(ownRoomName)) {
            if (this.announced) {
              this.setState({ roomName: ownRoomName });
            } else {
              announce();
            }
          }
        };

        // On unmount
        const onUnmount = () => {
          if (currentRooms) {
            client.update(lang, {
              state: { desired: { rooms: currentRooms.filter(item => item !== ownRoomName) } }
            });
          }
        };

        // On room disconnect
        const onDisconnect = () => {
          this.setState({ roomName: null });
          announce();
        };

        // Connect
        client.on('connect', () => {
          client.register(lang, () => {
            console.log(`Registered, getting current status`);
            // When a matching room is available
            client.get(lang);

            this._onUnmount = onUnmount;
            this._onDisconnect = onDisconnect;
          });
        });

        // Listen to status
        client.on('status', onChange);
        client.on('foreignStateChange', onChange);
      });

    window.addEventListener('beforeunload', this._onUnload);
  }

  componentWillUnmount() {
    this._onUnmount();
    window.removeEventListener('beforeunload', this._onUnload);
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    return (
      <div className={ styles.container }>
        <h1>
          { this.userData.student ?
            `Learning ${ this.userData.targetLanguage }` :
            `Teaching ${ this.userData.nativeLanguage }`
          }
        </h1>

        <div className={ styles.videoChat }>
          <VideoChat roomName={ this.state.roomName } onDisconnect={ this._onDisconnect } />
        </div>
      </div>
    );
  }
}
