import React, { PureComponent } from 'react';
import User from '../../services/User';
import PubSub from '../../services/PubSub';
import VideoApi from '../../services/VideoApi';
import VideoChat from '../VideoChat/VideoChat.jsx';
import styles from './Lobby.css';


/**
 * Lobby component
 */
export default class Lobby extends PureComponent {
  constructor() {
    super();

    this.userData = null;
    this.lang = null;
    this.ownRoomName = null;
    this.isWaiting = true;
    this.pubSub = null;

    this.state = {
      roomName: null
    };

    this._onDisconnect = () => this.onDisconnect();
  }

  isMatchingRoom(roomName) {
    const desiredRoom = [
      this.userData.student ? 'teacher' : 'student',
      this.lang,
      ''
    ].join('-');
    return roomName.indexOf(desiredRoom) === 0;
  }

  connectToRoom(roomName) {
    this.isWaiting = false;
    this.setState({ roomName });
  }

  createRoom() {
    this.isWaiting = true;
    this.setState({ roomName: this.ownRoomName });
    this.pubSub.publish(this.ownRoomName);
  }

  findMatch() {
    VideoApi.requestRooms().then(rooms => {
      const match = this.isWaiting && rooms.find(room => this.isMatchingRoom(room.uniqueName));

      match ?
        this.connectToRoom(match.uniqueName) :
        this.createRoom();
    });
  }

  onMessage(message) {
    if (this.isWaiting && this.isMatchingRoom(message)) {
      this.connectToRoom(message);
    }
  }

  onDisconnect() {
    this.isWaiting = true;
    this.findMatch();
  }

  componentWillMount() {
    // Check for WebRTC
    if (navigator.getUserMedia && !navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
      alert('WebRTC is not available in your browser.');
      return;
    }

    this.userData = User.getUserData();

    this.lang = this.userData.student ? this.userData.targetLanguage : this.userData.nativeLanguage;

    this.ownRoomName = [
      this.userData.student ? 'student' : 'teacher',
      this.lang,
      Math.random().toString(32).slice(2)
    ].join('-');

    this.pubSub = new PubSub(this.lang);

    this.pubSub.connect()
      .then(() => {
        // Listen for matching rooms
        this.pubSub.onMessage(message => this.onMessage(message));

        // Find a match or announce our own room
        this.findMatch();
      });

    // Subscribe to unload
    this._onUnload = () => this.pubSub.end();
    window.addEventListener('beforeunload', this._onUnload);
  }

  componentWillUnmount() {
    this._onUnload();
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
