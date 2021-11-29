import { shallowMount } from "@vue/test-utils";
import DataModelProperties from "@/components/concept/definition/DataModelProperties.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import StyleClass from "primevue/styleclass";

describe("DataModelProperties.vue", () => {
  let wrapper: any;
  let mockRouter: any;
  let mockRoute: any;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn()
    };
    mockRoute = {
      name: "Concept"
    };

    wrapper = shallowMount(DataModelProperties, {
      global: {
        components: { DataTable, Column, Button },
        mocks: { $route: mockRoute, $router: mockRouter },
        directives: { styleclass: StyleClass }
      },
      props: {
        label: "Data model properties",
        data: [
          {
            property: { name: "additional Practitioners", "@id": "http://endhealth.info/im#additionalPractitioners" },
            type: { name: "Practitioner in role  (record type)", "@id": "http://endhealth.info/im#ThePractitionerInRole" },
            inheritedFrom: {}
          },
          {
            property: { name: "completion Status", "@id": "http://endhealth.info/im#completionStatus" },
            type: { name: "Concept class", "@id": "http://endhealth.info/im#894281000252100" },
            inheritedFrom: {}
          },
          {
            property: { name: "duration", "@id": "http://endhealth.info/im#duration" },
            type: { name: "Concept class", "@id": "http://endhealth.info/im#894281000252100" },
            minExclusive: "1",
            inheritedFrom: {}
          },
          {
            property: { name: "has section", "@id": "http://endhealth.info/im#hasSection" },
            type: { name: "Section (structural)", "@id": "http://endhealth.info/im#Section" },
            inheritedFrom: {}
          },
          {
            property: { name: "linked appointment", "@id": "http://endhealth.info/im#linkedAppointment" },
            type: { name: "Appointment (slot)  (record type)", "@id": "http://endhealth.info/im#Appointment" },
            inheritedFrom: {}
          },
          {
            property: { name: "linked care episode", "@id": "http://endhealth.info/im#linkedCareEpisode" },
            type: { name: "Episode of care  (record type)", "@id": "http://endhealth.info/im#EpisodeOfCare" },
            inheritedFrom: {}
          },
          {
            property: { name: "location", "@id": "http://endhealth.info/im#location" },
            type: { name: "Location  (record type)", "@id": "http://endhealth.info/im#Location" },
            inheritedFrom: {}
          },
          {
            property: {
              name: "providing Organisation/ services or departments",
              "@id": "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments"
            },
            type: { name: "Organisation  (record type)", "@id": "http://endhealth.info/im#Organisation" },
            inheritedFrom: {}
          },
          {
            property: { name: "is subencounter of", "@id": "http://endhealth.info/im#isSubEnctounterOf" },
            type: { name: "Encounter (record type)", "@id": "http://endhealth.info/im#Encounter" },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {}
          },
          {
            property: { name: "has subject", "@id": "http://endhealth.info/im#hasSubject" },
            type: { name: "Patient (person)", "@id": "http://snomed.info/sct#116154003" },
            inheritedFrom: { name: "Patient health event (record type)", "@id": "http://endhealth.info/im#PatientHealthEvent" }
          },
          {
            property: { name: "practitioner", "@id": "http://endhealth.info/im#hasPractitioner" },
            type: { name: "Practitioner in role  (record type)", "@id": "http://endhealth.info/im#ThePractitionerInRole" },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: { name: "Patient health event (record type)", "@id": "http://endhealth.info/im#PatientHealthEvent" }
          },
          {
            property: { name: "date", "@id": "http://endhealth.info/im#date" },
            type: { name: "string", "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: { name: "Health event (record type)", "@id": "http://endhealth.info/im#HealthEvent" }
          },
          {
            property: { name: "end date", "@id": "http://endhealth.info/im#endDate" },
            type: { name: "string", "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: { name: "Health event (record type)", "@id": "http://endhealth.info/im#HealthEvent" }
          }
        ],
        size: "100%"
      }
    });
  });

  it("can navigate", () => {
    wrapper.vm.navigate("http://snomed.info/sct#116676008");
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Concept", params: { selectedIri: "http://snomed.info/sct#116676008" } });
  });

  it("can navigate ___ no iri", () => {
    wrapper.vm.navigate();
    expect(mockRouter.push).toHaveBeenCalledTimes(0);
  });

  it("can setButtonExpanded ___ true", () => {
    expect(wrapper.vm.buttonExpanded).toBe(false);
    wrapper.vm.setButtonExpanded();
    expect(wrapper.vm.buttonExpanded).toBe(true);
  });

  it("can setButtonExpanded ___ false", () => {
    wrapper.vm.buttonExpanded = true;
    wrapper.vm.setButtonExpanded();
    expect(wrapper.vm.buttonExpanded).toBe(false);
  });
});
