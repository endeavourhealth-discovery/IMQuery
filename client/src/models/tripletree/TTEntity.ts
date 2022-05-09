import { v4 } from "uuid";
import TTNode from "./TTNode"

import { IM, OWL, RDF, RDFS, SHACL } from "../../vocabulary"


export default class TTEntity extends TTNode {



    public "@id": string;
    public "rdfs:label": string;
    public "rdfs:comment": string;
    public "rdf:type": any[] = [];
    public "im:isContainedIn": any[] = [];
    public "im:definition": string;


    get iri(): string {
        return this.get(IM.IRI);
    }
    set iri(value: string) {
        this.set(IM.IRI, value);
    }

    get name(): string {
        return this.get(RDFS.LABEL);
    }
    set name(value: string) {
        this.set(RDFS.LABEL, value);
    }


    get description(): string {
        return this.get(RDFS.COMMENT);
    }
    set description(value: string) {
        this.set(RDFS.COMMENT, value);
    }

    get type(): any[] {
        const obj = this.get(RDF.TYPE);
        return obj ? obj : [];
    }
    set type(value: any[]) {

        if (value.length == 0) {
            this.set(RDF.TYPE);
        }
        else {
            this.set(RDF.TYPE, value);
        }
    }
    get isContainedIn(): any[] {
        const obj = this.get(IM.IS_CONTAINED_IN);
        return obj ? obj : [];
    }
    set isContainedIn(value: any[]) {

        if (value.length == 0) {
            this.set(IM.IS_CONTAINED_IN);
        }
        else {
            this.set(IM.IS_CONTAINED_IN, value);
        }
    }
    get definition(): string {
        return this.get(IM.DEFINITION);
    }

    set definition(value: string) {
        this.set(IM.DEFINITION, value);
    }


    constructor(iri?: string, name?: string) {
        super()
        iri ? this[IM.IRI] = iri : null;
        name ? this[RDFS.LABEL] = name : null;
    }


    asEntity(): any {
        let obj;
        this.predicates.forEach((predicate, value) => {
            obj[predicate] = value;
        })
        return obj;
    }

    public toJSON(): any {
        let obj = this;
        this.predicates.forEach((value, predicate) => obj[predicate] = value);
        const { predicates: _, ...props } = obj;  //"predicates"  IS ignored upon serialisation to JSON
        return props;
    }

    fromJSON(json: any): void {
        const obj = typeof (json) == "string" ? JSON.parse(json) : json;
        Object.keys(obj).forEach(key => {
            this.set(key, obj[key]);
        })
    }

}
