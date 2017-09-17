import React, { PureComponent } from 'react';
import PubSub from '../../services/PubSub';
import styles from './Emojis.css';

/**
 * Emojis component
 */
export default class Emojis extends PureComponent {
  constructor() {
    super();

    this.emojis = [
      '👍', '🍬', '🌟', '🐽'
    ];

    this.state = {
      emoji: ''
    };
  }

  publish(emoji) {
    this.pubSub && this.pubSub.publish(emoji);
  }

  init(roomName) {
    this.pubSub = new PubSub(`${ roomName }-emojis }`);

    this.pubSub.connect().then(() => {
      this.pubSub.onMessage(emoji => {
        this.setState({ emoji }, () => {
          setTimeout(() => {
            this.setState({ emoji: '' });
          }, 3500);
        });
      });
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
    this.pubSub && this.pubSub.end();
  }

  /**
   * @return {?JSX.Element}
   */
  render() {
    return (
      <div className={ styles.container }>
        { this.props.roomName ? (
          <div className={ styles.buttons }>
            { this.emojis.map(emoji => (
              <button onClick={ () => this.publish(emoji) }>{ emoji }</button>
            )) }
          </div>
        ) : '' }

        <div className={ styles.content }>
          { this.props.children }

          { this.state.emoji ? (
            <div className={ styles.emoji }>{ this.state.emoji }</div>
          ) : '' }
        </div>
      </div>
    );
  }
}
