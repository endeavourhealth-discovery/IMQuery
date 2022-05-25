import { IM, RDF, RDFS } from "../../vocabulary"

import { Comparison } from "../sets/Comparison"

import { Helpers } from "./Helpers"
const { a, isSingular } = Helpers;

import { Clause } from "./Clause"

import * as pathMap from "./Config/PathMap.json"
import * as wordMap from "./Config/WordMap.json"

import _ from "lodash";



export class TextGenerator {



    private static showConsole = true;


    //goes through a hierarchical casdcade of sentences joined with a comma, e.g. entity, property, and/or, sortLimit, test 
    public static summarise(clause: any, currentPath?: string): string {


       TextGenerator.showConsole && console.log("current clause raw input: ", clause)

        clause = new Clause(clause)
        let { and, or, are, have, property, propertyId, valueCompare, valueFunction, valueFunctionId, comparison, valueData, valueIn0, valueNotIn0, valueConcept0, entity, test, orderById, sortLimit, count, direction, orderBy, testValueIn, sortDirection, testValueIn0, units, firstDate, secondDate } = clause;  //these are function functions that are mapped to the properties in the pathMap.json file and return a transformed string
        //TextGenerator.showConsole && console.log("clause with getters", clause)

        let sentence: any[] = [];

        //fetch rdf:type, rdfs:range, etc to turn "descending" "effective date" into  "descending" "im:DateTime". Then add "latest"
        // very specific sentences 
        if (test && orderById == IM.EFFECTIVE_DATE && direction == "descending" && !and && !or && TextGenerator.isEntityPersistent(clause.definition)) {
           TextGenerator.showConsole && console.log("### Template used: persistent",)
            return [have, 'unresolved', testValueIn0?.name].join(" ");
        }
        // else if (valueCompare && valueFunctionId == IM.TIME_DIFFERENCE && Helpers.isNegative(valueData) && propertyId == IM.EFFECTIVE_DATE) {
        //    TextGenerator.showConsole && console.log("### Template used:")

        //     let beforeAfter = (secondDate.value == "the Reference Date") ? "befores" : "after";
        //     units.value = isSingular(valueData) ? wordMap[units.value]['singular'] : wordMap[units.value]['plural']
        //     sentence = [have, a(property), property.name, "that is", comparison, valueData, units.value, beforeAfter, secondDate.value + ","]
        // }
        // else if (test && orderById == IM.EFFECTIVE_DATE && direction == "descending" && entity && entity['@id'] == IM.OBSERVATION) {
        //    TextGenerator.showConsole && console.log("### Template used: latest",)
        //     let latest = direction == "descending" ? "latest" : "earliest";
        //     return [have, testValueIn0?.name, "where the", latest].join(" ")
        // }
        else if (entity) {
           TextGenerator.showConsole && console.log("### Template used: entity")


            sentence = [have, a(entity), entity.name]; //default sentence
            if (and && (and?.length > 0 || or?.length > 0)) {
                //TextGenerator.showConsole && console.log("Template used: and ", and)

                sentence.push("with:");
                let andOr = and?.length > 0 ? "and" : "or";
                let children = and?.length > 0 ? and : or;
                children.forEach((childClause: any, childIndex: number) => sentence = [...sentence, "--", ...TextGenerator.summariseProperty(childClause, "valueObject.and", childIndex == children.length - 1)])

                // and.forEach((childClause: any) => sentence = [...sentence, ...TextGenerator.summariseProperty(childClause, "valueObject.and")])
            } else {
                //TextGenerator.showConsole && console.log("Template used: single property ")

                sentence.push("with");
                sentence = [...sentence, ...TextGenerator.summariseProperty(clause.definition.valueObject, "valueObject"), ""]
            }


            // e.g. "and after sorting by ascending/descending  Property, the first # entry/ies"
            if (sortLimit) {
               TextGenerator.showConsole && console.log("### Template used: sortLimit")
                let entry = wordMap['entry'][isSingular(count).toString()] || wordMap['entry']['default']; //### todo remove outer ternarny once count is added
                sentence = [...sentence, "\n", "and after sorting by", direction, orderBy.name, "the first", count, entry + ":"]



                if (test && test?.length > 0 && (test[0]?.and?.length > 0 || test[0]?.or?.length > 0)) {
                   TextGenerator.showConsole && console.log("### Template used: test forEach")

                    let andOr = test[0]?.and?.length > 0 ? "and" : "or";
                    test[0][andOr].forEach((childClause: any, childIndex: number) => sentence = [...sentence, "--", ...TextGenerator.summariseProperty(childClause, `test[0].${andOr}`, childIndex == test[0][andOr].length - 1)])
                }
                else if (test && test?.length > 0) {
                   TextGenerator.showConsole && console.log("### Template used: test forEach")

                    test.forEach((childClause: any) => sentence = [...sentence, TextGenerator.summarise(childClause, "test")])
                }

            }

        }
        else if (property) {
            sentence = TextGenerator.summariseProperty(clause.definition, currentPath)
        }


        sentence = sentence.filter(item => item) //removes null
        return sentence.join(" ");
    }


