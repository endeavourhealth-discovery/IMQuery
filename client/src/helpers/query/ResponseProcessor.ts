import _ from "lodash";
import QueryUtils from '@/helpers/QueryUtils'

export default class ResponseProcessor {
    public static process(queryTemplate: string, data: any): any {
        if (queryTemplate == "getMembers" && _.get(data, "entities[0].im:definition[0].sh:or")?.length > 0) {
            let definition = _.get(data, "entities[0].im:definition[0]")
            definition["sh:or"] = definition["sh:or"].map((item: any) => {
                const iri = _.get(item, "@id");
                const label = _.get(item, "rdfs:label[0]");

                return {
                    "@id": QueryUtils.toUrl(iri),
                    "name": label,
                }
            })
            return definition;
        }
        else if (queryTemplate == "getSummary") {
            let definition = _.get(data, "entities[0]")
            return definition;
        }
    }
}