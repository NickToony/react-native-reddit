import RestClient from 'react-native-rest-client';

export class BaseResource extends RestClient {
    constructor (path: string) {
      super('https://api.reddit.com/' + path);
    }
  };