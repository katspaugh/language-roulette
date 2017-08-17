import { ReplaySubject } from 'rx-lite';
import config from '../config';

const localStorage = window.localStorage;
const { userApiUrl } = config;
const subject = new ReplaySubject(1);

export default class User {
  static subject;

  static saveEmail(value) {
    localStorage.setItem('email', value);
    subject.onNext({ email: value });
  }

  static saveExpiresAt(value) {
    localStorage.setItem('expiresAt', value);
    subject.onNext({ expiresAt: value });
  }

  static saveNativeLanguage(value) {
    localStorage.setItem('nativeLanguage', value);
    subject.onNext({ nativeLanguage: value });
  }

  static saveTargetLanguage(value) {
    localStorage.setItem('targetLanguage', value);
    subject.onNext({ targetLanguage: value });
  }

  static saveStudent(toggle) {
    localStorage.setItem('student', toggle ? '1' : '');
    subject.onNext({ student: Boolean(toggle) });
  }

  static saveId(id) {
    localStorage.setItem('userId', id);
    subject.onNext({ id });
  }

  static getId() {
    return localStorage.getItem('userId');
  }

  static getUserData() {
    return {
      id: User.getId(),
      email: localStorage.getItem('email'),
      expiresAt: Number(localStorage.getItem('expiresAt')),
      nativeLanguage: localStorage.getItem('nativeLanguage'),
      targetLanguage: localStorage.getItem('targetLanguage'),
      student: Boolean(Number(localStorage.getItem('student')))
    }
  }

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
}

User.getId() || User.saveId(Math.random().toString(32).slice(2));

User.subject = subject;
