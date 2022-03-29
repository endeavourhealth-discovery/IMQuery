import { v4 } from "uuid";
import _ from "lodash";
// import jmp from "jmp";
import jsonpath from "jsonpath";
import { ConsoleLogger } from "@aws-amplify/core";


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
        true: "Include",
        false: "Exclude",
        default: null,
    },
    entityIri: {
        "im:PersonDetails": "Personal Details Record",
        default: null,
    },
    entityName: {
        "DESCENDING": "descending",
        "ASCENDING": "ascending",
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
    entry: {
        singular: "entry",
        plural: "entries"
    },
    records: {
        singular: "record",
        plural: "records"
    },
    DESCENDING: {
        "im:DateTime": "latest",
        "default": null

    },
    ASCENDING: {
        "im:DateTime": "earliest",
        "default": null
    }

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




//////// referneces and phrase transformations



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
        // show rdfs label or iri 
        // console.log("references", _references)
        // _text = (targetPhrase == "entityIri") ? references[0]["data"]["rdfs:label"] : _value;
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
        const _valuePaths = ["json.valueCompare"];

        // is it a reference to an entity or a value at a JSON path?
        const _isEntityReference = _entityPaths.includes(input?.meta?.args?.propertyPath)
        const _isValueReference = _valuePaths.includes(input?.meta?.args?.propertyPath)

        if (Array.isArray(input.data)) {
            console.log("1")
            input.data.forEach((entity: any, index: any) => {
                //adds new "text" key to entity reference
                console.log("entity", entity)
                input.data[index]["_text"] = transform("entityName", entity["rdfs:label"])
            })
        } else if (input.data) {
            console.log("2")
            //adds new "text" key to value at path
            const _text = transform("entityName", input.data["rdfs:label"]);
            input.data["_text"] = _text;
        } else {

            console.log("phrase not found: [type] [input]", phraseType, input)
            return null;
        }


        // transforming 1 existing phrase [5-> 6]
    } else if (typeof (input == "string")) {
        console.log("3")

        console.log("phraseType input", phraseType, input)




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
                },
                uuid: `urn:uuid:${v4()}`,
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
                },
                uuid: `urn:uuid:${v4()}`,

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
function reference(targetClause: any, propertyPath = "") {

    // const jsonDefinition = targetClause?.json ? targetClause.json : targetClause;
    // const _values = _.get(targetClause, propertyPath);
    const _values = propertyPath && propertyPath != "" ? _.get(targetClause, propertyPath) : targetClause;

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
        },
        uuid: `urn:uuid:${v4()}`,

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





////// functions



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

function isSingular(testObject: any): boolean {
    if (typeof (testObject) == "number") {
        if (testObject == 1 || testObject == -1) return true
    } else if (typeof (testObject) == "string") {
        // #todo compare testObject against an array of strings that represent signular, all else is plural
    }
    return false
}

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

function hasTransformation(phraseType, input) {
    // console.log("hasTransformation type input isnull?", phraseType, input, valueToPhraseMap[phraseType][input] == null)
    return valueToPhraseMap[phraseType][input] == null ? false : true;
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
        uuid: `urn:uuid:${v4()}`,
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



    // const _ref3 = reference(mainEntity, "rdfs:label")
    // const _mainEntity = mutable(phrase("entityName", _ref3.data, [_ref3]));
    const _ref3 = reference(mainEntity, "")
    const _mainEntity = mutable(phrase("entityName", _ref3));

    const _a = phrase("firstLetterVowel", firstLetterIsVowel(_mainEntity.data._text));


    const _inFinalResults = optional(constant("in the final results of this search"))

    const _if = constant("if");

    // console.log("_pronoun", isObjectAnimate(_mainEntity.text))

    //doesnt require a refernece since it wil not be mutable by the user
    const _pronoun = phrase("animatePronoun", isObjectAnimate(_mainEntity.data["_text"]));

    const _sentence = [_include, _a, _mainEntity, _inFinalResults, _if, _pronoun];



    return _sentence;
};

