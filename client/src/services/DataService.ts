
// export default class DataService {

//     // .json example
//     public getData(filename: string): any {
//         return fetch(`demo/${filename}`).then(res => res.json())
//             .then(d => d.data);
//     }



// }



import axios, { AxiosResponse, CancelToken } from "axios";

export default class DataService {

  //env variables not working for some reason?
  //static url = import.meta.env.VITE_OSS_URL;


  public static async getData(filename: string): Promise<any> {
    return fetch(`demo/${filename}`).then(res => res.json());
    // return fetch(`demo/${filename}`);
  }


}