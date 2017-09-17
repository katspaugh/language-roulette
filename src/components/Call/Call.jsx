import React from 'react';
import VideoChat from '../VideoChat/VideoChat.jsx';
import Topics from '../Topics/Topics.jsx';
import styles from './Call.css';


/**
 * Call component
 */
export default function Call({ match }) {
  const roomName = match.params.id;

  return (
    <div className={ styles.container }>
      <div className={ styles.row }>
        <div className={ styles.column70 }>
          <Topics lang={ 'de' } roomName={ roomName } />
        </div>

        <div className={ styles.column }>
          <div className={ styles.videoChat }>
            <VideoChat roomName={ roomName } onConnect={ () => null } onDisconnect={ () => null }  />
          </div>
        </div>
      </div>
    </div>
  );
}
