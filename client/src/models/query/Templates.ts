import { v4 } from "uuid";
import _ from "lodash";
// import jmp from "jmp";
import jsonpath from "jsonpath";


// Future updates
//#todo: create map for Paths to each entity to keep code DRY



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
    had: {
        true: "had",
        false: "didn't have",
        default: "it"
    },
    were: {
        true: "were",
        false: "were not",
        default: "were"
    },
    was: {
        true: "was",
        false: "was not",
        default: "was"
    },
}

const is = [{ text: "text" }, "test"];

const propertyTokens = {
    "http://endhealth.info/im#hasProfile": "features that match the Profile of a Person {{isValueIn}}"
};

//  entities change the importance of a phrase e.g. from required -> optional. E.g. based on name or entityType. 
// const optionalPhrases = [{ entityType:}]


//maps function outcomes against values in valueToTokenMap
function phrase(targetPhrase, returnValue) {


    let _targetPhrase = targetPhrase;
    let _value = typeof (returnValue) == "string" ? returnValue : returnValue.toString();

    let _text = "";
    if (valueToTokenMap[_targetPhrase][_value]) {
        _text = valueToTokenMap[_targetPhrase][_value];
    } else if (valueToTokenMap[_targetPhrase]["default"]) {
        _text = valueToTokenMap[_targetPhrase]["default"];
    } else {
        _text = _value;
    }

    const _phrase = {
        text: _text,
        importance: "required",
        meta: {
            subtype: "phrase",
            input: _value,
            target: _targetPhrase,
        }
    }

    return _phrase;
}

function collection(targetClause: any, propertyPath: string) {

    const jsonDefinition = targetClause.json
    const _text = _.get(jsonDefinition, propertyPath);

    const _collection = {
        text: _text,
        importance: "required",
        meta: {
            subtype: "collection",
            input: propertyPath,
        }
    }

    return _collection;
}



// checks if a path exists - e.g. for template matching
function pathExists(testObject: any, testPath: string): boolean {
    return (typeof (_.get(testObject, testPath)) != "undefined");
};

function pathValueIs(testObject: any, testPath: string, comparatorObject: string): boolean {
    const _value = _.get(testObject, testPath);
    return (_value && _value == comparatorObject);
};

function fromPath(testObject: any, testPath: string): boolean {
    return (_.get(testObject, testPath));
};

// (case-insensitive) tests the first letter for a string against an array of letters - e.g. indefiniteArticle
function firstLetterIsVowel(testString: string): boolean {
    return ["a", "e", "i", "o", "u"].some((letter: string) => letter.toLowerCase() == testString.substring(0, 1).toLowerCase());
}

