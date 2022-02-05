import axios, { AxiosResponse, CancelToken } from "axios";
import { quadtree, quantize } from "d3";
import { MeiliSearch } from 'meilisearch'

export default class SearchService {

  //env variables not working for some reason?
  static oss_url = process.env.VUE_APP_OSS_URL;
  static graphdb_url = process.env.VUE_APP_GRAPHDB_URL;

  static oss_headers = {
    'Authorization': `Basic ${process.env.VUE_APP_OSS_AUTH_BASICTOKEN}`,
    'Content-Type': 'application/json'
  }

  static graphdb_headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
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

  public static async oss_search_templates(query: any, limit: number): Promise<AxiosResponse<any>> {

    return axios.post(`${this.oss_url}/${process.env.VUE_APP_INDEX_TEMPLATES}/_search`,
      {
        size: limit,
        query: query
      }
      ,
      {
        headers: this.oss_headers
      });

  };
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


  public static async fetchAppData(): Promise<AxiosResponse<any>> {



    const _fileName = "CoreOntology.json";
    const _url = `${process.env.VUE_APP_CDN_URL}/${_fileName}`;

    let _shouldCacheRefresh = true;

    //checks a file's last modified timestamp found in the response header to determine if cache needs to be refreshed
    await axios.head(_url).then((res => {

      // console.log("localStorage.getItem(`cache_last_modified_${_fileName}`)", localStorage.getItem(`cache_last_modified_${_fileName}`))
      // console.log(" res.headers[last-modified]", res.headers["last-modified"])


      if ((localStorage.getItem(`cache_last_modified_${_fileName}`) != res.headers["last-modified"])) {
        _shouldCacheRefresh = true;
        localStorage.setItem(`cache_last_modified_${_fileName}`, res.headers["last-modified"])
      } else {
        _shouldCacheRefresh = false;
      }

    }))

    if (_shouldCacheRefresh) {

      console.log("app data refreshed using latest files from server");
      const _res = await axios.get(_url);
      localStorage.setItem(`cache_data_${_fileName}`, JSON.stringify(_res.data));
      return _res;

      // axios.get(_url).then((res2 => {
      //   console.log("file loaded from sever");
      //   localStorage.setItem(`cache_${_fileName}`, JSON.stringify(res2))
      //   return res2;
      // }));

      // return axios.get(_url);


    } else {
      console.log("app data refreshed using files from localstorage as cache");
      return JSON.parse(localStorage.getItem(`cache_data_${_fileName}`) as string);
    }



  };


  // public static async graphdb_search(sparqlQueryString: string): Promise<AxiosResponse<any>> {

  //   // const queryParams = SearchService.toFormURLEncoded({ 'query': sparqlQueryString });


  //   console.log("queryParams is: ", this.toFormURLEncoded(sparqlQueryString));
  //   return axios.get(`${this.graphdb_url}/repositories/${process.env.VUE_APP_GRAPHDB_REPOSITORY}?q=${this.toFormURLEncoded(sparqlQueryString)}`,
  //     {
  //       headers: this.graphdb_headers
  //     });

  // }

  // public static toFormURLEncoded(sparqlQueryString: any): string {

  //   let qry = sparqlQueryString;
  //   qry = qry.replaceAll(" ", "+");
  //   qry = qry.replaceAll("{", "%7B");
  //   qry = qry.replaceAll("}", "%7D");
  //   qry = qry.replaceAll("?", "%3F");
  //   return qry;

  // var details = {
  //   'userName': 'test@gmail.com',
  //   'password': 'Password!',
  //   'grant_type': 'password'
  // };

  // const formBody = [];
  // for (const property in form) {
  //   const encodedKey = encodeURIComponent(property);
  //   const encodedValue = encodeURIComponent(form[property]);
  //   formBody.push(encodedKey + "=" + encodedValue);
  // }
  // return formBody.join("&");

  // }



}
