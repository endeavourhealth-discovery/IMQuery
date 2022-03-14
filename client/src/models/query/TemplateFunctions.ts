import { v4 } from "uuid";
import _ from "lodash";
import jmp from "jmp";
import jsonpath from "jsonpath";


const functions_v1 = {
    "pathExists": pathExist,
    "firstLetterEquals": firstLetterIsVowel,
    "equals": equals
}

const phrase_v1 = {
    "indefiniteArticle": {
        ifTrue: "an", // firstLetterIsVowel = true
        ifFalse: "a"
    },
    "inclusion": {
        ifTrue: "include",
        ifFalse: "exclude"
    }
}




// checks if a path exists - e.g. for template matching
function pathExist(testObject: any, testPath: string): boolean {
    return (typeof (_.get(testObject, testPath)) != "undefined");
};

// (case-insensitive) tests the first letter for a string against an array of letters - e.g. indefiniteArticle
function firstLetterIsVowel(testString: string): boolean {
    return ["a", "e", "i", "o", "u"].some((letter: string) => letter.toLowerCase() == testString.substring(0, 1).toLowerCase());
}

// compares the value of a string (testString) against an array (of strings for comparison) - e.g. useful for valueIn
function equals(testString: string, stringArray: string[]): boolean {
    return stringArray.includes(testString);
}



export { functions_v1 }; 
