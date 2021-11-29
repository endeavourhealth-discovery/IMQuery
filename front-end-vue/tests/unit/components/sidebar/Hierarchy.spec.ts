import { flushPromises, mount } from "@vue/test-utils";
import Hierarchy from "@/components/sidebar/Hierarchy.vue";
import Button from "primevue/button";
import Tree from "primevue/tree";
import ProgressSpinner from "primevue/progressspinner";
import EntityService from "@/services/EntityService";
import Tooltip from "primevue/tooltip";
import LoggerService from "@/services/LoggerService";

describe("Hierarchy.vue ___ DiscoveryOntology", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let mockRoute: any;
  let mockToast: any;

  beforeEach(async () => {
    jest.resetAllMocks();
    EntityService.getPartialEntity = jest.fn().mockResolvedValue({
      data: {
        "@id": "http://endhealth.info/im#DiscoveryOntology",
        "http://www.w3.org/2000/01/rdf-schema#comment": "A folder of ontologies including information models, value sets, query sets and maps",
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [{ "@id": "http://endhealth.info/im#Folder", name: "Folder" }],
        "http://www.w3.org/2000/01/rdf-schema#label": "Discovery ontology"
      }
    });
    EntityService.getEntityParents = jest.fn().mockResolvedValue({ data: [] });
    EntityService.getEntityChildren = jest.fn().mockResolvedValue({
      data: [
        {
          name: "Data model bound value sets",
          hasChildren: true,
          type: [{ name: "Value set", "@id": "http://endhealth.info/im#ValueSet" }],
          "@id": "http://endhealth.info/im#VSET_DataModel"
        },
        {
          name: "Emis terminology",
          hasChildren: false,
          type: [
            {
              name: "Legacy concept",
              "@id": "http://endhealth.info/im#LegacyConcept"
            }
          ],
          "@id": "http://endhealth.info/EMIS#EMISNHH2"
        },
        {
          name: "SNOMED CT Concept (SNOMED RT+CTV3)",
          hasChildren: true,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#138875005"
        }
      ]
    });
    mockStore = {
      state: {
        conceptIri: "http://endhealth.info/im#DiscoveryOntology",
        focusTree: false,
        treeLocked: false,
        sideNavHierarchyFocus: {
          name: "Ontology",
          iri: "http://endhealth.info/im#DiscoveryOntology"
        }
      },
      commit: jest.fn(),
      dispatch: jest.fn()
    };
    mockRoute = {
      fullPath: "/",
      name: "Dashboard"
    };
    mockRouter = {
      push: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };

    wrapper = mount(Hierarchy, {
      props: { active: 5 },
      global: {
        components: { Button, Tree, ProgressSpinner },
        mocks: {
          $store: mockStore,
          $route: mockRoute,
          $router: mockRouter,
          $toast: mockToast
        },
        directives: { tooltip: Tooltip }
      }
    });

    await flushPromises();
    jest.clearAllMocks();
  });

  it("fires a toast on conceptAggregate fetch error", async () => {
    EntityService.getEntityChildren = jest.fn().mockRejectedValue({ code: 400, error: "Test error" });
    console.error = jest.fn();
    wrapper.vm.getConceptAggregate();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Hierarchy tree concept aggregate fetch failed", "Test error"));
    expect(console.error).toHaveBeenCalledTimes(2);
    jest.clearAllMocks();
  });

  it("handles conceptIri changes ___ tree locked ___ false", async () => {
    expect(wrapper.vm.treeLocked).toBe(false);
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.updateHistory = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://endhealth.info/im#DiscoveryOntology");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.getConceptAggregate).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getConceptAggregate).toHaveBeenCalledWith("http://endhealth.info/im#DiscoveryOntology");
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectedKey).toStrictEqual({});
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.updateHistory).toHaveBeenCalledTimes(1);
  });

  it("handles sideNavHierarchyFocus changes ___ different", async () => {
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.updateHistory = jest.fn();
    wrapper.vm.$options.watch.sideNavHierarchyFocus.call(wrapper.vm, { iri: "testNew" }, { iri: "testOld" });
    await flushPromises();
    expect(wrapper.vm.getConceptAggregate).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.updateHistory).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.selectedKey).toStrictEqual({});
  });

  it("handles sideNavHierarchyFocus changes ___ same", async () => {
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.updateHistory = jest.fn();
    wrapper.vm.$options.watch.sideNavHierarchyFocus.call(wrapper.vm, { iri: "testSame" }, { iri: "testSame" });
    await flushPromises();
    expect(wrapper.vm.getConceptAggregate).not.toHaveBeenCalled();
    expect(wrapper.vm.refreshTree).not.toHaveBeenCalled();
    expect(wrapper.vm.updateHistory).not.toHaveBeenCalled();
    expect(wrapper.vm.selectedKey).not.toStrictEqual({});
  });

  it("handles active changes ___ refresh", async () => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.$options.watch.active.call(wrapper.vm, 0, 1);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(1);
  });

  it("can resetConcept", async () => {
    wrapper.vm.createTree = jest.fn();
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.parentLabel = "Test label";
    wrapper.vm.selectedKey = { name: "test selected key" };
    wrapper.vm.$nextTick();
    expect(wrapper.vm.parentLabel).toBe("Test label");
    expect(wrapper.vm.selectedKey).toStrictEqual({ name: "test selected key" });
    expect(wrapper.vm.sideNavHierarchyFocus.iri).toEqual("http://endhealth.info/im#DiscoveryOntology");
    wrapper.vm.resetConcept();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.parentLabel).toBe("");
    expect(wrapper.vm.selectedKey).toStrictEqual({
      "Discovery ontology": true
    });
    expect(wrapper.emitted()["showTree"]).toBeTruthy();
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateConceptIri", "http://endhealth.info/im#DiscoveryOntology");
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Dashboard" });
  });

  it("can resetConcept ___ InformationModel", async () => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.selectedKey = { name: "test selected key" };
    wrapper.vm.$nextTick();
    expect(wrapper.vm.selectedKey).toStrictEqual({ name: "test selected key" });
    wrapper.vm.resetConcept();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(wrapper.vm.selectedKey).toStrictEqual({});
    expect(wrapper.emitted()["showTree"]).toBeTruthy();
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateConceptIri", "http://endhealth.info/im#DiscoveryOntology");
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Dashboard" });
  });

  it("can toggleTreeLocked", () => {
    wrapper.vm.toggleTreeLocked(true);
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateTreeLocked", true);
  });
});

