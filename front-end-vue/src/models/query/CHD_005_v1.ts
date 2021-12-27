public static QOF_CHD005 = {
    id: "9ee8061d-267f-4b4d-95ad-1a435db7fdc5",
    iri: "im:Q_QOF_CHD005",
    name: "QOF CHD005",
    description: "The percentage of patients registered at a GP practice with coronary heart disease and a record in the preceding 12 months that aspirin, an alternative anti-platelet therapy, or an anti-coagulant is being taken.",
    data: {
        mainDataType: "im:Patient",
        selectedOrganisationsIri: "im:VSET_OrgAllAllowable",
        selectedOrganisationsListIris: [],
        steps: [
            {
                id: "56d94da4-1bd0-4a87-86e9-4d3a74e28060",
                name: "Registered patients",
                iri: "dds:Step_RegisteredPatients",
                searchterms: ["registered", "actively registered", "currently registered", "GMS register"],
                keyword: "Include all healthrecords from",
                copy: [
                    {
                        name: "Discovery Data Service",
                        iri: "im:DDS",
                    },
                ],
                meta: {
                    viewCount: 32,
                    patientCount: "1.3M"
                },
                inclusionCriteria: [
                    {
                        id: "6fa641ee-cb6b-4137-b510-6b314ff3e353",
                        modifier: {
                            iri: "im:modifier_latest",
                            name: "latest",
                        },
                        datamodelEntity: {
                            iri: "http://endhealth.info/im#EpisodeOfCare",
                            name: "Episode of Care"
                        },
                        constraints: [
                            {
                                id: "96b161cd-f16c-4d2f-8e59-719aa7b505d3",
                                itemType: "collection",
                                booleanOperator: "and",
                                children: [
                                    {
                                        id: "7666bfc5-18cf-4411-8438-d47939e563bf",
                                        itemType: "item",
                                        booleanOperator: "",
                                        children: [
                                            {
                                                id: "7c432f33-36e3-4132-9563-25464b43047e",
                                                datamodelProperty: {
                                                    property: {
                                                        iri: "im:Concept",
                                                        name: "Codeable Concept",
                                                    },
                                                    type: {
                                                        iri: "http://endhealth.info/im#894281000252100",
                                                        name: "Ontological Concept",
                                                    },
                                                },
                                                comparisons: [{
                                                    comparisonOperator: "is",
                                                    comparators: [
                                                        {
                                                            value: {
                                                                iri: "im:CSET_Registered",
                                                                name: "Registered",
                                                            },
                                                            type: {
                                                                iri: "im:Concept",
                                                                name: "Ontological Concept",
                                                            },
                                                        },
                                                    ],
                                                }],
                                            }
                                        ]
                                    },
                                    {
                                        id: "fcbe6b9a-5484-404c-81b2-c105e519269c",
                                        itemType: "collection",
                                        booleanOperator: "or",
                                        children: [
                                            {
                                                id: "3fff11b2-1603-491d-9b83-41f0b04f5bef",
                                                itemType: "item",
                                                booleanOperator: "",
                                                children: [
                                                    {
                                                        datamodelProperty: {
                                                            property: {
                                                                iri: "im:effectiveDate",
                                                                name: "Effective Date",
                                                            },
                                                            type: {
                                                                iri: "im:DateTime",
                                                                name: "Date Time",
                                                            },
                                                        },
                                                        comparisons: [{
                                                            comparisonOperator: "does not exist",
                                                            comparators: []
                                                        }],
                                                    }
                                                ]
                                            },
                                            {
                                                id: "35f79f3e-61fb-43b3-97a3-5c4b2f2a5924",
                                                itemType: "item",
                                                booleanOperator: "",
                                                children: [
                                                    {
                                                        datamodelProperty: {
                                                            property: {
                                                                iri: "im:endDate",
                                                                name: "End Date",
                                                            },
                                                            type: {
                                                                iri: "im:DateTime",
                                                                name: "Date Time",
                                                            },
                                                        },
                                                        comparisons: [{
                                                            comparisonOperator: "is before",
                                                            comparators: [
                                                                {
                                                                    value: {
                                                                        iri: "im:UserInput",
                                                                        name: "01/04/2020",
                                                                    },
                                                                    type: {
                                                                        iri: "im:DateTime",
                                                                        name: "Date Time",
                                                                    },
                                                                },
                                                            ],
                                                        }],
                                                    }
                                                ]
                                            },
                                        ]
                                    },
                                ]
                            },

                        ]

                    }
                ],
                exclusionCriteria: [],
            },
            {
                id: "e55d01bb-8e14-4256-ac0e-de74bb0a047d",
                name: "Diagnosis of CHD",
                iri: "dds:Step_DiagnosisCHD",
                searchterms: ["chd"],
                keyword: "Include all healthrecords from",
                copy: [
                    {
                        name: "Registered patients",
                        iri: "dds:Step_RegisteredPatients",
                    },
                ],
                meta: {
                    viewCount: 32,
                    patientCount: "1.3M"
                },
                inclusionCriteria: [
                    {
                        id: "e2f19e1c-e31e-414d-9815-6e4d8e282290",
                        modifier: {
                            iri: "im:modifier_any",
                            name: "any",
                        },
                        datamodelEntity: {
                            iri: "http://endhealth.info/im#ProblemOrCondition",
                            name: "Problem or Condition"
                        },
                        constraints: [
                            {
                                id: "271724a8-44ad-4893-9094-246980c4cb15",
                                itemType: "item",
                                booleanOperator: "",
                                children: [
                                    {
                                        id: "7c432f33-36e3-4132-9563-25464b43047e",
                                        datamodelProperty: {
                                            property: {
                                                iri: "im:Concept",
                                                name: "Codeable Concept",
                                            },
                                            type: {
                                                iri: "http://endhealth.info/im#894281000252100",
                                                name: "Ontological Concept",
                                            },
                                        },
                                        comparisons: [{
                                            comparisonOperator: "is",
                                            comparators: [
                                                {
                                                    value: {
                                                        iri: "im:CSET_CHD",
                                                        name: "Coronary Artery Disease (excl Haemorrhagic Stroke)",
                                                    },
                                                    type: {
                                                        iri: "im:Concept",
                                                        name: "Ontological Concept",
                                                    },
                                                },
                                            ],
                                        }],
                                    }
                                ]
                            },

                        ]

                    }
                ],
                exclusionCriteria: [],
            },
        ],
        output: [],
        export: {
            format: "",
        },
    }
}
