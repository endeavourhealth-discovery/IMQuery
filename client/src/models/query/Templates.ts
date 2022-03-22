import { v4 } from "uuid";
import _ from "lodash";
// import jmp from "jmp";
import jsonpath from "jsonpath";



const valueToTokenMap = {
    firstLetterVowel: {
        true: "an",
        false: "a",
        default: null,
    },
    include: {
        true: "include",
        false: "exclude",
        default: null,
    },
    entityName: {
        Event: "Health Record",
        default: null, //returns input itself
    },
    animatePronoun: {
        true: "they",
        false: "it",
        default: "it"
    },


}

//maps function outcomes against values
function phrase(tokenType, value) {

    let _tokenType = tokenType;
    let _value = typeof (value) == "string" ? value : value.toString();

    // if (args.length == 2) {
    //     _tokenType = args[0];
    //     _value = args[1];

    // } else if (args.length == 3) {
    //     _tokenType = args[0];
    //     const _f = args[1];
    //     const _args = args[2];
    //     _value = _f(args).toString();
    // }
    let _phrase = "";
    if (valueToTokenMap[_tokenType][_value]) {
        _phrase = valueToTokenMap[_tokenType][_value];
    } else if (valueToTokenMap[_tokenType]["default"]) {
        _phrase = valueToTokenMap[_tokenType]["default"];
    } else {
        _phrase = _value;
    }

    return _phrase;
}



// checks if a path exists - e.g. for template matching
function pathExist(testObject: any, testPath: string): boolean {
    return (typeof (_.get(testObject, testPath)) != "undefined");
};
function fromPath(testObject: any, testPath: string): boolean {
    return (_.get(testObject, testPath));
};

// (case-insensitive) tests the first letter for a string against an array of letters - e.g. indefiniteArticle
function firstLetterIsVowel(testString: string): boolean {
    return ["a", "e", "i", "o", "u"].some((letter: string) => letter.toLowerCase() == testString.substring(0, 1).toLowerCase());
}

// compares the value of a string (testString) against an array (of strings for comparison) - e.g. useful for valueIn
function equals(testString: string, stringArray: string[]): boolean {
    return stringArray.includes(testString);
}

function isObjectAnimate(testObjectName: string): boolean {
    return ["person", "persons", "patient", "patients", "people"]
        .includes(testObjectName.toLowerCase()) ? true : false;
}

function isTrue(...args): boolean {
    return args.every((arg, index) => arg == true);
}


// a phrase that is static and not mutable by user
// #todo: populate meta with info for querybuilding  
const constant = (phrase: string) => {
    return {
        text: phrase,
        type: "constant",
        mutable: false,
        meta: {},
    }
};

// a phrase derived from a function, not mutable by user
const variable = (phrase: string) => {
    return {
        text: phrase,
        type: "variable",
        mutable: false,
        meta: {},
    }
};

// a phrase derived from a function, mutable by user (i.e. when querybuilding)
const mutable = (phrase: string) => {
    return {
        text: phrase,
        type: "variable",
        mutable: true,
        meta: {},
    }
};



const entityPathMap = {
    "mainEntity": "entityType"
};



const IncludeMainEntity = (mainEntity: any, parentClause: any, currentClause: any) => {


    const _include = mutable(phrase("include", isTrue(parentClause.include, currentClause.include)));

    // console.log("_include", _include)

    const _mainEntity = mutable(phrase("entityName", mainEntity.name));

    // console.log("_mainEntity", _mainEntity)


    const _a = variable(phrase("firstLetterVowel", firstLetterIsVowel(_mainEntity.text)));

    // console.log("_a", _a)

    const _if = constant("if");

    // console.log("_pronoun", isObjectAnimate(_mainEntity.text))

    const _pronoun = variable(phrase("animatePronoun", isObjectAnimate(_mainEntity.text)));


    const _had = constant("had");

    const _sentence = [_include, _a, _mainEntity, _if, _pronoun, _had];

    return _sentence;
};

const AnyLinkedEntity = (mainEntity: any, parentClause: any, currentClause: any) => {


    console.log("currentClause", currentClause)
    
    const _entity = mutable(phrase("entityName", currentClause.data.entityType.name));
    
    console.log("_entity", _entity)

    const _a = variable(phrase("firstLetterVowel", firstLetterIsVowel(_entity.text)));

    const _with = constant("with");

    const _sentence = [_a, _entity, _with];

    return _sentence;
};


