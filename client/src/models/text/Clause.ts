import { Helpers } from "./Helpers"
// const { a, isSingular, html, isDateAliasCompared, href, isTemplateMatch } = Helpers;

import { _ } from "lodash";
import * as wordMap from "./Config/WordMap.json"
import * as pathMap from "./Config/PathMap.json"
import { IM, RDF, RDFS } from "../../vocabulary"
// import { Helpers } from "./Helpers"
// const { a, isSingular, html, isDateAliasCompared, href, isTemplateMatch } = Helpers;


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
    public path: string;


    constructor(definition: any) {
        this.definition = definition;

        //maps all key-value pairs in pathMap.json to functions (key) which return a transfored string (value mapped against wordMap.json)
        Object.keys(pathMap).forEach((key) => {
            Object.defineProperty(this, key, {
                get() { return this.get(pathMap[key]) },
            })
        })

        return this
    }

    //ensures all properties return labels from WordMap.json (if applicable) or labels from AdditionalOntology.json where Iris match  (if applicable)
    private get(path: string): any {


        let originalObject = _.cloneDeep(_.get(this.definition, path));

        let originalValue = originalObject?.name || originalObject?.value || originalObject
        if (originalValue == "Unknown code set") originalValue = Helpers.getLabel(originalObject['@id']) || originalValue
        if (typeof (originalValue) == "string") originalValue = Helpers.trimUnnecessaryText(originalValue);


        let mappedValue;
        if (originalValue) mappedValue = wordMap.name.find(obj => obj.originalValue == originalValue)?.mappedValue || originalValue;

        let mappedObject = _.cloneDeep(originalObject); //if you want to replace .name property of IriRef in original Definition remove _.cloneDeep
        if (mappedObject?.name) mappedObject.name = mappedValue;
        else if (mappedObject?.value) mappedObject.value = mappedValue;
        else mappedObject = mappedValue


        return mappedValue ? mappedObject : originalObject;
    }


    //special getters that are not defined in PathMap.json
    get exists(): boolean {
        const exists = this?.definition?.notExist != true && this?.definition?.match?.notExist != true;
        return exists
    }

    get are(): string {
        return wordMap["are"][this.exists.toString()];
    }

    get has(): string {
        return wordMap["has"][this.exists.toString()];
    }


    templates(): any {

        let result = {};
        if (this["and"] && Array.isArray(this["and"]) && this["and"].length > 1 && Helpers.isDateAliasCompared(this["and"])) {

        }
    }


}