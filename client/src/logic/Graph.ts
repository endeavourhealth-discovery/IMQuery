

import Datamodel from "./Datamodel"
import _ from "lodash";


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

  populateGraph() {
    let map;
    switch (this._mainEntity) {
      case "im:Person":
        map = [
          {
            "im:Person": ["im:isSubjectOf"]
          },
          {
            "im:isSubjectOf": _.cloneDeep(Datamodel["im:Event"])
          }
        ];
        //convert triples object
        map.forEach((mapItem: any) => {
          const key = Object.keys(mapItem)[0];
          let items = mapItem[key];
          this.setNeigbours(key, items);
        })
        return this.graph;
        //iterate trough DataModel go 5 entities deep for the map's relationship ()

        break;
      default:
        break;
    }
  }




  getNeighbours(iri: string) {
    console.log("getNeighbours", this.graph[iri]);
    return this.graph[iri];
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
      // console.log("list,", list);
      console.log("_.get(list, start)", _.get(list, start));
      if (start === end) return yield [...visited, end];
      if (start == "" || !_.get(list, start)) return null;
      visited.add(start);
      // console.log("start", start);
      for (let neighbor of _.get(list, start)) {
        if (!visited.has(neighbor)) {
          yield* findPath(list, neighbor, end, visited);
        }
      }
      visited.delete(start);
    }

    // let paths = [...findPath(entities, start, end)];
    let paths = [...findPath(this.graph, start, end)];
    //sport ascending or descending length of path
    paths = paths.sort(function (a, b) {
      return a.length - b.length; // ASC  -> a.length - b.length // DESC -> b.length - a.length
    });

    console.log(`paths for (${start})s ->`, paths);
    return paths;
  }

}