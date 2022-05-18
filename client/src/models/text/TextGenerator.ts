import { IM, RDF, RDFS } from "../../vocabulary"

import { Comparison } from "../sets/Comparison"
import { Filter } from "../sets/Filter"

import { Helpers } from "./Helpers"
const { a, isSingular } = Helpers;

import { Clause } from "./Clause"

import * as pathMap from "./Config/PathMap.json"
import * as wordMap from "./Config/wordMap.json"

import _ from "lodash";



export class TextGenerator {



    private static isEntityPersistent(clause: any): boolean {
        clause = new Clause(clause)
        let { objectValueIn, testValueIn0 } = clause;
        let isPersistent = objectValueIn && testValueIn0 && objectValueIn.some(ref => ref['@id'] == testValueIn0['@id']);
        return isPersistent;
    }


    // public static summarise(clause: Filter | any, currentPath?: string): string {
    //     console.log("current clause raw input: ", clause)

    //     // clause = currentPath && currentPath != "" ? new Clause(_.get(clause, currentPath)) : new Clause(clause)
    //     clause = new Clause(clause)
    //     let { and, or, were, had, property, propertyId, comparison, valueData, valueIn0, valueConcept0, entity, test, orderById, sortLimit, sortDirection, testValueIn0 } = clause;  //these are function functions that are mapped to the properties in the pathMap.json file and return a transformed string
    //     // console.log("clause with getters", clause)

    //     let sentence: any[] = [];

    //     if (test) {
    //         console.log("test ", test)

    //         sentence = [had, a(entity), entity.name]; //default

    //         if (orderById == IM.EFFECTIVE_DATE && sortDirection == "descending" && !and && !or) {
    //             console.log("had persistent [ ]")
    //             sentence = [had, 'persistent', testValueIn0?.name]; //default
    //         }

    //         if (and && and?.length > 0) {
    //             console.log("and ", and)

    //             sentence.push("with: ");
    //             and.forEach((clause: any) => sentence = [...sentence, TextGenerator.summarise(clause, "valueObject.and")])

    //         } else if (or && or?.length > 0) {
    //             console.log("or ", or)

    //             sentence.push("with: ");
    //             or.forEach((clause: any) => sentence = [...sentence, TextGenerator.summarise(clause, "valueObject.or")])
    //         }


    //         //with a value of [] more/less than [18] months before/after [the reference date]


    //     } else if (entity) {
    //         sentence = [had, a(entity), entity?.name, "with a", property?.name, "that is", valueIn0?.name || valueConcept0?.name];
    //     } else if (property) {

    //         // if valueObject exists it's supressed from th esentence  (and vice versa, if something is a direct property of person you need "had") 
    //         had = currentPath && currentPath.startsWith("valueObject") ? null : had;

    //         if (propertyId == IM.IN_RESULT_SET && valueIn0?.name) {
    //             sentence = [were, property.name, valueIn0.name + ","];
    //         } else if (valueIn0) {
    //             sentence = [had, a(property), property.name, "that is in the value-set", valueIn0?.name + "," ];

    //         } else if (valueConcept0) {
    //             sentence = [had, a(property), property.name, "that is", valueConcept0?.name + "," ];

    //         } else if (valueData) {
    //             sentence = [had, a(property), property.name, "that is", comparison, valueData + ","];

    //         }
    //         else if (property?.name) {
    //             sentence = [had, a(property), property.name + ","];
    //         }
    //     }


    //     // return sentenceString;
    //     return sentence.join(" ");
    // }

    

    

