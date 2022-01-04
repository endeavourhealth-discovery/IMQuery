// const { v4 } = require('uuid');

//todo: check available DBID with opensearch first before accepting a random number as DBID
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

export class Query {
    public id?: number | null;
    public iri?: string | null;
    public name?: string | null;
    public description?: string | null;
    public data?: any | null;

    // constructor(id?: string, iri?: string, name?: string, description?: string, data?: any) {
    constructor(query?: Query)
    constructor(query: Query) {

        this.id = query.id ? query.id : random(10000000, 99999999);
        this.iri = query.iri ? query.iri : "im:Q_{0}";
        this.name = query.name ? query.name : "Untitled Dataset";
        this.description = query.description ? query.description : null;
        this.data = query.data ? query.data : null;
    }


    // use setters to check  validity of value, otherwise threw new Error('Iri is invalid');e.g. datamodel entity iri.

}


export class Examples {


    public static QOF_CHD005 = {
        id: 3000000,
        iri: "im:Q_QOF_CHD005",
        name: "QOF CHD005",
        description: "The percentage of patients registered at a GP practice with a diagnosis of coronary heart disease with a record in the preceding 12 months that aspirin, an alternative anti-platelet therapy, or an anti-coagulant is being taken.",
        code: null,
        scheme: {
            name: "Discovery",
            iri: "http://endhealth.info/im#"
        },
        entityType: [{
            name: "Query",
            iri: "http://endhealth.info/im#Query"
        }],
        status: {
            name: "Draft",
            iri: "http://endhealth.info/im#Draft"
        },
        searchterms: [],
        data: {
            prefix: {
                im: "http://endhealth.info/im#",
                rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                rdfs: "http://www.w3.org/2000/01/rdf-schema#"
            },
            references: {
                entities: [
                    {
                        id: 703,
                        iri: "http://endhealth.info/im#Patient",
                        name: "Patient",
                        code: null,
                        scheme: {
                            name: "Discovery",
                            iri: "http://endhealth.info/im#"
                        },
                        entityType: [{
                            name: "Address (record type)",
                            iri: "http://endhealth.info/im#Address"
                        }, {
                            name: "Class",
                            iri: "http://www.w3.org/2000/01/rdf-schema#Class"
                        }, {
                            name: "Node shape",
                            iri: "http://www.w3.org/ns/shacl#NodeShape"
                        }],
                        status: {
                            name: "Active",
                            iri: "http://endhealth.info/im#Active"
                        },
                        searchterms: [
                            {
                                iri: "http://endhealth.info/im#Q_Term_cf5f7e68-5877-4f0f-bea2-9331adc5eb1d",
                                name: "pt",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_72b55224-b618-4066-9422-ae3ce2327ea7",
                                name: "pt's"
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_95a33ba1-6e05-4bf2-8879-5863522fa1c3",
                                name: "pts",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_6c16043d-0d55-450c-ae6d-06bf2e263e83",
                                name: "patient's",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_2a1669b0-1e10-4609-b821-85ed9c8190ee",
                                name: "patients",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_a9efae83-7c93-44ba-a7ad-d8ec58f3ff42",
                                name: "person",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_dbc65cd5-eb34-4fc3-8edb-f16120331b59",
                                name: "people",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_3e4b224c-b326-471d-957e-c2ef10acca46",
                                name: "asthmatic",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_2146bea2-96a7-431d-b074-e62afa8f6ecf",
                                name: "asthmatics",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_999f3c55-9203-4879-8130-8dfb6329562d",
                                name: "diabetic",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_b0a5b2d0-b25a-43d5-8f1f-1617810298b0",
                                name: "diabetics",
                            },
                        ]
                    },
                    {
                        id: 3000004,
                        iri: "http://endhealth.info/im#DDS",
                        name: "Discovery Data Service",
                        code: null,
                        scheme: {
                            name: "Discovery",
                            iri: "http://endhealth.info/im#"
                        },
                        entityType: [{
                            name: "Data Service",
                            iri: "http://endhealth.info/im#DataService"
                        }],
                        status: {
                            name: "Draft",
                            iri: "http://endhealth.info/im#Draft"
                        },
                        searchterms: [
                            {
                                iri: "http://endhealth.info/im#Q_Term_61441986-34a1-4380-a6d4-a7133c92c423",
                                name: "discovery",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_39e4b853-7ccf-4969-a917-625bdcf88f6e7",
                                name: "data service"
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_59d80df9-a7b6-4e0e-b08c-f82acf680af4",
                                name: "dds"
                            },
                        ]
                    },
                    {
                        id: 3000001,
                        iri: "im:Q_Step_RegisteredPatients",
                        name: "Registered patients",
                        description: "",
                        code: null,
                        scheme: {
                            iri: "http://endhealth.info/im#",
                            name: "Discovery",
                        },
                        entityType: [{
                            iri: "http://endhealth.info/im#Q_Step",
                            name: "Step",
                        }],
                        status: {
                            iri: "http://endhealth.info/im#Draft",
                            name: "Draft",
                        },
                        searchterms: [
                            {
                                iri: "http://endhealth.info/im#Q_Term_426a5cba-183b-4fe0-ad4e-26a54853dd33",
                                name: "chd",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_1a0e1266-43fc-4dd8-9f2c-aa563f122bf8",
                                name: "cad",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_cded1443-3cd0-475a-9263-4ccd7d2e055c",
                                name: "coronary artery disease",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_e5754e9e-a3e0-4a9f-aebb-501f625ae660",
                                name: "coronary heart disease",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_49022afd-d404-4613-921f-8b1beb38f70f",
                                name: "qof",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_7843f1f9-2ad1-4b50-8403-6c19da6d2ee3",
                                name: "chd005",
                            },
                        ],
                    },
                    {
                        id: 3000002,
                        name: "Diagnosis of CHD",
                        iri: "im:Q_Step_DiagnosisCHD",
                        description: "",
                        code: null,
                        scheme: {
                            iri: "http://endhealth.info/im#",
                            name: "Discovery",
                        },
                        entityType: [{
                            iri: "http://endhealth.info/im#Q_Step",
                            name: "Step",
                        }],
                        status: {
                            iri: "http://endhealth.info/im#Draft",
                            name: "Draft",
                        },
                        searchterms: [
                            {
                                iri: "http://endhealth.info/im#Q_Term_795fb8b3-8165-4ef8-b32f-905ff20d4fd2",
                                name: "registered",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_fcd410ab-56f1-457e-9e3f-3680bc71aaac",
                                name: "gp",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_043067b3-c613-439c-8a20-ff94d898c5e1",
                                name: "gp register",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_d2b8030d-cecf-47b8-888b-685971cc930b",
                                name: "gms",
                            },
                            {
                                iri: "http://endhealth.info/im#Q_Term_7abf6127-8a37-454d-817c-024d1d139d2d",
                                name: "gms register"
                            }
                        ],
                    }

                ],
                variables: {
                    ReferenceDate: {
                        entityType: "im:DateTime",
                        value: "31/03/2021"
                    },
                    StartDate: {
                        entityType: "im:RelativeDateTime",
                        value: "$ReferenceDate",
                        operation: "minus",
                        operationValue: "12",
                        operationUnit: "months",
                    }
                }
            },
            sourceOrganisations: {
                set: "im:Q_OrgSet_AllAllowable",
                name: "All Allowable Organisations (set)",
                members: ["im:Q_Org_F84081", "im:Q_Org_F84083"],
                fetchDate: "01/04/2021",
            },
            mainSubject: "im:Patient",
            steps: [
                {
                    iri: "im:Q_Step_RegisteredPatients",
                    name: "Registration history as GMS patient: date is on/before reference date, and either end date does not exist OR end date is after start date (reference date minus 12 months)",
                    input: [
                        {
                            iri: "im:DDS",
                            name: "Discovery Data Service",
                        }
                    ],
                    include: [
                        {
                            and: [
                                {
                                    subject: {
                                        iri: "im:GPRegistration",
                                        modififer: "any",
                                        quantity: 1,
                                        var: "reg",
                                    },
                                    predicate: {
                                        iri: "im:patientType",

                                    },
                                    object: {
                                        matchIf: true,
                                        comparison: "memberOf",
                                        iri: "im:2751000252106",
                                    }
                                },
                                {
                                    subject: {
                                        ref: "reg",
                                        quantity: 1,
                                    },
                                    predicate: {
                                        iri: "im:effectiveDate",
                                    },
                                    object: {
                                        matchIf: true,
                                        comparison: "lessThanOrEqual",
                                        values: ["$ReferenceDate"],
                                    }


                                },
                                {
                                    or: [
                                        {
                                            subject: {
                                                ref: "reg",
                                                quantity: 1,
                                            },
                                            predicate: {
                                                iri: "im:endDate",
                                            },
                                            object: {
                                                matchIf: true,
                                                comparison: "exists",
                                            }
                                        },
                                        {
                                            subject: {
                                                ref: "reg",
                                            },
                                            predicate: {
                                                iri: "im:endDate",
                                            },
                                            object: {
                                                matchIf: true,
                                                comparison: "before",
                                                values: ["$ReferenceDate"]
                                            }
                                        }
                                    ]
                                }
                            ],
                        },
                    ],
                    exclude: []
                },
                {
                    iri: "im:Q_Step_DiagnosisCHD",
                    name: "Any Diagnosis of Coronary Heart Disease ",
                    input: [
                        {
                            iri: "im:Q_Step_RegisteredPatients",
                            name: "Discovery Data Service",
                        }
                    ],
                    include: [
                        {
                            and: [
                                {
                                    subject: {
                                        iri: "im:ProblemOrCondition",
                                        modififer: "any",
                                        quantity: 1,
                                        var: "chd",
                                    },
                                    predicate: {
                                        iri: "im:concept",
                                    },
                                    object: {
                                        matchIf: true,
                                        comparison: "memberOf",
                                        iri: "im:Q_ConSet_CHD_Diagnosis",
                                    }
                                },
                            ],
                        },
                    ],
                    exclude: []
                },
                {
                    iri: "im:Q_Step_AntiClottingAgents12Months",
                    name: "Prescribed any anti-clotting agents in the last 12 months (oral-anticoagulants, salicylates or clopidogrel)",
                    input: [
                        {
                            iri: "im:Q_Step_RegisteredPatients",
                            name: "Discovery Data Service",
                        }
                    ],
                    include: [
                        {
                            and: [
                                {
                                    subject: {
                                        iri: "im:MedicationOrder",
                                        modififer: "any",
                                        quantity: 1,
                                        var: "medications",
                                    },
                                    predicate: {
                                        iri: "im:concept",
                                    },
                                    object: {
                                        matchIf: true,
                                        comparison: "memberOf",
                                        iri: "im:Q_ConSet_AntiClottingAgents",
                                    }
                                },
                                {
                                    subject: {
                                        ref: "medications",
                                    },
                                    predicate: {
                                        iri: "im:EffectiveDate",
                                    },
                                    object: {
                                        matchIf: true,
                                        comparison: "after",
                                        values: ["$StartDate"],
                                    }
                                }
                            ],
                        },
                    ],
                    exclude: []
                }
            ],
            output: [],
            export: {
                format: "",
            },
        },
        author: {
            iri: "im:Q_Author_7e799679-409e-46aa-8f2b-455b86ec5be2",
            name: "Dr Bruce Wayne",  
        },
        analytics: {
            views: 3,
            copy: 2,
            query: 0,

        }

    }

