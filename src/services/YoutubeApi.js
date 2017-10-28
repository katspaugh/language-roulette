import { shuffle, randomItem } from './Utils';
import config from '../config';

const apiUrl = 'https://www.googleapis.com/youtube/v3';
const key = 'QUl6YVN5RGRtQXpXQ2pvZ01vMTRqbjE4NXdfNVFDTUl4b0xidGUw';


const channels = {
  en: [
    'UCLXo7UDZvByw2ixzpQCufnA', // 'voxdotcom'
    'UCsXVk37bltHxD1rDPwtNM8Q', //'Kurzgesagt'
  ],

  de: [
    'UCbxb2fqe9oNgglAoYqsYOtQ', // Easy German
    'UCySxeQ0avHLwZhys1J4J7Zw', // Die Klugscheisserwissen
    'UCwRH985XgMYXQ6NxXDo8npw', // Kurzgesagt DE
    'UC5E9-r42JlymhLPnDv2wHuA', // Terra X Lesch & Co
  ]
};

export default class YoutubeApi {
  static search(languageCode, channelId) {
    const params = {
      part: 'snippet',
      maxResults: 20,
      order: 'date',
      type: 'video',
      videoEmbeddable: 'true',
      key: atob(key),
      relevanceLanguage: languageCode
    };

    if (channelId) {
      params.channelId = channelId;
    } else { // TODO
      params.q = config.languages[languageCode];
    }

    const qs = Object.keys(params)
      .map(key => `${ key }=${ encodeURIComponent(params[key]) }`)
      .join('&');

    return fetch(new Request(`${ apiUrl }/search?${ qs }`), {
      mode: 'cors',
      method: 'GET'
    })
      .then(resp => resp.json());
  }

  static searchSelectedChannels(languageCode = 'en') {
    const langChannels = channels[languageCode];
    if (!langChannels) return YoutubeApi.search(languageCode);

    return Promise.all(
      langChannels.map(channelId => YoutubeApi.search(languageCode, channelId))
    ).then(data => {
      const items = [];
      data.forEach(channel => items.push.apply(items, channel.items));
      return shuffle(items);
    });
  }

  static searchRandom(languageCode = 'en') {
    const channelId = channels[languageCode] ? randomItem(channels[languageCode]) : undefined;
    return YoutubeApi.search(languageCode, channelId)
      .then(data => randomItem(data.items));
  }
}
