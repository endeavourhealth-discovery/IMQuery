
import axios, { AxiosResponse, CancelToken } from "axios";

export default class DataService {

  //env variables not working for some reason?
  //static url = import.meta.env.VITE_OSS_URL;


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