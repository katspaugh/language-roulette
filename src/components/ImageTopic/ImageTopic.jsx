import React, { PureComponent } from 'react';
import NewsApi from '../../services/NewsApi';
import { randomItem } from '../../services/Utils';
import PubSub from '../../services/PubSub';
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
    const random = randomItem(this.newsTopics);
    const topic = {
      title: random.title,
      url: random.url,
      imageUrl: random.multimedia[4].url.replace(/superJumbo/, 'articleLarge')
    };

    this.setState({ topic });
    this.publish(topic);
  }

  publish(topic) {
    this.pubSub && this.pubSub.publish(topic);
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
      this.newsTopics = data.filter(({ multimedia }) => multimedia[4].height < multimedia[4].width);
      if (!this.state.topic) this.setTopic();
    });
  }

  componentWillReceiveProps(props) {
    if (props.roomName && !this.pubSub) {
      this.init(props.roomName);
    }
  }

  componentWillUnmount() {
    this.pubSub && this.pubSub.end();
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
          <img src={ topic.imageUrl } title={ topic.title } />
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
