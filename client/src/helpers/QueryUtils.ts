import prettier from "prettier/standalone";
import prettierBabylon from "prettier/parser-babylon";
import _ from "lodash";
import { v4 } from "uuid";
import jp from 'jsonpath';

export default class QueryUtils {

    public static debug = false;

    // https://stackoverflow.com/questions/15502629/regex-for-mustache-style-double-braces
    public static findPlaceholders(text: string): any {

        // eslint-disable-next-line
        const _regExPlaceholders = /{{\s*[\S\.]+\s*}}/g;
        // eslint-disable-next-line
        const _regExPlaceholderIri = /[\w+\:\w]+/;


        return text.match(_regExPlaceholders)
            .map(function (x) { return x.match(_regExPlaceholderIri)[0]; });
    }


    public static toIri(url: string) {

        const _arr = url.split("/")
        const _iri = _arr[_arr.length - 1].replace("#", ":");
        return _iri;


    }


    public static prefixes = [
        {
            rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        }, {
            im: "http://endhealth.info/im#",
        }, {
            imq: "http://endhealth.info/imq#",
        }, {
            bc: "http://endhealth.info/bc#",
        }, {
            rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        }, {
            emis: "http://endhealth.info/emis#",
        }, {
            sn: "http://snomed.info/sct#",
        }, {
            ods: "http://endhealth.info/ods#",
        }, {
            owl: "http://www.w3.org/2002/07/owl#",
        }, {
            prov: "http://www.w3.org/ns/prov#",
        }, {
            tpp: "http://endhealth.info/tpp#",
        }, {
            xml: "http://www.w3.org/XML/1998/namespace#",
        }, {
            sh: "http://www.w3.org/ns/shacl#",
        }, {
            opcs4: "http://endhealth.info/opcs4#",
        }, {
            vis: "http://endhealth.info/vision#",
        }, {
            orole: "https://directory.spineservices.nhs.uk/STU3/CodeSystem/ODSAPI-OrganizationRole-1#",
        }, {
            xsd: "http://www.w3.org/2001/XMLSchema#"
        }
    ];

    public static namespaces = [
        {
            "http://www.w3.org/1999/02/22-rdf-syntax-ns#": "rdf",
        }, {
            "http://endhealth.info/im#": "im",
        }, {
            "http://endhealth.info/imq#": "imq",
        }, {
            "http://endhealth.info/bc#": "bc",
        }, {
            "http://www.w3.org/2000/01/rdf-schema#": "rdfs",
        }, {
            "http://endhealth.info/emis#": "emis",
        }, {
            "http://snomed.info/sct#": "sn",
        }, {
            "http://endhealth.info/ods#": "ods",
        }, {
            "http://www.w3.org/2002/07/owl#": "owl",
        }, {
            "http://www.w3.org/ns/prov#": "prov",
        }, {
            "http://endhealth.info/tpp#": "tpp",
        }, {
            "http://www.w3.org/XML/1998/namespace#": "xml",
        }, {
            "http://www.w3.org/ns/shacl#": "sh",
        }, {
            "http://endhealth.info/opcs4#": "opcs4",
        }, {
            "http://endhealth.info/vision#": "vis",
        }, {
            "https://directory.spineservices.nhs.uk/STU3/CodeSystem/ODSAPI-OrganizationRole-1#": "orole",
        }, {
            "http://www.w3.org/2001/XMLSchema#": "xsd",
        }
    ];

    public static toUrl(iri: string) {

        //untested after changes
        const _iri = iri.replace(":", "#");
        const _contextKey = _iri.split("#")[0];
        const _iriKey = _iri.split("#")[1];
        const _url = QueryUtils.prefixes.filter(prefix => prefix[_contextKey] !== undefined)[0] + _iriKey;
        return _url;

    }


    // public static populateRangeTypes(entity: any): any {
    //     //populate name and entityType in JSON definition

    //     if (entity["im:definition"]) {
    //         const _json = JSON.parse(entity["im:definition"]);

    //         QueryUtils.debug && console.log("JSON definition", _json)
    //         let _entityReferences = jp.paths(_json, `$..[?(@.@id)]`);
    //         //filters out paths that are UUIDs for clauses (and not UUID's of entities);
    //         _entityReferences = _entityReferences.filter((reference: any) => reference[reference.length - 1] != "id");

    //         // populates each path with entity from ontology
    //         _entityReferences = _entityReferences.map((reference: any) => {

    //             const jpPath = jp.stringify(reference);
    //             const _path = jp.stringify(reference).substring(2);
    //             let _entityIri = _.get(_json, _path)["@id"];


    //             // changes http//endhealth.info/im#effectiveDate to im:effectiveDate (as an example)
    //             if (_entityIri.substring(0, 4) == "http") {
    //                 _entityIri = QueryUtils.toIri(_entityIri);
    //             }


    //             // console.log("_entityIri", _entityIri)
    //             const _entity = state.ontology.entities.byIri(_entityIri)
    //             // console.log("_entity", _entity)


