import React, { PureComponent } from 'react';
import PubSub from '../../services/PubSub';
import YoutubeApi from '../../services/YoutubeApi';
import styles from './YoutubeVideo.css';


/**
 * YoutubeVideo component
 *
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
export default class YoutubeVideo extends PureComponent {
  constructor() {
    super();

    this.clientId = 'video' + Math.random().toString(32).slice(2);
    this.playing = false;
    this.player = null;

    this.state = {
      videoId: null,
      loading: false
    };
  }

  loadVideo() {
    this.setState({ loading: true });

    YoutubeApi.searchRandom(this.props.lang)
      .then(video => this.setVideoId(video.id.videoId));
  }

  setVideoId(videoId) {
    this.setState({ videoId, loading: false });
  }

  publish(message) {
    message.clientId = this.clientId;
    this.pubSub && this.pubSub.publish(message);
  }

  init(roomName) {
    this.pubSub = new PubSub(`${ roomName }-video`);

    this.pubSub.connect().then(() => {
      if (this.state.videoId) {
        this.publish({ videoId: this.state.videoId });
      }

      this.pubSub.onMessage(message => {
        if (message.clientId === this.clientId) return;

        if (message.videoId && message.videoId !== this.state.videoId) {
          this.setVideoId(message.videoId);
        }

        if (!this.player) return;

        if (message.playing !== null && this.playing !== message.playing) {
          if (Math.abs(message.currentTime - this.player.getCurrentTime()) > 1) {
            this.player.seekTo(message.currentTime);
          }
          message.playing ? this.player.playVideo() : this.player.pauseVideo();
        }
      });
    });
  }

  onLoad() {
    const player = new YT.Player(this.clientId, {
      events: {
        onReady: () => {
          this.player = player;
        },

        onStateChange: (event) => {
          this.playing = null;
          if (event.data === YT.PlayerState.PLAYING) {
            this.playing = true;
          } else if (event.data === YT.PlayerState.PAUSED) {
            this.playing = false;
          }

          this.publish({
            videoId: this.state.videoId,
            currentTime: player.getCurrentTime(),
            playing: this.playing
          });
        }
      }
    });
  }

  componentWillMount() {
    if (this.props.roomName) {
      this.init(this.props.roomName);
    }

    this.loadVideo();
  }

  componentWillReceiveProps(props) {
    if (props.roomName && !this.pubSub) {
      this.init(props.roomName);
    }
  }

  componentWillUnmount() {
    this.pubSub.end();
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    const { videoId, loading } = this.state;

    if (!videoId) return null;

    return (
      <div className={ styles.container }>
        <iframe
          id={ this.clientId }
          onLoad={ () => this.onLoad() }
          src={ `https://www.youtube.com/embed/${ videoId }?enablejsapi=1` }
          width="640" height="360" frameBorder={ 0 }
          />

        <div className={ styles.controls }>
          <button onClick={ () => this.loadVideo() } disabled={ loading }>
            ↻ Another video
          </button>
        </div>
      </div>
    );
  }
}