    public static CEG_SMI_001 = {
        query: [{
            iri: "urn:uuid6d517466-813b-46a8-b848-aaf5a4fbdcbf",
            name: "SMI Population",
            description: "Adults 18+ with SMI",
            type: {
                "@id": "http://endhealth.info/im#Query"
            },
            prefix: {
                im: "http://endhealth.info/im#",
                rdf: "http://www.w3.org/1999/0 2/22-rdf-syntax-ns#",
                rdfs: "http://www.w3.org/2000/01/rdf-schema#",
                sn: "http://snomed.info/sct#"
            },
            operator: "AND",
            clause: [{
                name: "Registered with GP for GMS services on the reference date",
                where: [{
                    entity: [{
                        var: "?patient"
                    }],
                    property: [{
                        "@id": "http://endhealth.info/im#inDataset"
                    }],
                    filter: [{
                        in: [{
                            "@id": "Q_RegisteredGMS"
                        }]
                    }]
                }]
            }, {
                name: "Regular patient type and Age years >18",
                where: [{
                    entity: [{
                        var: "?patient"
                    }, {
                        "@id": "isSubjectOf"
                    }, {
                        var: "?reg1",
                        "@id": "PatientRegistration"
                    }],
                    property: [{
                        "@id": "http://endhealth.info/im#patientType"
                    }],
                    valueVar: "?patientType3",
                    filter: [{
                        in: [{
                            "@id": "urn:uuid:b34449f7-b2b8-4d7a-bdc4-835351479901"
                        }]
                    }]
                }, {
                    entity: [{
                        var: "?patient"
                    }],
                    property: [{
                        "@id": "http://endhealth.info/im#age"
                    }],
                    valueVar: "?age6",
                    filter: [{
                        argument: ["?age6", "YEAR"],
                        comparison: "greaterThanOrEqual",
                        value: "18"
                    }]
                }]
            }, {
                name: "Serious mental illness (not resolved)",
                clause: [{
                    select: [{
                        var: "?patient"
                    }, {
                        var: "?effectiveDate12"
                    }],
                    where: [{
                        entity: [{
                            var: "?patient"
                        }, {
                            "@id": "isSubjectOf"
                        }, {
                            var: "?event8",
                            "@id": "Event"
                        }],
                        property: [{
                            "@id": "http://endhealth.info/im#concept"
                        }],
                        valueVar: "?concept10",
                        filter: [{
                            in: [{
                                "@id": "urn:uuid:837c474c-f6af-4a05-83ad-7c4ee7557e11"
                            }, {
                                "@id": "urn:uuid:8ab86afb-94e0-45fc-9875-3d16705cf41c"
                            }]
                        }]
                    }, {
                        entity: [{
                            var: "?event8"
                        }],
                        property: [{
                            "@id": "http://endhealth.info/im#effectiveDate"
                        }],
                        valueVar: "?effectiveDate12"
                    }],
                    groupSort: [{
                        sortBy: "LATEST",
                        count: 1,
                        field: "?effectiveDate12",
                        groupBy: "?patient"
                    }]
                }],
                where: [{
                    entity: [{
                        var: "?event8"
                    }],
                    property: [{
                        "@id": "http://endhealth.info/im#concept"
                    }],
                    valueVar: "?concept10",
                    filter: [{
                        in: [{
                            "@id": "urn:uuid:8ab86afb-94e0-45fc-9875-3d16705cf41c"
                        }]
                    }]
                }]
            }],
            select: [{
                var: "?patient"
            }]
        }, {
            iri: "urn:uuid40a4a1f1-b768-4db8-a8a6-6df744935d97",
            name: "Priority 1",
            type: {
                "@id": "http://endhealth.info/im#Query"
            },
            prefix: {
                im: "http://endhealth.info/im#",
                rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                rdfs: "http://www.w3.org/2000/01/rdf-schema#",
                sn: "http://snomed.info/sct#"
            },
            operator: "AND",
            clause: [{
                name: "is in cohort : SMI Population",
                where: [{
                    entity: [{
                        var: "?patient"
                    }],
                    property: [{
                        "@id": "http://endhealth.info/im#inDataset"
                    }],
                    filter: [{
                        in: [{
                            "@id": "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf"
                        }]
                    }]
                }]
            }, {
                operator: "OR",
                clause: [{
                    operator: "AND",
                    clause: [{
                        name: "Hypertension (not resolved)",
                        operator: "AND",
                        clause: [{
                            select: [{
                                var: "?patient"
                            }, {
                                var: "?effectiveDate5"
                            }],
                            where: [{
                                entity: [{
                                    var: "?patient"
                                }, {
                                    "@id": "isSubjectOf"
                                }, {
                                    var: "?event1",
                                    "@id": "Event"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept3",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:be880ad6-5dab-48c2-8e94-d5c5219afb4f"
                                    }, {
                                        "@id": "urn:uuid:aafda1f0-02fc-45bc-bd6f-b899efe9547d"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event1"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#effectiveDate"
                                }],
                                valueVar: "?effectiveDate5"
                            }],
                            groupSort: [{
                                sortBy: "LATEST",
                                count: 1,
                                field: "?effectiveDate5",
                                groupBy: "?patient"
                            }]
                        }],
                        where: [{
                            entity: [{
                                var: "?event1"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#concept"
                            }],
                            valueVar: "?concept3",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:be880ad6-5dab-48c2-8e94-d5c5219afb4f"
                                }]
                            }]
                        }]
                    }, {
                        operator: "OR",
                        clause: [{
                            name: "Latest systolic blood pressure in the last 18 months : If Office based and >140",
                            clause: [{
                                select: [{
                                    var: "?patient"
                                }, {
                                    var: "?effectiveDate14"
                                }],
                                where: [{
                                    entity: [{
                                        var: "?patient"
                                    }, {
                                        "@id": "isSubjectOf"
                                    }, {
                                        var: "?event8",
                                        "@id": "Event"
                                    }],
                                    property: [{
                                        "@id": "http://endhealth.info/im#concept"
                                    }],
                                    valueVar: "?concept10",
                                    filter: [{
                                        in: [{
                                            "@id": "urn:uuid:43ed3aa3-0e0f-4cfc-bf24-82f64c9c4582"
                                        }]
                                    }]
                                }, {
                                    entity: [{
                                        var: "?patient"
                                    }, {
                                        "@id": "isSubjectOf"
                                    }, {
                                        var: "?event12",
                                        "@id": "Event"
                                    }],
                                    property: [{
                                        "@id": "http://endhealth.info/im#effectiveDate"
                                    }],
                                    valueVar: "?effectiveDate14",
                                    filter: [{
                                        function: {
                                            "@id": "http://endhealth.info/im#TimeDifference"
                                        },
                                        argument: ["MONTH", "?effectiveDate14", "$referenceDate"],
                                        comparison: "greaterThanOrEqual",
                                        value: "-18"
                                    }]
                                }],
                                groupSort: [{
                                    sortBy: "LATEST",
                                    count: 1,
                                    field: "?effectiveDate14",
                                    groupBy: "?patient"
                                }]
                            }],
                            where: [{
                                entity: [{
                                    var: "?event12"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept10",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:4330157f-ddbd-4159-9cc7-e0375b0b4c99"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event12"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#numericValue"
                                }],
                                filter: [{
                                    comparison: "greaterThanOrEqual",
                                    value: "140"
                                }]
                            }]
                        }, {
                            name: "Latest diastolic blood pressure in the last 18 months : if Office based and >90",
                            clause: [{
                                select: [{
                                    var: "?patient"
                                }, {
                                    var: "?effectiveDate26"
                                }],
                                where: [{
                                    entity: [{
                                        var: "?patient"
                                    }, {
                                        "@id": "isSubjectOf"
                                    }, {
                                        var: "?event20",
                                        "@id": "Event"
                                    }],
                                    property: [{
                                        "@id": "http://endhealth.info/im#concept"
                                    }],
                                    valueVar: "?concept22",
                                    filter: [{
                                        in: [{
                                            "@id": "urn:uuid:241c7550-e131-478c-8538-0ee6385bdf9c"
                                        }]
                                    }]
                                }, {
                                    entity: [{
                                        var: "?patient"
                                    }, {
                                        "@id": "isSubjectOf"
                                    }, {
                                        var: "?event24",
                                        "@id": "Event"
                                    }],
                                    property: [{
                                        "@id": "http://endhealth.info/im#effectiveDate"
                                    }],
                                    valueVar: "?effectiveDate26",
                                    filter: [{
                                        function: {
                                            "@id": "http://endhealth.info/im#TimeDifference"
                                        },
                                        argument: ["MONTH", "?effectiveDate26", "$referenceDate"],
                                        comparison: "greaterThanOrEqual",
                                        value: "-18"
                                    }]
                                }],
                                groupSort: [{
                                    sortBy: "LATEST",
                                    count: 1,
                                    field: "?effectiveDate26",
                                    groupBy: "?patient"
                                }]
                            }],
                            where: [{
                                entity: [{
                                    var: "?event24"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept22",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:ed8147d9-24e1-4196-b2b8-3f7425ae14a5"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event24"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#numericValue"
                                }],
                                filter: [{
                                    comparison: "greaterThanOrEqual",
                                    value: "90"
                                }]
                            }]
                        }, {
                            name: "Latest systolic blood pressure in the last 18 monthsm : if home based >135",
                            clause: [{
                                select: [{
                                    var: "?patient"
                                }, {
                                    var: "?effectiveDate38"
                                }],
                                where: [{
                                    entity: [{
                                        var: "?patient"
                                    }, {
                                        "@id": "isSubjectOf"
                                    }, {
                                        var: "?event32",
                                        "@id": "Event"
                                    }],
                                    property: [{
                                        "@id": "http://endhealth.info/im#concept"
                                    }],
                                    valueVar: "?concept34",
                                    filter: [{
                                        in: [{
                                            "@id": "urn:uuid:36eb4f63-d28e-4e90-9ede-cbee1d58551b"
                                        }]
                                    }]
                                }, {
                                    entity: [{
                                        var: "?patient"
                                    }, {
                                        "@id": "isSubjectOf"
                                    }, {
                                        var: "?event36",
                                        "@id": "Event"
                                    }],
                                    property: [{
                                        "@id": "http://endhealth.info/im#effectiveDate"
                                    }],
                                    valueVar: "?effectiveDate38",
                                    filter: [{
                                        function: {
                                            "@id": "http://endhealth.info/im#TimeDifference"
                                        },
                                        argument: ["MONTH", "?effectiveDate38", "$referenceDate"],
                                        comparison: "greaterThanOrEqual",
                                        value: "-18"
                                    }]
                                }],
                                groupSort: [{
                                    sortBy: "LATEST",
                                    count: 1,
                                    field: "?effectiveDate38",
                                    groupBy: "?patient"
                                }]
                            }],
                            where: [{
                                entity: [{
                                    var: "?event36"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept34",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:c945de2c-9b76-4404-b8f7-103266b1b137"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event36"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#numericValue"
                                }],
                                filter: [{
                                    comparison: "greaterThanOrEqual",
                                    value: "135"
                                }]
                            }]
                        }, {
                            name: "Latest diastolic blood pressure in the last 18 months a: if home based and >85",
                            clause: [{
                                select: [{
                                    var: "?patient"
                                }, {
                                    var: "?effectiveDate50"
                                }],
                                where: [{
                                    entity: [{
                                        var: "?patient"
                                    }, {
                                        "@id": "isSubjectOf"
                                    }, {
                                        var: "?event44",
                                        "@id": "Event"
                                    }],
                                    property: [{
                                        "@id": "http://endhealth.info/im#concept"
                                    }],
                                    valueVar: "?concept46",
                                    filter: [{
                                        in: [{
                                            "@id": "urn:uuid:83661482-667f-4b8d-8735-aaa82790e86c"
                                        }]
                                    }]
                                }, {
                                    entity: [{
                                        var: "?patient"
                                    }, {
                                        "@id": "isSubjectOf"
                                    }, {
                                        var: "?event48",
                                        "@id": "Event"
                                    }],
                                    property: [{
                                        "@id": "http://endhealth.info/im#effectiveDate"
                                    }],
                                    valueVar: "?effectiveDate50",
                                    filter: [{
                                        function: {
                                            "@id": "http://endhealth.info/im#TimeDifference"
                                        },
                                        argument: ["MONTH", "?effectiveDate50", "$referenceDate"],
                                        comparison: "greaterThanOrEqual",
                                        value: "-18"
                                    }]
                                }],
                                groupSort: [{
                                    sortBy: "LATEST",
                                    count: 1,
                                    field: "?effectiveDate50",
                                    groupBy: "?patient"
                                }]
                            }],
                            where: [{
                                entity: [{
                                    var: "?event48"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept46",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:9bbc735b-2403-43f2-8fe1-494da702c333"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event48"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#numericValue"
                                }],
                                filter: [{
                                    comparison: "greaterThanOrEqual",
                                    value: "85"
                                }]
                            }]
                        }, {
                            name: "No blood pressure in the last 18 months",
                            notExist: true,
                            where: [{
                                entity: [{
                                    var: "?patient"
                                }, {
                                    "@id": "isSubjectOf"
                                }, {
                                    var: "?event56",
                                    "@id": "Event"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept58",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:a5b51359-b31b-4893-8d1b-98b4f5c1c817"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?patient"
                                }, {
                                    "@id": "isSubjectOf"
                                }, {
                                    var: "?event60",
                                    "@id": "Event"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#effectiveDate"
                                }],
                                valueVar: "?effectiveDate62",
                                filter: [{
                                    function: {
                                        "@id": "http://endhealth.info/im#TimeDifference"
                                    },
                                    argument: ["MONTH", "?effectiveDate62", "$referenceDate"],
                                    comparison: "greaterThanOrEqual",
                                    value: "-18"
                                }]
                            }]
                        }]
                    }]
                }, {
                    operator: "AND",
                    clause: [{
                        name: "Diabetes (not resolved)",
                        clause: [{
                            select: [{
                                var: "?patient"
                            }, {
                                var: "?effectiveDate68"
                            }],
                            where: [{
                                entity: [{
                                    var: "?patient"
                                }, {
                                    "@id": "isSubjectOf"
                                }, {
                                    var: "?event64",
                                    "@id": "Event"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept66",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:4ecec7ee-f42f-4418-acc3-ba4f16264c95"
                                    }, {
                                        "@id": "urn:uuid:bd8458fb-abb7-469b-91e5-ce888b5b0f3d"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event64"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#effectiveDate"
                                }],
                                valueVar: "?effectiveDate68"
                            }],
                            groupSort: [{
                                sortBy: "LATEST",
                                count: 1,
                                field: "?effectiveDate68",
                                groupBy: "?patient"
                            }]
                        }],
                        where: [{
                            entity: [{
                                var: "?event64"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#concept"
                            }],
                            valueVar: "?concept66",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:4ecec7ee-f42f-4418-acc3-ba4f16264c95"
                                }]
                            }]
                        }]
                    }, {
                        name: "Latest HBA1C in the last 18 months : if >59",
                        clause: [{
                            select: [{
                                var: "?patient"
                            }, {
                                var: "?effectiveDate75"
                            }],
                            where: [{
                                entity: [{
                                    var: "?patient"
                                }, {
                                    "@id": "isSubjectOf"
                                }, {
                                    var: "?event71",
                                    "@id": "Event"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept73",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:a903cde4-68af-433b-9fa0-0ce292d906b3"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event71"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#effectiveDate"
                                }],
                                valueVar: "?effectiveDate75"
                            }],
                            groupSort: [{
                                sortBy: "LATEST",
                                count: 1,
                                field: "?effectiveDate75",
                                groupBy: "?patient"
                            }]
                        }],
                        where: [{
                            entity: [{
                                var: "?event71"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#numericValue"
                            }],
                            filter: [{
                                comparison: "greaterThanOrEqual",
                                value: "59"
                            }]
                        }]
                    }]
                }, {
                    operator: "AND",
                    clause: [{
                        name: "Latest QRisk2 or Qrisk 3, : if >10",
                        clause: [{
                            select: [{
                                var: "?patient"
                            }, {
                                var: "?effectiveDate82"
                            }],
                            where: [{
                                entity: [{
                                    var: "?patient"
                                }, {
                                    "@id": "isSubjectOf"
                                }, {
                                    var: "?event78",
                                    "@id": "Event"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept80",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:c7ca8edd-dd0f-4b2c-b17b-3abcc9951641"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event78"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#effectiveDate"
                                }],
                                valueVar: "?effectiveDate82"
                            }],
                            groupSort: [{
                                sortBy: "LATEST",
                                count: 1,
                                field: "?effectiveDate82",
                                groupBy: "?patient"
                            }]
                        }],
                        where: [{
                            entity: [{
                                var: "?event78"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#numericValue"
                            }],
                            filter: [{
                                comparison: "greaterThanOrEqual",
                                value: "10"
                            }]
                        }]
                    }, {
                        name: "Not on statins in the last 6 months",
                        notExist: true,
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med85",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#medication"
                            }],
                            valueVar: "?medication87",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:5d985d56-1a49-44a9-ac83-961e34a8838d"
                                }]
                            }]
                        }, {
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med89",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#effectiveDate"
                            }],
                            valueVar: "?effectiveDate91",
                            filter: [{
                                function: {
                                    "@id": "http://endhealth.info/im#TimeDifference"
                                },
                                argument: ["MONTH", "?effectiveDate91", "$referenceDate"],
                                comparison: "greaterThanOrEqual",
                                value: "-6"
                            }]
                        }]
                    }]
                }, {
                    operator: "AND",
                    clause: [{
                        name: "? What are these clinical concepts",
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?event93",
                                "@id": "Event"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#concept"
                            }],
                            valueVar: "?concept95",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:22575230-a13e-431d-983c-3fee668bf452"
                                }, {
                                    "@id": "urn:uuid:8aa2198a-efca-4d1a-9bcf-1fd6117ef87d"
                                }, {
                                    "@id": "urn:uuid:1ee3788a-0e92-4a69-890a-0b5daff494b4"
                                }, {
                                    "@id": "urn:uuid:8a030be6-be7a-49eb-b187-6575dfdd32c0"
                                }]
                            }]
                        }]
                    }, {
                        notExist: true,
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med97",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#medication"
                            }],
                            valueVar: "?medication99",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:705b717b-880c-402b-aed8-f76cdb561fa2"
                                }]
                            }]
                        }, {
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med101",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#effectiveDate"
                            }],
                            valueVar: "?effectiveDate103",
                            filter: [{
                                function: {
                                    "@id": "http://endhealth.info/im#TimeDifference"
                                },
                                argument: ["MONTH", "?effectiveDate103", "$referenceDate"],
                                comparison: "greaterThanOrEqual",
                                value: "-6"
                            }]
                        }]
                    }]
                }, {
                    operator: "AND",
                    clause: [{
                        name: "Cardiovascular disease (not resolved)",
                        clause: [{
                            select: [{
                                var: "?patient"
                            }, {
                                var: "?effectiveDate109"
                            }],
                            where: [{
                                entity: [{
                                    var: "?patient"
                                }, {
                                    "@id": "isSubjectOf"
                                }, {
                                    var: "?event105",
                                    "@id": "Event"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept107",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:b8e618ac-9a75-40d7-a3f9-698c94c6591c"
                                    }, {
                                        "@id": "urn:uuid:8717d642-5703-444d-8985-de8e5d1a3a06"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event105"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#effectiveDate"
                                }],
                                valueVar: "?effectiveDate109"
                            }],
                            groupSort: [{
                                sortBy: "LATEST",
                                count: 1,
                                field: "?effectiveDate109",
                                groupBy: "?patient"
                            }]
                        }],
                        where: [{
                            entity: [{
                                var: "?event105"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#concept"
                            }],
                            valueVar: "?concept107",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:8717d642-5703-444d-8985-de8e5d1a3a06"
                                }]
                            }]
                        }]
                    }, {
                        name: "Latest CHA2DS2-VASc and if >2",
                        clause: [{
                            select: [{
                                var: "?patient"
                            }, {
                                var: "?effectiveDate116"
                            }],
                            where: [{
                                entity: [{
                                    var: "?patient"
                                }, {
                                    "@id": "isSubjectOf"
                                }, {
                                    var: "?event112",
                                    "@id": "Event"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept114",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:797a3f50-a95d-41a5-a4a5-21c5ccd87fa8"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event112"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#effectiveDate"
                                }],
                                valueVar: "?effectiveDate116"
                            }],
                            groupSort: [{
                                sortBy: "LATEST",
                                count: 1,
                                field: "?effectiveDate116",
                                groupBy: "?patient"
                            }]
                        }],
                        where: [{
                            entity: [{
                                var: "?event112"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#numericValue"
                            }],
                            filter: [{
                                comparison: "greaterThanOrEqual",
                                value: "2"
                            }]
                        }]
                    }, {
                        name: "Not on Warfarin,Edoxaban,Dabigatranm Apixaban,Rivaroxaban,Phenindione,Acenocoumarol, in the last 6 months",
                        notExist: true,
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med119",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#medication"
                            }],
                            valueVar: "?medication121",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:44254378-a46d-4d21-9da9-710098583301"
                                }]
                            }]
                        }, {
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med123",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#effectiveDate"
                            }],
                            valueVar: "?effectiveDate125",
                            filter: [{
                                function: {
                                    "@id": "http://endhealth.info/im#TimeDifference"
                                },
                                argument: ["MONTH", "?effectiveDate125", "$referenceDate"],
                                comparison: "greaterThanOrEqual",
                                value: "-6"
                            }]
                        }]
                    }]
                }, {
                    operator: "AND",
                    clause: [{
                        name: "Latest BMI : if >30",
                        clause: [{
                            select: [{
                                var: "?patient"
                            }, {
                                var: "?effectiveDate131"
                            }],
                            where: [{
                                entity: [{
                                    var: "?patient"
                                }, {
                                    "@id": "isSubjectOf"
                                }, {
                                    var: "?event127",
                                    "@id": "Event"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept129",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:aefeba01-d292-406d-8d02-15790430d61f"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event127"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#effectiveDate"
                                }],
                                valueVar: "?effectiveDate131"
                            }],
                            groupSort: [{
                                sortBy: "LATEST",
                                count: 1,
                                field: "?effectiveDate131",
                                groupBy: "?patient"
                            }]
                        }],
                        where: [{
                            entity: [{
                                var: "?event127"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#numericValue"
                            }],
                            filter: [{
                                comparison: "greaterThanOrEqual",
                                value: "30"
                            }]
                        }]
                    }, {
                        name: "On Olanzapine, Clozapine in the last 6 months",
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med134",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#medication"
                            }],
                            valueVar: "?medication136",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:d15c85e6-00c7-4ef0-aecd-169b82acfb96"
                                }]
                            }]
                        }, {
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med138",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#effectiveDate"
                            }],
                            valueVar: "?effectiveDate140",
                            filter: [{
                                function: {
                                    "@id": "http://endhealth.info/im#TimeDifference"
                                },
                                argument: ["MONTH", "?effectiveDate140", "$referenceDate"],
                                comparison: "greaterThanOrEqual",
                                value: "-6"
                            }]
                        }]
                    }]
                }, {
                    operator: "AND",
                    clause: [{
                        name: "Latest BMI : if >27.5",
                        clause: [{
                            select: [{
                                var: "?patient"
                            }, {
                                var: "?effectiveDate146"
                            }],
                            where: [{
                                entity: [{
                                    var: "?patient"
                                }, {
                                    "@id": "isSubjectOf"
                                }, {
                                    var: "?event142",
                                    "@id": "Event"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept144",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:f36f7b3e-1689-4d59-865d-4f4f6954f74c"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event142"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#effectiveDate"
                                }],
                                valueVar: "?effectiveDate146"
                            }],
                            groupSort: [{
                                sortBy: "LATEST",
                                count: 1,
                                field: "?effectiveDate146",
                                groupBy: "?patient"
                            }]
                        }],
                        where: [{
                            entity: [{
                                var: "?event142"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#numericValue"
                            }],
                            filter: [{
                                comparison: "greaterThanOrEqual",
                                value: "27.5"
                            }]
                        }]
                    }, {
                        name: "On Olanzapine, Clozapine in the last 6 months",
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med149",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#medication"
                            }],
                            valueVar: "?medication151",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:ea022cb8-a544-4789-a4c6-68a84d4337e6"
                                }]
                            }]
                        }, {
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med153",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#effectiveDate"
                            }],
                            valueVar: "?effectiveDate155",
                            filter: [{
                                function: {
                                    "@id": "http://endhealth.info/im#TimeDifference"
                                },
                                argument: ["MONTH", "?effectiveDate155", "$referenceDate"],
                                comparison: "greaterThanOrEqual",
                                value: "-6"
                            }]
                        }]
                    }, {
                        name: "Asian or chinese",
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?event157",
                                "@id": "Event"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#concept"
                            }],
                            valueVar: "?concept159",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:726d11dd-c26f-4c8e-89a1-aa1102fba5ca"
                                }]
                            }]
                        }]
                    }]
                }, {
                    operator: "AND",
                    clause: [{
                        name: "Type 1 Diabetes",
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?event161",
                                "@id": "Event"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#concept"
                            }],
                            valueVar: "?concept163",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:5a0192fd-27ea-4b30-8f8d-db17ab89284a"
                                }]
                            }]
                        }]
                    }, {
                        name: "Age years >18",
                        where: [{
                            entity: [{
                                var: "?patient"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#age"
                            }],
                            valueVar: "?age166",
                            filter: [{
                                argument: ["?age166", "YEAR"],
                                comparison: "greaterThanOrEqual",
                                value: "18"
                            }]
                        }]
                    }, {
                        name: "On Atorvastin, Rosuvastin, Pravastin,Fluvastin,Simvastin in the last 6 months",
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med168",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#medication"
                            }],
                            valueVar: "?medication170",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:bc8ff12e-54d7-4f34-bc1c-6f5fc9465ee0"
                                }]
                            }]
                        }, {
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med172",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#effectiveDate"
                            }],
                            valueVar: "?effectiveDate174",
                            filter: [{
                                function: {
                                    "@id": "http://endhealth.info/im#TimeDifference"
                                },
                                argument: ["MONTH", "?effectiveDate174", "$referenceDate"],
                                comparison: "greaterThanOrEqual",
                                value: "-6"
                            }]
                        }]
                    }]
                }, {
                    operator: "AND",
                    clause: [{
                        name: "Latest various Diabetes illnesses and if a subset of these",
                        clause: [{
                            select: [{
                                var: "?patient"
                            }, {
                                var: "?effectiveDate180"
                            }],
                            where: [{
                                entity: [{
                                    var: "?patient"
                                }, {
                                    "@id": "isSubjectOf"
                                }, {
                                    var: "?event176",
                                    "@id": "Event"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#concept"
                                }],
                                valueVar: "?concept178",
                                filter: [{
                                    in: [{
                                        "@id": "urn:uuid:b31d668d-47d2-4859-82f6-1fc3d927389a"
                                    }]
                                }]
                            }, {
                                entity: [{
                                    var: "?event176"
                                }],
                                property: [{
                                    "@id": "http://endhealth.info/im#effectiveDate"
                                }],
                                valueVar: "?effectiveDate180"
                            }],
                            groupSort: [{
                                sortBy: "LATEST",
                                count: 1,
                                field: "?effectiveDate180",
                                groupBy: "?patient"
                            }]
                        }],
                        where: [{
                            entity: [{
                                var: "?event176"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#concept"
                            }],
                            valueVar: "?concept178",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:339cb893-1c82-449d-93ab-e24d4ab4fd97"
                                }]
                            }]
                        }]
                    }, {
                        name: "Age years >40",
                        where: [{
                            entity: [{
                                var: "?patient"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#age"
                            }],
                            valueVar: "?age184",
                            filter: [{
                                argument: ["?age184", "YEAR"],
                                comparison: "greaterThanOrEqual",
                                value: "40"
                            }]
                        }]
                    }, {
                        name: "On Atorvastin, Rosuvastin, Pravastin,Fluvastin,Simvastin in the last 6 months",
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med186",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#medication"
                            }],
                            valueVar: "?medication188",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:858923e7-d77e-419a-8a1e-f1b9e2646cb1"
                                }]
                            }]
                        }, {
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?med190",
                                "@id": "MedicationOrder"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#effectiveDate"
                            }],
                            valueVar: "?effectiveDate192",
                            filter: [{
                                function: {
                                    "@id": "http://endhealth.info/im#TimeDifference"
                                },
                                argument: ["MONTH", "?effectiveDate192", "$referenceDate"],
                                comparison: "greaterThanOrEqual",
                                value: "-6"
                            }]
                        }]
                    }]
                }]
            }],
            select: [{
                var: "?patient"
            }]
        }, {
            iri: "urn:uuidfe469cf2-84f3-4b03-a2f5-96223ae78dfd",
            name: "Priority 2",
            type: {
                "@id": "http://endhealth.info/im#Query"
            },
            prefix: {
                im: "http://endhealth.info/im#",
                rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                rdfs: "http://www.w3.org/2000/01/rdf-schema#",
                sn: "http://snomed.info/sct#"
            },
            operator: "AND",
            clause: [{
                name: "is in cohort : SMI Population",
                where: [{
                    entity: [{
                        var: "?patient"
                    }],
                    property: [{
                        "@id": "http://endhealth.info/im#inDataset"
                    }],
                    filter: [{
                        in: [{
                            "@id": "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf"
                        }]
                    }]
                }]
            }, {
                clause: [{
                    name: "is in cohort : Priority 1",
                    notExist: true,
                    where: [{
                        entity: [{
                            var: "?patient"
                        }],
                        property: [{
                            "@id": "http://endhealth.info/im#inDataset"
                        }],
                        filter: [{
                            in: [{
                                "@id": "urn:uuid:40a4a1f1-b768-4db8-a8a6-6df744935d97"
                            }]
                        }]
                    }]
                }]
            }],
            select: [{
                var: "?patient"
            }]
        }, {
            iri: "urn:uuid6d4abdbb-d278-4675-a98d-c340967daee6",
            name: "Priority 3a",
            type: {
                "@id": "http://endhealth.info/im#Query"
            },
            prefix: {
                im: "http://endhealth.info/im#",
                rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                rdfs: "http://www.w3.org/2000/01/rdf-schema#",
                sn: "http://snomed.info/sct#"
            },
            operator: "AND",
            clause: [{
                name: "is in cohort : SMI Population",
                where: [{
                    entity: [{
                        var: "?patient"
                    }],
                    property: [{
                        "@id": "http://endhealth.info/im#inDataset"
                    }],
                    filter: [{
                        in: [{
                            "@id": "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf"
                        }]
                    }]
                }]
            }, {
                operator: "OR",
                clause: [{
                    name: "Hypertension (not resolved)",
                    clause: [{
                        select: [{
                            var: "?patient"
                        }, {
                            var: "?effectiveDate5"
                        }],
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?event1",
                                "@id": "Event"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#concept"
                            }],
                            valueVar: "?concept3",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:be880ad6-5dab-48c2-8e94-d5c5219afb4f"
                                }, {
                                    "@id": "urn:uuid:aafda1f0-02fc-45bc-bd6f-b899efe9547d"
                                }]
                            }]
                        }, {
                            entity: [{
                                var: "?event1"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#effectiveDate"
                            }],
                            valueVar: "?effectiveDate5"
                        }],
                        groupSort: [{
                            sortBy: "LATEST",
                            count: 1,
                            field: "?effectiveDate5",
                            groupBy: "?patient"
                        }]
                    }],
                    where: [{
                        entity: [{
                            var: "?event1"
                        }],
                        property: [{
                            "@id": "http://endhealth.info/im#concept"
                        }],
                        valueVar: "?concept3",
                        filter: [{
                            in: [{
                                "@id": "urn:uuid:be880ad6-5dab-48c2-8e94-d5c5219afb4f"
                            }]
                        }]
                    }]
                }, {
                    name: "Diabetes (not resolved)",
                    clause: [{
                        select: [{
                            var: "?patient"
                        }, {
                            var: "?effectiveDate12"
                        }],
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?event8",
                                "@id": "Event"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#concept"
                            }],
                            valueVar: "?concept10",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:4ecec7ee-f42f-4418-acc3-ba4f16264c95"
                                }, {
                                    "@id": "urn:uuid:bd8458fb-abb7-469b-91e5-ce888b5b0f3d"
                                }]
                            }]
                        }, {
                            entity: [{
                                var: "?event8"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#effectiveDate"
                            }],
                            valueVar: "?effectiveDate12"
                        }],
                        groupSort: [{
                            sortBy: "LATEST",
                            count: 1,
                            field: "?effectiveDate12",
                            groupBy: "?patient"
                        }]
                    }],
                    where: [{
                        entity: [{
                            var: "?event8"
                        }],
                        property: [{
                            "@id": "http://endhealth.info/im#concept"
                        }],
                        valueVar: "?concept10",
                        filter: [{
                            in: [{
                                "@id": "urn:uuid:4ecec7ee-f42f-4418-acc3-ba4f16264c95"
                            }]
                        }]
                    }]
                }, {
                    where: [{
                        entity: [{
                            var: "?patient"
                        }, {
                            "@id": "isSubjectOf"
                        }, {
                            var: "?event15",
                            "@id": "Event"
                        }],
                        property: [{
                            "@id": "http://endhealth.info/im#concept"
                        }],
                        valueVar: "?concept17",
                        filter: [{
                            in: [{
                                "@id": "urn:uuid:22575230-a13e-431d-983c-3fee668bf452"
                            }, {
                                "@id": "urn:uuid:8aa2198a-efca-4d1a-9bcf-1fd6117ef87d"
                            }, {
                                "@id": "urn:uuid:1ee3788a-0e92-4a69-890a-0b5daff494b4"
                            }, {
                                "@id": "urn:uuid:8a030be6-be7a-49eb-b187-6575dfdd32c0"
                            }]
                        }]
                    }]
                }, {
                    where: [{
                        entity: [{
                            var: "?patient"
                        }, {
                            "@id": "isSubjectOf"
                        }, {
                            var: "?event19",
                            "@id": "Event"
                        }],
                        property: [{
                            "@id": "http://endhealth.info/im#concept"
                        }],
                        valueVar: "?concept21",
                        filter: [{
                            in: [{
                                "@id": "urn:uuid:15bd20c8-c92f-496c-8560-896299a632e5"
                            }, {
                                "@id": "urn:uuid:c97f55a2-fe6e-4da2-8865-a95b7cc80f4f"
                            }]
                        }]
                    }]
                }, {
                    name: "- Latest BMI >35",
                    clause: [{
                        select: [{
                            var: "?patient"
                        }, {
                            var: "?effectiveDate27"
                        }],
                        where: [{
                            entity: [{
                                var: "?patient"
                            }, {
                                "@id": "isSubjectOf"
                            }, {
                                var: "?event23",
                                "@id": "Event"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#concept"
                            }],
                            valueVar: "?concept25",
                            filter: [{
                                in: [{
                                    "@id": "urn:uuid:849eaf4e-55ef-40b7-be7b-1d95f56abee2"
                                }]
                            }]
                        }, {
                            entity: [{
                                var: "?event23"
                            }],
                            property: [{
                                "@id": "http://endhealth.info/im#effectiveDate"
                            }],
                            valueVar: "?effectiveDate27"
                        }],
                        groupSort: [{
                            sortBy: "LATEST",
                            count: 1,
                            field: "?effectiveDate27",
                            groupBy: "?patient"
                        }]
                    }],
                    where: [{
                        entity: [{
                            var: "?event23"
                        }],
                        property: [{
                            "@id": "http://endhealth.info/im#numericValue"
                        }],
                        filter: [{
                            comparison: "greaterThanOrEqual",
                            value: "35"
                        }]
                    }]
                }]
            }, {
                operator: "NOTOR",
                clause: [{
                    name: "is in cohort : Priority 1",
                    notExist: true,
                    where: [{
                        entity: [{
                            var: "?patient"
                        }],
                        property: [{
                            "@id": "http://endhealth.info/im#inDataset"
                        }],
                        filter: [{
                            in: [{
                                "@id": "urn:uuid:40a4a1f1-b768-4db8-a8a6-6df744935d97"
                            }]
                        }]
                    }]
                }, {
                    name: "is in cohort : Priority 2",
                    notExist: true,
                    where: [{
                        entity: [{
                            var: "?patient"
                        }],
                        property: [{
                            "@id": "http://endhealth.info/im#inDataset"
                        }],
                        filter: [{
                            in: [{
                                "@id": "urn:uuid:fe469cf2-84f3-4b03-a2f5-96223ae78dfd"
                            }]
                        }]
                    }]
                }]
            }],
            select: [{
                var: "?patient"
            }]
        }, {
            iri: "urn:uuid3f04bc73-fb03-4d50-bae4-49a866ad5033",
            name: "Priority 3b",
            type: {
                "@id": "http://endhealth.info/im#Query"
            },
            prefix: {
                im: "http://endhealth.info/im#",
                rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                rdfs: "http://www.w3.org/2000/01/rdf-schema#",
                sn: "http://snomed.info/sct#"
            },
            operator: "AND",
            clause: [{
                name: "is in cohort : SMI Population",
                where: [{
                    entity: [{
                        var: "?patient"
                    }],
                    property: [{
                        "@id": "http://endhealth.info/im#inDataset"
                    }],
                    filter: [{
                        in: [{
                            "@id": "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf"
                        }]
                    }]
                }]
            }, {
                operator: "NOTOR",
                clause: [{
                    name: "is in cohort : Priority 1",
                    notExist: true,
                    where: [{
                        entity: [{
                            var: "?patient"
                        }],
                        property: [{
                            "@id": "http://endhealth.info/im#inDataset"
                        }],
                        filter: [{
                            in: [{
                                "@id": "urn:uuid:40a4a1f1-b768-4db8-a8a6-6df744935d97"
                            }]
                        }]
                    }]
                }, {
                    name: "is in cohort : Priority 2",
                    notExist: true,
                    where: [{
                        entity: [{
                            var: "?patient"
                        }],
                        property: [{
                            "@id": "http://endhealth.info/im#inDataset"
                        }],
                        filter: [{
                            in: [{
                                "@id": "urn:uuid:fe469cf2-84f3-4b03-a2f5-96223ae78dfd"
                            }]
                        }]
                    }]
                }]
            }],
            select: [{
                var: "?patient"
            }]
        }]
    };

    
}




