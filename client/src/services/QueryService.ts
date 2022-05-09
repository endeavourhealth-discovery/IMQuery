import axios, { AxiosResponse, CancelToken } from "axios";
import _ from "lodash"


export default class QueryService {


  public static async querySummary(iri: string): Promise<any> {
    try {
      const _res = await axios.get(import.meta.env.VITE_NODE_API + "node_api/query/public/querySummary", {
        params: {
          iri: iri
        }
      });
      // console.log("api response", _.cloneDeep(_res))
      return _res;
    } catch (error) {
      return {} as any;
    }
  }

}
