import React, { PureComponent } from 'react';
import User from '../../services/User';
import PubSub from '../../services/PubSub';
import VideoCallApi from '../../services/VideoCallApi';
import VideoChat from '../VideoChat/VideoChat.jsx';
import Topics from '../Topics/Topics.jsx';
import Timer from '../Timer/Timer.jsx';
import config from '../../config';
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
    this.pubSub = null;
    this.isWaiting = true;
    this.isRoomCreated = false;

    this.state = {
      roomName: null,
      connected: false
    };

    this._onConnect = () => this.onConnect();
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

  setRoom(roomName) {
    this.setState({ roomName });
  }

  connectToRoom(roomName) {
    this.isWaiting = false;
    this.pubSub.publish({ roomName, joined: true });
    this.setRoom(roomName);
  }

  createRoom() {
    this.isWaiting = true;

    const onCreate = () => {
      this.isRoomCreated = true;
      this.pubSub.publish({ roomName: this.ownRoomName, created: true });
    };

    if (this.isRoomCreated) {
      onCreate();
    } else {
      VideoCallApi.createRoom(this.ownRoomName).then(onCreate);
    }
  }

  findMatch() {
    VideoCallApi.requestRooms().then(rooms => {
      const match = this.isWaiting && rooms.find(room => this.isMatchingRoom(room.uniqueName));

      // Check if a previously created room still exists
      const ownRoomCreated = rooms.some(room => room.uniqueName === this.ownRoomName);
      if (ownRoomCreated) {
        this.isRoomCreated = true;
      }

      match ?
        this.connectToRoom(match.uniqueName) :
        this.createRoom();
    });
  }

  onMessage(message) {
    if (!this.isWaiting) return;

    if (message.joined && message.roomName === this.ownRoomName) {
      this.setRoom(message.roomName);
      return;
    }

    if (!message.joined && this.isMatchingRoom(message.roomName)) {
      this.connectToRoom(message.roomName);
    }
  }

  onDisconnect() {
    this.isWaiting = true;
    this.setState({ connected: false, roomName: null });
    this.findMatch();
  }

  onConnect() {
    this.setState({ connected: true });
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
      this.userData.id
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
            `Learning ${ config.languages[this.userData.targetLanguage] }` :
            `Teaching ${ config.languages[this.userData.nativeLanguage] }`
          }

          <Timer />
        </h1>

        <div className={ styles.row }>
          <div className={ styles.column70 }>
            <Topics lang={ this.lang } roomName={ this.state.roomName } />
          </div>

          <div className={ styles.column }>
            <div className={ styles.videoChat }>
              <VideoChat
                roomName={ this.state.roomName }
                onConnect={ this._onConnect }
                onDisconnect={ this._onDisconnect } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