    public static summariseProperty(clause: any, currentPath?: string, lastItem?: boolean): any[] {

        clause = new Clause(clause)
        let { and, or, are, have, property, propertyId, valueCompare, valueFunction, valueFunctionId, comparison, valueData, valueIn0, valueNotIn0, valueConcept0, entity, test, orderById, sortLimit, count, sortDirection, testValueIn0, units, firstDate, secondDate } = clause;  //these are function functions that are mapped to the properties in the pathMap.json file and return a transformed string
        let sentence: any[] = [];


        have = currentPath && (currentPath.startsWith("valueObject") || currentPath.startsWith("test")) ? null : have;

        let commaOrSemiColon = lastItem == false ? "," : ";";

        if (propertyId == IM.IN_RESULT_SET && valueIn0?.name) {
           TextGenerator.showConsole && console.log("### Template used: IN_RESULT_SET",)

            sentence = [are, property.name, valueIn0.name];
        }
        else if (valueIn0 || valueNotIn0) {
           TextGenerator.showConsole && console.log("### Template used: valueIn0")
            let is = valueIn0 ? "is" : "is not";
            sentence = [have, a(property), property.name, "that", is, "in the value-set", valueIn0?.name + commaOrSemiColon];

        } else if (valueConcept0) {
           TextGenerator.showConsole && console.log("### Template used: valueConcept0")
            sentence = [have, a(property), property.name, "that is", valueConcept0?.name + commaOrSemiColon];


        } else if (valueCompare && valueFunctionId == IM.TIME_DIFFERENCE) {
           TextGenerator.showConsole && console.log("### Template used: valueData && valueFunction")

            let beforeAfter = (secondDate.value == "the Reference Date") ? "before" : "after";
            units.value = isSingular(valueData) ? wordMap[units.value]['singular'] : wordMap[units.value]['plural']

            let compare = comparison;
            let value = valueData
            if (value.substring(0, 1) == "-") value = value.substring(1, value.length)
            if (Helpers.isNegative(valueData) && comparison == "more than or equal to") compare = "less than or equal to";
            if (Helpers.isNegative(valueData) && comparison == "less than or equal to") compare = "more than or equal to";

            sentence = [have, a(property), property.name, "that is", compare, value, units.value, beforeAfter, secondDate.value + commaOrSemiColon]

        } else if (valueCompare) {
           TextGenerator.showConsole && console.log("### Template used: valueCompare")
            sentence = [have, a(property), property.name, "that is", comparison, valueData + commaOrSemiColon]

        }
        else if (property?.name) {
           TextGenerator.showConsole && console.log("### Template used: property?.name")
            sentence = [have, a(property), property.name + commaOrSemiColon];
        }
        return sentence;
    }


    private static isEntityPersistent(clause: any): boolean {
        clause = new Clause(clause)
        let { objectValueIn, testValueIn0 } = clause;
        let isPersistent = objectValueIn && testValueIn0 && objectValueIn.some(ref => ref['@id'] == testValueIn0['@id']);
        return isPersistent;
    }


}