//create tokens - these are  used as text templates for interpolation and autosuggest.

//primitive types
type Use = 'Use';
type Define = 'Define';
type Include = 'Include';
type Exclude = 'Exclude';
type Get = 'Get';
type As = 'as';
type From = 'from';
type For = 'for';
type If = 'if';
type Latest = 'latest';
type Earliest = 'earliest';
type Any = 'any';
type All = 'all';
type And = 'and';
type Or = 'or';
type Exists = 'eixst';
type Is = 'is';
type IsNot = 'is not';
type Contains = 'contains';
type MoreThan = 'more than';
type LessThan = 'less than';
type Within = 'within';
type Last = 'last';
type Days = 'days';
type Weeks = 'weeks';
type Months = 'months';
type Years = 'years';
type Before = 'before';
type After = 'after';
type Between = 'between';
type Now = 'now';
type Everything = 'everything';
type New = 'new';
type Dictionary = 'dictionary';
type Token = Use
    | Define
    | Include
    | Exclude
    | Get
    | As
    | From
    | For
    | If
    | Latest
    | Earliest
    | Any
    | All
    | And
    | Or
    | Exists
    | Is
    | IsNot
    | Contains
    | MoreThan
    | LessThan
    | Within
    | Last
    | Days
    | Weeks
    | Months
    | Years
    | Before
    | After
    | Between
    | Now
    | Everything
    | New
    | Dictionary;


