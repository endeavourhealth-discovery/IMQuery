import axios, { AxiosResponse, CancelToken } from "axios";

export default class SearchService {

  static API = import.meta.env.VITE_NODE_API;

  public static async advancedSearchDatamodel(searchString: any): Promise<AxiosResponse<any>> {
    try {
      console.log("api", this.API)
      const _requestBody = {
        termFilter: searchString,
        statusFilter: [],
        typeFilter: ["http://www.w3.org/ns/shacl#NodeShape", "http://www.w3.org/2000/01/rdf-schema#Class"],
        schemeFilter: [],
        sortBy: 0,
        page: 1,
        size: 20
      };
      return await axios.post(this.API + "api/entity/public/search", _requestBody);
    } catch (error) {
      console.log("error in advanced search:" + error);
      return null;
    }
  }

  public static async advancedSearchQuery(searchString: any): Promise<AxiosResponse<any>> {
    try {
      console.log("api", this.API)
      const _requestBody = {
        termFilter: searchString,
        statusFilter: [],
        typeFilter: ["http://endhealth.info/im#Profile", "http://endhealth.info/im#Query", "http://endhealth.info/im#DataSet"],
        schemeFilter: [],
        sortBy: 0,
        page: 1,
        size: 20
      };
      return await axios.post(this.API + "api/entity/public/search", _requestBody);
    } catch (error) {
      console.log("error in advanced search:" + error);
      return null;
    }
  }



  /// developmental
  static VITE_OSS_URL = import.meta.env.VITE_OSS_URL_DEV;

  static oss_headers = {
    'Authorization': `Basic ${import.meta.env.VITE_OSS_AUTH_BASICTOKEN}`,
    'Content-Type': 'application/json'
  }

  //search inside name or definition
  public static async oss_search(searchString: string, index: string, limit: number): Promise<AxiosResponse<any>> {
    return axios.post(`${this.VITE_OSS_URL}/${index}/_search`,
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
