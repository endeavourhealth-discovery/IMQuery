import { IM, RDF, RDFS } from "../../vocabulary"

import { Helpers } from "./Helpers"
const { a, isSingular, html, isDateAliasCompared, href } = Helpers;

import { Clause } from "./Clause"

import * as pathMap from "./Config/PathMap.json"
import * as wordMap from "./Config/WordMap.json"

import _ from "lodash";


export class TextGenerator {



    private static showConsole = false;



    //goes through a hierarchical casdcade to match query object model against potential templates (sentence)  
    public static summarise(clause: any, currentPath?: string): any {
        TextGenerator.showConsole && console.log("### summarise() clause: ", clause, " at path: ", currentPath)


        clause = new Clause(clause)
        // let { and, or, are, has, property, propertyId, value, valueFunction, valueFunctionId, comparison, valueData, entity, test, orderById, orderLimit, count, direction, orderBy, testSetIn, sortDirection, testSetIn0, units, firstDate, secondDate } = clause;  //these are function functions that are mapped to the properties in the pathMap.json file and return a transformed string
        let {
            pathTo,
            and,
            or,
            and0PropertyId,
            and0PropertyAlias,
            and0PropertyName,
            and0PropertyInSet0,
            and0OrderById,
            and0Direction,
            and0Count,
            and1NotExist,
            and1PropertyId,
            and1PropertyAlias,
            and1PropertyName,
            and1PropertyInSet0,
            and1OrderById,
            alias,
            isConcept,
            value,
            notExist,
            property,
            id,
            inSet0,
            comparison
        } = clause;

        TextGenerator.showConsole && console.log("Clause with getters: ", clause)

        let text: any[] = [];
        // let html: string; //`<p>{{innerHTML}}</p>`


        //templates (can be abstracted away / stored elsewhere as clause.findMatchingTemplates() and it finds you a list of matching templates for each clause.
        // const entryFollowedByEntry = isTemplateMatch("im:QT_EntryFollowedByEntry", and && Array.isArray(and) && and?.length > 1 && isDateAliasCompared(and))
        const entryFollowedByEntry = and && Array.isArray(and) && and?.length > 1 && isDateAliasCompared(and)


        //cascade
        if (pathTo) { //linked datamodel entities
            if (entryFollowedByEntry) {
                TextGenerator.showConsole && console.log("### Template used: entryFollowedByEntry", entryFollowedByEntry)
                text = TextGenerator.summariseClause(clause.definition, "entryFollowedByEntry");
            } else {
                TextGenerator.showConsole && console.log("### Template used: any clause", clause.definition)

                text = TextGenerator.summariseClause(clause.definition);
            }
        }
        else if (alias) { //direct properties

            TextGenerator.showConsole && console.log("### Template used: alias ")
            text = TextGenerator.template(clause.definition);

        }



        //results
        TextGenerator.showConsole && console.log("###Text sentence array is ", text)
        let result = {
            text: text.filter(t => t && t != "").join(" "),
            // html: html,
        }
        return result;
    }


