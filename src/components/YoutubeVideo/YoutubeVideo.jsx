import React, { PureComponent } from 'react';
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

    this.state = {
      topic: null,
      loading: false
    };
  }

  loadVideo() {
    this.setState({ loading: true });

    YoutubeApi.searchRandom(this.props.lang)
      .then(video => this.setTopic(video));
  }

  setTopic(topic) {
    this.setState({ topic, loading: false });

    this.props.onChange(topic);
  }

  componentWillMount() {
    if (this.props.topic) {
      this.setState({ topic: this.props.topic });
    } else {
      this.loadVideo();
    }
  }

  componentWillReceiveProps(props) {
    if (props.topic) {
      this.setState({ topic: props.topic });
    }
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    const { topic, loading } = this.state;

    if (!topic) return null;

    return (
      <div className={ styles.container }>
        <iframe
          src={ `https://www.youtube.com/embed/${ topic.id.videoId }?enablejsapi=1` }
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