// const LinkedEntityProperty = Template([had, a, entity, with])
// const LinkedEntityCriteria = Template([had, a, entity, with])




// this acts as both "constraints" for the querybuilder and as "templates" for the query viewer
// #todo: calculate mutableCount at runtime
// #todo: add requirements for template matchin
const CascadingTemplates = [
    {
        get: "IncludeMainEntity",
        set: null,
        meta: {
            min: 1,
            max: 1,
            mutableCount: 0,
            matchIf: []
        },
        data: [],
        children: [
            {
                get: "AnyLinkedEntity",
                set: null,
                meta: {
                    min: 1,
                    max: 1,
                    mutableCount: 0,
                    matchIf: []
                },
                data: [],
                children: [
                    // {
                    //     template: LinkedEntityProperty,
                    //     meta: {
                    //         min: 0,
                    //         max: 1,
                    //         mutableCount: 0,
                    //         requirements: []
                    //     },
                    //     data: [],
                    //     children: []
                    // },
                    // {
                    //     template: LinkedEntityCriteria,
                    //     meta: {
                    //         min: 1,
                    //         max: 1,
                    //         mutableCount: 0,
                    //         requirements: []
                    //     },
                    //     data: [],
                    //     children: []
                    // }
                ]
            },
            // {
            //     template: ActiveState,
            //     meta: {
            //         min: 1,
            //         max: 1,
            //         mutableCount: 2, //sum of all counts
            //         requirements: []
            //     },
            //     data: [],
            //     children: []
            // }
        ]
    }
];


const templateFunctions = {
    "IncludeMainEntity": IncludeMainEntity,
    "AnyLinkedEntity": AnyLinkedEntity,
}




export default class Templates {


    public static toTemplates(mainEntity: any, profile: any, clausePath: string) {

        console.log("args", arguments);

        // debugger;

        const _queue = [];

        //add all paths of templates then recursively go through each in order to populate data[]
        const _cascadingTemplates = _.cloneDeep(CascadingTemplates)

        _cascadingTemplates.forEach((item: any, index: number) => _queue.push(`[${index}]`));

        
        while (_queue.length > 0) {
            const _currentItemPath = _queue.shift();
            const _template = _.get(_cascadingTemplates, _currentItemPath)
            
            // console.log("current template", _template)
            
            const _currentClause = _.get(profile, clausePath);
            
            // console.log("_queue _currentClause", _currentClause)
            
            const _parentPath = clausePath
                .split(".")
                .slice(0, -1)
                .join(".");

            const _parentClause = _.get(profile, _parentPath);


            const _templateFunction = templateFunctions[_template.get];

            const _data = _templateFunction(mainEntity, _parentClause, _currentClause);

            _.set(_cascadingTemplates, _currentItemPath + "[data]", _data)

            //adds children to the queue
            if (_template.children.length > 0) {
                // console.log("_template.children.length ", _template.children.length )

                _template.children.forEach((item: any, index: number) => _queue.push(_currentItemPath + `[children][${index}]`))
            }
            // console.log("_queue", _queue)

        }

        return _cascadingTemplates

    }


}


//function factory for template creation?

// function Template(sentence: any) {


//     const _function = (profile: any, clausePath: string) => {

//     };


//     // const _vars = [
//     //     {
//     //        had  : "jsonPath"


//     // ];


//     // const _f = f;

//     return _function;

// }



// const Templates = {
//     "LinkedEntity": _linkedEntity,
//     "LinkedEntityProperty": _linkedEntityProperty,
//     "LinkedEntityCriteria": _linkedEntityCriteria

// }




// export { functions_v1 };





// const phrase_v1 = {
//     "indefiniteArticle": {
//         ifTrue: "an", // firstLetterIsVowel = true
//         ifFalse: "a"
//     },
//     "inclusion": {
//         ifTrue: "include",
//         ifFalse: "exclude"
//     }
// }




// function LinkedEntity(phrase) {
//     return {
//         text: phrase,
//         type: "LinkedEntity",
//         meta: {},
//     }
// }
// function Property(phrase) {
//     return {
//         text: phrase,
//         type: "Property",
//         meta: {},
//     }
// }
// function Criteria(phrase) {
//     return {
//         text: phrase,
//         type: "Criteria",
//         meta: {},
//     }
// }