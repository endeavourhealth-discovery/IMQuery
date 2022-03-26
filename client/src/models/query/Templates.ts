import { v4 } from "uuid";
import _ from "lodash";
// import jmp from "jmp";
import jsonpath from "jsonpath";


// Future updates
//#todo: create map for Paths to each entity to keep code DRY
// _vars should only be declared once for all metadata inside a JSON definition -> becomes avaialble by reference e.g. #currentClause


const valueToPhraseMap = {
    reserved: {
        "GREATER_THAN_OR_EQUAL": "greather than or equal to",
        "LESS_THAN_OR_EQUAL": "less than or equal to"
    },
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
        "GREATER_THAN_OR_EQUAL": "greather than or equal to",
        "LESS_THAN_OR_EQUAL": "less than or equal to",
        Event: "Health Record",
        "Person Details": "Personal Details Record",
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



//  entities change the importance of a phrase e.g. from required -> optional. E.g. based on name or entityType. 
// const optionalPhrases = [{ entityType:}]



// - consider short syntax e.g. Include Person, with a record where [concept is BP AND value >140 AND effective date exists]
// types of words that exist


// [phrase tyes 1-3] each must go through word transformation map [using #phrase]
// [phrase types 1-3] each must preserve both a reference to the  value and the path from of the original JSON profile [hence why they're called REF] 


// THIS IS NOT A PHRASE TYPE BUT A TEMPLATE RECURSIVE TEMPLATE FUNCTION
// 1. [JOIN with 1 AND/OR/NOT] collection of property joined with and/or/not -> linkedEntityProperty function  e.g.  and [effective date exists, numeric value >140, concept is]


// #REF -> references to one or more (entities or values) at paths 
// e.g. references to a match clauses containing properties (not match clauses containing linked entities, these are dealt with in Profile.vue/ UI OM (definitionTree)) 
// for now it is assumed that only 1 parent and/or/not is used 
// [ ] 2 [JOIN with 1 OR] collection of values of a property (profile, concept sets) - e.g. person hasProfile [collection], concept valueIn [collection], valueNotIn [collection] -> this may reference a single entity, or multiple entities
// 3. single value in at propertyPath -e.g. valueCompare, descending, equaltoorgreaterthan, valueFunction 

// #PHRASE -> valueToPhraseMap - adds an additional key to Entity "_text"
// [1-2] -> 4 transformations applied to existing names of entitties?
// [3] -> 5. words derived from the outcome of a function applied to values from types 1-3 (i.e. function applied iteratively to [2-2]) [e.g. descending + propert with entitytype datetime = latest]

// THIS IS NOR A PHRASE but a repetition of 5 as another word in the sentence
// [5] -> 6. words derived from other words (also using a function) (a / an) ( was, was not, include, exclude)

// #CONSTANT -> prewritten, immutable words or phrases 
// 6. completely static words ("with" "had")


function transform(targetPhrase, returnValue): any {

    //mapping words to the outcome of a function's value
    let _targetPhrase = targetPhrase;
    console.log("transform", targetPhrase, returnValue)
    let _value = typeof (returnValue) == "string" ? returnValue : returnValue.toString();

    let _text = "";
    if (valueToPhraseMap[_targetPhrase][_value]) {
        _text = valueToPhraseMap[_targetPhrase][_value];
    } else if (valueToPhraseMap[_targetPhrase]["default"]) {
        _text = valueToPhraseMap[_targetPhrase]["default"];
    } else {
        _text = _value;
    }
    return _text
}

//maps function outcomes against values in valueToPhraseMap
function phrase(phraseType: string, input: any, references = []): any {

    // let _input;

    // transforming one or more references [1-2] -> 4 AND  [3] -> 5.

    // [1-2]
    if (input?.type == "reference") {
        console.log("0")


        // _input = input.data;

        // [1]
        const _entityPaths = ["json.hasProfile", "json.valueIn", "json.valueNotIn"];
        // [2]
        const _valuePaths = ["json.valueCompare", "json.valueCompare"];

        const _isEntityReference = _entityPaths.includes(input?.meta?.args?.propertyPath)
        const _isValueReference = _valuePaths.includes(input?.meta?.args?.propertyPath)

        if (_isEntityReference && Array.isArray(input.data)) {
            console.log("1")
            input.data.forEach((entity: any, index: any) => {
                //adds new "text" key to entity reference
                input.data[index]["_text"] = transform("entityName", entity.name)
            })
        } else if (_isValueReference) {
            console.log("2")

            //adds new "text" key to value at path
            input.data["_text"] = transform("entityName", input.data.name)
        } else {

            console.log("phrase not found: [type] [input]", phraseType, input)
            return null;
        }


        // transforming 1 existing phrase [5-> 6]
    } else if (typeof (input == "string")) {
        console.log("3")

        console.log("typeof (input == 'string'): [type] [input]", phraseType, input)




        // if the object returned is just a string e.g. isTrue() it may have had metadata
        if (references.length > 0) {

            const _text = transform(phraseType, input);
            console.log("_text transform(phraseType, input)", _text, phraseType, input)
            const _transformedReferences = {
                text: _text,
                type: "transformedReferences",
                importance: "required",
                mutable: false,
                meta: {
                    transformations: [], //record subsequent transformations using phrase
                    args: {
                        data: references,
                        "transformationType": phraseType,
                        "transformationInput": input
                    },
                }
            };

            return _transformedReferences;

        } else {
            console.log("4")

            //if it doesnt have references it most likely isnt mutable, but some other variable 
            const _text = transform(phraseType, input)

            const _transformedReferences = {
                text: _text,
                type: "transformedText",
                importance: "required",
                mutable: false,
                meta: {
                    transformations: [], //record subsequent transformations using phrase
                    args: {
                        "transformationType": phraseType,
                        "transformationInput": input
                    },
                }
            };

            return _transformedReferences;

        }


    } else {

    }

    // const _phrase = {
    //     text: _text,
    //     importance: "required",
    //     meta: {
    //         subtype: "phrase",
    //         input: _value,
    //         target: _targetPhrase,
    //     }

    // }

    return input;
}

// used for hasPRofile/valueIn/valueNotIn or things that point to Entities
function reference(targetClause: any, propertyPath: string) {

    // const jsonDefinition = targetClause?.json ? targetClause.json : targetClause;
    const _values = _.get(targetClause, propertyPath);


    const _reference = {
        text: "",
        data: _values,
        type: "reference",
        importance: "required",
        mutable: false,
        meta: {
            transformations: [], //record subsequent transformations using phrase
            args: {
                "propertyPath": propertyPath
            },
        }
    };

    //sets uuid (definitionTree) or id (if json definition)
    // if not avaialble (e.g. main entity) sets the actual clause data.
    const _idKey = targetClause?.uuid ? "uuid" : targetClause?.id ? "id" : null;
    if (_idKey) {
        _reference.meta.args[_idKey] = targetClause[_idKey];

    } else {
        _reference.meta.args["targetClause"] = targetClause
    }

    return _reference;
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
        type: "constant",
        importance: "required",
        mutable: false,
        data: [],
        meta: {},
    }
};

