import axios, { AxiosResponse, CancelToken } from "axios";
import { quadtree, quantize } from "d3";
import { MeiliSearch } from 'meilisearch'
import { env } from "../../environment.js"

export default class SearchService {

  //env variables not working for some reason?
  static oss_url = process.env.VUE_APP_OSS_URL;

  static oss_headers = {
    'Authorization': `Basic ${process.env.VUE_APP_OSS_AUTH_BASICTOKEN}`,
    'Content-Type': 'application/json'
  }


  public static async oss_search(queryString: string, index: string, limit: number): Promise<AxiosResponse<any>> {
    return axios.post(`${this.oss_url}/${index}/_search`,
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

  public static async oss_search_im(queryString: string, limit: number, entityType?: string): Promise<AxiosResponse<any>> {
    const q = {
      bool: {
        must: [{
          match: {
            name: queryString
          }
        }],
        filter: [{
          bool: {
            should: [{
              match_phrase: {
                "scheme.@id": "http://snomed.info/sct#"
              }
            }, {
              match_phrase: {
                "scheme.@id": "http://endhealth.info/im#"
              }
            }],
            minimum_should_match: 1
          }
        }, {
          bool: {
            should: [{
              match_phrase: {
                "status.@id": "http://endhealth.info/im#Active"
              }
            }, {
              match_phrase: {
                "status.@id": "http://endhealth.info/im#Draft"
              }
            }],
            minimum_should_match: 1
          }
        }, {
          bool: {
            should: [{
              match_phrase: entityType ? {
                "entityType.@id": entityType
              } : null
            }],
            minimum_should_match: 1
          }
        }]
      }
    }
    return axios.post(`${this.oss_url}/${process.env.VUE_APP_INDEX_IM}/_search`,
      {
        size: limit,
        query: q
      }
      ,
      {
        headers: this.oss_headers
      });

  };

  public static async oss_getDataModelAll(): Promise<AxiosResponse<any>> {
    const q = {
      bool: {
        filter: [{
          bool: {
            should: [{
              match_phrase: {
                "scheme.@id": "http://snomed.info/sct#"
              }
            }, {
              match_phrase: {
                "scheme.@id": "http://endhealth.info/im#"
              }
            }],
            minimum_should_match: 1
          }
        }, {
          bool: {
            should: [{
              match_phrase: {
                "status.@id": "http://endhealth.info/im#Active"
              }
            }, {
              match_phrase: {
                "status.@id": "http://endhealth.info/im#Draft"
              }
            }],
            minimum_should_match: 1
          }
        }, {
          bool: {
            should: [{
              match_phrase: {
                "entityType.@id": "http://www.w3.org/ns/shacl#NodeShape"
              }
            }],
            minimum_should_match: 1
          }
        }]
      }
    }

    return axios.post(`${this.oss_url}/${process.env.VUE_APP_INDEX_IM}/_search`,
      {
        size: 100,
        query: q
      }
      ,
      {
        headers: this.oss_headers
      });

  };

}
