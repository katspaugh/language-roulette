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
      randomTopic: null
    };
  }

  setTopic() {
    const topic = randomItem(this.newsTopics);

    this.setState({ randomTopic: topic });

    this.pubSub.publish({ imageTopic: {
      title: topic.title,
      multimedia: topic.multimedia
    } });
  }

  componentWillMount() {
    this.pubSub = new PubSub(this.props.roomName);

    this.pubSub.connect().then(() => {
      this.pubSub.onMessage(message => {
        if (message.imageTopic) {
          this.setState({ randomTopic: message.imageTopic });
        }
      });

      NewsApi.getRandomStories().then(data => {
        this.newsTopics = data;
        if (!this.state.randomTopic) this.setTopic();
      });
    });
  }

  componentWillUnmount() {
    this.pubSub.end();
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    const { randomTopic } = this.state;

    if (!randomTopic) return null;

    return (
      <div className={ styles.container }>
        <h4>Describe the picture:</h4>

        <a href={ randomTopic.multimedia[4].url } target="_blank">
          <img src={ randomTopic.multimedia[3].url } title={ randomTopic.title } />
        </a>

        <div className={ styles.controls }>
          <button onClick={ () => this.setTopic() }>
            ↻ Another picure
          </button>
        </div>
      </div>
    );
  }
}
