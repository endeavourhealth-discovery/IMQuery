import { SearchRequest } from "@/models/search/SearchRequest";
import { ConceptDto } from "@/models/ConceptDto";
import axios, { AxiosResponse, CancelToken } from "axios";
import { ConceptNode } from "@/models/TTConcept/ConceptNode";
import { IM } from "@/vocabulary/IM";

export default class EntityService {
  public static async getPartialEntity(
    iri: string,
    predicates: string[]
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/partial", {
      params: {
        iri: iri,
        predicate: predicates.join(",")
      }
    });
  }

  static api = process.env.VUE_APP_API;

  public static async advancedSearch(
    request: SearchRequest,
    cancelToken: CancelToken
  ): Promise<AxiosResponse<any>> {
    return axios.post(this.api + "api/entity/search", request, {
      cancelToken: cancelToken
    });
  }

  public static async getEntity(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity", {
      params: { iri: iri }
    });
  }

  public static async getEntityDefinitionDto(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/definition", {
      params: { iri: iri }
    });
  }

  public static async getEntityImLang(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity", {
      params: { iri: iri },
      headers: {
        accept: "application/imlang"
      },
      responseType: "text"
    });
  }

  public static async getEntityParents(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get<ConceptNode[]>(this.api + "api/entity/parents", {
      params: { iri: iri }
    });
  }

  public static async getEntityChildren(
    iri: string,
    cancelToken?: CancelToken
  ): Promise<AxiosResponse<any>> {
    return axios.get<ConceptNode[]>(this.api + "api/entity/children", {
      params: { iri: iri },
      cancelToken: cancelToken
    });
  }

  public static async getEntityUsages(
    iri: string,
    pageIndex: number,
    pageSize: number
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/usages", {
      params: {
        iri: iri,
        page: pageIndex,
        size: pageSize
      }
    });
  }

  public static async getUsagesTotalRecords(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/usagesTotalRecords", {
      params: {
        iri: iri
      }
    });
  }

  public static async getEntityMembers(
    iri: string,
    expandMembers?: boolean,
    expandSubsets?: boolean,
    limit?: number,
    parentSetName?: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/members", {
      params: {
        iri: iri,
        expandMembers: expandMembers,
        expandSubsets: expandSubsets,
        limit: limit,
        parentSetName: parentSetName
      }
    });
  }

  public static async getSchemeOptions(): Promise<AxiosResponse<any>> {
    return this.getEntityChildren(IM.CODE_SCHEME);
  }

  public static async saveEntity(
    conceptDto: ConceptDto
  ): Promise<AxiosResponse<any>> {
    return axios.post(this.api + "api/entity", conceptDto);
  }

  public static getEntityGraph(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/graph", { params: { iri: iri } });
  }

  public static getEntityTermCodes(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/termCode", {
      params: { iri: iri }
    });
  }

  public static getSemanticProperties(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/semanticProperties", {
      params: { iri: iri }
    });
  }

  public static getDataModelProperties(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/dataModelProperties", {
      params: { iri: iri }
    });
  }

  public static getComplexMappings(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/complexMappings", {
      params: { iri: iri }
    });
  }

  public static getEntitySummary(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/summary", {
      params: { iri: iri }
    });
  }
}
