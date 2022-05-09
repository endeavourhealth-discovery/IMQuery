import { IM, RDF, RDFS } from "../../vocabulary"

import { Comparison } from "../sets/Comparison"

import { Helpers } from "./Helpers"
const { a } = Helpers;

import { Clause } from "./Clause"


import _ from "lodash";

export class TextGenerator {




    public static summarise(clause: any): string {



        clause = new Clause(clause);

        let property = clause.path('property.name').value;
        let comparison = Comparison[clause.path('valueCompare.comparison').value];
        let valueCompare = clause.path('valueCompare.valueData').value;
        // let unit = clause.path('valueCompare.function.argument[0].value').value;
        let valueIn = clause.path('valueIn[0].name').value;
        let entity = clause.path('valueObject.entityType.name').value;
        let test = clause.path('valueObject.sortLimit.test').value;
        let testValueIn = clause.path('valueObject.sortLimit.test[0].valueIn[0].name').value;
        // let testValueIn = clause.path('valueObject.sortLimit.test.valueIn[0].rdfs:label').value;



        let sentence: any[] = [];


        if (test) {
            sentence = ["had", testValueIn];

        } else if (entity) {
            sentence = ["had", a(entity), entity, "with a", property, "that is", valueIn,];

        } else if (valueIn) {
            sentence = ["had", a(property), property, "that is", valueIn];

        } else if (valueCompare) {
            sentence = ["had", a(property), property, "that is", comparison, valueCompare ];

        } else if (property) {
            sentence = ["had", a(property), property, "that exists"];

        }

        return sentence.join(" "); 
    }

}