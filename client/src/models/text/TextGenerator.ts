import { IM, RDF, RDFS } from "../../vocabulary"

import { Helpers } from "./Helpers"
const { a, isSingular } = Helpers;

import { Clause } from "./Clause"

import * as pathMap from "./Config/PathMap.json"
import * as wordMap from "./Config/WordMap.json"

import _ from "lodash";



export class TextGenerator {



    private static showConsole = true;



    //goes through a hierarchical casdcade of sentences joined with a comma, e.g. entity, property, and/or, orderLimit, test 
    public static summarise(clause: any, currentPath?: string): string {


        clause = new Clause(clause)
        let { and, or, are, has, property, propertyId, value, valueFunction, valueFunctionId, comparison, valueData, entity, test, orderById, orderLimit, count, direction, orderBy, testSetIn, sortDirection, testSetIn0, units, firstDate, secondDate } = clause;  //these are function functions that are mapped to the properties in the pathMap.json file and return a transformed string
        TextGenerator.showConsole && console.log("clause getters", clause)

        let sentence: any[] = [];

        //short specialised sentences e.g. "unresolved Diabetes"
        if (test && orderById == IM.EFFECTIVE_DATE && direction == "descending" && !and && !or && TextGenerator.isEntityPersistent(clause.definition)) {
            TextGenerator.showConsole && console.log("### Template used: persistent",)

            return [has, 'unresolved', testSetIn0?.name].join(" ");
        }

        //everything else e.g. "A person with an [Entity] with [Property][Value] and [orderLimit]etc"
        else if (entity) {
            TextGenerator.showConsole && console.log("### Template used: entity")


            sentence = [has, a(entity), entity?.name]; //default sentence
            if (and && (and?.length > 0 || or?.length > 0)) {

                sentence.push("with:");
                let andOr = and?.length > 0 ? "and" : "or";
                let children = and?.length > 0 ? and : or;
                children.forEach((childClause: any, childIndex: number) => sentence = [...sentence, "--", ...TextGenerator.summariseProperty(childClause, "match.and", childIndex == children.length - 1)])
            } else {
                sentence.push("with");
                sentence = [...sentence, ...TextGenerator.summariseProperty(clause?.definition?.match, "match")]
            }

            // e.g. "and after sorting by ascending/descending  Property, the first # entry/ies"
            if (orderLimit) {
                TextGenerator.showConsole && console.log("### Template used: orderLimit")

                let entry = wordMap['entry'][isSingular(count).toString()] || wordMap['entry']['default']; //### todo remove outer ternarny once count is added
                sentence = [...sentence, "\n", "and after sorting by", direction, orderBy?.name, "the first", count, entry + ":"]

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


    public static summariseProperty(clause: any, currentPath?: string, isLastItem?: boolean): any[] {
        clause = new Clause(clause)
        let { and, or, are, has, property, propertyId, value, valueFunction, valueFunctionId, comparison, valueData, isConcept0, isNotConcept0, inSet0, notInSet0, entity, test, orderById, orderLimit, count, sortDirection, testSetIn0, units, firstDate, secondDate } = clause;  //these are function functions that are mapped to the properties in the pathMap.json file and return a transformed string
        let sentence: any[] = [];


        has = currentPath && (currentPath.startsWith("match") || currentPath.startsWith("test")) ? null : has;

        let commaOrSemiColon = isLastItem == false ? "," : ";";

        if (propertyId == IM.IN_RESULT_SET && inSet0?.name) {
            TextGenerator.showConsole && console.log("### Template used: IN_RESULT_SET",)

            sentence = [are, property?.name, inSet0?.name];
        }
        else if (inSet0 || notInSet0) {
            TextGenerator.showConsole && console.log("### Template used: inSet0 || notInSet0")

            let is = inSet0 ? "is" : "is not";
            sentence = [has, a(property), property?.name, "that", is, "in the value-set", (inSet0?.name || notInSet0?.name) + commaOrSemiColon];

        } else if (isConcept0 || isNotConcept0) {
            TextGenerator.showConsole && console.log("### Template used: isConcept0 || isNotConcept0")


            sentence = [has, a(property), property?.name, "that is", (isConcept0?.name || isNotConcept0?.name) + commaOrSemiColon];
        } else if (value && valueFunctionId == IM.TIME_DIFFERENCE) {
            TextGenerator.showConsole && console.log("### Template used: valueData && valueFunction")


            let beforeAfter = (secondDate.value == "the Reference Date") ? "before" : "after";
            units.valueData = isSingular(valueData) ? wordMap[units.valueData]['singular'] : wordMap[units.valueData]['plural']
            let compare = comparison;
            let value = valueData
            if (value.substring(0, 1) == "-") value = value.substring(1, value.length)
            if (Helpers.isNegative(valueData) && comparison == "more than or equal to") compare = "less than or equal to";
            if (Helpers.isNegative(valueData) && comparison == "less than or equal to") compare = "more than or equal to";

            sentence = [has, a(property), property?.name, "that is", compare, value, units?.valueData, beforeAfter, secondDate + commaOrSemiColon]

        } else if (value) {
            TextGenerator.showConsole && console.log("### Template used: valueCompare")


            sentence = [has, a(property), property?.name, "that is", comparison, valueData + commaOrSemiColon]
        }
        else if (property?.name) {
            TextGenerator.showConsole && console.log("### Template used: property?.name")


            sentence = [has, a(property), property?.name + commaOrSemiColon];
        }
        return sentence;
    }


    private static isEntityPersistent(clause: any): boolean {
        clause = new Clause(clause)
        TextGenerator.showConsole && console.log("clause getters for isEntityPersistent", clause)


        let { matchInSet, testSetIn0 } = clause;
        let isPersistent = matchInSet && testSetIn0 && matchInSet.some(ref => ref['@id'] == testSetIn0['@id']);
        return isPersistent;
    }


}


