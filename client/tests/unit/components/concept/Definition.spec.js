import { shallowMount } from "@vue/test-utils";
import Definition from "@/components/concept/Definition.vue";
import Description from "@/components/concept/Description.vue";
import Divider from "primevue/divider";
import Listbox from "primevue/listbox";
import SemanticProperties from "@/components/concept/SemanticProperties.vue";
import DataModelProperties from "@/components/concept/DataModelProperties.vue";

describe("Definition.vue", () => {
  let wrapper;
  let mockRoute;
  let mockRouter;

  beforeEach(() => {
    jest.resetAllMocks();
    mockRoute = {
      name: "Concept"
    };
    mockRouter = {
      push: jest.fn()
    };

    wrapper = shallowMount(Definition, {
      global: {
        components: { Description, Divider, Listbox, SemanticProperties, DataModelProperties },
        mocks: { $route: mockRoute, $router: mockRouter }
      },
      props: {
        concept: {
          "iri":"http://snomed.info/sct#298382003","name":"Scoliosis deformity of spine (disorder)", "status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Curvature of spine (disorder)","@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","@id":"http://snomed.info/sct#699699005"}],"subtypes":[{"name":"Acquired scoliosis (disorder)","@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Idiopathic scoliosis (disorder)","@id":"http://snomed.info/sct#203639008"},{"name":"Idiopathic scoliosis AND/OR kyphoscoliosis (disorder)","@id":"http://snomed.info/sct#30611007"},{"name":"Kyphoscoliosis and scoliosis (disorder)","@id":"http://snomed.info/sct#203638000"},{"name":"Kyphoscoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#405773007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Neuromuscular scoliosis (disorder)","@id":"http://snomed.info/sct#203662005"},{"name":"Postural scoliosis (disorder)","@id":"http://snomed.info/sct#203645000"},{"name":"Radioulnar synostosis with microcephaly and scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#719162001"},{"name":"Scoliosis in connective tissue anomalies (disorder)","@id":"http://snomed.info/sct#203664006"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"},{"name":"Scoliosis of cervical spine (disorder)","@id":"http://snomed.info/sct#298392006"},{"name":"Scoliosis of lumbar spine (disorder)","@id":"http://snomed.info/sct#298591003"},{"name":"Scoliosis of thoracic spine (disorder)","@id":"http://snomed.info/sct#298494008"}]
        },
        semanticProperties: [
          {"property":{"name":"Associated morphology (attribute)","@id":"http://snomed.info/sct#116676008"},"type":{"name":"Lateral abnormal curvature (morphologic abnormality)","@id":"http://snomed.info/sct#31739005"}}
        ],
        dataModelProperties: [{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}}],
        contentHeight: 800
      }
    });
  });

  it("starts with empty values + props", () => {
    expect(wrapper.vm.selected).toStrictEqual({});
    expect(wrapper.vm.copyMenuItems).toStrictEqual([]);
    expect(wrapper.vm.contentHeight).toBe(800);
    expect(wrapper.vm.concept).toStrictEqual({
      "iri":"http://snomed.info/sct#298382003","name":"Scoliosis deformity of spine (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Curvature of spine (disorder)","@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","@id":"http://snomed.info/sct#699699005"}],"subtypes":[{"name":"Acquired scoliosis (disorder)","@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Idiopathic scoliosis (disorder)","@id":"http://snomed.info/sct#203639008"},{"name":"Idiopathic scoliosis AND/OR kyphoscoliosis (disorder)","@id":"http://snomed.info/sct#30611007"},{"name":"Kyphoscoliosis and scoliosis (disorder)","@id":"http://snomed.info/sct#203638000"},{"name":"Kyphoscoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#405773007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Neuromuscular scoliosis (disorder)","@id":"http://snomed.info/sct#203662005"},{"name":"Postural scoliosis (disorder)","@id":"http://snomed.info/sct#203645000"},{"name":"Radioulnar synostosis with microcephaly and scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#719162001"},{"name":"Scoliosis in connective tissue anomalies (disorder)","@id":"http://snomed.info/sct#203664006"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"},{"name":"Scoliosis of cervical spine (disorder)","@id":"http://snomed.info/sct#298392006"},{"name":"Scoliosis of lumbar spine (disorder)","@id":"http://snomed.info/sct#298591003"},{"name":"Scoliosis of thoracic spine (disorder)","@id":"http://snomed.info/sct#298494008"}]
    });
    expect(wrapper.vm.semanticProperties).toStrictEqual([
      {"property":{"name":"Associated morphology (attribute)","@id":"http://snomed.info/sct#116676008"},"type":{"name":"Lateral abnormal curvature (morphologic abnormality)","@id":"http://snomed.info/sct#31739005"}}
    ]);
    expect(wrapper.vm.dataModelProperties).toStrictEqual([{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}}]);
  });

  it("can get conceptTypes ___ single", () => {
    expect(Definition.computed.conceptTypes.call({ concept: { types: [{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}]} })).toBe("Class");
  });

  it("can get conceptTypes ___ multiple", () => {
    expect(Definition.computed.conceptTypes.call({ concept: { types: [{"name":"Record type","@id":"http://endhealth.info/im#RecordType"},{"name":"Node shape","@id":"http://www.w3.org/ns/shacl#NodeShape"},{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}]} })).toBe("Record type, Node shape, Class");
  });

  it("can get conceptTypes ___ none", () => {
    expect(Definition.computed.conceptTypes.call({ concept: {} })).toBe(undefined);
  });

  it("can create descriptionHTML ___ description", () => {
    expect(Definition.computed.descriptionHTML.call({ concept: { description: "An entry recording information about a criticial care encounter.<p>common data model attributes for Critical care encounter" }})).toBe("<p class='description-p'>An entry recording information about a criticial care encounter.</p>\n<p class='description-p'>common data model attributes for Critical care encounter</p>");
  });


  it("can create descriptionHTML ___ description", () => {
    expect(Definition.computed.descriptionHTML.call({ concept: {}})).toBe(undefined);
  });

  it("can navigate", () => {
    wrapper.vm.navigate("http://endhealth.info/im#12345678");
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Concept", params: { selectedIri: "http://endhealth.info/im#12345678" } });
  });

  it("can navigate __ no Iri", () => {
    wrapper.vm.navigate();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
