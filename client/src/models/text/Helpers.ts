
import * as wordMap from './Config/WordMap.json';
import _ from "lodash";
import * as labels from "./Config/AdditionalOntology.json"
import { Clause } from "./Clause"
import { IM, RDF, RDFS } from "../../vocabulary"
import jp from 'jsonpath';

// import * as Templates from "./Config/Templates.json"

export class Helpers {


    // public static getText(templateIri: string): string {
    //     const template = Helpers.isTemplateMatch(templateIri, true);
    
    // }


    // public static isTemplateMatch(templateIri: string, isMatch: boolean): any {
    //     // console.log("arguments", arguments)
    //     // console.log("Templates", Templates.default.find((template: any) => template?.iri == templateIri))
    //     if (isMatch) {
    //         return Templates.default.find((template: any) => template?.iri == templateIri)
    //     } else {
    //         return null
    //     }
    // };


    public static href = (iri: string) => "https://dev.endhealth.co.uk/viewer/#/concept/" + encodeURIComponent(iri);


    public static html(tagName: string, innerHTML: string, attributes?: any | null,): string {
        let html = `<${tagName}`;
        Object.keys(attributes).forEach((attribute: any) => {
            const value = attributes[attribute];
            html = html + ` ${attribute}="${value}"`
        })
        html = html + ">" + innerHTML + ` </${tagName}>`;
        return html;
    }

    public static isDateAliasCompared(matchClause: any): boolean {

        const andClause = new Clause(matchClause);
        // console.log("isDateAliasCompared clause getters", andClause)

        function isDateAliasInPrecedingClause(matchClause: any, testAlias: string, currentClauseIndex: number): boolean {
            // console.log("args", arguments)
            return matchClause?.definition.some((property: any, index: number) => {
                const aliases = jp.nodes(property, `$..[?(@.alias)]`);
                const result = index < currentClauseIndex && aliases.some((alias: any) => alias?.value?.alias == testAlias);
                return result;
            })

        }

        const aliasIndexMap = new Map();
        for (let i = 1; i < andClause.definition.length; i++) {
            const propertyClause = andClause.definition[i];
            return propertyClause?.property.some((property: any) => {
                if (property['@id'] == IM.EFFECTIVE_DATE && isDateAliasInPrecedingClause(andClause, property?.value?.valueVariable, i)) {
                    return true;
                }
            })
        }

        return false;
    }

    //these are silenced words or excess words that need to be trimmed off
    public static trimUnnecessaryText(inputString: string): string {
        return inputString
            // .replace("Observation (entry type)", "")
            // .replace("Event (entry type)", "")
            .replace(" (entry type)", "")

    }

    public static isSingular(testObject: any): boolean {
        if (typeof (testObject) == "number") {
            if (testObject == 1 || testObject == -1) return true
        } else if (typeof (testObject) == "string") {
            // #todo compare testObject against an array of strings that represent signular, all else is plural
        }
        return false
    }


    // (case-insensitive) tests the first letter for a string against an array of letters - e.g. indefiniteArticle
    public static isFirstLetterVowel(testString: string): boolean {
        return ["a", "e", "i", "o", "u"].some((letter: string) => letter.toLowerCase() == testString.substring(0, 1).toLowerCase());
    }

    // compares the value of a string (testString) against an array (of strings for comparison) - e.g. useful for valueIn
    public static includes(testString: string, stringArray: string[]): boolean {
        return stringArray.includes(testString);
    }

    public static isObjectAnimate(testObjectName: string): boolean {
        return ["person", "persons", "patient", "patients", "people"]
            .includes(testObjectName.toLowerCase()) ? true : false;
    }

    //checks the list of arguments for truthness 
    public static isTrue(...args): boolean {
        return args.every((arg, index) => arg == true);
    }

    public static hasTransformation(phraseType, input) {
        return wordMap[phraseType][input] == null ? false : true;
    }

    public static isNegative(testNumber: number): boolean {
        const _sign = Math.sign(testNumber);
        if (_sign == 1 || _sign == 0) {
            return false;
        } else {
            return true;
        }
    }

    public static a(ref: any) {
        const testString = ref?.name || ref;
        if (!testString || testString == "") return "a/an";
        return Helpers.isFirstLetterVowel(testString) ? "an" : "a";
    };

    public static pronoun(ref: any): string {
        const testString = ref?.name || ref;
        if (!testString || testString == "") return "they/it";
        return wordMap?.animatePronoun[Helpers.isObjectAnimate(testString).toString()];
    }

    public static getLabel(iri: string): any {
        const label = labels.entities.filter(label => label['@id'] == iri)
        return label.length > 0 ? label[0]["rdfs:label"] : null;

    }



}

// export const Helpers = { "isSingular": isSingular, "firstLetterIsVowel": firstLetterIsVowel, "includes": includes, "isObjectAnimate": isObjectAnimate, "isTrue": isTrue, "hasTransformation": hasTransformation, "isNegative": isNegative, "a": a };

