'use strict';

import awsIot from 'aws-iot-device-sdk';
import config from '../config';
const { videoApiUrl } = config;

let keys;

export default class PubSub {
  connect() {
    return this.getKeys().then(keys => {
      this.client = awsIot.device({
        region: keys.region,
        protocol: 'wss',
        accessKeyId: keys.accessKey,
        secretKey: keys.secretKey,
        sessionToken: keys.sessionToken,
        port: 443,
        host: keys.iotEndpoint
      });

      this.client.on('error', err => {
        console.error(err);
      });

      return this.client;
    });
  }

  getKeys() {
    if (keys) return Promise.resolve(keys);

    return fetch(new Request(`${ videoApiUrl }/auth`, {
      mode: 'cors',
      method: 'GET'
    }))
      .then(resp => resp.json())
      .then(res => keys = res);
  }

  publish(topic, message) {
    console.log(`Message published in "${ topic }": ${ message }`);
    this.client.publish(topic, message);
  }

  close() {
    this.client.end();
  }
};
