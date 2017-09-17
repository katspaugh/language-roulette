import React, { PureComponent } from 'react';
import styles from './Timer.css';


/**
 * Timer component
 */
export default class Timer extends PureComponent {
  constructor() {
    super();

    this.state = {
      time: ''
    };
  }

  formatTime(timestamp) {
    const pad = n => ('00' + n).slice(-2);
    const d = new Date(timestamp);
    return [ pad((d.getHours() - 1) * 60 + d.getMinutes()), pad(d.getSeconds()) ].join(':');
  }

  componentWillMount() {
    const startTime = Date.now();

    setInterval(() => {
      const time = Math.round(Date.now() - startTime);
      const formatted = this.formatTime(time);

      if (formatted !== this.state.time) {
        this.setState({ time: formatted });
      }
    }, 500);
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    return (
      <span className={ styles.container }>
        { this.state.time }
      </span>
    );
  }
}
