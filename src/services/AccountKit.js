import UserApi from './UserApi';

class AccountKit {
  constructor() {
    this.initialized = false;
  }

  init() {
    return UserApi.requestLoginAppId().then(data => {
      return new Promise(resolve => {
        const init = () => {
          window.AccountKit.init(data);

          this.initialized = true;

          resolve(true);
        };

        if (window.AccountKit && window.AccountKit.init) {
          init();
        } else {
          window.AccountKit_OnInteractive = init;
        }
      });
    });
  }

  openLogin(emailAddress = '') {
    return new Promise((resolve, reject) => {
      window.AccountKit.login(
        'EMAIL',

        { emailAddress },

        response => {
          if (response.status === 'PARTIALLY_AUTHENTICATED') {
            // success
            UserApi.requestLoginToken(response.code, response.state).then(resolve);
          } else if (response.status === 'NOT_AUTHENTICATED') {
            // handle authentication failure
            reject(response.status);
          } else if (response.status === 'BAD_PARAMS') {
            // handle bad parameters
            reject(response.status);
          }
        }
      );
    });
  }
}

export default new AccountKit();
