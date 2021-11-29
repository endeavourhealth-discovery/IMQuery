import { flushPromises, shallowMount } from "@vue/test-utils";
import DownloadDialog from "@/components/concept/DownloadDialog.vue";
import Dialog from "primevue/dialog";
import SelectButton from "primevue/selectbutton";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { RDFS } from "@/vocabulary/RDFS";
import { IM } from "@/vocabulary/IM";

describe("DownloadDialog.vue", () => {
  let wrapper: any;
  let mockToast: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockToast = {
      add: jest.fn()
    };
    EntityService.getPartialEntity = jest.fn().mockResolvedValue({ data: {"@id":"http://snomed.info/sct#298382003","http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)", "http://endhealth.info/im#isA":[{"@id":"http://snomed.info/sct#64217002","name":"Curvature of spine (disorder)"},{"@id":"http://snomed.info/sct#928000","name":"Disorder of musculoskeletal system (disorder)"},{"@id":"http://snomed.info/sct#699699005","name":"Disorder of vertebral column (disorder)"}]} });
    EntityService.getEntityChildren = jest.fn().mockResolvedValue({ data: [{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"}] });
    EntityService.getDataModelProperties = jest.fn().mockResolvedValue({data: [{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}},{"property":{"name":"completion Status","@id":"http://endhealth.info/im#completionStatus"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"inheritedFrom":{}},{"property":{"name":"duration","@id":"http://endhealth.info/im#duration"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"minExclusive":"1","inheritedFrom":{}}]});
    EntityService.getSemanticProperties = jest.fn().mockResolvedValue({data: [{"property":{"name":"Associated morphology (attribute)","@id":"http://snomed.info/sct#116676008"},"type":{"name":"Lateral abnormal curvature (morphologic abnormality)","@id":"http://snomed.info/sct#31739005"}}]});
    EntityService.getEntityMembers = jest.fn().mockResolvedValue({data: {"valueSet":{"name":"Family history","@id":"http://endhealth.info/im#VSET_RecordType_FamilyHistory"},"members":[{"entity":{"name":"Family history with explicit context (situation)","@id":"http://snomed.info/sct#57177007"},"code":"57177007","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"MemberIncluded"},{"entity":{"name":"No family history of clinical finding (situation)","@id":"http://snomed.info/sct#160266009"},"code":"160266009","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"MemberXcluded"}],"limited":false}});
    EntityService.getEntityTermCodes = jest.fn().mockResolvedValue({data: [{"name":"Scoliosis deformity of spine","code":"439061010","scheme":"Snomed-CT namespace"},{"name":"Scoliosis","code":"439062015","scheme":"Snomed-CT namespace"},{"name":"Scoliosis deformity of spine (disorder)","code":"2153143014","scheme":"Snomed-CT namespace"}]});

    wrapper = shallowMount(DownloadDialog, {
      global: {
        components: { Dialog, SelectButton, Checkbox, Button, ProgressSpinner },
        mocks: { $toast: mockToast }
      },
      props: { conceptIri: "http://snomed.info/sct#298382003", showDialog: true }
    });
  });

  it("inits on mounted", async() => {
    await flushPromises();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
  });

  it("inits on conceptIri change", () => {
    wrapper.vm.init = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://endhealth.info/im#DiscoveryOntology");
    expect(wrapper.vm.init).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.init).toHaveBeenCalledWith("http://endhealth.info/im#DiscoveryOntology");
  });

  it("emits on closeDownloadDialog", () => {
    wrapper.vm.closeDownloadDialog();
    expect(wrapper.emitted().closeDownloadDialog).toBeTruthy();
  });

  it("can downloadConcept ___ success", () => {
    wrapper.vm.closeDownloadDialog = jest.fn();
    window.open = jest.fn().mockReturnValue(true);
    wrapper.vm.downloadConcept();
    expect(wrapper.vm.closeDownloadDialog).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith("/test/api/entity/download?iri=http:%2F%2Fsnomed.info%2Fsct%23298382003&format=excel&hasSubTypes=true&dataModelProperties=true&members=true&expandMembers=false&isA=true&semanticProperties=false&terms=false&isChildOf=false&hasChildren=false&inactive=false");
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.success("Download will begin shortly"));
  });

  it("can downloadConcept ___ fail", () => {
    wrapper.vm.closeDownloadDialog = jest.fn();
    window.open = jest.fn().mockReturnValue(false);
    wrapper.vm.downloadConcept();
    expect(wrapper.vm.closeDownloadDialog).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith("/test/api/entity/download?iri=http:%2F%2Fsnomed.info%2Fsct%23298382003&format=excel&hasSubTypes=true&dataModelProperties=true&members=true&expandMembers=false&isA=true&semanticProperties=false&terms=false&isChildOf=false&hasChildren=false&inactive=false");
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Download failed from server"));
  });

  it("Inits ___ success", async() => {
    await flushPromises();
    jest.clearAllMocks();
    wrapper.vm.setIncludeBooleans = jest.fn();
    wrapper.vm.init("http://snomed.info/sct#298382003");
    expect(wrapper.vm.loading).toBe(true);
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://snomed.info/sct#298382003", [RDFS.LABEL, IM.IS_CHILD_OF, IM.HAS_CHILDREN, IM.IS_A]);
    expect(wrapper.vm.concept).toStrictEqual({"@id":"http://snomed.info/sct#298382003","http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)", "http://endhealth.info/im#isA": [{"@id": "http://snomed.info/sct#64217002", "name": "Curvature of spine (disorder)"}, {"@id": "http://snomed.info/sct#928000", "name": "Disorder of musculoskeletal system (disorder)"}, {"@id": "http://snomed.info/sct#699699005", "name": "Disorder of vertebral column (disorder)"}]});
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(wrapper.vm.terms).toStrictEqual([{"name":"Scoliosis deformity of spine","code":"439061010","scheme":"Snomed-CT namespace"},{"name":"Scoliosis","code":"439062015","scheme":"Snomed-CT namespace"},{"name":"Scoliosis deformity of spine (disorder)","code":"2153143014","scheme":"Snomed-CT namespace"}]);
    expect(wrapper.vm.isA).toStrictEqual([{"@id": "http://snomed.info/sct#64217002", "name": "Curvature of spine (disorder)"}, {"@id": "http://snomed.info/sct#928000", "name": "Disorder of musculoskeletal system (disorder)"}, {"@id": "http://snomed.info/sct#699699005", "name": "Disorder of vertebral column (disorder)"}]);
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(wrapper.vm.hasSubTypes).toStrictEqual([{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"}]);
    expect(EntityService.getDataModelProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getDataModelProperties).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(wrapper.vm.dataModelProperties).toStrictEqual([{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}},{"property":{"name":"completion Status","@id":"http://endhealth.info/im#completionStatus"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"inheritedFrom":{}},{"property":{"name":"duration","@id":"http://endhealth.info/im#duration"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"minExclusive":"1","inheritedFrom":{}}]);
    expect(EntityService.getSemanticProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getSemanticProperties).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(wrapper.vm.semanticProperties).toStrictEqual([{"property":{"name":"Associated morphology (attribute)","@id":"http://snomed.info/sct#116676008"},"type":{"name":"Lateral abnormal curvature (morphologic abnormality)","@id":"http://snomed.info/sct#31739005"}}]);
    expect(EntityService.getEntityMembers).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityMembers).toHaveBeenCalledWith("http://snomed.info/sct#298382003", false, false);
    expect(wrapper.vm.members).toStrictEqual({"valueSet":{"name":"Family history","@id":"http://endhealth.info/im#VSET_RecordType_FamilyHistory"},"members":[{"entity":{"name":"Family history with explicit context (situation)","@id":"http://snomed.info/sct#57177007"},"code":"57177007","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"MemberIncluded"},{"entity":{"name":"No family history of clinical finding (situation)","@id":"http://snomed.info/sct#160266009"},"code":"160266009","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"MemberXcluded"}],"limited":false});
    expect(wrapper.vm.setIncludeBooleans).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(false);
  });

  it("Inits ___ fail", async() => {
    console.error = jest.fn();
    EntityService.getPartialEntity = jest.fn().mockRejectedValue({ code: 403, message: "Test error" });
    EntityService.getEntityParents = jest.fn().mockRejectedValue({ code: 403, message: "Test error" });
    EntityService.getEntityChildren = jest.fn().mockRejectedValue({ code: 403, message: "Test error" });
    EntityService.getDataModelProperties = jest.fn().mockRejectedValue({ code: 403, message: "Test error" });
    EntityService.getSemanticProperties = jest.fn().mockRejectedValue({ code: 403, message: "Test error" });
    EntityService.getEntityMembers = jest.fn().mockRejectedValue({ code: 403, message: "Test error" });
    EntityService.getEntityTermCodes = jest.fn().mockRejectedValue({code: 403, message: "Test error"});
    await flushPromises();
    jest.clearAllMocks();
    wrapper.vm.setIncludeBooleans = jest.fn();
    wrapper.vm.init("http://snomed.info/sct#298382003");
    expect(wrapper.vm.loading).toBe(true);
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://snomed.info/sct#298382003", [RDFS.LABEL, IM.IS_CHILD_OF, IM.HAS_CHILDREN, IM.IS_A]);
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getDataModelProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getDataModelProperties).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getSemanticProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getSemanticProperties).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getEntityMembers).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityMembers).toHaveBeenCalledWith("http://snomed.info/sct#298382003", false, false);
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(mockToast.add).toHaveBeenCalledTimes(6);
    expect(mockToast.add).toHaveBeenNthCalledWith(1, LoggerService.error("Failed to get concept data from server"));
    expect(mockToast.add).toHaveBeenNthCalledWith(2, LoggerService.error("Failed to get children data from server"));
    expect(mockToast.add).toHaveBeenNthCalledWith(3, LoggerService.error("Failed to get terms from server"));
    expect(mockToast.add).toHaveBeenNthCalledWith(4, LoggerService.error("Failed to get data model properties from server"));
    expect(mockToast.add).toHaveBeenNthCalledWith(5, LoggerService.error("Failed to get semantic properties from server"));
    expect(mockToast.add).toHaveBeenNthCalledWith(6, LoggerService.error("Failed to get members from server"));
    expect(wrapper.vm.setIncludeBooleans).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(false);
  });

  it("Can setIncludeBooleans ___ members", async() => {
    await flushPromises();
    await wrapper.vm.$nextTick();
    wrapper.vm.setIncludeBooleans();
    expect(wrapper.vm.includeIsA).toBe(true);
    expect(wrapper.vm.includeHasSubTypes).toBe(true);
    expect(wrapper.vm.includeDataModelProperties).toBe(true);
    expect(wrapper.vm.includeSemanticProperties).toBe(true);
    expect(wrapper.vm.includeMembers).toBe(true);
  });

  it("Can setIncludeBooleans ___ no members", async() => {
    await flushPromises();
    await wrapper.vm.$nextTick();
    wrapper.vm.members = {};
    wrapper.vm.setIncludeBooleans();
    expect(wrapper.vm.includeIsA).toBe(true);
    expect(wrapper.vm.includeHasSubTypes).toBe(true);
    expect(wrapper.vm.includeDataModelProperties).toBe(true);
    expect(wrapper.vm.includeSemanticProperties).toBe(true);
    expect(wrapper.vm.includeMembers).toBe(false);
  });
});
