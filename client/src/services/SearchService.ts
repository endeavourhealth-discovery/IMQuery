import axios, { AxiosResponse, CancelToken } from "axios";

export default class SearchService {

  //env variables not working for some reason?
  static oss_url = import.meta.env.VITE_OSS_URL;
  static graphdb_url = import.meta.env.VITE_GRAPHDB_URL;

  static oss_headers = {
    'Authorization': `Basic ${import.meta.env.VITE_OSS_AUTH_BASICTOKEN}`,
    'Content-Type': 'application/json'
  }

  static graphdb_headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  //search inside name or definition
  public static async oss_search(searchString: string, index: string, limit: number): Promise<AxiosResponse<any>> {
    return axios.post(`${this.oss_url}/${index}/_search`,
      {
        size: limit,
        query: {
          bool: {
            filter: [
              {
                bool: {
                  should: [
                    {
                      match_phrase: {
                        "rdfs:label": searchString
                      }
                    },
                    {
                      match_phrase: {
                        "im:definition": searchString
                      }
                    }
                  ],
                  minimum_should_match: 1
                }
              }
            ]
          }
        }
      }
      ,
      {
        headers: this.oss_headers
      });
  }

}
