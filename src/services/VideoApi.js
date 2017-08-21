import config from '../config';

const { videoApiUrl } = config;

export default class VideoApi {
  static requestToken() {
    return fetch(new Request(`${ videoApiUrl }/token`, {
      mode: 'cors',
      method: 'GET'
    }))
      .then(resp => resp.json());
  }

  static requestRooms() {
    return fetch(new Request(`${ videoApiUrl }/rooms`, {
      mode: 'cors',
      method: 'GET'
    }))
      .then(resp => resp.json());
  }

  static createRoom(uniqueName, maxParticipants = 2) {
    return fetch(new Request(`${ videoApiUrl }/rooms`, {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({
        uniqueName,
        maxParticipants,
        enableTurn: true
      })
    }))
      .then(resp => resp.json());
  }
}
