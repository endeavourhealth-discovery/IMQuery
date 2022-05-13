import {Namespaces, Prefixes} from "../../models/constants"


export default class OntologyUtils {


    public static toPrefix(iri: string): string {
        const namespace = iri.split("#")[0] + "#";
        const predicate = iri.split("#")[1];
        const prefix = Prefixes[namespace];
        
        return `${prefix}:${predicate}`;
    }


}