    //creates a sentence by matching translating properties in a specific order
    public static summariseClause(clause: any, templateName?: string): any {
        TextGenerator.showConsole && console.log("summariseClause: ", clause)

        let text: any[] = [];


        clause = new Clause(clause);
        const { pathTo, and, or, notExist, orderLimit, orderById, direction, count, isConcept, property, id, propertyName, inSet, notInSet, inSet0, value, comparison, valueData, functionArg1 } = clause;


        if (templateName == "entryFollowedByEntry") {

            text = [
                ...TextGenerator.template(and[0], "orderLimit"),
                ...TextGenerator.template(and[0].property[0], "inSet", ["of"]),
                ...TextGenerator.template(and[1].property[0], "followedBy", and[1]?.notExist),
                ...TextGenerator.template(and[1], "orderLimit"),
                ...TextGenerator.template(and[1].property[0], "inSet", ["of"]),
            ]

        } else {
            // summarise any clause in a specific order (oderLimit, then properties: concept, then value, then date, then other properties)
            // text = TextGenerator.template(and[0], "orderLimit");

            //todo: improve concept matching / create external function


            let mustBe = clause.definition?.testProperty ? "must be" : "";

            text = [
                ...TextGenerator.template(clause.definition, "orderLimit"),
                ...TextGenerator.summarisePropertiesInOrder(clause.definition.property, ["of"]),
                mustBe,
                ...TextGenerator.summarisePropertiesInOrder(clause.definition?.testProperty, ["must be"]),
                // ...TextGenerator.template(clause.definition.property[0], conceptTemplate)
                // ...TextGenerator.template(clause.definition.property[0], conceptTemplate)
                // ...TextGenerator.template(and[1].property[0], "followedBy", and[1]?.notExist),
                // ...TextGenerator.template(and[1], "orderLimit"),
                // ...TextGenerator.template(and[1].property[0], "ofInSet"),
            ]

        }
        return text;

    }

    public static summarisePropertiesInOrder(properties: any, variants?: any[]): any {
        let _properties = _.cloneDeep(properties);

        // console.log("templatePrefix", templatePrefix)

        let propertyOrder: any[] = [
            { propertyIri: IM.CONCEPT },
            { propertyIri: IM.CODE, },
            { propertyIri: IM.VALUE },
            { propertyIri: IM.EFFECTIVE_DATE },
            { propertyIri: "", }
        ];

        let text: any[] = [];

        if (Array.isArray(_properties) && _properties.length > 0) {

            while (_properties.length > 0) {
                propertyOrder.forEach((propertyOrderItem: any) => {
                    // propertyIri specified in PropertyOrder or any property if iri is emppty string
                    let property;

                    if (propertyOrderItem?.propertyIri == "") {
                        property = _properties.pop();
                    } else {
                        property = _properties.find((p: any, i: number) => {
                            if (p['@id'] == propertyOrderItem?.propertyIri) {
                                _properties.splice(i, 1);
                                return true;
                            }
                        })
                    }

                    if (property) {
                        let conceptKeys = ["isConcept", "inSet", "notInSet"];
                        let conceptKey = Object.keys(property).find((key: string) => conceptKeys.includes(key));
                        // let templateName = conceptKey ? propertyOrderItem.templatePrefix + conceptKey + propertyOrderItem.templateSuffix : "";

                        let and = variants && variants.includes("must be") && text.length > 0 ? "and" : "";


                        text = [...text, and, ...TextGenerator.template(property, conceptKey, variants)]
                    }



                    // text = conceptTemplate 
                    // ? [...text, ...TextGenerator.template(property, conceptTemplate)]
                    // : [...text, ...TextGenerator.template(property, templatePrefix, templateSuffix)]
                })
                // return TextGenerator.summarise(clause)
            }
        }

        return text.length > 0 ? text : "";
    }


