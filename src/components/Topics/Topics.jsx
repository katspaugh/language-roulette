import React, { PureComponent } from 'react';
import Tabs from '../Tabs/Tabs.jsx';
import ImageTopic from '../ImageTopic/ImageTopic.jsx';
import YoutubeVideo from '../YoutubeVideo/YoutubeVideo.jsx';


/**
 * Topics component
 */
export default class Topics extends PureComponent {
  /**
   * @return {JSX.Element}
   */
  render() {
    return (
      <Tabs title="Conversation topics">
        { {
          'Picture': <ImageTopic roomName={ this.props.roomName } />,
          'Video': <YoutubeVideo lang={ this.props.lang } roomName={ this.props.roomName } />
        } }
      </Tabs>
    );
  }
}
