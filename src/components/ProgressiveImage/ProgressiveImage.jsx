import React, { PureComponent } from 'react';


/**
 * ProgressiveImage component
 */
export default class ProgressiveImage extends PureComponent {
  constructor() {
    super();

    this.state = {
      src: '',
      style: null
    };
  }

  update({ lowSrc, fullSrc }) {
    const img = new Image();

    img.src = fullSrc;

    img.addEventListener('load', () => {
      this.setState({ src: fullSrc, style: null });
    });

    this.setState({ src: lowSrc, style: { filter: 'blur(2px)' } });
  }

  componentWillMount() {
    this.update(this.props);
  }

  componentWillReceiveProps(props) {
    this.update(props);
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    return (
      <img src={ this.state.src } style={ this.state.style } />
    );
  }
}
