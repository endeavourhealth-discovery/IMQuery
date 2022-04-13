import { v4 } from "uuid";
import _ from "lodash";
// import jmp from "jmp";
import jsonpath from "jsonpath";
import axios, { AxiosResponse } from "axios";
import EntityService from "@/services/EntityService";

export enum entityTypes {
    datamodel = 'sh:NodeShape',
    function = 'sh:Function',
    concept = 'im:Concept',
}

// An extract of CoreOntology that is cached in the browsers localStorage
export default class Ontology {


    private _ontology: any;
    public get ontology(): any {
        return this["_ontology"];
    }
    public set ontology(value: any) {
        if (value["@context"] && value["@graph"] || value["entities"]) {
            this["_@context"] = value["@context"];
            this["_@graph"] = value["@graph"];
            this["_entities"] = value["entities"];
        } else {

            throw new Error("Unrecognised Ontology file content");
        }
    }


    public '_@context': any;

    public '_@graph': any;

    private '_entities': any;


    public loadEntities(entities: any) {
        this._entities = [...this._entities, ...entities];
    }

    public entities = new class {

        constructor(public superThis: Ontology) {
            return superThis._entities;
        }

        public byIri(iri: string): any {
            if (iri != "") {

                const _results = this.superThis._entities.filter((entity: any) => entity["@id"] == iri);
                // console.log("", )
                return _results;
                // return jmp.search(this.superThis._entities, `[?"@id" == \`${iri}\`]`)[0]
            }
            else {
                throw new Error("Iri parameter is an empty string");
            }
        }



        // public byType(entityType: entityTypes | string): any {
        //     console.log("entityType", entityType)

        //     const _results = this._entities.filter((entity: any) => {
        //         // console.log(entity["rdf:type"])
        //         return entity["rdf:type"]?.includes(entityType)
        //     });
        //     // const _results = this._entities.filter((entity: any) => entity["rdf:type"]?.includes(entityType));
        //     return _results;
        //     // return jmp.search(this.superThis._entities, `[?"rdf:type"[?"@id" == \`${entityType}\`]]`)
        // }

    }(this);


    constructor() {
        const _filenames = ["CoreOntology.json", "AdditionalOntology.json"]; //can add your own definitions e.g. for profiles and random concept sets.

        _filenames.forEach(async (filename: string) => {
            await EntityService.getData(filename)
                .then(data => {
                    if (data["entities"]) {
                        this._entities = data["entities"]
                    } else {
                        data.forEach((item: any) => this._entities.push(item));
                    }

                })
                .catch(err => {
                    console.error("Failed to fetch userdata", err);
                });
        });
    }



    // if you want to load the file from cloud
    // the url to the cloudfront url / S3 bucket containing the ontology file
    // constructor(ontologyURL = import.meta.env.VITE_ONTOLOGY_URL as string) {

    //     if (!ontologyURL || ontologyURL == "") {

    //         throw new Error("No Ontology URL specified on instantiation. Pass a URL to entities in your ontology in JSON-LD format i.e. '@context', '@graph' and 'entities'");
    //     }

    //     this.fetchOntology(ontologyURL)
    //         .then((res) => {
    //             this.ontology = res;
    //             console.log("ontology loaded", res);
    //         })
    //         .catch((err) => {
    //             throw new Error("Failed to fetch Ontology from specified URL. Error message:" + err);
    //         });;
    //     return this;
    // }


    public async fetchOntology(ontologyURL: string): Promise<AxiosResponse<any>> {


        const _fileName = ontologyURL.substring(ontologyURL.lastIndexOf('/') + 1); //CoreOntology.json

        let _shouldCacheRefresh = true;

        //checks a file's last modified timestamp found in the response header to determine if cache needs to be refreshed
        await axios.head(ontologyURL).then((res => {

            // console.log("localStorage.getItem(`cache_last_modified_${_fileName}`)", localStorage.getItem(`cache_last_modified_${_fileName}`))
            // console.log(" res.headers[last-modified]", res.headers["last-modified"])


            if ((localStorage.getItem(`cache_last_modified_${_fileName}`) != res.headers["last-modified"])) {
                _shouldCacheRefresh = true;
                localStorage.setItem(`cache_last_modified_${_fileName}`, res.headers["last-modified"])
            } else {
                _shouldCacheRefresh = false;
            }

        }))

        if (_shouldCacheRefresh) {

            console.log("Ontology fetched from server");
            const _res = await axios.get(ontologyURL);
            localStorage.setItem(`cache_data_${_fileName}`, JSON.stringify(_res.data));
            return _res.data;


        } else {
            console.log("Ontology fetched from localstorage");
            return JSON.parse(localStorage.getItem(`cache_data_${_fileName}`) as string);
        }
    };


}


