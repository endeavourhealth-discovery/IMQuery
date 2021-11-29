import { ConceptReference } from "@/models/ConceptReference";
import axios from "axios";

export default class SuggestionService {
  static api = process.env.VUE_APP_API;

  public static async getIriSuggestions(keyword: string, word: string): Promise<ConceptReference[]> {
    const response = await axios.get<ConceptReference[]>(this.api + "api/entity/referenceSuggestions", {
      params: {
        keyword: keyword,
        word: word
      }
    });

    return response.data;
  }
}
