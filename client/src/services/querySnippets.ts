export default class querySnippets {

    public static datamodel = {
        "query": {
            "name": "get entities with property",
            "description": "get entities with property",
            "mainEntity": {
                "@id": "http://www.w3.org/ns/shacl#NodeShape"
            },
            "resultFormat": "OBJECT",
            "select": {
                "property": [
                    {
                        "@id": "http://www.w3.org/ns/shacl#property",
                        "select": {
                            "property": [
                                {
                                    "@id": "http://www.w3.org/ns/shacl#path",
                                    "select": {
                                        "property": [
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                            },
                                            {
                                                "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#datatype",
                                    "select": {
                                        "property": [
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                            },
                                            {
                                                "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#class",
                                    "select": {
                                        "property": [
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                            },
                                            {
                                                "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#nodeKind",
                                    "select": {
                                        "property": [
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#node"
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#minCount"
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#maxCount"
                                }
                            ]
                        }
                    },
                    {
                        "@id": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
                    }
                ],
                "match": [
                    {
                        "entityType": {
                            "@id": "http://www.w3.org/ns/shacl#NodeShape"
                        },
                        "property": []
                    }
                ]
            },
            "usePrefixes": true
        }
    }
    public static datamodel_properties = {
        "query": {
            "name": "get entities with property",
            "description": "get entities with property",
            "mainEntity": {
                "@id": "http://www.w3.org/ns/shacl#NodeShape"
            },
            "resultFormat": "OBJECT",
            "select": {
                "property": [
                    {
                        "@id": "http://www.w3.org/ns/shacl#property",
                        "select": {
                            "property": [
                                {
                                    "@id": "http://www.w3.org/ns/shacl#path",
                                    "select": {
                                        "property": [
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                            },
                                            {
                                                "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#datatype",
                                    "select": {
                                        "property": [
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                            },
                                            {
                                                "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#class",
                                    "select": {
                                        "property": [
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                            },
                                            {
                                                "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#nodeKind",
                                    "select": {
                                        "property": [
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#node"
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#minCount"
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#maxCount"
                                }
                            ]
                        }
                    },
                    {
                        "@id": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
                    }
                ],
                "match": [
                    {
                        or: [
                            {
                                "entityType": {
                                    "@id": "http://www.w3.org/ns/shacl#NodeShape"
                                },
                                "property": []
                            },
                            {
                                "entityType": {
                                    "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
                                },
                                "property": []
                            }
                        ]
                    },
                ]
            },
            "usePrefixes": true
        }
    }



    public static datamodel_plus = {
        "query": {
            "name": "get entities with property",
            "description": "get entities with property",
            "mainEntity": {
                "@id": "http://www.w3.org/ns/shacl#NodeShape"
            },
            "resultFormat": "OBJECT",
            "select": {
                "property": [
                    {
                        "@id": "http://www.w3.org/ns/shacl#property",
                        "select": {
                            "property": [
                                {
                                    "@id": "http://www.w3.org/ns/shacl#path",
                                    "select": {
                                        "property": [
                                            {
                                                "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                                            },
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                            },
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#comment"
                                            },
                                            {
                                                "@id": "http://www.w3.org/ns/shacl#parameter"
                                            },
                                            {
                                                "@id": "http://endhealth.info/im#function"
                                            },
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#range"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#datatype",
                                    "select": {
                                        "property": [
                                            {
                                                "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                                            },
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                            },
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#comment"
                                            },
                                            {
                                                "@id": "http://www.w3.org/ns/shacl#parameter"
                                            },
                                            {
                                                "@id": "http://endhealth.info/im#function"
                                            },
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#range"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#class",
                                    "select": {
                                        "property": [
                                            {
                                                "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                                            },
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                            },
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#comment"
                                            },
                                            {
                                                "@id": "http://www.w3.org/ns/shacl#parameter"
                                            },
                                            {
                                                "@id": "http://endhealth.info/im#function"
                                            },
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#range"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#nodeKind",
                                    "select": {
                                        "property": [
                                            {
                                                "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#node"
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#minCount"
                                },
                                {
                                    "@id": "http://www.w3.org/ns/shacl#maxCount"
                                }
                            ]
                        }
                    },
                    {
                        "@id": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
                    }
                ],
                "match": [
                    {
                        "entityType": {
                            "@id": "http://www.w3.org/ns/shacl#NodeShape"
                        },
                        "property": []
                    }
                ]
            },
            "usePrefixes": true
        }
    };


    public static getMembers(args: any): string {
        let iri = args?.iri;

        return `{
    "query": {
        "name": "",
        "description": "",
        "mainEntity": {
            "@id": "http://endhealth.info/im#ConceptSet"
        },
        "resultFormat": "OBJECT",
        "select": {
            "property": [
                {
                    "@id": "http://endhealth.info/im#definition",
                    "select": {
                        "property": [
                            {
                                "@id": "http://www.w3.org/ns/shacl#or",
                                 "select": {
                                    "property": [
                                        {
                                            "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ],
            "match": [
                {
                    "entityId": {
                        "@id": "${iri}"
                    }
                }
            ]
        },
        "usePrefixes": true
    }
}`
    }
    public static getSummary(args: any): string {
        let iri = args?.iri;

        return `{
            "query": {
                "name": "",
                "description": "",
                "mainEntity": {
                    "@id": "im:ConceptSet"
                },
                "resultFormat": "OBJECT",
                "select": {
                    "property": [
                        {
                            "@id": "rdfs:label"
                        },
                        {
                            "@id": "rdf:type",
                            "select": {
                                "property": [
                                    {
                                        "@id": "rdfs:label"
                                    }
                                ]
                            }
                        },
                        {
                            "@id": "im:isContainedIn",
                            "select": {
                                "property": [
                                    {
                                        "@id": "rdfs:label"
                                    }
                                ]
                            }
                        }
                    ],
                    "match": [
                        {
                            "entityId": {
                                "@id": "${iri}"
                            }
                        }
                    ]
                },
                "usePrefixes": true
            }
        }`
    }

}