export const DataModel = [
    {
      iri: "http://endhealth.info/im#AllergyIntoleranceAndAdverseReaction",
      name: "Allergy, intolerance and adverse reaction  (record type)",
      summary: {
        name: "Allergy, intolerance and adverse reaction  (record type)",
        iri: "http://endhealth.info/im#AllergyIntoleranceAndAdverseReaction",
        description:
          'Allergies, intolerance and adverse substance reactions are grouped together and are extensions of simple observations whereby the simple observation code includes the full concept of the allergy e.g.... "allergy to penicillin"<p>The additional data relates to more specific information about the substance and reaction.',
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Allergy, intolerance and adverse reaction  (record type)",
      },
      properties: [
        {
          property: {
            name: "manifestation",
            "@id": "http://endhealth.info/im#manifestation",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "manifestation description",
            "@id": "http://endhealth.info/im#manifestationDescription",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "observations",
            "@id": "http://endhealth.info/im#observations",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "severity",
            "@id": "http://endhealth.info/im#severity",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "substance",
            "@id": "http://endhealth.info/im#substance",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Value set - allergy and adverse reactions",
            "@id": "http://endhealth.info/im#VSET_RecordType_Allergy",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#CarePlan",
      name: "Care plan (record type)",
      summary: {
        name: "Care plan (record type)",
        iri: "http://endhealth.info/im#CarePlan",
        description:
          "A dynamic document that notes the plan regarding the care of a patient. As in the document structure they tend to specialise and thus this highlights only the generic sections.",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Care plan  (record type)",
      },
      properties: [
        {
          property: {
            name: "associated practitioners",
            "@id": "http://endhealth.info/im#associatedPractitioners",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "associated teams",
            "@id": "http://endhealth.info/im#associatedTeams",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "document Status",
            "@id": "http://endhealth.info/im#documentStatus",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "linked activities",
            "@id": "http://endhealth.info/im#linkedActivities",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "linked episodes",
            "@id": "http://endhealth.info/im#linkedEpisodes",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "linked Headings",
            "@id": "http://endhealth.info/im#linkedHeadings",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "parent plan",
            "@id": "http://endhealth.info/im#parentPlan",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "time period",
            "@id": "http://endhealth.info/im#timePeriod",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "type of plan",
            "@id": "http://endhealth.info/im#typeOfPlan",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "description",
            "@id": "http://endhealth.info/im#description",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#DiagnosticReport",
      name: "Diagnostic report  (record type)",
      summary: {
        name: "Diagnostic report  (record type)",
        iri: "http://endhealth.info/im#DiagnosticReport",
        description:
          "A diagnostic report is the set of information that is typically provided by a diagnostic service when investigations are complete. It includes a mix of component events often arranged hierarchically, some structured, some unstructured.<p>A diagnostic report has a header and set of components",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Diagnostic report  (record type)",
      },
      properties: [
        {
          property: {
            name: "diagnostic service",
            "@id": "http://endhealth.info/im#diagnosticService",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "identifier",
            "@id": "http://endhealth.info/im#identifier",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "report type",
            "@id": "http://endhealth.info/im#reportType",
          },
          type: {
            name: "Concept set - Value set - Diagnostic report categories",
            "@id": "http://endhealth.info/im#VSET_1000001",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "service category",
            "@id": "http://endhealth.info/im#serviceCategory",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "report issue date",
            "@id": "http://endhealth.info/im#reportIssueDate",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#Encounter",
      name: "Encounter (record type)",
      summary: {
        name: "Encounter (record type)",
        iri: "http://endhealth.info/im#Encounter",
        description:
          "An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Encounter (record type)",
      },
      properties: [
        {
          property: {
            name: "additional Practitioners",
            "@id": "http://endhealth.info/im#additionalPractitioners",
          },
          type: {
            name: "Practitioner in role  (record type)",
            "@id": "http://endhealth.info/im#PractitionerInRole",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "completion Status",
            "@id": "http://endhealth.info/im#completionStatus",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "duration",
            "@id": "http://endhealth.info/im#duration",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          minExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "has section",
            "@id": "http://endhealth.info/im#hasSection",
          },
          type: {
            name: "Section (structural)",
            "@id": "http://endhealth.info/im#Section",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "linked appointment",
            "@id": "http://endhealth.info/im#linkedAppointment",
          },
          type: {
            name: "Appointment  (record type)",
            "@id": "http://endhealth.info/im#Appointment",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "linked care episode",
            "@id": "http://endhealth.info/im#linkedCareEpisode",
          },
          type: {
            name: "Episode of care  (record type)",
            "@id": "http://endhealth.info/im#EpisodeOfCare",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "location",
            "@id": "http://endhealth.info/im#location",
          },
          type: {
            name: "Location  (record type)",
            "@id": "http://endhealth.info/im#Location",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "providing Organisation/ services or departments",
            "@id":
              "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "is subencounter of",
            "@id": "http://endhealth.info/im#isSubEncounterOf",
          },
          type: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Encounter",
            "@id": "http://endhealth.info/im#1741000252102",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#AccidentAndEmergencyEncounter",
      name: "Accident and emergency encounter (record type)",
      summary: {
        name: "Accident and emergency encounter (record type)",
        iri: "http://endhealth.info/im#AccidentAndEmergencyEncounter",
        description:
          "An entry recording an encounter in the A&E unit. Specialised properties.<p>common data model attributes for Accident and emergency encounter",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Accident and emergency encounter (record type)",
      },
      properties: [
        {
          property: {
            name: "a&e department type",
            "@id": "http://endhealth.info/im#aAndeDepartmentType",
          },
          type: {
            name: "Accident and emergency (setting)",
            "@id": "http://endhealth.info/im#651000252108",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "has a&e attendance source of",
            "@id": "http://endhealth.info/im#hasAandeAttendanceSourceOf",
          },
          type: { "@id": "http://snomed.info/sct#999002991000000109" },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "has a&e category of attendance of",
            "@id": "http://endhealth.info/im#hasAandeCategoryOfAttendanceOf",
          },
          type: {
            name: "Accident and emergency attendance or follow up",
            "@id": "http://endhealth.info/im#461000252108",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "has arrival mode",
            "@id": "http://endhealth.info/im#hasArrivalMode",
          },
          type: { "@id": "http://snomed.info/sct#999002981000000107" },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "treatment function for service for which admitted",
            "@id":
              "http://endhealth.info/im#treatmentFunctionForServiceForWhichAdmitted",
          },
          type: {
            name: "Services (qualifier value)",
            "@id": "http://snomed.info/sct#224930009",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Accident and emergency encounter",
            "@id": "http://endhealth.info/im#1151000252104",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "additional Practitioners",
            "@id": "http://endhealth.info/im#additionalPractitioners",
          },
          type: {
            name: "Practitioner in role  (record type)",
            "@id": "http://endhealth.info/im#PractitionerInRole",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "completion Status",
            "@id": "http://endhealth.info/im#completionStatus",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "duration",
            "@id": "http://endhealth.info/im#duration",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          minExclusive: "1",
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "has section",
            "@id": "http://endhealth.info/im#hasSection",
          },
          type: {
            name: "Section (structural)",
            "@id": "http://endhealth.info/im#Section",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "linked appointment",
            "@id": "http://endhealth.info/im#linkedAppointment",
          },
          type: {
            name: "Appointment  (record type)",
            "@id": "http://endhealth.info/im#Appointment",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "linked care episode",
            "@id": "http://endhealth.info/im#linkedCareEpisode",
          },
          type: {
            name: "Episode of care  (record type)",
            "@id": "http://endhealth.info/im#EpisodeOfCare",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "location",
            "@id": "http://endhealth.info/im#location",
          },
          type: {
            name: "Location  (record type)",
            "@id": "http://endhealth.info/im#Location",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "providing Organisation/ services or departments",
            "@id":
              "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "is subencounter of",
            "@id": "http://endhealth.info/im#isSubEncounterOf",
          },
          type: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#CriticalCareEncounter",
      name: "Critical care encounter (record type)",
      summary: {
        name: "Critical care encounter (record type)",
        iri: "http://endhealth.info/im#CriticalCareEncounter",
        description:
          "An entry recording information about a criticial care encounter.<p>common data model attributes for Critical care encounter",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Critical care encounter (record type)",
      },
      properties: [
        {
          property: {
            name: "has admission source",
            "@id": "http://endhealth.info/im#hasAdmissionSource",
          },
          type: {
            name: "Critical care admission source",
            "@id": "http://endhealth.info/im#1041000252100",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "has critical care unit function",
            "@id": "http://endhealth.info/im#hasCriticalCareUnitFunction",
          },
          type: {
            name: "Critical care unit function",
            "@id": "http://endhealth.info/im#211000252109",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Critical care encounter",
            "@id": "http://endhealth.info/im#841000252107",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "additional Practitioners",
            "@id": "http://endhealth.info/im#additionalPractitioners",
          },
          type: {
            name: "Practitioner in role  (record type)",
            "@id": "http://endhealth.info/im#PractitionerInRole",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "completion Status",
            "@id": "http://endhealth.info/im#completionStatus",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "duration",
            "@id": "http://endhealth.info/im#duration",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          minExclusive: "1",
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "has section",
            "@id": "http://endhealth.info/im#hasSection",
          },
          type: {
            name: "Section (structural)",
            "@id": "http://endhealth.info/im#Section",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "linked appointment",
            "@id": "http://endhealth.info/im#linkedAppointment",
          },
          type: {
            name: "Appointment  (record type)",
            "@id": "http://endhealth.info/im#Appointment",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "linked care episode",
            "@id": "http://endhealth.info/im#linkedCareEpisode",
          },
          type: {
            name: "Episode of care  (record type)",
            "@id": "http://endhealth.info/im#EpisodeOfCare",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "location",
            "@id": "http://endhealth.info/im#location",
          },
          type: {
            name: "Location  (record type)",
            "@id": "http://endhealth.info/im#Location",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "providing Organisation/ services or departments",
            "@id":
              "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "is subencounter of",
            "@id": "http://endhealth.info/im#isSubEncounterOf",
          },
          type: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#HospitalAdmission",
      name: "Hospital admission (record type)",
      summary: {
        name: "Hospital admission (record type)",
        iri: "http://endhealth.info/im#HospitalAdmission",
        description:
          "An entry recording the event of a hospital admission. Has specialised properties.<p>common data model attributes for Hospital admission",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Hospital admission (record type)",
      },
      properties: [
        {
          property: {
            name: "administrative category",
            "@id": "http://endhealth.info/im#administrativeCategory",
          },
          type: {
            name: "Administrative category code (NHS DD)",
            "@id": "http://endhealth.info/im#2451000252104",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "has admission classification of patient",
            "@id": "http://endhealth.info/im#hasAdmissionClassificationOfPatient",
          },
          type: {
            name: "Admitted patient classification",
            "@id": "http://endhealth.info/im#161000252101",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "has admission method",
            "@id": "http://endhealth.info/im#hasAdmissionMethod",
          },
          type: {
            name: "Admission method",
            "@id": "http://endhealth.info/im#1581000252101",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "has admission source",
            "@id": "http://endhealth.info/im#hasAdmissionSource",
          },
          type: {
            name: "Admission source",
            "@id": "http://endhealth.info/im#1391000252106",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "is component of",
            "@id": "http://endhealth.info/im#isComponentOf",
          },
          type: {
            name: "Hospital inpatient stay (record type)",
            "@id": "http://endhealth.info/im#HospitalInpatientStay",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Hospital admission",
            "@id": "http://endhealth.info/im#1281000252104",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "additional Practitioners",
            "@id": "http://endhealth.info/im#additionalPractitioners",
          },
          type: {
            name: "Practitioner in role  (record type)",
            "@id": "http://endhealth.info/im#PractitionerInRole",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "completion Status",
            "@id": "http://endhealth.info/im#completionStatus",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "duration",
            "@id": "http://endhealth.info/im#duration",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          minExclusive: "1",
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "has section",
            "@id": "http://endhealth.info/im#hasSection",
          },
          type: {
            name: "Section (structural)",
            "@id": "http://endhealth.info/im#Section",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "linked appointment",
            "@id": "http://endhealth.info/im#linkedAppointment",
          },
          type: {
            name: "Appointment  (record type)",
            "@id": "http://endhealth.info/im#Appointment",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "linked care episode",
            "@id": "http://endhealth.info/im#linkedCareEpisode",
          },
          type: {
            name: "Episode of care  (record type)",
            "@id": "http://endhealth.info/im#EpisodeOfCare",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "location",
            "@id": "http://endhealth.info/im#location",
          },
          type: {
            name: "Location  (record type)",
            "@id": "http://endhealth.info/im#Location",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "providing Organisation/ services or departments",
            "@id":
              "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "is subencounter of",
            "@id": "http://endhealth.info/im#isSubEncounterOf",
          },
          type: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#HospitalDischarge",
      name: "Hospital discharge (record type)",
      summary: {
        name: "Hospital discharge (record type)",
        iri: "http://endhealth.info/im#HospitalDischarge",
        description:
          "An entry describing the event of a hospital discharge. Has specialised encounter properties.<p>common data model attributes for Hospital discharge (entry)",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Hospital discharge (record type)",
      },
      properties: [
        {
          property: {
            name: "has discharge destination",
            "@id": "http://endhealth.info/im#hasDischargeDestination",
          },
          type: {
            name: "Discharge destination",
            "@id": "http://endhealth.info/im#921000252109",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "has discharge method",
            "@id": "http://endhealth.info/im#hasDischargeMethod",
          },
          type: {
            name: "Discharge method",
            "@id": "http://endhealth.info/im#731000252105",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "is component of",
            "@id": "http://endhealth.info/im#isComponentOf",
          },
          type: {
            name: "Hospital inpatient stay (record type)",
            "@id": "http://endhealth.info/im#HospitalInpatientStay",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Hospital discharge",
            "@id": "http://endhealth.info/im#411000252105",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "additional Practitioners",
            "@id": "http://endhealth.info/im#additionalPractitioners",
          },
          type: {
            name: "Practitioner in role  (record type)",
            "@id": "http://endhealth.info/im#PractitionerInRole",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "completion Status",
            "@id": "http://endhealth.info/im#completionStatus",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "duration",
            "@id": "http://endhealth.info/im#duration",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          minExclusive: "1",
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "has section",
            "@id": "http://endhealth.info/im#hasSection",
          },
          type: {
            name: "Section (structural)",
            "@id": "http://endhealth.info/im#Section",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "linked appointment",
            "@id": "http://endhealth.info/im#linkedAppointment",
          },
          type: {
            name: "Appointment  (record type)",
            "@id": "http://endhealth.info/im#Appointment",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "linked care episode",
            "@id": "http://endhealth.info/im#linkedCareEpisode",
          },
          type: {
            name: "Episode of care  (record type)",
            "@id": "http://endhealth.info/im#EpisodeOfCare",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "location",
            "@id": "http://endhealth.info/im#location",
          },
          type: {
            name: "Location  (record type)",
            "@id": "http://endhealth.info/im#Location",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "providing Organisation/ services or departments",
            "@id":
              "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "is subencounter of",
            "@id": "http://endhealth.info/im#isSubEncounterOf",
          },
          type: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#HospitalInpatientStay",
      name: "Hospital inpatient stay (record type)",
      summary: {
        name: "Hospital inpatient stay (record type)",
        iri: "http://endhealth.info/im#HospitalInpatientStay",
        description:
          "An entry describing the stay of a patient in hospital. As well as spcialised properties it has sub component encounters of admission and discharge.<p>common data model attributes for Hospital inpatient stay",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Hospital inpatient stay (record type)",
      },
      properties: [
        {
          property: {
            name: "administrative category",
            "@id": "http://endhealth.info/im#administrativeCategory",
          },
          type: {
            name: "Administrative category code (NHS DD)",
            "@id": "http://endhealth.info/im#2451000252104",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "treatment function type",
            "@id": "http://endhealth.info/im#treatmentFunctionType",
          },
          type: {
            name: "Services (qualifier value)",
            "@id": "http://snomed.info/sct#224930009",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Hospital inpatient stay",
            "@id": "http://endhealth.info/im#2551000252103",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "additional Practitioners",
            "@id": "http://endhealth.info/im#additionalPractitioners",
          },
          type: {
            name: "Practitioner in role  (record type)",
            "@id": "http://endhealth.info/im#PractitionerInRole",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "completion Status",
            "@id": "http://endhealth.info/im#completionStatus",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "duration",
            "@id": "http://endhealth.info/im#duration",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          minExclusive: "1",
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "has section",
            "@id": "http://endhealth.info/im#hasSection",
          },
          type: {
            name: "Section (structural)",
            "@id": "http://endhealth.info/im#Section",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "linked appointment",
            "@id": "http://endhealth.info/im#linkedAppointment",
          },
          type: {
            name: "Appointment  (record type)",
            "@id": "http://endhealth.info/im#Appointment",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "linked care episode",
            "@id": "http://endhealth.info/im#linkedCareEpisode",
          },
          type: {
            name: "Episode of care  (record type)",
            "@id": "http://endhealth.info/im#EpisodeOfCare",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "location",
            "@id": "http://endhealth.info/im#location",
          },
          type: {
            name: "Location  (record type)",
            "@id": "http://endhealth.info/im#Location",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "providing Organisation/ services or departments",
            "@id":
              "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "is subencounter of",
            "@id": "http://endhealth.info/im#isSubEncounterOf",
          },
          type: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#HospitalOutpatientEncounter",
      name: "Hospital outpatient encounter (record type)",
      summary: {
        name: "Hospital outpatient encounter (record type)",
        iri: "http://endhealth.info/im#HospitalOutpatientEncounter",
        description:
          "An entry describing a hospital outpatient attendance.<p>common data model attributes for Hospital outpatient encounter",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Hospital outpatient encounter (record type)",
      },
      properties: [
        {
          property: {
            name: "has attendance outcome",
            "@id": "http://endhealth.info/im#hasAttendanceOutcome",
          },
          type: {
            name: "Attendance outcome",
            "@id": "http://endhealth.info/im#2171000252103",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "has attendance status",
            "@id": "http://endhealth.info/im#hasAttendanceStatus",
          },
          type: {
            name: "Attended or not attended",
            "@id": "http://endhealth.info/im#2231000252106",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "treatment function type",
            "@id": "http://endhealth.info/im#treatmentFunctionType",
          },
          type: {
            name: "Services (qualifier value)",
            "@id": "http://snomed.info/sct#224930009",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Hospital outpatient encounter",
            "@id": "http://endhealth.info/im#2331000252104",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "additional Practitioners",
            "@id": "http://endhealth.info/im#additionalPractitioners",
          },
          type: {
            name: "Practitioner in role  (record type)",
            "@id": "http://endhealth.info/im#PractitionerInRole",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "completion Status",
            "@id": "http://endhealth.info/im#completionStatus",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "duration",
            "@id": "http://endhealth.info/im#duration",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          minExclusive: "1",
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "has section",
            "@id": "http://endhealth.info/im#hasSection",
          },
          type: {
            name: "Section (structural)",
            "@id": "http://endhealth.info/im#Section",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "linked appointment",
            "@id": "http://endhealth.info/im#linkedAppointment",
          },
          type: {
            name: "Appointment  (record type)",
            "@id": "http://endhealth.info/im#Appointment",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "linked care episode",
            "@id": "http://endhealth.info/im#linkedCareEpisode",
          },
          type: {
            name: "Episode of care  (record type)",
            "@id": "http://endhealth.info/im#EpisodeOfCare",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "location",
            "@id": "http://endhealth.info/im#location",
          },
          type: {
            name: "Location  (record type)",
            "@id": "http://endhealth.info/im#Location",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "providing Organisation/ services or departments",
            "@id":
              "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "is subencounter of",
            "@id": "http://endhealth.info/im#isSubEncounterOf",
          },
          type: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Encounter (record type)",
            "@id": "http://endhealth.info/im#Encounter",
          },
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#EpisodeOfCare",
      name: "Episode of care  (record type)",
      summary: {
        name: "Episode of care  (record type)",
        iri: "http://endhealth.info/im#EpisodeOfCare",
        description:
          "A care episode is an association between a patient and a healthcare provider during which time care is provided. The association implies that the provider has some responsibility for the provision of care during the period of time covered by the episode.<p>A care episode may be a concept that is explicitly stated. For example, GP registration is an explicit process by which the patient registers for care and in due course may be de-registered when they move elsewhere.<p>A care episode may otherwise be deduced from the data provided , usually relating to encounters. For example the acceptance of a referral or the attendance at accident and emergency provide episode of care start points. Discharge from an outpatient clinical may be used to deduce the end of a care episode.",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          { name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" },
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Episode of care  (record type)",
      },
      properties: [
        {
          property: {
            name: "patient type",
            "@id": "http://endhealth.info/im#patientType",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "initiating Referral",
            "@id": "http://endhealth.info/im#initiatingReferral",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "linked Entries",
            "@id": "http://endhealth.info/im#linkedEntries",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#Immunisation",
      name: "Immunisation  (record type)",
      summary: {
        name: "Immunisation  (record type)",
        iri: "http://endhealth.info/im#Immunisation",
        description:
          "Immunisation extends a simple observation by providing more information about the immunisation procedure and vaccine used.<p>This is a summary of immunisation, (expected to be extended)",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          { name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" },
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Immunisation  (record type)",
      },
      properties: [
        {
          property: {
            name: "manufacturer",
            "@id": "http://endhealth.info/im#manufacturer",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "reaction",
            "@id": "http://endhealth.info/im#reaction",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "vaccination procedure",
            "@id": "http://endhealth.info/im#vaccinationProcedure",
          },
          type: {
            name: "Value set Immunisations - Care connect",
            "@id": "http://endhealth.info/im#VSET_Immunisations_CareConnect",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "vaccine product",
            "@id": "http://endhealth.info/im#vaccineProduct",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "batch number",
            "@id": "http://endhealth.info/im#batchNumber",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "dose sequence",
            "@id": "http://endhealth.info/im#doseSequence",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "doses required",
            "@id": "http://endhealth.info/im#dosesRequired",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "expiry date",
            "@id": "http://endhealth.info/im#expiryDate",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#MedicationOrder",
      name: "Medication order  (record type)",
      summary: {
        name: "Medication order  (record type)",
        iri: "http://endhealth.info/im#MedicationOrder",
        description:
          "A medication order is the actual prescription for a medication item. It represents the instance of the order derived from the medication statement. It inherits MOST fields from medication and has some additional items. However, field values for the order may be different from the field values of the medication statement so they are repeated for clarity",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          { name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" },
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Medication order  (record type)",
      },
      properties: [
        {
          property: {
            name: "course type",
            "@id": "http://endhealth.info/im#courseType",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "medication",
            "@id": "http://endhealth.info/im#medication",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "order Quantity- units",
            "@id": "http://endhealth.info/im#orderQuantity-Units",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {},
        },
        {
          property: {
            name: "prescription duration",
            "@id": "http://endhealth.info/im#prescriptionDuration",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "prescription duration units",
            "@id": "http://endhealth.info/im#prescriptionDurationUnits",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "additional instructions",
            "@id": "http://endhealth.info/im#additionalInstructions",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: { name: "dosage", "@id": "http://endhealth.info/im#dosage" },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "number from authorised count",
            "@id": "http://endhealth.info/im#numberFromAuthorisedCount",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "order quantity  number of units",
            "@id": "http://endhealth.info/im#orderQuantityNumberOfUnits",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#integer" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "pharmacy instructions",
            "@id": "http://endhealth.info/im#pharmacyInstructions",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#Observation",
      name: "Observation (record type)",
      summary: {
        name: "Observation (record type)",
        iri: "http://endhealth.info/im#Observation",
        description:
          "An observation is considered a type of health event that records some characteristic of the patient or some procedure performed on the patient, excluding the specialised events such as medication.<p>An observation in Discovery is much broader than an observation in FHIR. Because observations may be highly specialised, like encounters, only the generic properties are illustrated in this document.<p>The type of observation is deduced from the observation concept itself.<p>Observations may be linked at any level of nesting. In particular, tests and concept results observations are considered as 2 separate but linked observations, one for the test, the other for the result. This varies the Discovery observation model from the FHIR model that includes both test and result in the same observation.<p>For example, a blood pressure would be modelled as 3 observations as follows:<p>Observation 1Blood pressure<p>Observation 2Systolic blood pressure value= 120, part of observation 1<p>Observation 3Diastolic blood pressure value= 80, part of observation 2",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Observation (record type)",
      },
      properties: [
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#ProblemOrCondition",
      name: "Problem or condition  (record type)",
      summary: {
        name: "Problem or condition  (record type)",
        iri: "http://endhealth.info/im#ProblemOrCondition",
        description:
          'Problem is a patient and record management construct designed to help manage care. The main purposes of problem structures are to highlight significant issues and to group entries in the record to enable a narrative view categorised by a focus of care. In different care domains different terms are used such as "problem", "issue" or "need" but from a structural perspective they are the same.<p>A problem is always associated with at least one observation and therefore automatically shares its attribution.',
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Problem or condition  (record type)",
      },
      properties: [
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "anticipated duration",
            "@id": "http://endhealth.info/im#anticipatedDuration",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "parent problem",
            "@id": "http://endhealth.info/im#parentProblem",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "significance",
            "@id": "http://endhealth.info/im#significance",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "description",
            "@id": "http://endhealth.info/im#description",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#Procedure",
      name: "Procedure  (record type)",
      summary: {
        name: "Procedure  (record type)",
        iri: "http://endhealth.info/im#Procedure",
        description:
          "Procedure provides more information beyond a simple observation about an operation or observation relating to the outcome of the procedure.<p>Within Discovery, unlike FHIR a complex procedure description (that includes body site, laterality, method and nature of device) is represented by a Snomed expression in the observation concept.",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          { name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" },
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Procedure  (record type)",
      },
      properties: [
        {
          property: {
            name: "complications",
            "@id": "http://endhealth.info/im#complications",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "devices used",
            "@id": "http://endhealth.info/im#devicesUsed",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "follow ups",
            "@id": "http://endhealth.info/im#followUps",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "linked problems",
            "@id": "http://endhealth.info/im#linkedProblems",
          },
          type: {
            name: "Problem or condition  (record type)",
            "@id": "http://endhealth.info/im#ProblemOrCondition",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "outcome",
            "@id": "http://endhealth.info/im#outcome",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "performed period",
            "@id": "http://endhealth.info/im#performedPeriod",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "end time",
            "@id": "http://endhealth.info/im#endTime",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Value set -  Procedures",
            "@id": "http://endhealth.info/im#VSET_Category_Procedures",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#ReferralRequestOrProcedureRequest",
      name: "Referral Request or procedure request  (record type)",
      summary: {
        name: "Referral Request or procedure request  (record type)",
        iri: "http://endhealth.info/im#ReferralRequestOrProcedureRequest",
        description:
          "A referral request or (procedure request) includes request for advice or invitation to participate in care and is not limited to conventional referrals. A referral request often precedes the encounter or care transfer that occurs subsequently. Furthermore a referral request may accompany a care transfer e.g.... a request for input from a community health professional during the discharge process. The referral type is considered as the core observation concept<p>Referral inherits attribution",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Referral Request or procedure request  (record type)",
      },
      properties: [
        {
          property: {
            name: "linked episode",
            "@id": "http://endhealth.info/im#linkedEpisode",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "priority",
            "@id": "http://endhealth.info/im#priority",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "procedure or Service type requested",
            "@id": "http://endhealth.info/im#procedureOrServiceTypeRequested",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "recipient location",
            "@id": "http://endhealth.info/im#recipientLocation",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "recipient practitioner",
            "@id": "http://endhealth.info/im#recipientPractitioner",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "recipient service or organisation",
            "@id": "http://endhealth.info/im#recipientServiceOrOrganisation",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "referral mode",
            "@id": "http://endhealth.info/im#referralMode",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "referred by type",
            "@id": "http://endhealth.info/im#referredByType",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "request Reason",
            "@id": "http://endhealth.info/im#requestReason",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "source organisation",
            "@id": "http://endhealth.info/im#sourceOrganisation",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "speciality requested",
            "@id": "http://endhealth.info/im#specialityRequested",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "referral UBRN",
            "@id": "http://endhealth.info/im#referralUbrn",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "codeable Concept",
            "@id": "http://endhealth.info/im#concept",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "effective `date",
            "@id": "http://endhealth.info/im#effectiveDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "end date",
            "@id": "http://endhealth.info/im#endDate",
          },
          type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: { name: "status", "@id": "http://endhealth.info/im#status" },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "practitioner",
            "@id": "http://endhealth.info/im#hasPractitioner",
          },
          type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
          inheritedFrom: {
            name: "Patient related health event",
            "@id": "http://endhealth.info/im#PatientEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
    {
      iri: "http://endhealth.info/im#Appointment",
      name: "Appointment  (record type)",
      summary: {
        name: "Appointment  (record type)",
        iri: "http://endhealth.info/im#Appointment",
        description:
          "This is information about a particular appointment. Does not include the processes involved in slot booking itself",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { "@id": "http://endhealth.info/im#" },
        entityType: [
          { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
        ],
        isDescendentOf: [],
        match: "Appointment  (record type)",
      },
      properties: [
        {
          property: {
            name: "appointment category",
            "@id": "http://endhealth.info/im#appointmentCategory",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "attendance history",
            "@id": "http://endhealth.info/im#attendanceHistory",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "attendance status",
            "@id": "http://endhealth.info/im#attendanceStatus",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "booking history",
            "@id": "http://endhealth.info/im#bookingHistory",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "booking urgency",
            "@id": "http://endhealth.info/im#bookingUrgency",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "interaction type",
            "@id": "http://endhealth.info/im#interactionType",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "linked schedule",
            "@id": "http://endhealth.info/im#linkedSchedule",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "planned duration",
            "@id": "http://endhealth.info/im#plannedDuration",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "planned Reason",
            "@id": "http://endhealth.info/im#plannedReason",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "slot booking status",
            "@id": "http://endhealth.info/im#slotBookingStatus",
          },
          type: {
            name: "Ontological concept",
            "@id": "http://endhealth.info/im#894281000252100",
          },
          inheritedFrom: {},
        },
        {
          property: {
            name: "description",
            "@id": "http://endhealth.info/im#description",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
          inheritedFrom: {},
        },
        {
          property: {
            name: "start date and time",
            "@id": "http://endhealth.info/im#startDateTime",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#dateTime" },
          inheritedFrom: {
            name: "Workflow or scheduled event",
            "@id": "http://endhealth.info/im#WorkflowEvent",
          },
        },
        {
          property: {
            name: "end date and time",
            "@id": "http://endhealth.info/im#endDateTime",
          },
          type: { "@id": "http://www.w3.org/2001/XMLSchema#dateTime" },
          inheritedFrom: {
            name: "Workflow or scheduled event",
            "@id": "http://endhealth.info/im#WorkflowEvent",
          },
        },
        {
          property: {
            name: "patient",
            "@id": "http://endhealth.info/im#patient",
          },
          type: {
            name: "Patient (person)",
            "@id": "http://snomed.info/sct#116154003",
          },
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
        {
          property: {
            name: "has data controller",
            "@id": "http://endhealth.info/im#hasDataController",
          },
          type: {
            name: "Organisation  (record type)",
            "@id": "http://endhealth.info/im#Organisation",
          },
          minExclusive: "1",
          maxExclusive: "1",
          inheritedFrom: {
            name: "Health record entry (record type)",
            "@id": "http://endhealth.info/im#HealthRecordEntry",
          },
        },
      ],
    },
  ];




