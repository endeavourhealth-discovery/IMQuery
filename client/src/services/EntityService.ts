import axios, { AxiosResponse, CancelToken } from "axios";
import _ from "lodash"
import QueryUtils from "@/helpers/QueryUtils";


export default class EntityService {


  public static async getData(filename: string): Promise<any> {
    return fetch(`local/${filename}`).then(res => res.json());
  }

  public static async test(): Promise<any> {
    try {
      const _res = await axios.get(import.meta.env.VITE_API + "api/query/public/queryIM", {
        params: {
          query: {
            "name": "AsthmaSubTypesCore",
            "select": [
              {
                "binding": "label",
                "alias": "term"
              },
              {
                "binding": "code",
                "alias": "code"
              }
            ],
            "match": {
              "entityId": {
                "@id": "http://snomed.info/sct#195967001"
              },
              "includeSubEntities": true,
              "optional": [
                {
                  "property": {
                    "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                  },
                  "valueVar": "label"
                },
                {
                  "property": {
                    "@id": "http://endhealth.info/im#code"
                  },
                  "valueVar": "code"
                }
              ]
            }
          }
        }
      });
      console.log("api response", _.cloneDeep(_res))
      return _res;
    } catch (error) {
      return {} as any;
    }

  }

  // public static async getDefinitionBundle(iri: string): Promise<any> {
  //   try {
  //     const _res = await axios.get(import.meta.env.VITE_NODE_API + "entity")
  //     console.log("_res",_res)
  //     return _res;
  //   } catch (error) {
  //     return {} as any;
  //   }
  // }

  // public static async getDefinitionBundle(iri: string): Promise<any> {
  //   try {
  //     const _res = await axios.get(import.meta.env.VITE_NODE_API + "entity", {
  //       params: {
  //         iri: iri
  //       }
  //     })
  //     console.log("_res", _res)
  //     return _res;
  //   } catch (error) {
  //     return {} as any;
  //   }
  // }


  public static async getDatamodelProperties(iri: string): Promise<any> {
    try {
      if (!iri.startsWith("http")) {
        iri = QueryUtils.toUrl(iri);
      }
      var data = JSON.stringify({
        "query": {
          "name": "Data model for entity",
          "description": "Get the properties of an entity",
          "mainEntity": {
            "@id": "http://www.w3.org/ns/shacl#NodeShape"
          },
          "resultFormat": "OBJECT",
          "select": {
            "property": [
              {
                "@id": "http://www.w3.org/ns/shacl#property",
                "select": {
                  "property": [
                    {
                      "@id": "http://www.w3.org/ns/shacl#path"
                    },
                    {
                      "@id": "http://www.w3.org/ns/shacl#datatype"
                    },
                    {
                      "@id": "http://www.w3.org/ns/shacl#class"
                    },
                    {
                      "@id": "http://www.w3.org/ns/shacl#nodeKind"
                    },
                    {
                      "@id": "http://www.w3.org/ns/shacl#node"
                    },
                    {
                      "@id": "http://www.w3.org/ns/shacl#minCount"
                    },
                    {
                      "@id": "http://www.w3.org/ns/shacl#maxCount"
                    }
                  ]
                }
              }
            ],
            "match": [
              {
                "entityId": {
                  "@id": "http://endhealth.info/im#Observation"
                }
              }
            ]
          },
          "usePrefixes": true
        }
      });

      var config = {
        method: 'post',
        url: 'http://localhost:8080/api/query/public/queryIM',
        headers: {
          'query': '{"name":"AsthmaSubTypesCore","select":[{"binding":"label","alias":"term"},{"binding":"code","alias":"code"}],"match":{"entityId":{"@id":"http://snomed.info/sct#195967001"},"includeSubEntities":true,"optional":[{"property":{"@id":"http://www.w3.org/2000/01/rdf-schema#label"},"valueVar":"label"},{"property":{"@id":"http://endhealth.info/im#code"},"valueVar":"code"}]}}',
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          return JSON.stringify(response.data);

        })
        .catch(function (error) {
          console.log(error);
        });

      // const _res = await axios.post(import.meta.env.VITE_API + "api/query/public/queryIM", data);
      // const _res = await axios.get(import.meta.env.VITE_API + "api/entity/public/dataModelProperties", {
      //   params: {
      //     iri: iri
      //   }
      // });
      // console.log("api response", _.cloneDeep(_res))
      // return _res;
    } catch (error) {
      return {} as any;
    }
  }



  public static async getDefinitionBundle(iri: string): Promise<any> {
    try {
      const _res = await axios.get(import.meta.env.VITE_NODE_API + "api/entity/public/inferredBundle", {
        params: {
          iri: iri
        }
      });
      console.log("api response", _.cloneDeep(_res))
      return _res;
    } catch (error) {
      return {} as any;
    }
  }

}
