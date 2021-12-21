import axios, { AxiosResponse, CancelToken } from "axios";
import { quadtree, quantize } from "d3";
import { MeiliSearch } from 'meilisearch'
import { env } from "../../environment.js"

export default class SearchService {

  //env variables not working for some reason?
  static oss_endpoint = env.oss_endpoint;

  static oss_headers = {
    'Authorization': `Basic ${env.oss_auth_basic}`,
    'Content-Type': 'application/json'
  }


  public static async oss_search(queryString: string, index: string): Promise<AxiosResponse<any>> {
    return axios.post(`${this.oss_endpoint}/${index}/_search`,
      {
        size: 20,
        query: {
          query_string: {
            query: queryString
          }
        }
      }
      ,
      {
        headers: this.oss_headers
      });
  }
}
