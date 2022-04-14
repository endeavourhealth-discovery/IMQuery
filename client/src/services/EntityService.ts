import axios, { AxiosResponse, CancelToken } from "axios";

export default class EntityService {


  public static async getData(filename: string): Promise<any> {
    return fetch(`demo/${filename}`).then(res => res.json());
  }

  public static async getDefinitionBundle(iri: string): Promise<any> {
    try {
      return await axios.get(import.meta.env.VITE_API + "api/entity/public/inferredBundle", {
        params: {
          iri: iri
        }
      });
    } catch (error) {
      return {} as any;
    }
  }

}
