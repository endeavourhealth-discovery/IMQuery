import EntityService from '@/services/EntityService';
import QueryService from '@/services/QueryService';

import QueryUtils from "@/helpers//QueryUtils";


import Datamodel from "./Datamodel"
import _ from "lodash";
import { faBullhorn, faGrinTongueSquint } from '@fortawesome/free-solid-svg-icons';
// import QueryService from "@/services/QueryService";


export default class Graph {

  public graph = {};

  constructor(mainEntity?: string) {
    this.mainEntity = mainEntity || "im:Person";
    this.populateDatamodel();

  }

  private _mainEntity: string;
  public get mainEntity(): string {
    return this._mainEntity;
  }
  public set mainEntity(mainEntity?: string) {
    this._mainEntity = mainEntity;
    this.populateGraph();
  }

  private datamodel: any;
  private async populateDatamodel(): Promise<any> {
    await QueryService.getDatamodel().then((res: any) => {
      console.log("QueryService.getDatamodel res", res)
      this.datamodel = res.entities;
      // console.log("this.datamodel", this.datamodel);
      this.populateGraph();
      return res;
    });
  }


  async populateGraph() {
    let map;
    switch (this._mainEntity) {
      case "im:Person":
        map = [
          {
            "key": "im:Person",
            "values": ["im:isSubjectOf", "im:dataController", "im:gpGMSRegisteredPractice"]
          },
          {
            "key": "im:isSubjectOf",
            "values": _.cloneDeep(Datamodel["im:Event"])
          },
          {
            "key": "im:gpGMSRegisteredPractice",
            "values": ["im:Organisation"]
          },
          {
            "key": "im:dataController",
            "values": ["im:Organisation"]
          },
          {
            "key": _.cloneDeep(Datamodel["im:Event"]),
            "values": ["im:hasPractitioner"]
          },
          {
            "key": "im:hasPractitioner",
            "values": ["im:PractitionerInRole"]
          },
          {
            "key": "im:Organisation",
            "values": ["im:mainLocation", "im:address"]
          },
          {
            "key": "im:mainLocation",
            "values": ["im:Location"]
          },
          {
            "key": "im:address",
            "values": ["im:Address"]
          },
        ];
        //convert map tp graph
        map.forEach((mapItem: any) => {
          // const key = Object.keys(mapItem)[0];
          // let items = mapItem[key];
          if (Array.isArray(mapItem?.key)) {
            mapItem?.key?.forEach((key: any) => {
              this.setNeigbours(key, mapItem.values);
            }
            );
          } else {
            this.setNeigbours(mapItem.key, mapItem.values);

          }
        })


        //iterate trough DataModel to go 2 entities deep for the main entity ()
        //add properties
        // const clauses = await QueryService.clauseAutoComplete("age");
        // console.log("clauses", clauses);



        return this.graph;
        break;
      default:
        break;
    }
  }


  ///////////////// lookup


  public byIri(iri: string): any {
    return this.datamodel.find((entity: any) => entity['@id'] === iri);
  }

  //e.g. gets all properties of an entity that are a nodeshape
  // public getEntityPropertyByType = (type: iri): any => {

  // }


  public getDatamodelSubtypes(iri: string): any {


    const getChildren = (iri: string) => {
      return Array.isArray(this.datamodel) && this.datamodel?.length > 0
        ? this.datamodel.filter((entity: any) => {
          return entity["rdfs:subClassOf"] && entity["rdfs:subClassOf"].some((ref: any) => ref["@id"] == iri);
        })
        : null;
    }

    const queue = [iri];
    const results = [iri];

    while (queue.length > 0) {
      const entity = queue.shift();
      let children = getChildren(entity);
      children = children.map(item => QueryUtils.toIri(item["@id"]));

      if (children.length > 0) {
        queue.push(...children);
        results.push(...children);
      }
    }
    // console.log("results", results);
    return results;
  }


  //find entity specific property, otherwise any property of a datamodel 
  public getPropertyMeta(propertyIri: string, entityIri?: string): any {
    const entity = this.datamodel.find((entity: any) => QueryUtils.toIri(entity["@id"]) == entityIri && entity["sh:property"]);

    let meta;

    if (entity["sh:property"] && Array.isArray(entity["sh:property"])) {
      const property = entity["sh:property"].find((property: any) => {
        return _.get(property, "sh:path[0].@id") == propertyIri;
      })
      meta = property;
    }

    if (meta && meta?.length > 0) {
      return meta;
    } else {
      this.datamodel.forEach((entity: any) => {
        if (entity["sh:property"] && Array.isArray(entity["sh:property"])) {
          entity["sh:property"].forEach((property: any) => {
            const iri = _.get(property, "sh:path[0].@id");
            if (iri == propertyIri) {
              meta = property;
            }
          })
        }
      })
      return meta;
    }
  }


  public withProperty(iri: string): any {
    return Array.isArray(this.datamodel) && this.datamodel?.length > 0
      ? this.datamodel.filter((entity: any) => entity["sh:property"] && entity["sh:property"].some((property: any) => {
        return _.get(property, "sh:path[0].@id") == iri;
      }
      ))
      : null;
  }

  ///////////////// paths
  getNeighbours(iri: string) {
    console.log("getNeighbours", _.get(this.graph, iri));
    return _.get(this.graph, iri);
  }


  setNeigbours(key: string, items: any[]) {
    this.graph[key] = items;
  }

  private addItem(key: string, value: any) {
    if (this.graph[key]) {
      this.graph[key].push(value);
    } else {
      this.graph[key] = [];
      this.graph[key].push(value);
    }
  }


  findPaths(start: string, end: string): any {

    function* findPath(list, start, end, visited = new Set()) {
      if (start === end) return yield [...visited, end];
      if (start == "" || !_.get(list, start)) return null;
      visited.add(start);
      for (let neighbor of _.get(list, start)) {
        if (!visited.has(neighbor)) {
          yield* findPath(list, neighbor, end, visited);
        }
      }
      visited.delete(start);
    }

    let paths = [...findPath(this.graph, start, end)];
    //sort ascending or descending length of path
    paths = paths.sort(function (a, b) {
      return a.length - b.length; // ASC  -> a.length - b.length // DESC -> b.length - a.length
    });
    return paths;
  }

}