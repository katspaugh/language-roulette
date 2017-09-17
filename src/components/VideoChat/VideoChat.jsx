import React, { PureComponent } from 'react';
import Video from 'twilio-video';
import VideoCallApi from '../../services/VideoCallApi';
import styles from './VideoChat.css';

/**
 * VideoChat component
 */
export default class VideoChat extends PureComponent {
  constructor() {
    super();

    this.previewTracks = null;
    this.activeRoom = null;

    this.refs = {
      localMedia: null,
      remoteMedia: null
    };

    this.state = {
      hasPreview: false
    };

    this._getLocalMedia = el => this.refs.localMedia = el;
    this._getRemoteMedia = el => this.refs.remoteMedia = el;
    this._onPreviewClick = () => this.onPreviewClick();
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
    this.activeRoom = room;

    console.info(`Joined as ${ this.identity }`);

    // Attach LocalParticipant's Tracks, if not already attached.
    const previewContainer = this.refs.localMedia;
    if (!previewContainer.querySelector('video')) {
      this.attachParticipantTracks(room.localParticipant, previewContainer);
      this.setState({ hasPreview: true });
    }

    this.props.onConnect();

    // Attach the Tracks of the Room's Participants.
    room.participants.forEach(participant => {
      console.info(`Already in Room: ${ participant.identity }`);
      const previewContainer = this.refs.remoteMedia;
      this.attachParticipantTracks(participant, previewContainer);
    });

    // When a Participant joins the Room, log the event.
    room.on('participantConnected', participant => {
      console.info(`Joining: ${ participant.identity }`);

      this.props.onConnect();
    });

    // When a Participant adds a Track, attach it to the DOM.
    room.on('trackAdded', (track, participant) => {
      console.info(`${ participant.identity } added track: ${ track.kind }`);
      const previewContainer = this.refs.remoteMedia;
      this.attachTracks([ track ], previewContainer);
    });

    // When a Participant removes a Track, detach it from the DOM.
    room.on('trackRemoved', (track, participant) => {
      console.info(`${ participant.identity } removed track: ${ track.kind }`);
      this.detachTracks([ track ]);
    });

    // When a Participant leaves the Room, detach its Tracks.
    room.on('participantDisconnected', participant => {
      console.info(`Participant ${ participant.identity } left the room`);
      this.detachParticipantTracks(participant);

      this.props.onDisconnect();
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

      this.setState({ hasPreview: false });

      this.props.onDisconnect();
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
      name: roomName
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

  // Obtain a token from the server in order to connect to the Room.
  getToken() {
    if (this.token) {
      return Promise.resolve();
    }

    return VideoCallApi.requestToken().then(data => {
      this.identity = data.identity;
      this.token = data.token;
    });
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

        this.setState({ hasPreview: true });
      },
      error => {
        console.error('Unable to access local media', error);
        console.info('Unable to access Camera and Microphone');
      }
    );
  }

  componentWillMount() {
    if (this.props.roomName) {
      this.getToken().then(() => {
        this.props.roomName && this.joinRoom(this.props.roomName);
      });
    }

    // When we are about to transition away from this page, disconnect
    // from the room, if joined.
    this._onBeforeUnload = () => this.leaveRoomIfJoined();
    window.addEventListener('beforeunload', this._onBeforeUnload);
  }

  componentWillReceiveProps(props) {
    if (props.roomName !== this.props.roomName) {
      this.leaveRoomIfJoined();

      if (props.roomName) {
        this.getToken().then(() => this.joinRoom(props.roomName));
      }
    }
  }

  componentWillUnmount() {
    this.leaveRoomIfJoined();

    // Unsubscribe
    if (this._onBeforeUnload) {
      window.removeEventListener('beforeunload', this._onBeforeUnload);
    }
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    return (
      <div className={ styles.container }>
        <div className={ styles.remoteMedia } ref={ this._getRemoteMedia }>
          <div className={ styles.center }><span>Waiting for a partner...</span></div>
        </div>

        <div className={ styles.localMedia } ref={ this._getLocalMedia }>
          { this.state.hasPreview ? null : (
            <div className={ styles.center }>
              <button className={ styles.button } onClick={ this._onPreviewClick }>Preview my video</button>
            </div>
          ) }
        </div>
      </div>
    );
  }
}
