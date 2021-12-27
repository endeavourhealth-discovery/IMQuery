const { v4 } = require('uuid');

export class Query {
    public id?: string | null;
    public iri?: string | null;
    public name?: string | null;
    public description?: string | null;
    public data?: any | null;

    // constructor(id?: string, iri?: string, name?: string, description?: string, data?: any) {
    constructor(query?: Query)
    constructor(query: Query) {

        this.id = query.id ? query.id : v4();
        this.iri = query.iri ? query.iri : "im:Q_{0}";
        this.name = query.name ? query.name : "Untitled Dataset";
        this.description = query.description ? query.description : null;
        this.data = query.data ? query.data : null;
    }


    // use setters to check  validity of value, throw exception otherwise throew new Error('Iri is invalid');e.g. datamodel entity iri.



}

// export interface query {
//     id: string;
//     iri: string;
//     name: string;
//     description: string | null;
//     data: any | null;
//     mainDataType: string | null;
// }

// interface Steps {
//     id: string;
//     iri: string;
//     name: string;
//     description: string | null;
//     searchTags: string | null;
//     action: "include" | "exclude";
// }


export class Examples {

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

    public static QOF_CHD005_v2 = {
        id: 3000000,
        iri: "im:Q_QOF_CHD005",
        name: "QOF CHD005",
        description: "The percentage of patients registered at a GP practice with coronary heart disease with a record in the preceding 12 months that aspirin, an alternative anti-platelet therapy, or an anti-coagulant is being taken.",
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
            meta: {
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
                        id: 3000001,
                        name: "Registered patients",
                        iri: "im:Q_Step_RegisteredPatients",
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
                            name: "Draft",
                            iri: "http://endhealth.info/im#Draft"
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
                            name: "Discovery",
                            iri: "http://endhealth.info/im#"
                        },
                        entityType: [{
                            name: "Step",
                            iri: "http://endhealth.info/im#Q_Step"
                        }],
                        status: {
                            name: "Draft",
                            iri: "http://endhealth.info/im#Draft"
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
            },
            sourceOrganisations: {
                set: "im:Q_OrgSet_AllAllowable",
                name: "All Allowable Organisations (set)",
                setMembers: ["im:Q_Org_F84081", "im:Q_Org_F84083"],
                setFetchDate: "26/12/2021",
            },
            mainSubject: "im:Patient",
            steps: [


            ],
            output: [],
            export: {
                format: "",
            },



        },

    }
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

