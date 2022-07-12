import axios, { AxiosResponse, CancelToken } from "axios";
import _ from "lodash"
import jp from 'jsonpath';
import { TextGenerator } from "../models/text/TextGenerator";
import { IM, RDF, RDFS } from "../vocabulary"
import { OntologyUtils, ManipulationUtils, SparqlSnippets } from '../helpers/query'
import { select } from "d3";
import { resourceLimits } from "worker_threads";
const { onlyUnique, excludedPaths, entitiesFromPredicates, isTTIriRef } = ManipulationUtils;


export default class QueryService {



  public static async getLocalDefinition(filename: string): Promise<any> {
    try {
      const _res = await axios.get(import.meta.env.VITE_NODE_API + "node_api/query/public/localDefinition", {
        params: {
          iri: filename
        }
      });
      // console.log("api response", _.cloneDeep(_res))
      return _res;
    } catch (error) {
      return {} as any;
    }

  }
  // public static async getLocalData(filename: string): Promise<any> {
  //   const queries: any[] = await fetch(`local/queries.json`).then(res => res.json());
  //   const query = queries.find(item => item["@id"] == filename)
  //   return query;

  // }


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


  public static async getSQL(iri: string): Promise<any> {
    try {
      const _res = await axios.get(import.meta.env.VITE_NODE_API + "node_api/query/public/getSQL", {
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

  public static async definition(iri: string): Promise<any> {
    try {
      const _res = await axios.get(import.meta.env.VITE_NODE_API + "node_api/query/public/definition", {
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

  public static async getRichDefinition(iri: string): Promise<any> {
    try {
      const _res = await axios.get(import.meta.env.VITE_NODE_API + "node_api/query/public/richDefinition", {
        params: {
          iri: iri
        }
      });
      console.log("api response", _.cloneDeep(_res))
      return _res;
    } catch (error) {
      return {} as any;
    }
  }


  /////////////// development only

  public static async summariseQuery(queryIri: string): Promise<any> {

     const definition: any = await QueryService.getRichDefinition(queryIri).then(res => res.data);

    //matchClause = an object with "property" key
    const jsonQuery = `$..[?(@.property || @.pathTo)]`;    // const jsonQuery = `$..[? (@.@id)]`
    let clauses = QueryService.findClauses(definition?.select?.match);
    console.log("clauses", clauses)

    // add summary to match clauses
    clauses.forEach(item => {
      const textPath = item.path + ".displayText";
      const htmlPath = item.path + ".displayHTML";
      const { text, html } = TextGenerator.summarise(item.value) || "";
      // const htmlSummary = TextGenerator.htmlSummary(item.value) || "";
      text ? _.set(definition?.select?.match, textPath, text) : null;
      // htmlSummary ? _.set(definition?.select?.match, htmlPath, htmlSummary) : null;
      console.log(`### summary of clause(${textPath}): `, text);
      // console.log(`### summary of clause(${htmlPath}): `, htmlSummary);
      // const path = jp.stringify(item.path).substring(2) + ".displayText";
    })
    console.log(`### Definition with displayText + HTML: \n`, _.cloneDeep(definition));
    return definition;

  }
  public static async summariseLocalQuery(queryIri: string): Promise<any> {
    const definition: any = await QueryService.getLocalDefinition(queryIri).then(res => res.data);

    //matchClause = an object with "property" key
    const jsonQuery = `$..[?(@.property || @.pathTo)]`;    // const jsonQuery = `$..[? (@.@id)]`
    let clauses = QueryService.findClauses(definition?.select?.match);
    console.log("clauses", clauses)

    // add summary to match clauses
    clauses.forEach(item => {
      const textPath = item.path + ".displayText";
      const htmlPath = item.path + ".displayHTML";
      const { text, html } = TextGenerator.summarise(item.value) || "";
      // const htmlSummary = TextGenerator.htmlSummary(item.value) || "";
      text ? _.set(definition?.select?.match, textPath, text) : null;
      // htmlSummary ? _.set(definition?.select?.match, htmlPath, htmlSummary) : null;
      console.log(`### summary of clause(${textPath}): `, text);
      // console.log(`### summary of clause(${htmlPath}): `, htmlSummary);
      // const path = jp.stringify(item.path).substring(2) + ".displayText";
    })
    console.log(`### Definition with displayText + HTML: \n`, _.cloneDeep(definition));
    return definition;

  }

  //returns jsonPath for all clauses (properties or matchClauses) that need need displayText / displayHT
  public static findClauses(matchClause: any): any {
    let result = [];
    const visited = new Set();
    const queuedPaths = [""];
    const getChildren = (path: string) => {
      return path == "" ? matchClause : _.get(matchClause, path);
    }



    const clauseIsAdded = (path: string, clause: any): boolean => {
      //datamodel entities are translated at the level of the matchClause
      if (Object.keys(clause).some(key => key == "pathTo")) {
        result.push({ path: path, value: clause })
        return true;
      } else if (Object.keys(clause).some(key => key == "property")) {
        clause?.property.forEach((property: any, index: number) => {
          result.push({ path: `${path}.property[${index}]`, value: property })
        })
        return true;
      }
      return false;
    };


    while (queuedPaths.length > 0) {
      const currentPath = queuedPaths.shift();
      const children = getChildren(currentPath);
      const isArray = Array.isArray(children);

      if (isArray && children.length > 0) {

        children.forEach((child: any, index: number) => {
          //if a child contains a clause needing translation it is added  adds to final results.
          // otherwise it's children are added to the queue for inspection 
          if (clauseIsAdded(`${currentPath}[${index}]`, child) == false) {
            if (child?.or) queuedPaths.push(`${currentPath}[${index}].or`)
            if (child?.and) queuedPaths.push(`${currentPath}[${index}].and`)
          }
        })
      }

    }
    return result;
  }

  // public static filterExcludedClauses(matchClause: any, jpNodes: any): any {
  //   // console.log("parent ! ", jp.parent(matchClause, "$[2].and[0]"));


  //   console.log("jpNodes", jpNodes);
  //   jpNodes = jpNodes.filter(node => {
  //     const path = jp.stringify(node.path);
  //     // console.log("path", path);
  //     const parentPath = path.includes(".") ? path.split(".").slice(0, -1).join(".") : null;
  //     // console.log("parentPath", parentPath)
  //     const parent = parentPath ? jp.nodes(matchClause, parentPath)[0] : null;
  //     // console.log("parent ", parent);
  //     const isParentExcluded = parent ? Object.keys(parent?.value).some(key => key == "pathTo") : false;
  //     // console.log("parent excluded", isParentExcluded)
  //     return !isParentExcluded;
  //   })


  //   return jpNodes;
  // }

  // public static async summariseLocalQuery(queryIri: string): Promise<any> {

  //   // const definition: DataSet =
  //   const definition: any = await QueryService.getLocalData("queries.json").then(res => {
  //     let query = res?.entities.filter(item => item['@id'] === queryIri)[0];
  //     query = JSON.parse(query["im:definition"]);
  //     console.log("query", query);
  //     return query
  //   });
  //   console.log(`1. raw definition`, _.cloneDeep(definition));

  //   //matchClause = an object with "property" key
  //   const jsonQuery = `$..[?(@.property)]`;    // const jsonQuery = `$..[? (@.@id)]`
  //   let matchClauses = jp.nodes(definition?.select?.match, jsonQuery);
  //   matchClauses = matchClauses.filter(excludedPaths);


  //   // add summary to match clauses
  //   matchClauses.forEach(item => {
  //     const summary = TextGenerator.summarise(item.value) || "";
  //     const path = jp.stringify(item.path).substring(2) + ".name";
  //     summary ? _.set(definition?.select?.match, path, summary) : null;
  //     console.log(`### summary of clause(${path}): `, summary);
  //   })
  //   console.log(`2. definition`, _.cloneDeep(definition));
  //   return definition;

  // }



}