//types by category
type PrimaryTokenType1 = Use;
type PrimaryTokenType2 = 'Define';
type PrimaryTokenType3 = 'Include' | 'Exclude';
type PrimaryTokenType4 = 'Get';
type SecondaryTokenType1 = 'as'; //applies to use and define
type SecondaryTokenType2 = 'from'; //applies to include / exclude  
type SecondaryTokenType3 = 'for'; //applies to get
type TertiaryTokenType1 = 'from'; //applies to use
type ConditionTokenToken = 'if'; //applies to include/exclude
type SingularInstanceModifierToken = 'latest' | 'any' | 'earliest';
type MultipleInstanceModifierToken = 'all';
type InstanceModifierToken = SingularInstanceModifierToken | MultipleInstanceModifierToken;

type InstanceQuantityToken = 1;
type BooleanOperatorToken = 'and' | 'or';
type InstanceComparisonOperatorToken = 'exists';
type ComparisonOperatorToken = 'is' | 'is not';
type TextComparisonOperatorToken = 'contains';
type ValueComparisonOperatorToken = 'more than' | 'less than';
//could add TimeRangeDays (1-365) 
type TimePeriodToken = 'days' | 'weeks' | 'months' | 'years';
type TimeChronologyToken = 'before' | 'after';
type RangeToken = `between {0} and {1}`; //aplies to time and value
type TimeSpecialToken = 'now';
type NumberRangeToken = null | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 128 | 129 | 130 | 131 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 141 | 142 | 143 | 144 | 145 | 146 | 147 | 148 | 149 | 150 | 151 | 152 | 153 | 154 | 155 | 156 | 157 | 158 | 159 | 160 | 161 | 162 | 163 | 164 | 165 | 166 | 167 | 168 | 169 | 170 | 171 | 172 | 173 | 174 | 175 | 176 | 177 | 178 | 179 | 180 | 181 | 182 | 183 | 184 | 185 | 186 | 187 | 188 | 189 | 190 | 191 | 192 | 193 | 194 | 195 | 196 | 197 | 198 | 199 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212 | 213 | 214 | 215 | 216 | 217 | 218 | 219 | 220 | 221 | 222 | 223 | 224 | 225 | 226 | 227 | 228 | 229 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 237 | 238 | 239 | 240 | 241 | 242 | 243 | 244 | 245 | 246 | 247 | 248 | 249 | 250 | 251 | 252 | 253 | 254 | 255 | 256 | 257 | 258 | 259 | 260 | 261 | 262 | 263 | 264 | 265 | 266 | 267 | 268 | 269 | 270 | 271 | 272 | 273 | 274 | 275 | 276 | 277 | 278 | 279 | 280 | 281 | 282 | 283 | 284 | 285 | 286 | 287 | 288 | 289 | 290 | 291 | 292 | 293 | 294 | 295 | 296 | 297 | 298 | 299 | 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | 309 | 310 | 311 | 312 | 313 | 314 | 315 | 316 | 317 | 318 | 319 | 320 | 321 | 322 | 323 | 324 | 325 | 326 | 327 | 328 | 329 | 330 | 331 | 332 | 333 | 334 | 335 | 336 | 337 | 338 | 339 | 340 | 341 | 342 | 343 | 344 | 345 | 346 | 347 | 348 | 349 | 350 | 351 | 352 | 353 | 354 | 355 | 356 | 357 | 358 | 359 | 360 | 361 | 362 | 363 | 364 | 365 | 366 | 367 | 368 | 369 | 370 | 371 | 372 | 373 | 374 | 375 | 376 | 377 | 378 | 379 | 380 | 381 | 382 | 383 | 384 | 385 | 386 | 387 | 388 | 389 | 390 | 391 | 392 | 393 | 394 | 395 | 396 | 397 | 398 | 399 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 427 | 428 | 429 | 430 | 431 | 432 | 433 | 434 | 435 | 436 | 437 | 438 | 439 | 440 | 441 | 442 | 443 | 444 | 445 | 446 | 447 | 448 | 449 | 450 | 451 | 452 | 453 | 454 | 455 | 456 | 457 | 458 | 459 | 460 | 461 | 462 | 463 | 464 | 465 | 466 | 467 | 468 | 469 | 470 | 471 | 472 | 473 | 474 | 475 | 476 | 477 | 478 | 479 | 480 | 481 | 482 | 483 | 484 | 485 | 486 | 487 | 488 | 489 | 490 | 491 | 492 | 493 | 494 | 495 | 496 | 497 | 498 | 499 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 509 | 510 | 511 | 512 | 513 | 514 | 515 | 516 | 517 | 518 | 519 | 520 | 521 | 522 | 523 | 524 | 525 | 526 | 527 | 528 | 529 | 530 | 531 | 532 | 533 | 534 | 535 | 536 | 537 | 538 | 539 | 540 | 541 | 542 | 543 | 544 | 545 | 546 | 547 | 548 | 549 | 550 | 551 | 552 | 553 | 554 | 555 | 556 | 557 | 558 | 559 | 560 | 561 | 562 | 563 | 564 | 565 | 566 | 567 | 568 | 569 | 570 | 571 | 572 | 573 | 574 | 575 | 576 | 577 | 578 | 579 | 580 | 581 | 582 | 583 | 584 | 585 | 586 | 587 | 588 | 589 | 590 | 591 | 592 | 593 | 594 | 595 | 596 | 597 | 598 | 599 | 600 | 601 | 602 | 603 | 604 | 605 | 606 | 607 | 608 | 609 | 610 | 611 | 612 | 613 | 614 | 615 | 616 | 617 | 618 | 619 | 620 | 621 | 622 | 623 | 624 | 625 | 626 | 627 | 628 | 629 | 630 | 631 | 632 | 633 | 634 | 635 | 636 | 637 | 638 | 639 | 640 | 641 | 642 | 643 | 644 | 645 | 646 | 647 | 648 | 649 | 650 | 651 | 652 | 653 | 654 | 655 | 656 | 657 | 658 | 659 | 660 | 661 | 662 | 663 | 664 | 665 | 666 | 667 | 668 | 669 | 670 | 671 | 672 | 673 | 674 | 675 | 676 | 677 | 678 | 679 | 680 | 681 | 682 | 683 | 684 | 685 | 686 | 687 | 688 | 689 | 690 | 691 | 692 | 693 | 694 | 695 | 696 | 697 | 698 | 699 | 700 | 701 | 702 | 703 | 704 | 705 | 706 | 707 | 708 | 709 | 710 | 711 | 712 | 713 | 714 | 715 | 716 | 717 | 718 | 719 | 720 | 721 | 722 | 723 | 724 | 725 | 726 | 727 | 728 | 729 | 730 | 731 | 732 | 733 | 734 | 735 | 736 | 737 | 738 | 739 | 740 | 741 | 742 | 743 | 744 | 745 | 746 | 747 | 748 | 749 | 750 | 751 | 752 | 753 | 754 | 755 | 756 | 757 | 758 | 759 | 760 | 761 | 762 | 763 | 764 | 765 | 766 | 767 | 768 | 769 | 770 | 771 | 772 | 773 | 774 | 775 | 776 | 777 | 778 | 779 | 780 | 781 | 782 | 783 | 784 | 785 | 786 | 787 | 788 | 789 | 790 | 791 | 792 | 793 | 794 | 795 | 796 | 797 | 798 | 799 | 800 | 801 | 802 | 803 | 804 | 805 | 806 | 807 | 808 | 809 | 810 | 811 | 812 | 813 | 814 | 815 | 816 | 817 | 818 | 819 | 820 | 821 | 822 | 823 | 824 | 825 | 826 | 827 | 828 | 829 | 830 | 831 | 832 | 833 | 834 | 835 | 836 | 837 | 838 | 839 | 840 | 841 | 842 | 843 | 844 | 845 | 846 | 847 | 848 | 849 | 850 | 851 | 852 | 853 | 854 | 855 | 856 | 857 | 858 | 859 | 860 | 861 | 862 | 863 | 864 | 865 | 866 | 867 | 868 | 869 | 870 | 871 | 872 | 873 | 874 | 875 | 876 | 877 | 878 | 879 | 880 | 881 | 882 | 883 | 884 | 885 | 886 | 887 | 888 | 889 | 890 | 891 | 892 | 893 | 894 | 895 | 896 | 897 | 898 | 899 | 900 | 901 | 902 | 903 | 904 | 905 | 906 | 907 | 908 | 909 | 910 | 911 | 912 | 913 | 914 | 915 | 916 | 917 | 918 | 919 | 920 | 921 | 922 | 923 | 924 | 925 | 926 | 927 | 928 | 929 | 930 | 931 | 932 | 933 | 934 | 935 | 936 | 937 | 938 | 939 | 940 | 941 | 942 | 943 | 944 | 945 | 946 | 947 | 948 | 949 | 950 | 951 | 952 | 953 | 954 | 955 | 956 | 957 | 958 | 959 | 960 | 961 | 962 | 963 | 964 | 965 | 966 | 967 | 968 | 969 | 970 | 971 | 972 | 973 | 974 | 975 | 976 | 977 | 978 | 979 | 980 | 981 | 982 | 983 | 984 | 985 | 986 | 987 | 988 | 989 | 990 | 991 | 992 | 993 | 994 | 995 | 996 | 997 | 998 | 999 | 1000;
type TimeComparisonOperatorToken = `${ValueComparisonOperatorToken} ${NumberRangeToken} ${TimePeriodToken} ${TimeChronologyToken}`;