    public static template(clause: any, templateName?: string, variants?: any[], parentNotExist?: boolean, isPlural?: boolean): any {
        TextGenerator.showConsole && console.log("###summariseProperty() - template", templateName, " - Clause ", clause)


        let text: any[] = [];


        const propertyClause = new Clause(clause) as any;
        const { notExist, orderLimit, orderById, direction, count, isConcept, property, functionId, id, propertyName, inSet, notInSet, inSet0, value, comparison, valueData, functionArg1, units, firstDate, secondDate } = propertyClause;


        //properted of linked entities
        if (templateName == "inSet") {
            TextGenerator.showConsole && console.log("### TemplateName inSet")

            let isOf = variants && variants.includes("of") ? "of" : "";
            let names = inSet?.length > 1 ? `${inSet[0].name} or ${inSet[1].name}` : inSet[0].name;
            text = [isOf, names];

        } else if (templateName == "isConcept") {
            TextGenerator.showConsole && console.log("### TemplateName isConcept")

            let isOf = variants && variants.includes("of") ? "of" : "";
            let names = isConcept?.length > 1 ? `${isConcept[0].name} or ${isConcept[1].name}` : isConcept[0].name;
            text = [isOf, names];

        }
        else if (templateName == "followedBy") {
            TextGenerator.showConsole && console.log("### TemplateName followedBy")
            let is = parentNotExist || notInSet ? "is not" : "is";
            text = [is, "followed by"];


            //direct properties of main entity
        } else if (templateName == "orderLimit") {
            //any/latest/earliest/highest/lowest
            let anyLatestHighest;

            if (orderById == IM.EFFECTIVE_DATE && direction == "descending") {
                anyLatestHighest = "latest";
            } else if (orderById == IM.EFFECTIVE_DATE && direction == "ascending") {
                anyLatestHighest = "earliest";
            } else {
                // anyLatestHighest = notExist ? "no" : "any";
                anyLatestHighest = "any";
            }

            // anyLatestHighest = anyLatestHighest != "no" && notExist ? "no" + anyLatestHighest : anyLatestHighest;



            //latest [quantity] entry/entries. If quantity = 1 it is silenced 
            let quantity = count > 1 ? count : "";
            let entry = count > 1 ? "entries" : "entry";

            text = [anyLatestHighest, quantity, entry];


        } else if (isConcept) {
            TextGenerator.showConsole && console.log("### Template isConcept")

            let is = notExist ? "is not" : "is";
            let andSubtypes = isConcept[0].includeSubtypes ? "(or its subtypes)" : "";
            text = [propertyName, is, isConcept[0].name, andSubtypes];


        } else if (inSet || notInSet) {
            TextGenerator.showConsole && console.log("### Template inSet")

            let is = notExist || notInSet ? "is not" : "is";
            text = [propertyName, is, inSet[0].name]


        } else if (value && functionArg1) {
            TextGenerator.showConsole && console.log("### Template value")

            let is = notExist ? "is not" : "is";
            let units = isSingular(valueData) ? wordMap[functionArg1]['singular'] : wordMap[functionArg1]['plural']
            text = [propertyName, is, comparison, valueData, units]

        } else if (value && functionId == IM.TIME_DIFFERENCE) {
            TextGenerator.showConsole && console.log("### Template TIME_DIFFERENCE")

            let is = notExist ? "is not" : "is";



            let isSecondDateThis = secondDate.value == "$this"
            let beforeAfter = (secondDate.value == "the Reference Date" || Helpers.isNegative(valueData)) ? "after" : "before";
            units.valueData = isSingular(valueData) ? wordMap[units.valueData]['singular'] : wordMap[units.valueData]['plural']
            let _comparison = comparison;
            let _valueData = valueData
            let _date;


            if (_valueData.substring(0, 1) == "-") _valueData = _valueData.substring(1, _valueData.length)

            const flipComparison = (comparison: string) => {
                switch (comparison) {
                    case "more than or equal to":
                        return "less than or equal to";
                    case "less than or equal to":
                        return "more than or equal to";
                    case "more than":
                        return "less than";
                    case "less than":
                        return "more than";
                    default:
                        return comparison;
                }
            }

            // if (isSecondDateThis) _comparison = flipComparison(_comparison);;
            // if (Helpers.isNegative(_valueData)) _comparison = flipComparison(_comparison);;
            // if (Helpers.isNegative(_valueData) && comparison == "less than or equal to") _comparison = "more than or equal to";

            text = ["in the", _valueData, units?.valueData, beforeAfter, "the Reference Date"]
        }

        else if (value) {
            TextGenerator.showConsole && console.log("### Template value")

            let is = notExist ? "is not" : "is";
            is = variants && variants.includes("must be") ? "" : is;
            text = [is, comparison, valueData]
        }

        return text

    }
}