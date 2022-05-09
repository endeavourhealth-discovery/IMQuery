import axios, { AxiosResponse, CancelToken } from "axios";
import _ from "lodash"


export default class EntityService {


  public static async getData(filename: string): Promise<any> {
    return fetch(`demo/${filename}`).then(res => res.json());
  }

  public static async test(): Promise<any> {
    try {
      const _res = await axios.get("http://localhost:8080/" + "api/query/public/queryIM", {
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
