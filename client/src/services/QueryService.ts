import axios, { AxiosResponse, CancelToken } from "axios";
import _ from "lodash"
import jp from 'jsonpath';
import { TextGenerator } from "../models/text/TextGenerator";
import { IM, RDF, RDFS } from "../vocabulary"
import { OntologyUtils, ManipulationUtils, SparqlSnippets } from '../helpers/query'
import { select } from "d3";
const { onlyUnique, excludedPaths, entitiesFromPredicates, isTTIriRef } = ManipulationUtils;


export default class QueryService {


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
  public static async summariseQuery(queryIri: string): Promise<any> {

    // const definition: DataSet =
    const definition: any = await QueryService.definition(queryIri).then(res => res.data);
    console.log(`1. raw definition`, definition);

    //matchClause = an object with "property" key
    const jsonQuery = `$..[?(@.property)]`;    // const jsonQuery = `$..[? (@.@id)]`
    let matchClauses = jp.nodes(definition?.select?.filter, jsonQuery);
    matchClauses = matchClauses.filter(excludedPaths);
    // console.log(`2. matchClauses`, matchClauses);


    // add summary to match clauses
    matchClauses.forEach(item => {
      const summary = TextGenerator.summarise(item.value) || "";
      const path = jp.stringify(item.path).substring(2) + "name";
      summary ? _.set(definition?.select?.filter, path, summary) : null;
      console.log(`summary of clause(${ path }): `, summary);
    })
    // console.log(`2. matchClauses`, matchClauses);



    return definition;
    // try {

    // } catch (error) {
    //   return {} as any;
    // }
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




}
