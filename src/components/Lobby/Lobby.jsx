import React, { PureComponent } from 'react';
import Video from 'twilio-video';
import User from '../../services/User';
import VideoApi from '../../services/VideoApi';
import styles from './Lobby.css';


/**
 * Lobby component
 */
export default class Lobby extends PureComponent {
  constructor() {
    super();

    this.identity = null;
    this.userData = null;
    this.previewTracks = null;
    this.waitingRoomName = null;

    this.refs = {
    };

    this.state = {
    };
  }

  // Attach the Tracks to the DOM.
  attachTracks(tracks, container) {
    tracks.forEach(track => {
      container.appendChild(track.attach());
    });
  }

  // Attach the Participant's Tracks to the DOM.
  attachParticipantTracks(participant, container) {
    const tracks = Array.from(participant.tracks.values());
    this.attachTracks(tracks, container);
  }

  // Detach the Tracks from the DOM.
  detachTracks(tracks) {
    tracks.forEach(track => {
      track.detach().forEach(detachedElement => {
        detachedElement.remove();
      });
    });
  }

  // Detach the Participant's Tracks from the DOM.
  detachParticipantTracks(participant) {
    const tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  }

  // Successfully connected!
  roomJoined(room) {
    this.room = this.activeRoom = room;

    console.info(`Joined as ${ this.identity }`);

    // Attach LocalParticipant's Tracks, if not already attached.
    const previewContainer = this.refs.localMedia;
    if (!previewContainer.querySelector('video')) {
      this.attachParticipantTracks(room.localParticipant, previewContainer);
    }

    // Attach the Tracks of the Room's Participants.
    room.participants.forEach(participant => {
      console.info(`Already in Room: ${ participant.identity }`);
      const previewContainer = this.refs.remoteMedia;
      this.attachParticipantTracks(participant, previewContainer);
    });

    // When a Participant joins the Room, log the event.
    room.on('participantConnected', participant => {
      console.info(`Joining: ${ participant.identity }`);
    });

    // When a Participant adds a Track, attach it to the DOM.
    room.on('trackAdded', (track, participant) => {
      console.info(`${ participant.identity } added track: ${ track.kind }`);
      const previewContainer = this.refs.remoteMedia;
      this.attachTracks([track], previewContainer);
    });

    // When a Participant removes a Track, detach it from the DOM.
    room.on('trackRemoved', (track, participant) => {
      console.info(`${ participant.identity } removed track: ${ track.kind }`);
      this.detachTracks([track]);
    });

    // When a Participant leaves the Room, detach its Tracks.
    room.on('participantDisconnected', participant => {
      console.info(`Participant ${ participant.identity } left the room`);
      this.detachParticipantTracks(participant);
    });

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    room.on('disconnected', () => {
      console.info('Left');

      if (this.previewTracks) {
        this.previewTracks.forEach(track => track.stop());
      }

      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(item => this.detachParticipantTracks(item));

      this.activeRoom = null;
    });
  }

  // Leave Room.
  leaveRoomIfJoined() {
    if (this.activeRoom) {
      this.activeRoom.disconnect();
    }
  }

  joinRoom(roomName) {
    console.info(`Joining room ${ roomName }...`);

    const connectOptions = {
      name: roomName,
      //logLevel: 'debug'
    };

    if (this.previewTracks) {
      connectOptions.tracks = this.previewTracks;
    }

    // Join the Room with the token from the server and the
    // LocalParticipant's Tracks.
    Video.connect(this.token, connectOptions).then(
      room => this.roomJoined(room),
      error => console.info(`Could not connect to Twilio: ${ error.message }`)
    );
  }

  getMatchingRooms() {
    return VideoApi.requestRooms().then(data => {
      console.info('Rooms: %o', data);

      const user = this.userData;

      const wantedParams = [
        this.userData.student ? 'teacher' : 'student',
        this.userData.student ? this.userData.targetLanguage : this.userData.nativeLanguage
      ];

      const matching = data
        .filter(room => {
          const params = room.uniqueName.split('-');
          return (params[0] === wantedParams[0] && params[1] === wantedParams[1]);
        })
        .sort(item => item.createdAt)
        .map(item => item.uniqueName);

      return matching;
    });
  }

  // Obtain a token from the server in order to connect to the Room.
  getToken() {
    VideoApi.requestToken().then(data => {
      this.identity = data.identity;
      this.token = data.token;
    });
  }

  componentWillMount() {
    // Check for WebRTC
    if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
      alert('WebRTC is not available in your browser.');
    }

    this.userData = User.getUserData();

    const waitingRoomName = [
      this.userData.student ? 'student' : 'teacher',
      this.userData.student ? this.userData.targetLanguage : this.userData.nativeLanguage,
      Math.random().toString(32).slice(2)
    ].join('-');

    this.getToken();

    this.getMatchingRooms()
      .then(rooms => {
        this.joinRoom(rooms[0] || waitingRoomName);
      });

    // When we are about to transition away from this page, disconnect
    // from the room, if joined.
    window.addEventListener('beforeunload', () => this.leaveRoomIfJoined());
  }

  // Preview LocalParticipant's Tracks.
  onPreviewClick() {
    const localTracksPromise = this.previewTracks ?
      Promise.resolve(this.previewTracks) :
      Video.createLocalTracks();

    localTracksPromise.then(
      tracks => {
        this.previewTracks = tracks;

        const previewContainer = this.refs.localMedia;
        if (!previewContainer.querySelector('video')) {
          this.attachTracks(tracks, previewContainer);
        }
      },
      error => {
        console.error('Unable to access local media', error);
        console.info('Unable to access Camera and Microphone');
      }
    );
  }

  componentWillUnmount() {
    this.leaveRoomIfJoined();
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    return (
      <div className={ styles.container }>
        <h1>Learning { this.userData.targetLanguage }</h1>

        <div className={ styles.localMedia } ref={ el => this.refs.localMedia = el } />

        <div className={ styles.remoteMedia } ref={ el => this.refs.remoteMedia = el } />
      </div>
    );
  }
}
