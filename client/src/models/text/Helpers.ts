
import * as wordMap from './Config/WordMap.json';
import _ from "lodash";
import * as labels from "./Config/AdditionalOntology.json"


export class Helpers {


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

