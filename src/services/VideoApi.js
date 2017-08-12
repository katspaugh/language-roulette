import config from '../config';

const localStorage = window.localStorage;
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
}
