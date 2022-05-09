
import * as wordMap from './WordMap.json';
import _ from "lodash";


export class Helpers {

    public static isSingular(testObject: any): boolean {
        if (typeof (testObject) == "number") {
            if (testObject == 1 || testObject == -1) return true
        } else if (typeof (testObject) == "string") {
            // #todo compare testObject against an array of strings that represent signular, all else is plural
        }
        return false
    }

    // (case-insensitive) tests the first letter for a string against an array of letters - e.g. indefiniteArticle
    public static firstLetterIsVowel(testString: string): boolean {
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

    public static a(testString: string) {
        return testString && testString != "" ? ["a", "e", "i", "o", "u"].some((letter: string) => letter.toLowerCase() == testString.substring(0, 1).toLowerCase()) ? "an" : "a" : "a";
    };

    public static pronoun(testString: string): string {
        return Helpers.isObjectAnimate(testString) ? "they" : "it";
    }


}

// export const Helpers = { "isSingular": isSingular, "firstLetterIsVowel": firstLetterIsVowel, "includes": includes, "isObjectAnimate": isObjectAnimate, "isTrue": isTrue, "hasTransformation": hasTransformation, "isNegative": isNegative, "a": a };

