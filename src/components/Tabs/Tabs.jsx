import React, { PureComponent } from 'react';
import classnames from 'classnames';
import styles from './Tabs.css';


/**
 * Tabs component
 */
export default class Tabs extends PureComponent {
  constructor() {
    super();

    this.state = {
      activeTab: 0
    };
  }

  setTab(activeTab) {
    this.setState({ activeTab });
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    const { activeTab } = this.state;
    const data = this.props.children;
    const tabNames = Object.keys(data);

    return (
      <div className={ styles.container }>
        <div className={ styles.tabs }>
          <h4>{ this.props.title }:</h4>

          { tabNames.map((name, index) => (
            <div className={ classnames(styles.tab, { [styles.active]: index === activeTab }) }
                 onClick={ () => this.setTab(index) }>
              { name }
            </div>
          )) }
        </div>

        <div className={ styles.content }>
          { data[tabNames[activeTab]] }
        </div>
      </div>
    );
  }
}
