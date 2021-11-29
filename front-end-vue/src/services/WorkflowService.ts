import axios, { AxiosResponse } from "axios";

export default class WorkflowService {
  static api = process.env.VUE_APP_API;

  public static async getWorkflows(): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "workflow");
  }

  public static async getWorkflowTasks(): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "workflow/tasks");
  }
}