    //             let _shortEntity;
    //             if (_entity && _entity.length > 0) {
    //                 // console.log(_entity)
    //                 _shortEntity = {
    //                     "@id": _entity[0]["@id"],
    //                     "rdf:type": _entity[0]["rdf:type"],
    //                     "rdfs:label": _entity[0]["rdfs:label"],
    //                     "rdfs:comment": _entity[0]["rdfs:comment"]
    //                 };


    //                 //populate range for each property based on the datamodel (entityType inside the same clause)
    //                 const _propertyTypes = ["owl:ObjectProperty", "owl:DatatypeProperty"];
    //                 // console.log("_shortEntity", _shortEntity)
    //                 const _isObjectProperty = _shortEntity["rdf:type"].some((rdfType: any) => _propertyTypes.includes(rdfType["@id"]));
    //                 if (_isObjectProperty) {
    //                     // console.log("reference", reference)
    //                     // console.log("_path", _path)


    //                     //get datamodel entity
    //                     const _pathQueue = _.cloneDeep(reference);
    //                     // console.log("_pathQueue", jp.stringify(_pathQueue))



    //                     //finds nearest parent that is datamodel entity (i.e. has entityType json path)
    //                     let _parentIri = "";
    //                     while (_pathQueue.length > 1) {

    //                         const _valueAtPath = jp.query(_json, jp.stringify(_pathQueue))[0];
    //                         // console.log("_valueAtPath", _valueAtPath)

    //                         if (_valueAtPath["entityType"]) {
    //                             // console.log("entityType", _valueAtPath)
    //                             // console.log("entityType id", _valueAtPath["entityType"]["@id"])

    //                             _parentIri = _valueAtPath["entityType"]["@id"];
    //                             // console.log("_parentIri", _parentIri)


    //                             if (_parentIri.substring(0, 4) == "http") {
    //                                 _parentIri = QueryUtils.toIri(_parentIri);
    //                             }
    //                             break;
    //                         }

    //                         _pathQueue.pop();
    //                     }

    //                     // if datamodel entity found, find the the range 
    //                     if (_parentIri != "") {



    //                         const _datamodelEntity = state.ontology.entities.byIri(_parentIri);

    //                         // console.log("_parentIri", _parentIri)
    //                         // console.log("_datamodelEntity", _datamodelEntity)

    //                         // find the properties range

    //                         if (_datamodelEntity.length) {
    //                             const _rangeProperty = _datamodelEntity[0]["sh:property"].filter((_property: any) => {
    //                                 return _property["sh:path"].some((path: any) => {
    //                                     const _isMatch = path["@id"] == _shortEntity["@id"]
    //                                     // console.log("_match", _property)
    //                                     return _isMatch;
    //                                 })
    //                             });

    //                             if (_rangeProperty.length > 0) {

    //                                 _shortEntity["rdfs:range"] = _.get(_rangeProperty, "0.sh:datatype.0");
    //                             }

    //                         }

    //                     }
    //                 }


    //             }



    //             return {
    //                 uuid: `urn:uuid:${v4()}`,
    //                 jpPath: jpPath,
    //                 path: _path,
    //                 iri: _entityIri,
    //                 entityData: _shortEntity, //state.ontology.entities.byIri(entityIri)
    //                 pathArray: reference,
    //             }
    //         })


    //         //populates definition with entities
    //         _entityReferences.forEach((reference: any) => {

    //             // console.log("reference.path", reference.path)
    //             // console.log("reference.path", referenc?e.path.substring(reference.path.length - 5, reference.path.length - 2))
    //             // if (reference.path.substring(-10, -2) )
    //             if (reference.entityData != undefined) _.set(_json, reference.path, reference.entityData);
    //         });

    //         // console.log("1", JSON.stringify(_json) )
    //         entities[index]["im:definition"] = JSON.stringify(_json);

    //         // console.log("_entityReferences", _entityReferences)

    //         QueryUtils.debug && console.log("JSON definition (populated)", _json)

    //         //for debugging
    //         let _entitiesWithoutData = _entityReferences.filter((entity: any) => entity.entityData == undefined);

    //         _entitiesWithoutData = _entitiesWithoutData.map((entity: any) => {
    //             return {
    //                 "@id": entity["iri"],
    //                 "rdf:type": [],
    //                 "rdfs:label": "",
    //                 "rdfs:comment": ""
    //             }
    //         })

    //         //removes duplicates
    //         const unique = new Set()
    //         _entityReferences = _entityReferences.filter((item: any) => {
    //             if (unique.has(item.iri)) {
    //                 return false;
    //             } else {
    //                 unique.add(item.iri)
    //                 return true;
    //             }
    //         });



    //         entities[index]["entityReferences"] = _entityReferences;
    //         entities[index]["entitiesWithoutData"] = _entitiesWithoutData;

