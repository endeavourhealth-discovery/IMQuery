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


  public static async oss_search(queryString: string, index: string, limit: number): Promise<AxiosResponse<any>> {
    return axios.post(`${this.oss_endpoint}/${index}/_search`,
      {
        size: limit,
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

  public static async oss_search_datamodel(queryString: string, index: string, limit: number): Promise<AxiosResponse<any>> {
    return axios.post(`${this.oss_endpoint}/${index}/_search`,
      {
        size: limit,
        query: { bool: { must: [{ match: { name: queryString } }], filter: [{ bool: { should: [{ match_phrase: { "scheme.@id": "http://snomed.info/sct#" } }, { match_phrase: { "scheme.@id": "http://endhealth.info/im#" } }], minimum_should_match: 1 } }, { bool: { should: [{ match_phrase: { "status.@id": "http://endhealth.info/im#Active" } }, { match_phrase: { "status.@id": "http://endhealth.info/im#Draft" } }], minimum_should_match: 1 } }, { bool: { should: [{ match_phrase: { "entityType.@id": "http://www.w3.org/ns/shacl#NodeShape" } }], minimum_should_match: 1 } }] } }
      }
      ,
      {
        headers: this.oss_headers
      });
  }


}
