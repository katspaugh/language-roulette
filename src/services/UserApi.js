import config from '../config';
const { userApiUrl } = config;

export default class UserApi {
  static requestLoginToken(code, csrf) {
    return fetch(new Request(`${ userApiUrl }/auth`, {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({ code, csrf })
    }))
      .then(resp => resp.json());
  }

  static requestLoginAppId() {
    return fetch(new Request(`${ userApiUrl }/credentials`, {
      mode: 'cors'
    }))
      .then(resp => resp.json());
  }

  static getUserData(userId, accessToken) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${ accessToken }`);

    return fetch(new Request(`${ userApiUrl }/user/${ userId }`, {
      mode: 'cors',
      method: 'GET',
      headers
    }))
      .then(resp => resp.json());
  }

  static updateUserData(userId, userAccessToken, userData) {
    return fetch(new Request(`${ userApiUrl }/user`, {
      mode: 'cors',
      method: 'PUT',
      body: JSON.stringify(Object.assign({ userId, userAccessToken }, userData))
    }))
      .then(resp => resp.json());
  }
}
