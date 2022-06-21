import TTEntity from '../../models/tripletree/TTEntity';
import { OntologyUtils } from "../../helpers/query/"
import { Keyspaces } from 'aws-sdk';

export default class ManipulationUtils {

    /**
    * A callback function for Array.filter() that filters out duplicate items in an array e.g. use as Array.filter(onlyUnique);
    * @name onlyUnique
    **/
    public static onlyUnique(element: any, index: any, array: any): boolean {
        return array.indexOf(element) === index;
    }

    public static isTTIriRef(element: any): boolean {
        const keys = Object.keys(element);
        const excludedKeys = ["and", "or", "property"]; 
        const isExcludedKeysPresent = !keys.some(key => excludedKeys.includes(key));
        return keys.includes("@id") && isExcludedKeysPresent;
    }


    public static excludedPaths(clause: any): boolean {
        const excludedPathProperties = ["test", "match"]
        return !excludedPathProperties.some(path => clause.path.includes(path));
    }

    // from a graphDB query result with columns (predicate, object, predicateLabel, objectLabel) it generates TTEntity.
    public static entitiesFromPredicates(queryResult: any): any {
        let entity;
        const visitedIris = new Set();
        const entities: any[] = [];

        // populates response with queryResults
        queryResult.forEach((item, index) => {
            const iri = item.iri.value;

            //adds an entity to return value if all their predicates are populated.
            if (!visitedIris.has(iri)) {
                visitedIris.size > 0 ? entities.push(entity) : null;
                visitedIris.add(iri);
                entity = new TTEntity(iri);
            }

            const predicate = item.predicate.value || item?.predicate;
            const object = item?.object?.value || item?.object;
            const predicateLabel = item?.predicateLabel;
            const objectLabel = item?.objectLabel;
            const prefixedPredicate = OntologyUtils.toPrefix(predicate)

            if (Array.isArray(entity[prefixedPredicate])) {
                //TTIriRef e.g. rdf:type
                entity[prefixedPredicate].push(
                    {
                        "@id": object,
                        "name": objectLabel
                    }
                );
            } else {
                //All Else e.g. rdfs:comment
                entity[prefixedPredicate] = object;
            }


            //add final entity in the query result ot the return value
            if (index == queryResult.length - 1) {
                entities.push(entity)
            }
        })

        return entities;


    }

}