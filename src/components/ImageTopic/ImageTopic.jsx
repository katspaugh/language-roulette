import React, { PureComponent } from 'react';
import NewsApi from '../../services/NewsApi';
import { randomItem } from '../../services/Utils';
import PubSub from '../../services/PubSub';
import ProgressiveImage from '../ProgressiveImage/ProgressiveImage.jsx';
import styles from './ImageTopic.css';


/**
 * ImageTopic component
 */
export default class ImageTopic extends PureComponent {
  constructor() {
    super();

    this.newsTopics = [];

    this.state = {
      topic: null
    };
  }

  setTopic() {
    const topic = randomItem(this.newsTopics);
    this.setState({ topic });
    this.publish(topic);
  }

  publish(topic) {
    this.pubSub && this.pubSub.publish({
      url: topic.url,
      title: topic.title,
      multimedia: topic.multimedia
    });
  }

  init(roomName) {
    this.pubSub = new PubSub(`${ roomName }-image }`);

    this.pubSub.connect().then(() => {
      this.pubSub.onMessage(message => {
        this.setState({ topic: message });
      });

      if (this.state.topic) {
        this.publish(this.state.topic);
      }
    });
  }

  componentWillMount() {
    if (this.props.roomName) {
      this.init(this.props.roomName);
    }

    NewsApi.getRandomStories().then(data => {
      this.newsTopics = data;
      if (!this.state.topic) this.setTopic();
    });
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
    const { topic } = this.state;

    if (!topic) return null;

    return (
      <div className={ styles.container }>
        <a href={ topic.url } target="_blank">
          <ProgressiveImage
            lowSrc={ topic.multimedia[3].url }
            fullSrc={ topic.multimedia[4].url }
            title={ topic.title } />
        </a>

        <div className={ styles.controls }>
          <button onClick={ () => this.setTopic() }>
            ↻ Another picture
          </button>
        </div>
      </div>
    );
  }
}
