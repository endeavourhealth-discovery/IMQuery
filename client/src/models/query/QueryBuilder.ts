import { TTIriRef } from './../tripletree/TTIriRef';
import { v4 } from "uuid";
import _ from "lodash";
import { DataSet } from "../sets/DataSet";
import { Match } from "../sets/Match";

// import Templates from "@/models/query/Templates";


export class QueryBuilder {


    'Loaded' = false;

    // string = TTIriRef.@id
    public dataSet = new Map<string, DataSet>();

    get dataSetsAsArray(): any {
        return [...this.dataSet.values()];
    }
    //string = jsonPath
    private match = new Map<string, Match>()

    // loads JSON file 
    loadDataSet(dataSet: any): void {
        try {
            if (typeof (dataSet) == "string") dataSet = JSON.parse(dataSet)  //if json string -> parse
            if (Array.isArray(dataSet)) {

                dataSet.forEach((d: any) => this.dataSet.set(d["@id"], d as DataSet));   // all dataset in array
            } else {

                this.dataSet.set(dataSet["@id"], dataSet as DataSet);  // single dataset
            }

            console.log("this.dataSet", this.dataSet)
        } catch (error) {
            console.log("Error with load() method in queryBuilder:", error)
        }
    }

}