// a phrase derived from a function, not mutable by user
// const variable = (object: any) => {
//     return {
//         ...object,
//         type: "variable",
//     }
// };

// a phrase derived from a function, mutable by user (i.e. when querybuilding)
const mutable = (object: any) => {
    // return {
    //     ...object,
    //     type: "mutable",
    // }
    if (Array.isArray(object)) {
        object.forEach((item: any, index: number) => object[index].mutable = true);
    } else {
        object.mutable = true;
    }
    return object;
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


    const _ref1 = reference(parentClause, "include")
    const _ref2 = reference(currentClause, "include")
    const _include = mutable(phrase("include", isTrue(_ref1.data, _ref2.data), [_ref1, _ref2]));



    const _ref3 = reference(mainEntity, "name")
    const _mainEntity = mutable(phrase("entityName", _ref3.data, [_ref3]));



    const _a = phrase("firstLetterVowel", firstLetterIsVowel(_mainEntity.text));


    const _inFinalResults = optional(constant("in the final results of this search"))

    const _if = constant("if");

    // console.log("_pronoun", isObjectAnimate(_mainEntity.text))

    //doesnt require a refernece since it wil not be mutable by the user
    const _pronoun = phrase("animatePronoun", isObjectAnimate(_mainEntity.text));



    const _sentence = [_include, _a, _mainEntity, _inFinalResults, _if, _pronoun];



    return _sentence;
};

const linkedEntity = (mainEntity: any, parentClause: any, currentClause: any, args: any) => {


    const _had = constant("had");


    const _ref1 = reference(currentClause, "json.entityType.name")
    const _entity = mutable(phrase("entityName", _ref1.data, [_ref1]));

    const _a = phrase("firstLetterVowel", firstLetterIsVowel(_entity.text));

    const _with = constant("with");


    const _sentence = [_had, _a, _entity, _with];

    // console.log("_sentence", _sentence)

    return _sentence;
};


