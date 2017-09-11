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

    this.props.onChange(topic);
  }

  componentWillMount() {
    if (this.props.topic) {
      this.setState({ topic: this.props.topic });
    }

    NewsApi.getRandomStories().then(data => {
      this.newsTopics = data;
      if (!this.state.topic) this.setTopic();
    });
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