    //goes through a hierarchical casdcade of sentences
    public static summarise(clause: Filter | any, currentPath?: string): string {
        console.log("current clause raw input: ", clause)

        clause = new Clause(clause)
        let { and, or, were, had, property, propertyId, comparison, valueData, valueIn0, valueConcept0, entity, test, orderById, sortLimit, count, direction, orderBy, testValueIn, testValueIn0 } = clause;  //these are function functions that are mapped to the properties in the pathMap.json file and return a transformed string
        console.log("clause with getters", clause)


        let sentence: any[] = [];


        // very specific sentences 
        if (test && orderById == IM.EFFECTIVE_DATE && direction == "descending" && !and && !or && TextGenerator.isEntityPersistent(clause.definition)) {
            console.log("### Template used: persistent",)
            return [had, 'persistent', testValueIn0?.name].join(" ");
        }

       
        if (entity) {
            console.log("### Template used: entity",)


            sentence = [had, a(entity), entity.name]; //default sentence

            if (and && and?.length > 0) {
                // console.log("Template used: and ", and)

                sentence.push("with: ");
                and.forEach((childClause: any) => sentence = [...sentence, TextGenerator.summarise(childClause, "valueObject.and")])

            } else if (or && or?.length > 0) {
                // console.log("Template used: or ", or)

                sentence.push("with: ");
                or.forEach((childClause: any) => sentence = [...sentence, TextGenerator.summarise(childClause, "valueObject.or")])
            } else {
                // console.log("Template used: single property ")

                sentence.push("with ");
                sentence = [...sentence, ...TextGenerator.summariseProperty(clause.definition.valueObject, "valueObject")]

            }


            // e.g. "and after sorting by ascending/descending  Property, the first # entry/ies"
            if (sortLimit) {
                // console.log("### Template used: test",)
                let entry = count ? isSingular(count) ? wordMap['entry']['singular'] : wordMap['entry']['plural'] : "entry"; //### todo remove outer ternarny once count is added
                sentence = [...sentence, "and after sorting by", direction, orderBy.name, "the first", count, entry + ""]


                
                if (test && test?.length > 0) {
                    test.forEach((childClause: any) => sentence = [...sentence, TextGenerator.summarise(childClause)])
                }

            }

        } else if (property) {
            sentence = TextGenerator.summariseProperty(clause.definition, currentPath)
        }


        // return sentenceString;
        return sentence.join(" ");
    }

    public static summariseProperty(clause: any, currentPath?: string): any[] {

        clause = new Clause(clause)
        let { and, or, were, had, property, propertyId, valueCompare, valueFunction, valueFunctionId, comparison, valueData, valueIn0, valueNotIn0, valueConcept0, entity, test, orderById, sortLimit, count, sortDirection, testValueIn0, units, firstDate, secondDate } = clause;  //these are function functions that are mapped to the properties in the pathMap.json file and return a transformed string
        let sentence: any[] = [];


        had = currentPath && currentPath.startsWith("valueObject") ? null : had;

        if (propertyId == IM.IN_RESULT_SET && valueIn0?.name) {
            console.log("### Template used: propertyId",)

            sentence = [were, property.name, valueIn0.name + ","];
        }
        else if (valueIn0 || valueNotIn0) {
            console.log("### Template used: valueIn0")
            let is = valueIn0 ? "is" : "is not";
            sentence = [had, a(property), property.name, "that", is, "in the value-set", valueIn0?.name + ","];

        } else if (valueConcept0) {
            console.log("### Template used: valueConcept0")
            sentence = [had, a(property), property.name, "that is", valueConcept0?.name + ","];

        } else if (valueCompare && valueFunctionId == IM.TIME_DIFFERENCE) {
            console.log("### Template used: valueData && valueFunction")

            let beforeAfter = (secondDate.value == "the Reference Date") ? "before" : "after";
            units.value = isSingular(valueData) ? wordMap[units.value]['singular'] : wordMap[units.value]['plural']
            sentence = [had, a(property), property.name, "that is", comparison, valueData, units.value, beforeAfter, secondDate.value + ","]

        } else if (valueCompare) {
            console.log("### Template used: valueCompare")
            sentence = [had, a(property), property.name, "that is", comparison, valueData + ","]

        }
        else if (property?.name) {
            console.log("### Template used: property?.name")
            sentence = [had, a(property), property.name + ","];
        }
        return sentence;
    }

}


