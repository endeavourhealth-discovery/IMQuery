import EntityService from '@/services/EntityService';
import QueryService from '@/services/QueryService';


import Datamodel from "./Datamodel"
import _ from "lodash";
// import QueryService from "@/services/QueryService";


export default class Graph {

  public graph = {};

  constructor(mainEntity?: string) {
    this.mainEntity = mainEntity || "im:Person";
    this.populateGraph();
  }


  private _mainEntity: string;
  public get mainEntity(): string {
    return this._mainEntity;
  }
  public set mainEntity(mainEntity?: string) {
    this._mainEntity = mainEntity;
    this.populateGraph();
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