describe("Hierarchy.vue ___ Concept", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let mockRoute: any;
  let mockToast: any;

  beforeEach(async () => {
    jest.resetAllMocks();
    EntityService.getPartialEntity = jest.fn().mockResolvedValue({
      data: {
        "@id": "http://snomed.info/sct#298382003",
        "http://endhealth.info/im#isA": [
          {
            "@id": "http://snomed.info/sct#64217002",
            name: "Curvature of spine (disorder)"
          },
          {
            "@id": "http://snomed.info/sct#928000",
            name: "Disorder of musculoskeletal system (disorder)"
          },
          {
            "@id": "http://snomed.info/sct#699699005",
            name: "Disorder of vertebral column (disorder)"
          }
        ],
        "http://endhealth.info/im#status": {
          "@id": "http://endhealth.info/im#Active",
          name: "Active"
        },
        "http://endhealth.info/im#code": "298382003",
        "http://endhealth.info/im#roleGroup": [
          {
            "http://endhealth.info/im#groupNumber": {
              "@value": 1,
              "@type": "http://www.w3.org/2001/XMLSchema#integer"
            },
            "http://www.w3.org/2002/07/owl#someValuesFrom": {
              "@id": "http://snomed.info/sct#31739005",
              name: "Lateral abnormal curvature (morphologic abnormality)"
            },
            "http://www.w3.org/2002/07/owl#onProperty": {
              "@id": "http://snomed.info/sct#116676008",
              name: "Associated morphology (attribute)"
            },
            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
              "@id": "http://www.w3.org/2002/07/owl#Restriction",
              name: "Restriction"
            }
          }
        ],
        "http://endhealth.info/im#hasMap": [
          {
            "http://endhealth.info/im#oneOf": [
              {
                "http://endhealth.info/im#matchedTo": {
                  "@id": "http://endhealth.info/ICD10#M419",
                  name: "Scoliosis, unspecified"
                },
                "http://endhealth.info/im#mapAdvice": "ALWAYS M41.9 | FIFTH CHARACTER POSSIBLE",
                "http://endhealth.info/im#mapPriority": {
                  "@value": 3,
                  "@type": "http://www.w3.org/2001/XMLSchema#integer"
                },
                "http://endhealth.info/im#assuranceLevel": {
                  "@id": "http://endhealth.info/im#NationallyAssuredUK",
                  name: "Nationally assured UK level"
                }
              },
              {
                "http://endhealth.info/im#matchedTo": {
                  "@id": "http://endhealth.info/ICD10#M418",
                  name: "Other forms of scoliosis"
                },
                "http://endhealth.info/im#mapAdvice": "ALWAYS M41.8 | FIFTH CHARACTER POSSIBLE",
                "http://endhealth.info/im#mapPriority": {
                  "@value": 2,
                  "@type": "http://www.w3.org/2001/XMLSchema#integer"
                },
                "http://endhealth.info/im#assuranceLevel": {
                  "@id": "http://endhealth.info/im#NationallyAssuredUK",
                  name: "Nationally assured UK level"
                }
              },
              {
                "http://endhealth.info/im#matchedTo": {
                  "@id": "http://endhealth.info/ICD10#Q675",
                  name: "Congenital deformity of spine"
                },
                "http://endhealth.info/im#mapAdvice": "ALWAYS Q67.5",
                "http://endhealth.info/im#mapPriority": {
                  "@value": 1,
                  "@type": "http://www.w3.org/2001/XMLSchema#integer"
                },
                "http://endhealth.info/im#assuranceLevel": {
                  "@id": "http://endhealth.info/im#NationallyAssuredUK",
                  name: "Nationally assured UK level"
                }
              }
            ]
          }
        ],
        "http://endhealth.info/im#scheme": {
          "@id": "http://endhealth.info/im#SnomedCodeScheme",
          name: "Snomed-CT code"
        },
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [{ "@id": "http://www.w3.org/2002/07/owl#Class", name: "Class" }],
        "http://www.w3.org/2000/01/rdf-schema#label": "Scoliosis deformity of spine (disorder)",
        "http://www.w3.org/2002/07/owl#equivalentClass": [
          {
            "http://www.w3.org/2002/07/owl#intersectionOf": [
              {
                "@id": "http://snomed.info/sct#64572001",
                name: "Disease (disorder)"
              },
              {
                "http://www.w3.org/2002/07/owl#someValuesFrom": {
                  "http://www.w3.org/2002/07/owl#intersectionOf": [
                    {
                      "http://www.w3.org/2002/07/owl#someValuesFrom": {
                        "@id": "http://snomed.info/sct#31739005",
                        name: "Lateral abnormal curvature (morphologic abnormality)"
                      },
                      "http://www.w3.org/2002/07/owl#onProperty": {
                        "@id": "http://snomed.info/sct#116676008",
                        name: "Associated morphology (attribute)"
                      },
                      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
                        "@id": "http://www.w3.org/2002/07/owl#Restriction",
                        name: "Restriction"
                      }
                    },
                    {
                      "http://www.w3.org/2002/07/owl#someValuesFrom": {
                        "@id": "http://snomed.info/sct#289959001",
                        name: "Musculoskeletal structure of spine (body structure)"
                      },
                      "http://www.w3.org/2002/07/owl#onProperty": {
                        "@id": "http://snomed.info/sct#363698007",
                        name: "Finding site (attribute)"
                      },
                      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
                        "@id": "http://www.w3.org/2002/07/owl#Restriction",
                        name: "Restriction"
                      }
                    }
                  ]
                },
                "http://www.w3.org/2002/07/owl#onProperty": {
                  "@id": "http://endhealth.info/im#roleGroup",
                  name: "role group"
                },
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
                  "@id": "http://www.w3.org/2002/07/owl#Restriction",
                  name: "Restriction"
                }
              }
            ]
          }
        ]
      }
    });
    EntityService.getEntityParents = jest.fn().mockResolvedValue({
      data: [
        {
          name: "Curvature of spine (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#64217002"
        },
        {
          name: "Disorder of musculoskeletal system (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#928000"
        },
        {
          name: "Disorder of vertebral column (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#699699005"
        }
      ]
    });
    EntityService.getEntityChildren = jest.fn().mockResolvedValue({
      data: [
        {
          name: "Acquired scoliosis (disorder)",
          hasChildren: true,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#111266001"
        },
        {
          name: "Acrodysplasia scoliosis (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#773773006"
        },
        {
          name: "Congenital scoliosis due to bony malformation (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#205045003"
        },
        {
          name: "Distal arthrogryposis type 4 (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#715575001"
        },
        {
          name: "Duane anomaly, myopathy, scoliosis syndrome (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#722432000"
        },
        {
          name: "Horizontal gaze palsy with progressive scoliosis (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#702381007"
        },
        {
          name: "Idiopathic scoliosis (disorder)",
          hasChildren: true,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#203639008"
        },
        {
          name: "Idiopathic scoliosis AND/OR kyphoscoliosis (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#30611007"
        },
        {
          name: "Kyphoscoliosis and scoliosis (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#203638000"
        },
        {
          name: "Kyphoscoliosis deformity of spine (disorder)",
          hasChildren: true,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#405773007"
        },
        {
          name: "Lordoscoliosis (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#111268000"
        },
        {
          name: "Neuromuscular scoliosis (disorder)",
          hasChildren: true,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#203662005"
        },
        {
          name: "Postural scoliosis (disorder)",
          hasChildren: true,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#203645000"
        },
        {
          name: "Radioulnar synostosis with microcephaly and scoliosis syndrome (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#719162001"
        },
        {
          name: "Scoliosis in connective tissue anomalies (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#203664006"
        },
        {
          name: "Scoliosis in neurofibromatosis (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#203663000"
        },
        {
          name: "Scoliosis in skeletal dysplasia (disorder)",
          hasChildren: false,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#203661003"
        },
        {
          name: "Scoliosis of cervical spine (disorder)",
          hasChildren: true,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#298392006"
        },
        {
          name: "Scoliosis of lumbar spine (disorder)",
          hasChildren: true,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#298591003"
        },
        {
          name: "Scoliosis of thoracic spine (disorder)",
          hasChildren: true,
          type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
          "@id": "http://snomed.info/sct#298494008"
        }
      ]
    });
    mockStore = {
      state: {
        conceptIri: "http://snomed.info/sct#298382003",
        focusTree: false,
        treeLocked: true,
        sideNavHierarchyFocus: {
          name: "Ontology",
          iri: "http://endhealth.info/im#DiscoveryOntology"
        }
      },
      commit: jest.fn(),
      dispatch: jest.fn()
    };
    mockRoute = {
      fullPath: "/concept/http:%2F%2Fsnomed.info%2Fsct%23298382003",
      name: "Concept"
    };
    mockRouter = {
      push: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };

    wrapper = mount(Hierarchy, {
      props: { active: 5 },
      global: {
        components: { Button, Tree, ProgressSpinner },
        mocks: {
          $store: mockStore,
          $route: mockRoute,
          $router: mockRouter,
          $toast: mockToast
        },
        directives: { tooltip: Tooltip }
      }
    });

    await flushPromises();
    jest.clearAllMocks();
  });

  it("mounts", async () => {
    expect(wrapper.vm.conceptAggregate).toStrictEqual({
      children: [
        {
          "@id": "http://snomed.info/sct#111266001",
          hasChildren: true,
          name: "Acquired scoliosis (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#773773006",
          hasChildren: false,
          name: "Acrodysplasia scoliosis (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#205045003",
          hasChildren: false,
          name: "Congenital scoliosis due to bony malformation (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#715575001",
          hasChildren: false,
          name: "Distal arthrogryposis type 4 (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#722432000",
          hasChildren: false,
          name: "Duane anomaly, myopathy, scoliosis syndrome (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#702381007",
          hasChildren: false,
          name: "Horizontal gaze palsy with progressive scoliosis (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#203639008",
          hasChildren: true,
          name: "Idiopathic scoliosis (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#30611007",
          hasChildren: false,
          name: "Idiopathic scoliosis AND/OR kyphoscoliosis (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#203638000",
          hasChildren: false,
          name: "Kyphoscoliosis and scoliosis (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#405773007",
          hasChildren: true,
          name: "Kyphoscoliosis deformity of spine (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#111268000",
          hasChildren: false,
          name: "Lordoscoliosis (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#203662005",
          hasChildren: true,
          name: "Neuromuscular scoliosis (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#203645000",
          hasChildren: true,
          name: "Postural scoliosis (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#719162001",
          hasChildren: false,
          name: "Radioulnar synostosis with microcephaly and scoliosis syndrome (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#203664006",
          hasChildren: false,
          name: "Scoliosis in connective tissue anomalies (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#203663000",
          hasChildren: false,
          name: "Scoliosis in neurofibromatosis (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#203661003",
          hasChildren: false,
          name: "Scoliosis in skeletal dysplasia (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#298392006",
          hasChildren: true,
          name: "Scoliosis of cervical spine (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#298591003",
          hasChildren: true,
          name: "Scoliosis of lumbar spine (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#298494008",
          hasChildren: true,
          name: "Scoliosis of thoracic spine (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        }
      ],
      concept: {
        "@id": "http://snomed.info/sct#298382003",
        "http://endhealth.info/im#code": "298382003",
        "http://endhealth.info/im#hasMap": [
          {
            "http://endhealth.info/im#oneOf": [
              {
                "http://endhealth.info/im#assuranceLevel": {
                  "@id": "http://endhealth.info/im#NationallyAssuredUK",
                  name: "Nationally assured UK level"
                },
                "http://endhealth.info/im#mapAdvice": "ALWAYS M41.9 | FIFTH CHARACTER POSSIBLE",
                "http://endhealth.info/im#mapPriority": {
                  "@type": "http://www.w3.org/2001/XMLSchema#integer",
                  "@value": 3
                },
                "http://endhealth.info/im#matchedTo": {
                  "@id": "http://endhealth.info/ICD10#M419",
                  name: "Scoliosis, unspecified"
                }
              },
              {
                "http://endhealth.info/im#assuranceLevel": {
                  "@id": "http://endhealth.info/im#NationallyAssuredUK",
                  name: "Nationally assured UK level"
                },
                "http://endhealth.info/im#mapAdvice": "ALWAYS M41.8 | FIFTH CHARACTER POSSIBLE",
                "http://endhealth.info/im#mapPriority": {
                  "@type": "http://www.w3.org/2001/XMLSchema#integer",
                  "@value": 2
                },
                "http://endhealth.info/im#matchedTo": {
                  "@id": "http://endhealth.info/ICD10#M418",
                  name: "Other forms of scoliosis"
                }
              },
              {
                "http://endhealth.info/im#assuranceLevel": {
                  "@id": "http://endhealth.info/im#NationallyAssuredUK",
                  name: "Nationally assured UK level"
                },
                "http://endhealth.info/im#mapAdvice": "ALWAYS Q67.5",
                "http://endhealth.info/im#mapPriority": {
                  "@type": "http://www.w3.org/2001/XMLSchema#integer",
                  "@value": 1
                },
                "http://endhealth.info/im#matchedTo": {
                  "@id": "http://endhealth.info/ICD10#Q675",
                  name: "Congenital deformity of spine"
                }
              }
            ]
          }
        ],
        "http://endhealth.info/im#isA": [
          {
            "@id": "http://snomed.info/sct#64217002",
            name: "Curvature of spine (disorder)"
          },
          {
            "@id": "http://snomed.info/sct#928000",
            name: "Disorder of musculoskeletal system (disorder)"
          },
          {
            "@id": "http://snomed.info/sct#699699005",
            name: "Disorder of vertebral column (disorder)"
          }
        ],
        "http://endhealth.info/im#roleGroup": [
          {
            "http://endhealth.info/im#groupNumber": {
              "@type": "http://www.w3.org/2001/XMLSchema#integer",
              "@value": 1
            },
            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
              "@id": "http://www.w3.org/2002/07/owl#Restriction",
              name: "Restriction"
            },
            "http://www.w3.org/2002/07/owl#onProperty": {
              "@id": "http://snomed.info/sct#116676008",
              name: "Associated morphology (attribute)"
            },
            "http://www.w3.org/2002/07/owl#someValuesFrom": {
              "@id": "http://snomed.info/sct#31739005",
              name: "Lateral abnormal curvature (morphologic abnormality)"
            }
          }
        ],
        "http://endhealth.info/im#scheme": {
          "@id": "http://endhealth.info/im#SnomedCodeScheme",
          name: "Snomed-CT code"
        },
        "http://endhealth.info/im#status": {
          "@id": "http://endhealth.info/im#Active",
          name: "Active"
        },
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
          {
            "@id": "http://www.w3.org/2002/07/owl#Class",
            name: "Class"
          }
        ],
        "http://www.w3.org/2000/01/rdf-schema#label": "Scoliosis deformity of spine (disorder)",
        "http://www.w3.org/2002/07/owl#equivalentClass": [
          {
            "http://www.w3.org/2002/07/owl#intersectionOf": [
              {
                "@id": "http://snomed.info/sct#64572001",
                name: "Disease (disorder)"
              },
              {
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
                  "@id": "http://www.w3.org/2002/07/owl#Restriction",
                  name: "Restriction"
                },
                "http://www.w3.org/2002/07/owl#onProperty": {
                  "@id": "http://endhealth.info/im#roleGroup",
                  name: "role group"
                },
                "http://www.w3.org/2002/07/owl#someValuesFrom": {
                  "http://www.w3.org/2002/07/owl#intersectionOf": [
                    {
                      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
                        "@id": "http://www.w3.org/2002/07/owl#Restriction",
                        name: "Restriction"
                      },
                      "http://www.w3.org/2002/07/owl#onProperty": {
                        "@id": "http://snomed.info/sct#116676008",
                        name: "Associated morphology (attribute)"
                      },
                      "http://www.w3.org/2002/07/owl#someValuesFrom": {
                        "@id": "http://snomed.info/sct#31739005",
                        name: "Lateral abnormal curvature (morphologic abnormality)"
                      }
                    },
                    {
                      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
                        "@id": "http://www.w3.org/2002/07/owl#Restriction",
                        name: "Restriction"
                      },
                      "http://www.w3.org/2002/07/owl#onProperty": {
                        "@id": "http://snomed.info/sct#363698007",
                        name: "Finding site (attribute)"
                      },
                      "http://www.w3.org/2002/07/owl#someValuesFrom": {
                        "@id": "http://snomed.info/sct#289959001",
                        name: "Musculoskeletal structure of spine (body structure)"
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      },
      parents: [
        {
          "@id": "http://snomed.info/sct#64217002",
          hasChildren: false,
          name: "Curvature of spine (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#928000",
          hasChildren: false,
          name: "Disorder of musculoskeletal system (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        },
        {
          "@id": "http://snomed.info/sct#699699005",
          hasChildren: false,
          name: "Disorder of vertebral column (disorder)",
          type: [
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ]
        }
      ]
    });
    expect(wrapper.vm.searchResult).toBe("");
    expect(wrapper.vm.root).toStrictEqual([
      {
        children: [
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#111266001",
            key: "Acquired scoliosis (disorder)",
            label: "Acquired scoliosis (disorder)",
            leaf: false,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#773773006",
            key: "Acrodysplasia scoliosis (disorder)",
            label: "Acrodysplasia scoliosis (disorder)",
            leaf: true,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#205045003",
            key: "Congenital scoliosis due to bony malformation (disorder)",
            label: "Congenital scoliosis due to bony malformation (disorder)",
            leaf: true,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#715575001",
            key: "Distal arthrogryposis type 4 (disorder)",
            label: "Distal arthrogryposis type 4 (disorder)",
            leaf: true,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#722432000",
            key: "Duane anomaly, myopathy, scoliosis syndrome (disorder)",
            label: "Duane anomaly, myopathy, scoliosis syndrome (disorder)",
            leaf: true,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#702381007",
            key: "Horizontal gaze palsy with progressive scoliosis (disorder)",
            label: "Horizontal gaze palsy with progressive scoliosis (disorder)",
            leaf: true,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#203639008",
            key: "Idiopathic scoliosis (disorder)",
            label: "Idiopathic scoliosis (disorder)",
            leaf: false,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#30611007",
            key: "Idiopathic scoliosis AND/OR kyphoscoliosis (disorder)",
            label: "Idiopathic scoliosis AND/OR kyphoscoliosis (disorder)",
            leaf: true,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#203638000",
            key: "Kyphoscoliosis and scoliosis (disorder)",
            label: "Kyphoscoliosis and scoliosis (disorder)",
            leaf: true,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#405773007",
            key: "Kyphoscoliosis deformity of spine (disorder)",
            label: "Kyphoscoliosis deformity of spine (disorder)",
            leaf: false,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#111268000",
            key: "Lordoscoliosis (disorder)",
            label: "Lordoscoliosis (disorder)",
            leaf: true,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#203662005",
            key: "Neuromuscular scoliosis (disorder)",
            label: "Neuromuscular scoliosis (disorder)",
            leaf: false,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#203645000",
            key: "Postural scoliosis (disorder)",
            label: "Postural scoliosis (disorder)",
            leaf: false,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#719162001",
            key: "Radioulnar synostosis with microcephaly and scoliosis syndrome (disorder)",
            label: "Radioulnar synostosis with microcephaly and scoliosis syndrome (disorder)",
            leaf: true,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#203664006",
            key: "Scoliosis in connective tissue anomalies (disorder)",
            label: "Scoliosis in connective tissue anomalies (disorder)",
            leaf: true,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#203663000",
            key: "Scoliosis in neurofibromatosis (disorder)",
            label: "Scoliosis in neurofibromatosis (disorder)",
            leaf: true,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#203661003",
            key: "Scoliosis in skeletal dysplasia (disorder)",
            label: "Scoliosis in skeletal dysplasia (disorder)",
            leaf: true,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#298392006",
            key: "Scoliosis of cervical spine (disorder)",
            label: "Scoliosis of cervical spine (disorder)",
            leaf: false,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#298591003",
            key: "Scoliosis of lumbar spine (disorder)",
            label: "Scoliosis of lumbar spine (disorder)",
            leaf: false,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          },
          {
            children: [],
            color: "#e39a3688",
            data: "http://snomed.info/sct#298494008",
            key: "Scoliosis of thoracic spine (disorder)",
            label: "Scoliosis of thoracic spine (disorder)",
            leaf: false,
            loading: false,
            typeIcon: "far fa-fw fa-lightbulb"
          }
        ],
        color: "#e39a3688",
        data: "http://snomed.info/sct#298382003",
        key: "Scoliosis deformity of spine (disorder)",
        label: "Scoliosis deformity of spine (disorder)",
        leaf: true,
        loading: false,
        typeIcon: "far fa-fw fa-lightbulb"
      }
    ]);
    expect(wrapper.vm.expandedKeys).toStrictEqual({ "Scoliosis deformity of spine (disorder)": true });
    expect(wrapper.vm.selectedKey).toStrictEqual({ "Scoliosis deformity of spine (disorder)": true });
    expect(wrapper.vm.parentLabel).toBe("Curvature of spine (disorder)");
  });

  it("handles conceptIri changes ___ tree locked ___ true", async () => {
    jest.clearAllMocks();
    expect(wrapper.vm.treeLocked).toBe(true);
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.updateHistory = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://endhealth.info/im#DiscoveryOntology");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.getConceptAggregate).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getConceptAggregate).toHaveBeenCalledWith("http://endhealth.info/im#DiscoveryOntology");
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectedKey).toStrictEqual({
      "Scoliosis deformity of spine (disorder)": true
    });
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.updateHistory).toHaveBeenCalledTimes(1);
  });

  it("handles focusTree changes ___ true", async () => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.$options.watch.focusTree.call(wrapper.vm, true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getConceptAggregate).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateFocusTree", false);
    expect(wrapper.emitted().showTree).toBeTruthy();
  });

  it("handles focusTree changes ___ false", async () => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.$options.watch.focusTree.call(wrapper.vm, false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.refreshTree).not.toHaveBeenCalled();
    expect(wrapper.vm.getConceptAggregate).not.toHaveBeenCalled();
    expect(wrapper.emitted().showTree).toBeFalsy();
  });

  it("handles active changes ___ no refresh", async () => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.$options.watch.active.call(wrapper.vm, 1, 0);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.refreshTree).not.toHaveBeenCalled();
  });

  it("handles treeLocked changes ___ refresh", async () => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.$options.watch.treeLocked.call(wrapper.vm, false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getConceptAggregate).toHaveBeenCalledTimes(1);
  });

  it("handles treeLocked changes ___ no refresh", async () => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.$options.watch.treeLocked.call(wrapper.vm, true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.refreshTree).not.toHaveBeenCalled();
    expect(wrapper.vm.getConceptAggregate).not.toHaveBeenCalled();
  });

  it("createsTree ___ no root", () => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.refreshTree(EntityService.getPartialEntity, EntityService.getEntityParents, EntityService.getEntityChildren);
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(1);
  });

  it("createsTree ___ concept", () => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.root = [1];
    wrapper.vm.refreshTree({ "@id": "http://endhealth.info/im#InformationModel" }, EntityService.getEntityParents, EntityService.getEntityChildren);
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(1);
  });

  it("routes onNodeSelect ___ IM", () => {
    wrapper.vm.onNodeSelect({
      data: "http://endhealth.info/im#InformationModel"
    });
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Dashboard" });
  });

  it("routes onNodeSelect ___ Concept", () => {
    wrapper.vm.onNodeSelect({ data: "http://endhealth.info/im#TestConcept" });
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "Concept",
      params: { selectedIri: "http://endhealth.info/im#TestConcept" }
    });
  });

  it("can expand children", async () => {
    wrapper.vm.containsChild = jest.fn().mockReturnValue(false);
    const testNode = {
      data: "http://endhealth.info/im#TestConcept",
      key: "http://endhealth.info/im#TestConcept",
      loading: false,
      children: [1]
    };
    await wrapper.vm.expandChildren(testNode);
    await wrapper.vm.$nextTick();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://endhealth.info/im#TestConcept");
    expect(wrapper.vm.containsChild).toHaveBeenCalled();
    expect(testNode.children).toHaveLength(21);
  });

  it("can expand children ___ api fail", async () => {
    wrapper.vm.containsChild = jest.fn().mockReturnValue(false);
    EntityService.getEntityChildren = jest.fn().mockRejectedValue({ code: 404, message: "testError" });
    const testNode = {
      data: "http://endhealth.info/im#TestConcept",
      key: "testKey",
      loading: false,
      children: [1]
    };
    await wrapper.vm.expandChildren(testNode);
    await wrapper.vm.$nextTick();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://endhealth.info/im#TestConcept");
    expect(mockToast.add).toHaveBeenCalled();
  });

  it("can expand children ___ containsChildTrue", async () => {
    wrapper.vm.containsChild = jest.fn().mockReturnValue(true);
    const testNode = {
      data: "http://endhealth.info/im#TestConcept",
      key: "http://endhealth.info/im#TestConcept",
      loading: false,
      children: []
    };
    await wrapper.vm.expandChildren(testNode);
    await wrapper.vm.$nextTick();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://endhealth.info/im#TestConcept");
    expect(wrapper.vm.containsChild).toHaveBeenCalled();
    expect(testNode.children).toHaveLength(0);
  });

  it("can check containsChild ___ false", async () => {
    expect(wrapper.vm.containsChild([{ data: "TestFail" }], { "@id": "TestId" })).toBeFalsy();
  });

  it("can check containsChild ___ true", async () => {
    expect(wrapper.vm.containsChild([{ data: "TestId" }], { "@id": "TestId" })).toBeTruthy();
  });

  it("can expand parents __ api pass", async () => {
    wrapper.vm.root = [
      {
        data: "http://snomed.info/sct#298382003",
        key: "Scoliosis deformity of spine (disorder)"
      }
    ];
    await wrapper.vm.expandParents();
    expect(EntityService.getEntityParents).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityParents).toHaveBeenNthCalledWith(1, "http://snomed.info/sct#298382003");
    expect(EntityService.getEntityParents).toHaveBeenLastCalledWith("http://snomed.info/sct#64217002");
  });

  it("can expand parents __ api 1 fail", async () => {
    EntityService.getEntityParents = jest.fn().mockRejectedValue({ code: 404, message: "Test error" });
    wrapper.vm.root = [
      {
        data: "http://snomed.info/sct#298382003",
        key: "Scoliosis deformity of spine (disorder)"
      }
    ];
    await wrapper.vm.expandParents();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(EntityService.getEntityParents).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityParents).toHaveBeenNthCalledWith(1, "http://snomed.info/sct#298382003");
    expect(EntityService.getEntityParents).toHaveBeenLastCalledWith("http://snomed.info/sct#298382003");
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Concept parents server request 1 failed"));
  });

  it("can expand parents __ api 2 fail", async () => {
    wrapper.vm.root = [
      {
        data: "http://snomed.info/sct#298382003",
        key: "Scoliosis deformity of spine (disorder)"
      }
    ];
    EntityService.getEntityParents = jest
      .fn()
      .mockResolvedValueOnce({
        data: [
          {
            name: "Curvature of spine (disorder)",
            hasChildren: false,
            type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
            "@id": "http://snomed.info/sct#64217002"
          },
          {
            name: "Disorder of musculoskeletal system (disorder)",
            hasChildren: false,
            type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
            "@id": "http://snomed.info/sct#928000"
          },
          {
            name: "Disorder of vertebral column (disorder)",
            hasChildren: false,
            type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
            "@id": "http://snomed.info/sct#699699005"
          }
        ]
      })
      .mockRejectedValue({ code: 404, message: "Test error" });
    await wrapper.vm.expandParents();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(EntityService.getEntityParents).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityParents).toHaveBeenNthCalledWith(1, "http://snomed.info/sct#298382003");
    expect(EntityService.getEntityParents).toHaveBeenLastCalledWith("http://snomed.info/sct#64217002");
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Concept parents server request 2 failed"));
  });

  it("can expand parents __ api 2 no data", async () => {
    wrapper.vm.root = [
      {
        data: "http://snomed.info/sct#298382003",
        key: "Scoliosis deformity of spine (disorder)"
      }
    ];
    EntityService.getEntityParents = jest
      .fn()
      .mockResolvedValueOnce({
        data: [
          {
            name: "Curvature of spine (disorder)",
            hasChildren: false,
            type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
            "@id": "http://snomed.info/sct#64217002"
          },
          {
            name: "Disorder of musculoskeletal system (disorder)",
            hasChildren: false,
            type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
            "@id": "http://snomed.info/sct#928000"
          },
          {
            name: "Disorder of vertebral column (disorder)",
            hasChildren: false,
            type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
            "@id": "http://snomed.info/sct#699699005"
          }
        ]
      })
      .mockResolvedValueOnce({ data: [] });
    await wrapper.vm.expandParents();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(EntityService.getEntityParents).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityParents).toHaveBeenNthCalledWith(1, "http://snomed.info/sct#298382003");
    expect(EntityService.getEntityParents).toHaveBeenLastCalledWith("http://snomed.info/sct#64217002");
    expect(wrapper.vm.parentLabel).toBe("");
  });
});