    //         // console.log("entity", entity)
    //         QueryUtils.debug && console.log("Entities References", _entityReferences)
    //         QueryUtils.debug && console.log("Entities without data", _entitiesWithoutData)


    //     }

    // }


    public static toPrefixedIri(entity: any): any {

        let _oldEntity = entity;

        Object.keys(entity).forEach((key: any) => {

            const _namespaces = QueryUtils.namespaces.filter(namespace => {
                const _nameSpaceURL = Object.keys(namespace)[0]
                return key.includes(_nameSpaceURL)
            });

            if (_namespaces.length > 0) {

                const _namespace = _namespaces[0];
                // console.log(_namespace)

                const _oldKey = key;
                // console.log("_oldKey", _oldKey)

                const _nameSpaceURL = Object.keys(_namespace)[0];
                const _nameSpacePrefix = Object.values(_namespace)[0];
                const _newKey = _oldKey.replace(_nameSpaceURL, _nameSpacePrefix + ":");
                // console.log("_nameSpaceURL", _nameSpaceURL)
                // console.log("_nameSpacePrefix", _nameSpacePrefix)
                // console.log("_newKey", _newKey)
                _oldEntity = QueryUtils.replaceObjectKey(_oldEntity, _oldKey, _newKey);

            }
        })

        return _oldEntity;
    }

    public static replaceObjectKey(object: any, oldKey: string, newKey: string): any {
        if (oldKey !== newKey) {
            Object.defineProperty(object, newKey,
                Object.getOwnPropertyDescriptor(object, oldKey));
            delete object[oldKey];
        }
        return object;
    }


    //generates name from full iri, prefixed iri or returns originalstring (i.e. iri);
    public static toName = (iri: string) => {
        const _iri = iri.substring(0, 3);
        if (_iri == "http") {
            const _iriArray = iri.split("/");
            return _iriArray[_iriArray.length - 1]
                .split("#")[1]
                .match(/([A-Z]?[^A-Z]*)/g)
                .slice(0, -1)
                .join(" ");
        } else if (iri.split(":").length == 2) {
            return iri
                .split(":")[1]
                .match(/([A-Z]?[^A-Z]*)/g)
                .slice(0, -1)
                .join(" ");
        } else {
            return iri;
        }
    };



    // prettify JSON
    public static prettifyJSON(value: string): string {
        const _json = prettier.format(value, {
            parser: "json",
            plugins: [prettierBabylon],
        }) as string;
        return _json;

    }

    //replaces all ":"" and "@" with __ and ___ respectively to enable JMESPath and JsonPath tools
    public static replaceKeys(object: any): any {

        // deep nested replacement of keys if they are string
        const replaceKeysDeep = (o: any) => {
            return _.transform(o, function (result: any, value: any, key: any) {
                const _currentKey = typeof (key) == "string" ? QueryUtils.replaceChars(key) : key;
                result[_currentKey] = _.isObject(value) ? replaceKeysDeep(value) : value; // if the key is an object run it through the inner function - replaceKeys
            });
        }
        return replaceKeysDeep(object);
    }


    //characters and their replacements
    private static _characterMap: any = {
        ':': "__c__",
        '@': "__a__",
    };


    //replaces all keys in an object using  key-value pairs in character map
    public static replaceChars = (text: string) => {
        let _text = text;
        Object.keys(QueryUtils._characterMap).forEach((key: string) => {
            _text = _text.replaceAll(key, QueryUtils._characterMap[key])
        });
        return _text;
    };

    // adds random uuid only used in frontend to provide a :key for v-for iterators in UI components  
    private addUUID(array: any): any {
        return array.map((item: any) => {
            return {
                'temp_id': `urn:uuid${v4()}`,
                'item': item
            }
        })
    }



    //flattens a JS object to its constituent paths (lodash compatible)
    public static flattenObject(object: any): any {

        const result = {} as any;
        function recurse(cur: any, prop: any) {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {
                // for (var i = 0, l = cur.length; i < l; i++)
                for (let i = 0; i < cur.length; i++)
                    recurse(cur[i], prop + "[" + i + "]");
                // if (l == 0)
                if (cur.length == 0)
                    result[prop] = [];
            } else {
                let isEmpty = true;
                for (const p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? prop + "." + p : p);
                }
                if (isEmpty && prop)
                    result[prop] = {};
            }
        }
        recurse(object, "");
        console.log("flattened result", result)
        return result;
    }

    //unflattens JS object
    // public static unflattenObject(object: any): any {
    //     if (Object(object) !== object || Array.isArray(object))
    //         return object;
    //     var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
    //         resultholder = {} as any;
    //     for (var p in object) {
    //         var cur = resultholder as any,
    //             prop = "",
    //             m;
    //         while (m = regex.exec(p)) {
    //             cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
    //             prop = m[2] || m[1];
    //         }
    //         cur[prop] = object[p];
    //     }
    //     return resultholder[""] || resultholder;
    // }


}

