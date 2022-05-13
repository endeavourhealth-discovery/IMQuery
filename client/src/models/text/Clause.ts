import _ from "lodash";
import { String } from 'aws-sdk/clients/cloudsearch';
import * as wordMap from "./WordMap.json"
import { IM, RDF, RDFS } from "../../vocabulary"


export class TTIriRef {
    public "@id": string;
    public name: string;


    constructor(obj?: any) {
        if (obj && obj["@id"] && obj?.name) {
            this["@id"] = obj["@id"] ? obj["@id"] : null;
            this.name = obj?.name;
        }
    }
}

export class Clause {


    public definition: any;


    constructor(definition: any) {
        this.definition = definition;
        return this
    }

    private get(path: string): any {
        const value = _.get(this.definition, path);
        if (value && value?.name) {
            // console.log("value?.name", value?.name);
            const mappedWord = wordMap.name[value?.name] || wordMap.name[value] || value?.name || value?.name;;
            console.log("mappedWord", mappedWord);
            value.name = mappedWord;
        }
        return value;
    }


    // get property(): any { return this.get('property.name') }
    // get inResultSet(): any { return this.get('property.id')}
    // get comparison(): any { return this.get(('valueCompare.comparison')) }
    // get valueCompare(): any { return this.get('valueCompare.valueData') }
    // get valueIn(): any { return this.get('valueIn[0].name') }
    // get valueConcept(): any { return this.get('valueConcept[0].name') }
    // get entity(): any { return this.get('valueObject.entityType.name') }
    // get test(): any { return this.get('valueObject.sortLimit.test') }
    // get testValueIn(): any { return this.get('valueObject.sortLimit.test[0].valueIn[0].name') }
    get property(): any { return new TTIriRef(this.get('property')) }
    // get inResultSet(): any { return this.get('property.id')}
    get comparison(): any { return this.get(('valueCompare.comparison')) }
    get valueData(): any { return this.get('valueCompare.valueData') }
    get valueIn(): any { return new TTIriRef(this.get('valueIn[0]')) }
    get valueConcept(): any { return new TTIriRef(this.get('valueConcept[0]')) }
    get entity(): any { return new TTIriRef(this.get('valueObject.entityType')) }
    get test(): any { return this.get('valueObject.sortLimit.test') }
    get testValueIn(): any { return new TTIriRef(this.get('valueObject.sortLimit.test[0].valueIn[0]')) }


    path(jsonPath: string): any {
        const obj = _.get(this.definition, jsonPath);
        this._value = obj
        return this;
    }


    private _value: any;

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