type QuantitySpecialToken = 'everything';
type InstanceSpecialToken = 'new';

type ToolToken = 'dictionary';






// aggregate union tyoes 
type PrimaryToken = PrimaryTokenType1 | PrimaryTokenType2 | PrimaryTokenType3 | PrimaryTokenType4;
type SecondaryToken = SecondaryTokenType1 | SecondaryTokenType2 | SecondaryTokenType3;
type TertiaryToken = TertiaryTokenType1 | ConditionTokenToken;

// compound types
type UseStatementTemplate = `${PrimaryTokenType1} {namespace} ${SecondaryTokenType1} ${ToolToken} ${TertiaryTokenType1} {url}.`;
type DefineStatementTemplate = `${PrimaryTokenType2} {alias} ${SecondaryTokenType1} {object iri or literal}`;
type ImportStatementTemplate1 = `Include {0} ${SecondaryTokenType2} {1}`;
type ImportStatementTemplate2 = `Include {0} ${SecondaryTokenType2} {1}`;
type ImportStatementTemplate3 = ImportStatementTemplate1 | ImportStatementTemplate2;

type ConditionalImportStatementTemplate = `${PrimaryTokenType3} {0} ${SecondaryTokenType2} {1} ${ConditionTokenToken} {2]}`;
type FilterStatementTemplate1 = `${PrimaryTokenType3} ${InstanceModifierToken} {0} ${ConditionTokenToken} {1}`;
type FilterStatementTemplate2 = `${PrimaryTokenType3} ${InstanceModifierToken} {0} ${ConditionTokenToken} {1}`;


type Templates = UseStatementTemplate | DefineStatementTemplate; //all templates

// type TestPhrase = `${PrimaryToken} / ${SecondaryToken}`;

// const example: Templates = "";

