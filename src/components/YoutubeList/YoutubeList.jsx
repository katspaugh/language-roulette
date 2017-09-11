import React, { PureComponent } from 'react';
import YoutubeApi from '../../services/YoutubeApi';
import styles from './YoutubeList.css';


/**
 * YoutubeList component
 */
export default class YoutubeList extends PureComponent {
  constructor() {
    super();

    this.state = {
      videos: []
    };
  }

  componentWillMount() {
    YoutubeApi.searchSelectedChannels('de').then(videos => {
      this.setState({ videos: videos.slice(0, 5) });
    });
  }

  /**
   * @param {any} video
   * @return {JSX.Element}
   */
  renderVideo(video) {
    return (
      <iframe
        src={ `https://www.youtube.com/embed/${ video.id.videoId }` }
        width="640" height="360" frameBorder={ 0 }
        />
    );
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    return (
      <div className={ styles.container }>
        { this.state.videos.map(this.renderVideo, this) }
      </div>
    );
  }
}
