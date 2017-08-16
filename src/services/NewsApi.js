import { randomItem } from './Utils';

const newsApiUrl = 'https://api.nytimes.com/svc/topstories/v2/<topic>.json?api-key=ae35a3dcfdbd4814bef25aa5b9e62dd1';

const Topics = [
  'arts',
  'science'
];


export default class NewsApi {
  static requestTopStories(topic = randomItem(Topics)) {
    return fetch(new Request(newsApiUrl.replace(/<topic>/, topic), {
      mode: 'cors',
      method: 'GET'
    }))
      .then(resp => resp.json());
  }

  static getRandomStories() {
    return NewsApi.requestTopStories()
      .then(data => {
        return data.results.filter(item => item.multimedia && item.multimedia.length);
      });
  }
}