// compares the value of a string (testString) against an array (of strings for comparison) - e.g. useful for valueIn
function includes(testString: string, stringArray: string[]): boolean {
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
const constant = (text: any) => {
    return {
        text: text,
        importance: "required",
        type: "constant",
        meta: {}
    }
};

// a phrase derived from a function, not mutable by user
const variable = (object: any) => {
    return {
        ...object,
        type: "variable",
    }
};

// a phrase derived from a function, mutable by user (i.e. when querybuilding)
const mutable = (object: any) => {
    return {
        ...object,
        type: "mutable",
    }
};


const optional = (object: any) => {

    if (Array.isArray(object)) {
        object.forEach((item: any, index: number) => object[index].importance = "optional");
    } else {
        object.importance = "optional";
    }
    return object;
};




const includeMainEntity = (mainEntity: any, parentClause: any, currentClause: any, args: any) => {


    const _include = mutable(phrase("include", isTrue(parentClause.include, currentClause.include)));

    // console.log("_include", _include)

    const _mainEntity = mutable(phrase("entityName", mainEntity.name));

    // console.log("_mainEntity", _mainEntity)


    const _a = variable(phrase("firstLetterVowel", firstLetterIsVowel(_mainEntity.text)));

    // console.log("_a", _a)

    const _inFinalResults = optional(constant("in the final results of my search"))

    const _if = constant("if");

    // console.log("_pronoun", isObjectAnimate(_mainEntity.text))

    const _pronoun = variable(phrase("animatePronoun", isObjectAnimate(_mainEntity.text)));



    const _sentence = [_include, _a, _mainEntity, _inFinalResults, _if, _pronoun];

    return _sentence;
};

const linkedEntity = (mainEntity: any, parentClause: any, currentClause: any, args: any) => {


    // const _had = constant("had");

    const _had = mutable(phrase("had", isTrue(!currentClause?.json?.notExists || currentClause?.json?.notExists == false)))


    // console.log("linkedEntity currentClause", currentClause)

    const _entity = mutable(phrase("entityName", currentClause.json.entityType.name));

    // console.log("_entity", _entity)

    const _a = variable(phrase("firstLetterVowel", firstLetterIsVowel(_entity.text)));

    const _with = constant("with");

    const _sentence = [_had, _a, _entity, _with];

    return _sentence;
};


const hasProfile = (mainEntity: any, parentClause: any, currentClause: any, args: any) => {

    // console.log("MainEntityProperty currentClause", currentClause)



    const _were = mutable(phrase("were", isTrue(!currentClause?.json?.notExist || currentClause?.json?.notExist == false)))


    const _partOf = constant("part of");

    const _resultsOf = optional(constant("the final results of the search"));

    // const _features = constant("the profile of");
    // const _property = mutable(phrase("entityName", currentClause.json.pathTo.name));

    // console.log("_entity", _property)


    const _profiles = mutable(collection(currentClause, "valueIn"))

    const _sentence = [_were, _partOf, _resultsOf, _profiles];

    return _sentence;
};

const entityProperty = (mainEntity: any, parentClause: any, currentClause: any, args: any) => {

    console.log("entityProperty currentClause", currentClause)


    const _sentence = (currentClause: any): any => {

        console.log("_sentence currentClause", currentClause)





        const _property = mutable(phrase("entityName", currentClause.property.name));

        const _a = variable(phrase("firstLetterVowel", firstLetterIsVowel(_property.text)));

        // const _were = mutable(phrase("were", isTrue(!currentClause?.json?.notExist || currentClause?.json?.notExist == false)))

        const _that = constant("that");


        const _isNegated = currentClause.valueNotIn ? true : false;

        console.log("is", currentClause.json)


        const _was = variable(phrase("was", !_isNegated))






        // const _partOf = constant("part of");

        // const _resultsOf = optional(constant("the final results of the Search"));

        // // const _features = constant("the profile of");
        // // const _property = mutable(phrase("entityName", currentClause.json.pathTo.name));

        // // console.log("_entity", _property)


        // const _profiles = mutable(collection(currentClause, "valueIn"))

        const _sentence = [_a, _property, _that, _was];


        return _sentence;
    }


    let _sentences = [] as any[];

    //#todo: if there is an and/or/not key -> go through it recursively in case there are other children
    const _paths = _.get(args, "[0][paths]");

    if (_paths) {
        console.log("_paths", _paths)

        //check each path for a property to translate
        _paths.forEach((_path: string) => {


            // "" = root object
            let _clauses = (_path == "") ? currentClause.json : _.get(currentClause.json, _path);
            console.log("_path", _path)
            console.log("_clause", _clauses)

            //arrays e.g. and/or/nots
            if (_clauses && Array.isArray(_clauses)) {
                console.log("array", _clauses)

                _clauses.forEach((_clause: any) => {
                    if (_clause?.property) {
                        _sentences.push(_sentence(_clause))
                    }

                });

                // single properties e.g. at root path of a match clause clause
            } else if (_clauses && _clauses?.property) {
                console.log("single", _clauses)

                _sentences.push(_sentence(_clauses));
            }

        })

    } else {
        console.log("no argument specified for entityProperty template function inside the cascade")
        return null;
    }


    return _sentences;



};



const PropertySort = (mainEntity: any, parentClause: any, currentClause: any, args: any) => {

    //this can have as its child (another property test clause )


    const _and = constant("and the")

    const _timeSort = "a phrase specific to sorting by date?";

    const _quantitySort = "a phrase specific to sorting by value?";

    const _anySort = "a phrase for any sorting that will expos DESCENDING etc "


    const _propertyName = variable(phrase("entityName", currentClause.json.test.property))

    const _a = variable(phrase("firstLetterVowel", firstLetterIsVowel(_propertyName.text)));








    //  have a generic default for each property's IRI
    // #todo: this map of metadata can be configured by user / added to an entity's definition?


    const _sentences = {
        "": "",


    };

    return "test";
};


// const LinkedEntityProperty = Template([had, a, entity, with])
// const LinkedEntityCriteria = Template([had, a, entity, with])




// this acts as both "constraints" for the querybuilder and as "templates" for the query viewer
// #todo: calculate mutableCount at runtime
// #todo: add requirements for template matchin
const CascadingTemplates = [
    {
        get: { function: "includeMainEntity", input: [] },
        set: null,
        meta: {
            min: 0,
            max: 1,
            mutableCount: 0,
            matchIf: null,
        },
        data: [],
        children: [
            {
                get: { function: "linkedEntity", input: [] },
                set: null,
                meta: {
                    min: 0,
                    max: 1,
                    mutableCount: 0,
                    matchIf: {
                        all: [
                            {
                                test: "pathExists",
                                input: ["#currentClause", "entityType.@id"],
                                expect: true
                            }
                        ]
                    }
                },
                data: [],
                children: [
                    {
                        get: { function: "entityProperty", input: [{ paths: ["", "and", "or", "not"] }] },
                        set: null,
                        meta: {
                            min: 0,
                            max: 1,
                            mutableCount: 0,
                            matchIf: {
                                any: [
                                    {
                                        test: "pathExists",
                                        input: ["#currentClause", "property"],
                                        expect: true
                                    },
                                    {
                                        test: "pathExists",
                                        input: ["#currentClause", "and"],
                                        expect: true
                                    },

                                ]
                            }
                        },
                        data: [],
                        children: []
                    }
                    // {
                    //     get: "PropertySort",
                    //     set: null,
                    //     meta: {
                    //         min: 0,
                    //         max: 1,
                    //         mutableCount: 0,
                    //         matchIf: {
                    //             all: [
                    //                 {
                    //                     test: "pathExists",
                    //                     input: ["#currentClause", "sort"],
                    //                     expect: true
                    //                 },
                    //                 {
                    //                     test: "pathExists",
                    //                     input: ["#currentClause", "test"],
                    //                     expect: true
                    //                 }
                    //             ]
                    //         }
                    //     },
                    //     data: [],
                    //     children: [
                    //         {
                    //             get: "LinkedEntityProperty = requires an argument to point it to test instead of root object",
                    //             set: null,
                    //             meta: {
                    //                 min: 0,
                    //                 max: 1,
                    //                 mutableCount: 0,
                    //                 matchIf: {
                    //                     any: [
                    //                         {
                    //                             test: "pathExists",
                    //                             input: ["#currentClause", "entityType.@id"],
                    //                             expect: true
                    //                         },
                    // {
                    //     test: "pathExists",
                    //     input: ["#currentClause", "and"],
                    //     expect: true
                    // }
                    //                     ]
                    //                 }
                    //             },
                    //             data: [],
                    //             children: []
                    //         }


                    //     ]
                    // },
                ]
            },
            {
                get: { function: 'hasProfile', input: [] },
                set: null,
                meta: {
                    min: 0,
                    max: 0,
                    mutableCount: 0,
                    matchIf: {
                        all: [
                            {
                                test: "pathValueIs",
                                input: ["#currentClause", "property.@id", "http://endhealth.info/im#hasProfile"],
                                expect: true
                            }
                        ]
                    }
                },
                data: [],
                children: []
            }
        ]
    }
];
// #todo: ensure all templateFunctions return empty placeholders if functions are called without paramters -> this is to generate metadata for querybuilding
const templateFunctions = {
    "includeMainEntity": includeMainEntity,
    "linkedEntity": linkedEntity,
    "hasProfile": hasProfile,
    "PropertySort": PropertySort,
    "entityProperty": entityProperty,
}


const matchFunctions = {
    "pathExists": pathExists,
    "pathValueIs": pathValueIs,
}


export default class Templates {


    public static toTemplates(mainEntity: any, profile: any, clausePath: string) {


        const doesTemplateMatch = (mainEntity: any, profile: any, parentClause: any, currentClause: any, template: any): boolean => {
            //do a depth first recursive function OR queue like below through matchIf
            // check every child in matchIf - if it's an "all" -> use array.every, otherwise use array.some


            // if no criteria are specified
            if (!template.meta.matchIf) return true;

            // in order to support arguments such as #currentClause #profile, #mainEntity, #parentClause use the object vars
            const _vars = {
                "#mainEntity": mainEntity,
                "#profile": profile,
                "#currentClause": currentClause.json,
                "#parentClause": parentClause.json,
                "#temmplate": template
            };

            let _shouldMatch = false;

            // console.log("template", _.cloneDeep(template))


            const _testCriteria = (criteria: any) => {


                const _f = matchFunctions[criteria.test];
                let _args = criteria.input;

                //replaces args with vars
                _args.forEach((arg: any, index: number) => {
                    if (typeof (arg) == "string" && arg.substring(0, 1) == "#") {
                        // console.log("variable found", arg, _vars[arg]);
                        return _args[index] = _vars[arg];
                    }
                })

                // console.log("f", _f(..._args) == criteria.expect)
                return _f(..._args) == criteria.expect;
            }


            // #todo: add support multiple templates matching a single clause -> generate all of them
            // #display to the user first the template with the most specificity (most matchIf requirements) or least amount of placeholders (count mutables?)

            if (template.meta.matchIf.all && template.meta.matchIf.all.length) {

                //test all criteria using "every"
                const _criteria = template.meta.matchIf.all;
                _shouldMatch = _criteria.every(_testCriteria)

            } else if (template.meta.matchIf.any && template.meta.matchIf.any.length) {


                //test all criteria using "every"
                const _criteria = template.meta.matchIf.any;
                _shouldMatch = _criteria.some(_testCriteria)

            } else {
                _shouldMatch = false;
            }


            //#todo: select multiple compatible phrases templates and pick the shortest one (currently it only picks one
            console.log("template ", template.get, " should match: ", _shouldMatch)
            return _shouldMatch;
        }

        // console.log("args", arguments);

        // debugger;

        const _queue = [];

        const _deleteQueue = [];

        //add all paths of templates then recursively go through each in order to populate json[]
        const _cascadingTemplates = _.cloneDeep(CascadingTemplates)

        _cascadingTemplates.forEach((item: any, index: number) => _queue.push(`[${index}]`));


        while (_queue.length > 0) {
            const _currentItemPath = _queue.shift();

            const _template = _.get(_cascadingTemplates, _currentItemPath)

            console.log("current template", _template.get)



            // console.log("current template", _template)

            const _currentClause = _.get(profile, clausePath);

            // console.log("_queue _currentClause", _currentClause)

            const _parentPath = clausePath
                .split(".")
                .slice(0, -1)
                .join(".");

            const _parentClause = _.get(profile, _parentPath);

            //check template requirements are met
            if (doesTemplateMatch(mainEntity, profile, _parentClause, _currentClause, _template)) {

                // console.log("_template f", _template)

                const _templateFunction = templateFunctions[_template.get.function];

                const _data = _templateFunction(mainEntity, _parentClause, _currentClause, _template.get.input);

                // if data is a collection of arrays (e.g. a function executing itself more than once ).
                // the data:[] key in the cascade acts as an "AND" operator clause and can contain and/or/not
                let _currentCascade = _.get(_cascadingTemplates, _currentItemPath)
                _currentCascade.data.push(_data)
                // _.set(_cascadingTemplates, _currentItemPath + "[data]", _data)

                //adds children to the queue
                if (_template.children.length > 0) {
                    // console.log("_template.children.length ", _template.children.length )

                    _template.children.forEach((item: any, index: number) => _queue.push(_currentItemPath + `[children][${index}]`))
                }
                // console.log("_queue", _queue)
            } else {
                // remove template from cascade if not matching
                _deleteQueue.push(_currentItemPath);

            }
        }


        // removes templates not matched 
        while (_deleteQueue.length > 0) {

            //deletes items starting with last time to avoid shifting array indices
            const _lastIndex = _deleteQueue.length - 1;
            const _currentItemPath = _deleteQueue[_lastIndex];


            const _start: number = _currentItemPath.lastIndexOf("[");
            const _end: number = _currentItemPath.lastIndexOf("]");
            const _index = _currentItemPath.substring(_start + 1, _end);
            const _parentPath = _currentItemPath.substring(0, _start);


            const _parent = _.get(_cascadingTemplates, _parentPath);
            _parent.splice(_index, 1)
            _deleteQueue.splice(_lastIndex, 1);

            //does not remove object propery
            // _.unset(_cascadingTemplates, _currentItemPath)

        }

        return _cascadingTemplates;

    }


}