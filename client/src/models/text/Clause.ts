import _ from "lodash";
import { String } from 'aws-sdk/clients/cloudsearch';

export class Clause {


    public definition: any;


    constructor(definition: any) {
        this.definition = definition;
        return this
    }


    private _value: any;

    path(jsonPath: string): any {
        const obj = _.get(this.definition, jsonPath);
        this._value = obj
        return this;
    }

    get value(): any {
        return _.cloneDeep(this._value);
    }

    get exists(): boolean {
        return (typeof this._value != "undefined");
    };

    public is(comparatorObject: any): boolean {
        return this._value == comparatorObject;
    };


}