const hasProfile = (mainEntity: any, parentClause: any, currentClause: any, args: any) => {


    const _ref1 = reference(currentClause, "json.notExist")
    const _were = mutable(phrase("were", isTrue(!_ref1.data), [_ref1]))


    const _partOf = constant("part of");

    const _resultsOf = optional(constant("the final results of the search"));


    //don't need to pass references as an argument
    const _ref2 = reference(currentClause, "json.valueIn");
    // console.log("_ref2", _ref2)

    const _profiles = mutable(phrase("entityName", _ref2))
    // console.log("_profiles", _profiles)

    const _sentence = [_were, _partOf, _resultsOf, _profiles];
    // console.log("_sentence", _sentence)

    return _sentence;
};

const entityProperty = (mainEntity: any, parentClause: any, currentClause: any, args: any) => {
    // console.log("entityProperty currentClause", currentClause)


    //a function that returns an array of objects that represents a single sentence (i.e. the description one property)
    const _sentence = (currentClause: any): any => {
        // console.log("_sentence currentClause", currentClause)

        const _ref1 = reference(currentClause, "property.name");
        const _property = mutable(phrase("entityName", _ref1.data));
        // console.log("_property", _property)

        const _a = phrase("firstLetterVowel", firstLetterIsVowel(_property.text));

        const _that = constant("that");

        const _partOf = constant("part of the set of values");


        // old
        // const _isNegated = currentClause.valueNotIn ? true : false;
        // const _was = phrase("was", !_isNegated)

        // applies to scenario 3/4
        const _ref2 = reference(currentClause, "valueNotIn");
        const _was = phrase("was", _ref2.data == undefined, [_ref2])

        console.log("_ref2", _ref2)



        //scenario 1: nothing besides property [entity reference] is declared [e.g. property opreator clause  effectiveDate4]

        //parent would be: "and the latest [3] entries in [their] health record had:"
        //current would be: "an [effective date] that exists / that was an entry in their record" //This should be autogenerated in the UI when [Latest/Earliest] is in use - i.e. if no effective date exits you cannot say "latest" or "earliest" 
        const _exists = constant("that exists");


        // // scenario 2: valueCompare / valueFunction
        // const _comparison = currentClause?.valueCompare?.comparison ? phrase("entityName", currentClause?.valueCompare?.comparison) : null;
        // const _valueData = currentClause?.valueCompare?.comparison ? phrase("entityName", currentClause?.valueCompare?.valueData) : null;

        const _ref3 = currentClause?.valueCompare ? reference(currentClause, "valueCompare.comparison") : null;
        const _comparison = _ref3 ? mutable(phrase("entityName", _ref3.data, [_ref3])) : null;

        const _ref4 = currentClause?.valueCompare ? reference(currentClause, "valueCompare.valueData") : null;
        const _valueData = _ref4 ? mutable(phrase("entityName", _ref4.data, [_ref4])) : null;
        // const _valueData = currentClause?.valueCompare ? mutable(reference(currentClause, "valueCompare.valueData")) : null;

        // #todo: valueFunction for units
        // const _ref5 = currentClause?.valueFunction ? reference(currentClause, "valueFunction.argument[0].paramter"):  null;  
        // const _units = _ref5 ? mutable(phrase("entityName", _ref5, [_ref5])) : null;


        // secnario 3: valueIn / valueNotIn
        const _valueIn = currentClause?.valueIn ? mutable(reference(currentClause, "valueIn")) : null;
        const _valueNotIn = currentClause?.valueNotIn ? mutable(reference(currentClause, "valueNotIn")) : null;

        // console.log("_valueIn", _valueIn)
        // console.log("_valueNotIn", _valueIn)


        
        let _sentence = [_a, _property, _exists]; //default sentence is "exists"
        const _sentenceVariants = {
            valueCompare: [_a, _property, _that, _was, _comparison, _valueData], //add _units
            valueIn: [_a, _property, _that, _was, _partOf, _valueIn],
            valueNotIn: [_a, _property, _that, _was, _partOf, _valueNotIn],
        };

 
        //select the sentence based on json path otherwise use default sentence.
        const _expectedKeys = ["valueIn", "valueNotIn", "valueCompare"];
        Object.keys(currentClause).forEach((key: string) => {
            if (_expectedKeys.includes(key)) {
                _sentence = _sentenceVariants[key]
            }
        })

        console.log("_sentence", _sentence)
        return _sentence;
    }


    let _sentences = [] as any[];

    //#todo: if there is an and/or/not key -> go through it recursively in case there are other children (not required at present)
    
    //gets the arguments specified in the cascade object 
    // [0][paths] is the path of a clause to check for properties e.g. and/or/nots, "" (Root)
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


    const _propertyName = phrase("entityName", currentClause.json.test.property)

    // todomy
    // const _a = phrase("firstLetterVowel", firstLetterIsVowel(_propertyName.text));








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