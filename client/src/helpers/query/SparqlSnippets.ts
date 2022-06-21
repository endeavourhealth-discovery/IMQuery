export default class SparqSnippets {
    public static allEntities(iris: string[]): string {
        const iriStr = iris.map(iri => `<${iri}>`).join(',');

        return `
        SELECT ?iri ?predicate ?predicateLabel ?object ?objectLabel
        WHERE   { 	
                ?iri ?predicate ?object.
            optional{?predicate rdfs:label ?predicateLabel.}
            optional{?object rdfs:label ?objectLabel.}
            FILTER (?iri IN (${iriStr}))
        }`;
    }

    public static inferredBundle(iri: string): string {
        return `
        SELECT 
          ?predicate 
          ?predicateLabel 
          ?object 
          ?objectLabel
        WHERE {
                    <${iri}> ?predicate ?object.
          optional  {?predicate rdfs:label ?predicateLabel.}
          optional  {?object rdfs:label ?objectLabel.}
          }`;
    }

    public static create(quad: any): string {

        const { graph, iri, predicate, object } = quad;
        return `
        INSERT DATA { GRAPH <${graph}> {
            <${iri}> ${predicate}  "${object}"
        }}
        `;

    }
    public static update(quad: any): string {
        const { graph, iri, predicate, object } = quad;
        // #todo: make graph-specific
        return `
        DELETE {
            <${iri}> ${predicate}  ?oldValue
        }
        INSERT {
            <${iri}> ${predicate}  "${object}"
        }
        WHERE {
            <${iri}> ${predicate}  ?oldValue
        }
        `;

    }
    public static delete(quad: any): string {
        const { graph, iri, predicate, object } = quad;
        // #todo: make graph-specific
        return `
        DELETE {
            <${iri}> ${predicate}  ?oldValue
        }
        WHERE {
            <${iri}> ${predicate}  ?oldValue
        }
        `;

    }

}