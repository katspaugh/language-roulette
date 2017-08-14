import React from 'react';
import VideoChat from '../VideoChat/VideoChat.jsx';
import styles from './Call.css';


/**
 * Call component
 */
export default function Call({ match }) {
  return (
    <div className={ styles.container }>
      <VideoChat roomName={ match.params.id } onDisconnect={ () => null } />
    </div>
  );
}
