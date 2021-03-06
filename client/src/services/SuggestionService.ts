import { ConceptReference } from "@/models/ConceptReference";
import axios from "axios";

export default class SuggestionService {
  static api = import.meta.env.VITE_API;

  public static async getIriSuggestions(
    keyword: string,
    word: string
  ): Promise<ConceptReference[]> {
    const response = await axios.get<ConceptReference[]>(
      this.api + "api/concept/referenceSuggestions",
      {
        params: {
          keyword: keyword,
          word: word
        }
      }
    );

    return response.data;
  }
}
