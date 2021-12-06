import axios, { AxiosResponse, CancelToken } from "axios";
import { MeiliSearch } from 'meilisearch'


export default class SearchService {

  //env variables not working for some reason?
  static searchApi = process.env.MEILI_API;
  static searchApiKeyPublic = process.env.MEILI_API_KEY_PUBLIC;



  static meili_api = "http://167.99.194.138/"
  static meili_api_key_public = "68942f3e956f95db5b18963e1be76a78eb620dff0e6f56f4239be1b76c3e93af";
  static meili_headers = {
    'X-Meili-Api-Key': SearchService.meili_api_key_public,
    'Content-Type': 'application/json'
  }


  public static async fetchAutocompleteREST(searchString: string): Promise<AxiosResponse<any>> {
    return axios.post(this.meili_api + "indexes/AutocompleteSearch/search",
      {
        q: searchString,
        attributesToHighlight: ["searchString"]
      }
      ,
      {
        headers: this.meili_headers
      });
  }




  // public static async search(searchString: string, filters:string): Promise<AxiosResponse<any>> {
  //   return axios.post(this.meili_api + "indexes/IMSearch/search",
  //     {
  //       q: searchString,

  //     }
  //     ,
  //     {
  //       headers: this.meili_headers
  //     });
  // }

}


//old component method
// async getAutocompleteREST(): Promise<void> {
//   await SearchService.fetchAutocompleteREST(this.searchString)
//     .then((res: any) => {
//       console.log("fetched ", res);
//       this.autocompleteData = res.data;
//     })
//     .catch((err: any) => {
//       this.$toast.add(
//         LoggerService.error("Could not load autocomplete results", err)
//       );
//     });
// },