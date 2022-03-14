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

  beforeEach(() => {
    jest.resetAllMocks();
    EntityService.getPartialEntity = jest.fn().mockResolvedValue({data:{
      "@id":"http://endhealth.info/im#DiscoveryOntology",
      "http://www.w3.org/2000/01/rdf-schema#comment":"A folder of ontologies including information models, value sets, query sets and maps",
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://endhealth.info/im#Folder","name":"Folder"}],"http://www.w3.org/2000/01/rdf-schema#label":"Discovery ontology"
    }});
    EntityService.getEntityParents = jest.fn().mockResolvedValue({data:[]});
    EntityService.getEntityChildren = jest.fn().mockResolvedValue({data:[
      {"name":"Data model bound value sets","hasChildren":true,"type":[{"name":"Value set","@id":"http://endhealth.info/im#ValueSet"}],"@id":"http://endhealth.info/im#VSET_DataModel"},
      {"name":"Emis terminology","hasChildren":false,"type":[{"name":"Legacy concept","@id":"http://endhealth.info/im#LegacyConcept"}],"@id":"http://endhealth.info/EMIS#EMISNHH2"},
      {"name":"SNOMED CT Concept (SNOMED RT+CTV3)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#138875005"},
    ]});
    mockStore = {
      state: {
        conceptIri: "http://endhealth.info/im#DiscoveryOntology",
        focusTree: false,
        treeLocked: true,
        sideNavHierarchyFocus: {name: "Ontology", iri: "http://endhealth.info/im#DiscoveryOntology" }
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
    }
    mockToast = {
      add: jest.fn()
    }

    wrapper = mount(Hierarchy, {
      props: { active: 5 },
      global: {
        components: { Button, Tree, ProgressSpinner },
        mocks: { $store: mockStore, $route: mockRoute, $router: mockRouter, $toast: mockToast },
        directives: { tooltip: Tooltip }
      }
    });
  });

  it("starts with empty default data", () => {
    expect(wrapper.vm.searchResult).toBe("");
    expect(wrapper.vm.conceptAggregate).toStrictEqual({concept: {
      "@id":"http://endhealth.info/im#DiscoveryOntology",
      "http://www.w3.org/2000/01/rdf-schema#comment":"A folder of ontologies including information models, value sets, query sets and maps",
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://endhealth.info/im#Folder","name":"Folder"}],"http://www.w3.org/2000/01/rdf-schema#label":"Discovery ontology"
    }, children: [
      {"name":"Data model bound value sets","hasChildren":true,"type":[{"name":"Value set","@id":"http://endhealth.info/im#ValueSet"}],"@id":"http://endhealth.info/im#VSET_DataModel"},
      {"name":"Emis terminology","hasChildren":false,"type":[{"name":"Legacy concept","@id":"http://endhealth.info/im#LegacyConcept"}],"@id":"http://endhealth.info/EMIS#EMISNHH2"},
      {"name":"SNOMED CT Concept (SNOMED RT+CTV3)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#138875005"},
    ], parents: []});
    expect(wrapper.vm.root).toStrictEqual([]);
    expect(wrapper.vm.expandedKeys).toStrictEqual({});
    expect(wrapper.vm.selectedKey).toStrictEqual({});
    expect(wrapper.vm.parentLabel).toBe("");
  });

  it("calls services, populates conceptAggregate and updatesHistory on mounted", async() => {
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://endhealth.info/im#DiscoveryOntology",
        ["http://www.w3.org/2000/01/rdf-schema#label", "http://www.w3.org/2000/01/rdf-schema#comment", "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]);
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://endhealth.info/im#DiscoveryOntology");
    expect(EntityService.getEntityParents).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityParents).toHaveBeenCalledWith("http://endhealth.info/im#DiscoveryOntology");
    await flushPromises();
    expect(mockStore.commit).toHaveBeenCalledTimes(0);
  });

  it("fires a toast on conceptAggregate fetch error", async() => {
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

  it("handles conceptIri changes", async() => {
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.createTree = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://endhealth.info/im#DiscoveryOntology");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.getConceptAggregate).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getConceptAggregate).toHaveBeenCalledWith("http://endhealth.info/im#DiscoveryOntology");
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.createTree).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenCalledTimes(0);
  });

  it("can resetConcept", async() => {
    wrapper.vm.createTree = jest.fn();
    wrapper.vm.parentLabel = "Test label";
    wrapper.vm.selectedKey = { name: "test selected key" };
    wrapper.vm.$nextTick();
    expect(wrapper.vm.parentLabel).toBe("Test label");
    expect(wrapper.vm.selectedKey).toStrictEqual({ name: "test selected key" });
    expect(wrapper.vm.sideNavHierarchyFocus.iri).toEqual("http://endhealth.info/im#DiscoveryOntology");
    wrapper.vm.resetConcept();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.parentLabel).toBe("");
    expect(wrapper.vm.selectedKey).toStrictEqual({});
    expect(wrapper.emitted()["showTree"]).toBeTruthy();
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateConceptIri", "http://endhealth.info/im#DiscoveryOntology");
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Dashboard" });
  });

  it("can resetConcept ___ InformationModel", async() => {
    wrapper.vm.createTree = jest.fn();
    wrapper.vm.parentLabel = "Information Model";
    wrapper.vm.selectedKey = { name: "test selected key" };
    wrapper.vm.$nextTick();
    expect(wrapper.vm.parentLabel).toBe("Information Model");
    expect(wrapper.vm.selectedKey).toStrictEqual({ name: "test selected key" });
    expect(wrapper.vm.sideNavHierarchyFocus.iri).toEqual("http://endhealth.info/im#DiscoveryOntology");
    wrapper.vm.resetConcept();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.parentLabel).toBe("Information Model");
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

  beforeEach(() => {
    jest.resetAllMocks();
    EntityService.getPartialEntity = jest.fn().mockResolvedValue({data:{"@id":"http://snomed.info/sct#298382003","http://endhealth.info/im#isA":[{"@id":"http://snomed.info/sct#64217002","name":"Curvature of spine (disorder)"},{"@id":"http://snomed.info/sct#928000","name":"Disorder of musculoskeletal system (disorder)"},{"@id":"http://snomed.info/sct#699699005","name":"Disorder of vertebral column (disorder)"}],"http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://endhealth.info/im#code":"298382003","http://endhealth.info/im#roleGroup":[{"http://endhealth.info/im#groupNumber":{"@value":1,"@type":"http://www.w3.org/2001/XMLSchema#integer"},"http://www.w3.org/2002/07/owl#someValuesFrom":{"@id":"http://snomed.info/sct#31739005","name":"Lateral abnormal curvature (morphologic abnormality)"},"http://www.w3.org/2002/07/owl#onProperty":{"@id":"http://snomed.info/sct#116676008","name":"Associated morphology (attribute)"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":{"@id":"http://www.w3.org/2002/07/owl#Restriction","name":"Restriction"}}],"http://endhealth.info/im#hasMap":[{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/ICD10#M419","name":"Scoliosis, unspecified"},"http://endhealth.info/im#mapAdvice":"ALWAYS M41.9 | FIFTH CHARACTER POSSIBLE","http://endhealth.info/im#mapPriority":{"@value":3,"@type":"http://www.w3.org/2001/XMLSchema#integer"},"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}},{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/ICD10#M418","name":"Other forms of scoliosis"},"http://endhealth.info/im#mapAdvice":"ALWAYS M41.8 | FIFTH CHARACTER POSSIBLE","http://endhealth.info/im#mapPriority":{"@value":2,"@type":"http://www.w3.org/2001/XMLSchema#integer"},"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}},{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/ICD10#Q675","name":"Congenital deformity of spine"},"http://endhealth.info/im#mapAdvice":"ALWAYS Q67.5","http://endhealth.info/im#mapPriority":{"@value":1,"@type":"http://www.w3.org/2001/XMLSchema#integer"},"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]}],"http://endhealth.info/im#scheme":{"@id":"http://endhealth.info/im#SnomedCodeScheme","name":"Snomed-CT code"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)","http://www.w3.org/2002/07/owl#equivalentClass":[{"http://www.w3.org/2002/07/owl#intersectionOf":[{"@id":"http://snomed.info/sct#64572001","name":"Disease (disorder)"},{"http://www.w3.org/2002/07/owl#someValuesFrom":{"http://www.w3.org/2002/07/owl#intersectionOf":[{"http://www.w3.org/2002/07/owl#someValuesFrom":{"@id":"http://snomed.info/sct#31739005","name":"Lateral abnormal curvature (morphologic abnormality)"},"http://www.w3.org/2002/07/owl#onProperty":{"@id":"http://snomed.info/sct#116676008","name":"Associated morphology (attribute)"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":{"@id":"http://www.w3.org/2002/07/owl#Restriction","name":"Restriction"}},{"http://www.w3.org/2002/07/owl#someValuesFrom":{"@id":"http://snomed.info/sct#289959001","name":"Musculoskeletal structure of spine (body structure)"},"http://www.w3.org/2002/07/owl#onProperty":{"@id":"http://snomed.info/sct#363698007","name":"Finding site (attribute)"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":{"@id":"http://www.w3.org/2002/07/owl#Restriction","name":"Restriction"}}]},"http://www.w3.org/2002/07/owl#onProperty":{"@id":"http://endhealth.info/im#roleGroup","name":"role group"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":{"@id":"http://www.w3.org/2002/07/owl#Restriction","name":"Restriction"}}]}]}});
    EntityService.getEntityParents = jest.fn().mockResolvedValue({data:[{"name":"Curvature of spine (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#699699005"}]});
    EntityService.getEntityChildren = jest.fn().mockResolvedValue({data:[{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#722432000"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#702381007"},{"name":"Idiopathic scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#203639008"},{"name":"Idiopathic scoliosis AND/OR kyphoscoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#30611007"},{"name":"Kyphoscoliosis and scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#203638000"},{"name":"Kyphoscoliosis deformity of spine (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#405773007"},{"name":"Lordoscoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111268000"},{"name":"Neuromuscular scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#203662005"},{"name":"Postural scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#203645000"},{"name":"Radioulnar synostosis with microcephaly and scoliosis syndrome (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#719162001"},{"name":"Scoliosis in connective tissue anomalies (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#203664006"},{"name":"Scoliosis in neurofibromatosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#203661003"},{"name":"Scoliosis of cervical spine (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#298392006"},{"name":"Scoliosis of lumbar spine (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#298591003"},{"name":"Scoliosis of thoracic spine (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#298494008"}]});
    mockStore = {
      state: {
        conceptIri: "http://snomed.info/sct#298382003",
        focusTree: false,
        treeLocked: false,
        sideNavHierarchyFocus: {name: "Ontology", iri: "http://endhealth.info/im#DiscoveryOntology" }
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
    }
    mockToast = {
      add: jest.fn()
    }

    wrapper = mount(Hierarchy, {
      props: { active: 5 },
      global: {
        components: { Button, Tree, ProgressSpinner },
        mocks: { $store: mockStore, $route: mockRoute, $router: mockRouter, $toast: mockToast },
        directives: { tooltip: Tooltip }
      }
    });
  });

  it("calls services, populates conceptAggregate and updatesHistory on mounted", async() => {
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://snomed.info/sct#298382003",
        ["http://www.w3.org/2000/01/rdf-schema#label", "http://www.w3.org/2000/01/rdf-schema#comment", "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]);
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getEntityParents).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityParents).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    await flushPromises();
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateHistory", {
      url: "/concept/http:%2F%2Fsnomed.info%2Fsct%23298382003",
      conceptName: "Scoliosis deformity of spine (disorder)",
      view: "Concept"
    });
  });

  it("handles conceptIri changes ___ not home", async() => {
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.createTree = jest.fn();
    wrapper.vm.resetConcept = jest.fn();
    wrapper.vm.conceptAggregate = {"children":[],"concept":{
      "@id":"http://snomed.info/sct#298382003",
      "http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)"},"parents":[]}
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://snomed.info/sct#298382003");
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockStore.commit).toHaveBeenCalled();
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateHistory", {"conceptName": "Scoliosis deformity of spine (disorder)", "url": "/concept/http:%2F%2Fsnomed.info%2Fsct%23298382003", "view": "Concept"});
  });

  it("handles focusTree changes ___ true", async() => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.$options.watch.focusTree.call(wrapper.vm, true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateFocusTree", false);
    expect(wrapper.emitted().showTree).toBeTruthy();
  });

  it("handles focusTree changes ___ false", async() => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.$options.watch.focusTree.call(wrapper.vm, false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(0);
    expect(wrapper.emitted().showTree).toBeFalsy();
  });

  it("handles active changes ___ refresh", async() => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.$options.watch.active.call(wrapper.vm, 0, 1);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(1);
  });

  it("handles active changes ___ no refresh", async() => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.$options.watch.active.call(wrapper.vm, 1, 0);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(0);
  });

  it("handles treeLocked changes ___ refresh", async() => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.$options.watch.treeLocked.call(wrapper.vm, false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(1);
  });

  it("handles treeLocked changes ___ no refresh", async() => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.$options.watch.treeLocked.call(wrapper.vm, true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(0);
  });

  it("createsTree ___ no root", () => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.createTree(EntityService.getPartialEntity, EntityService.getEntityParents, EntityService.getEntityChildren);
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(1);
  });

  it("createsTree ___ concept", () => {
    wrapper.vm.refreshTree = jest.fn();
    wrapper.vm.root = [1];
    wrapper.vm.createTree({ "@id": "http://endhealth.info/im#InformationModel" }, EntityService.getEntityParents, EntityService.getEntityChildren);
    expect(wrapper.vm.refreshTree).toHaveBeenCalledTimes(1);
  });

  it("routes onNodeSelect ___ IM", () => {
    wrapper.vm.onNodeSelect({ data: "http://endhealth.info/im#InformationModel" });
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Dashboard" });
  });

  it("routes onNodeSelect ___ Concept", () => {
    wrapper.vm.onNodeSelect({ data: "http://endhealth.info/im#TestConcept" });
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Concept", params: { selectedIri: "http://endhealth.info/im#TestConcept" } });
  });

  it("can expand children", async() => {
    wrapper.vm.containsChild = jest.fn().mockReturnValue(false);
    const testNode = { data: "http://endhealth.info/im#TestConcept", key: "http://endhealth.info/im#TestConcept", loading: false, children: [1] }
    await wrapper.vm.expandChildren(testNode);
    await wrapper.vm.$nextTick();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://endhealth.info/im#TestConcept");
    expect(wrapper.vm.containsChild).toHaveBeenCalled();
    expect(testNode.children).toHaveLength(21);
  });

  it("can expand children ___ api fail", async() => {
    wrapper.vm.containsChild = jest.fn().mockReturnValue(false);
    EntityService.getEntityChildren = jest.fn().mockRejectedValue({ code: 404, message: "testError"});
    const testNode = { data: "http://endhealth.info/im#TestConcept", key: "testKey", loading: false, children: [1] }
    await wrapper.vm.expandChildren(testNode);
    await wrapper.vm.$nextTick();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://endhealth.info/im#TestConcept");
    expect(mockToast.add).toHaveBeenCalled();
  });

  it("can expand children ___ containsChildTrue", async() => {
    wrapper.vm.containsChild = jest.fn().mockReturnValue(true);
    const testNode = { data: "http://endhealth.info/im#TestConcept", key: "http://endhealth.info/im#TestConcept", loading: false, children: [] }
    await wrapper.vm.expandChildren(testNode);
    await wrapper.vm.$nextTick();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://endhealth.info/im#TestConcept");
    expect(wrapper.vm.containsChild).toHaveBeenCalled();
    expect(testNode.children).toHaveLength(0);
  });

  it("can check containsChild ___ false", async() => {
    expect(wrapper.vm.containsChild([{ data: "TestFail" }], { "@id": "TestId" })).toBeFalsy();
  });

  it("can check containsChild ___ true", async() => {
    expect(wrapper.vm.containsChild([{ data: "TestId" }], { "@id": "TestId" })).toBeTruthy();
  });

  it("can expand parents __ api pass", async() => {
    wrapper.vm.root = [{ data: "http://snomed.info/sct#298382003", key: "Scoliosis deformity of spine (disorder)"}];
    await wrapper.vm.expandParents();
    expect(EntityService.getEntityParents).toHaveBeenCalledTimes(3);
    expect(EntityService.getEntityParents).toHaveBeenNthCalledWith(1, "http://snomed.info/sct#298382003");
    expect(EntityService.getEntityParents).toHaveBeenLastCalledWith("http://snomed.info/sct#64217002");
  });

  it("can expand parents __ api 1 fail", async() => {
    EntityService.getEntityParents = jest.fn().mockRejectedValue({ code: 404, message: "Test error" });
    wrapper.vm.root = [{ data: "http://snomed.info/sct#298382003", key: "Scoliosis deformity of spine (disorder)"}];
    await wrapper.vm.expandParents();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(EntityService.getEntityParents).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityParents).toHaveBeenNthCalledWith(1, "http://snomed.info/sct#298382003");
    expect(EntityService.getEntityParents).toHaveBeenLastCalledWith("http://snomed.info/sct#298382003");
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Concept parents server request 1 failed"));
  });

  it("can expand parents __ api 2 fail", async() => {
    wrapper.vm.root = [{ data: "http://snomed.info/sct#298382003", key: "Scoliosis deformity of spine (disorder)"}];
    EntityService.getEntityParents = jest.fn()
      .mockResolvedValueOnce({data:[{"name":"Curvature of spine (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#699699005"}]})
      .mockRejectedValue({ code: 404, message: "Test error" })
    await wrapper.vm.expandParents();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(EntityService.getEntityParents).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityParents).toHaveBeenNthCalledWith(1, "http://snomed.info/sct#298382003");
    expect(EntityService.getEntityParents).toHaveBeenLastCalledWith("http://snomed.info/sct#64217002");
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Concept parents server request 2 failed"));
  });

  it("can expand parents __ api 2 no data", async() => {
    wrapper.vm.root = [{ data: "http://snomed.info/sct#298382003", key: "Scoliosis deformity of spine (disorder)"}];
    EntityService.getEntityParents = jest.fn()
      .mockResolvedValueOnce({data:[{"name":"Curvature of spine (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#699699005"}]})
      .mockResolvedValueOnce({data:[]})
    await wrapper.vm.expandParents();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(EntityService.getEntityParents).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityParents).toHaveBeenNthCalledWith(1, "http://snomed.info/sct#298382003");
    expect(EntityService.getEntityParents).toHaveBeenLastCalledWith("http://snomed.info/sct#64217002");
    expect(wrapper.vm.parentLabel).toBe("");
  });
});
