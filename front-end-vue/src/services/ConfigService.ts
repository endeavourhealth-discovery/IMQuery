import axios, { AxiosResponse } from "axios";

export default class ConfigService {
  static api = process.env.VUE_APP_API;

  public static async getComponentLayout(name: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/config/componentLayout", {
      params: {
        name: name
      }
    });
  }

  public static async getFilterDefaults(): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/config/filterDefaults");
  }
}
