'use strict';

import awsIot from 'aws-iot-device-sdk';
import config from '../config';
const { videoApiUrl } = config;

let keys;

export default class PubSub {
  getKeys() {
    if (keys) return Promise.resolve(keys);

    return fetch(new Request(`${ videoApiUrl }/auth`, {
      mode: 'cors',
      method: 'GET'
    }))
      .then(resp => resp.json())
      .then(res => keys = res);
  }

  constructor(topic) {
    this.topic = topic;
  }

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

      this.client.on('connect', () => {
        this.client.subscribe(this.topic);
      });

      return this.client;
    });
  }

  onMessage(callback) {
    this.client.on('message', (topic, message) => {
      console.log(`Received message in ${ topic }: "${ message }"`);

      if (topic !== this.topic) return;

      callback(String(message));
    });
  }

  publish(message) {
    this.client.publish(this.topic, message);
  }

  end() {
    this.client && this.client.end();
  }
};