const linkedEntity = (mainEntity: any, parentClause: any, currentClause: any, args: any) => {
    // console.log("linkedEntity parentClause currentClause args", mainEntity, parentClause, currentClause, args)


    const _had = constant("had");


    const _ref1 = reference(currentClause, "json.entityType")

    // console.log("_ref1", _ref1)

    const _entity = mutable(phrase("entityName", _ref1));
    // const _entity = mutable(phrase("entityName", _ref1.data["rdfs:label"], [_ref1]));
    // const _entity = mutable(phrase("entityName", _ref1));

    const _a = phrase("firstLetterVowel", firstLetterIsVowel(_entity.data._text));

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
    console.log("_sentence", _sentence)

    return _sentence;
};

const entityProperty = (mainEntity: any, parentClause: any, currentClause: any, args: any) => {
    // console.log("entityProperty currentClause", currentClause)


    //a function that returns an array of objects that represents a single sentence (i.e. the description one property)
    const _sentence = (currentClause: any): any => {
        // console.log("#####################################################")
        console.log("_sentence currentClause", currentClause)

        const _ref1 = reference(currentClause, "property");
        const _property = mutable(phrase("entityName", _ref1));

        const _a = phrase("firstLetterVowel", firstLetterIsVowel(_property.data._text));

        const _that = constant("that");

        const _partOf = constant("part the sets of values in");


        // old
        // const _isNegated = currentClause.valueNotIn ? true : false;
        // const _was = phrase("was", !_isNegated)

        // applies to scenario 3/4
        const _ref2 = reference(currentClause, "valueNotIn");
        const _was = phrase("was", _ref2.data == undefined, [_ref2])

        // console.log("_ref2", _ref2)



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
    // [0][paths] is the path of a clause to check for properties e.g. 1 and/or/nots, 2 "" (Root), 3 test
    const _paths = _.get(args, "[0][paths]");
    if (_paths) {
        // console.log("_paths", _paths)

        //check each path for a property to translate
        _paths.forEach((_path: string) => {


            // "" = root object
            let _clauses = (_path == "") ? currentClause.json : _.get(currentClause, _path);
            
            console.log("_path", _path)
            console.log("_clause", _clauses)

            //arrays e.g. and/or/nots
            if (_clauses && Array.isArray(_clauses)) {
                // console.log("array of clauses", _clauses)

                _clauses.forEach((_clause: any) => {
                    if (_clause?.property) {
                        _sentences.push(_sentence(_clause))
                    }
                });
                // single properties e.g. at root path of a match clause clause
            } else if (_clauses && _clauses?.property) {
                // console.log("one clause", _clauses)
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



    const _refDirection = reference(currentClause, "json.sort.direction"); //e.g. descending
    const _refOrderBy = reference(currentClause, "json.sort.orderBy");  //e.g. effectivedate
    const _refCount = reference(currentClause, "json.sort.count");  //e.g. 1



    const _andAfter = constant("and after sorting by"); //[descending] [effective date]
    // console.log("_refDirection",_refDirection)
    // console.log("_refOrderBy",_refDirection)
    // console.log("_refCount",_refDirection)
    const _direction = phrase("entityName", _refDirection.data)

    const _propertyName = phrase("entityName", _refOrderBy)

    const _theFirst = constant("the first"); //[1]
    const _count = phrase("entityName", _refCount.data)


    const _phraseValue = isSingular(_refCount.data) ? "singular" : "plural";
    const _items = phrase("entry", _phraseValue, [_refCount]) //entry/entries //record(s)


    const _had = constant("had")


    //  have a generic default for each property's IRI
    // #todo: this map of metadata can be configured by user / added to an entity's definition?
    const _andThe = constant("and the")




    // fix entityType on population
    // ensure arrays are read

    const _hasTransformation = hasTransformation("DESCENDING", _refOrderBy.data["rdfs:range"]["@id"]);
    // console.log("_hasTransformation",_hasTransformation) 
    // console.log("_refOrderBy.data",_refOrderBy.data)

    const _latestHighest = _hasTransformation ? phrase(_refDirection.data, _refOrderBy.data["rdfs:range"]["@id"], [_refDirection, _refOrderBy]) : null; //  e.g. latest 


    let _sentence;
    if (_hasTransformation) {
        // sentence with transformed phrases = and the [latest] [1] entry had
        _sentence = [_andThe, _latestHighest, _count, _items, _had]
        // console.log("1st variant",_sentence )

        //default sentence = and after sorting by [descending] [effective date] the first [1] entry/entries had
    } else {
        _sentence = [_andAfter, _direction, _propertyName, _theFirst, _count, _items, _had]
        // console.log("2nd variant",_sentence )

    }

    console.log("_sentence", _sentence)
    return _sentence;

};


// const LinkedEntityProperty = Template([had, a, entity, with])
// const LinkedEntityCriteria = Template([had, a, entity, with])




// this acts as both "constraints" for the querybuilder and as "templates" for the query viewer
// #todo: calculate mutableCount at runtime
// #todo: add requirements for template matchin
const CascadingTemplates = [
    {
        uuid: `urn:uuid:${v4()}`,

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
                uuid: `urn:uuid:${v4()}`,

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
                                input: ["#currentClause", "json.entityType.@id"],
                                expect: true
                            }
                        ]
                    }
                },
                data: [],
                children: [
                    {
                        uuid: `urn:uuid:${v4()}`,

                        get: { function: "entityProperty", input: [{ paths: ["json", "json.and", "json.or", "json.not"] }] },
                        set: null,
                        meta: {
                            min: 0,
                            max: 1,
                            mutableCount: 0,
                            matchIf: {
                                any: [
                                    {
                                        test: "pathExists",
                                        input: ["#currentClause", "json.property"],
                                        expect: true
                                    },
                                    {
                                        test: "pathExists",
                                        input: ["#currentClause", "json.and"],
                                        expect: true
                                    },

                                ]
                            }
                        },
                        data: [],
                        children: []
                    },
                    {
                        uuid: `urn:uuid:${v4()}`,

                        get: { function: "PropertySort", input: [] },
                        set: null,
                        meta: {
                            min: 0,
                            max: 1,
                            mutableCount: 0,
                            matchIf: {
                                all: [
                                    {
                                        test: "pathExists",
                                        input: ["#currentClause", "json.sort"],
                                        expect: true
                                    },

                                ]
                            }
                        },
                        data: [],
                        children: [
                            {
                                get: { function: "entityProperty", input: [{ paths: ["json.test"] }] },
                                set: null,
                                meta: {
                                    min: 0,
                                    max: 1,
                                    mutableCount: 0,
                                    matchIf: {
                                        any: [
                                            {
                                                test: "pathExists",
                                                input: ["#currentClause", "json.test"],
                                                expect: true
                                            }

                                        ]
                                    }
                                },
                                data: [],
                                children: []
                            },
                        ]
                    },
                ]
            },
            {
                uuid: `urn:uuid:${v4()}`,

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
                                input: ["#currentClause", "json.property.@id", "im:hasProfile"],
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

        console.log("current clausePath 1", clausePath)



        const doesTemplateMatch = (mainEntity: any, profile: any, parentClause: any, currentClause: any, template: any): boolean => {
            //do a depth first recursive function OR queue like below through matchIf
            // check every child in matchIf - if it's an "all" -> use array.every, otherwise use array.some


            // if no criteria are specified
            if (!template.meta.matchIf) return true;

            // in order to support arguments such as #currentClause #profile, #mainEntity, #parentClause use the object vars
            const _vars = {
                "#mainEntity": mainEntity,
                "#profile": profile,
                "#currentClause": currentClause,
                "#parentClause": parentClause,
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

                console.log("_f(..._args) == criteria.expect", _f, _args, criteria.expect)
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
            console.log("template ", template.get.function, " should match: ", _shouldMatch)
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

            console.log("current template", _template.get.function)



            // console.log("current template", _template)

            const _currentClause = _.get(profile, clausePath);

            // console.log("_queue _currentClause", _currentClause)

            console.log("current mainEntity", mainEntity)

            console.log("current profile", profile)

            console.log("current clausePath", clausePath)

            console.log("current _currentClause", _currentClause)


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

                // if there are multiple sentences, push all sentences individually, otherwise push the single sentence
                if (Array.isArray(_data[0])) {
                    _currentCascade.data = _data;

                } else {
                    _currentCascade.data.push(_data)

                }
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