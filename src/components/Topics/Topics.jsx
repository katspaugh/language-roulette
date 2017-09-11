import PubSub from '../../services/PubSub';
import React, { PureComponent } from 'react';
import Tabs from '../Tabs/Tabs.jsx';
import ImageTopic from '../ImageTopic/ImageTopic.jsx';
import YoutubeVideo from '../YoutubeVideo/YoutubeVideo.jsx';
import styles from './Topics.css';


/**
 * Topics component
 */
export default class Topics extends PureComponent {
  constructor() {
    super();

    this.state = {
      imageTopic: null,
      videoTopic: null
    };

    this._onImageChange = this.onImageChange.bind(this);
    this._onVideoChange = this.onVideoChange.bind(this);
  }

  publishImageTopic(topic) {
    this.pubSub && this.pubSub.publish({ imageTopic: {
      url: topic.url,
      title: topic.title,
      multimedia: topic.multimedia
    } });
  }

  publishVideoTopic(topic) {
    this.pubSub && this.pubSub.publish({ videoTopic: {
      id: { videoId: topic.id.videoId }
    } });
  }

  onImageChange(topic) {
    this.setState({ imageTopic: topic });
    this.publishImageTopic(topic);
  }

  onVideoChange(topic) {
    this.setState({ videoTopic: topic });
    this.publishVideoTopic(topic);
  }

  init(roomName) {
    this.pubSub = new PubSub(roomName);

    this.pubSub.connect().then(() => {
      this.pubSub.onMessage(message => {
        if (message.imageTopic) {
          this.setState({ imageTopic: message.imageTopic });
        }
        if (message.videoTopic) {
          this.setState({ videoTopic: message.videoTopic });
        }
      });

      if (this.state.imageTopic) {
        this.publishImageTopic(this.state.imageTopic);
      }
      if (this.state.videoTopic) {
        this.publishVideoTopic(this.state.videoTopic);
      }
    });
  }

  componentWillMount() {
    if (this.props.roomName) {
      this.init(this.props.roomName);
    }
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
    const { videoTopic, imageTopic } = this.state;

    return (
      <div className={ styles.container }>
        <Tabs title="Conversation topics">
          { {
            'Watch Video': <YoutubeVideo lang={ this.props.lang } topic={ videoTopic } onChange={ this._onVideoChange } />,
            'Describe Picture': <ImageTopic topic={ imageTopic } onChange={ this._onImageChange } />
          } }
        </Tabs>
      </div>
    );
  }
}
