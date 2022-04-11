import { ConceptReference } from "@/models/ConceptReference";

export class ConceptSummary {
  name = "";
  iri = "";
  scheme = {} as ConceptReference;
  code = "";
  entityType = {} as { elements: ConceptReference[]};
  isDescendentOf: ConceptReference[] = [];
  weighting = 0;
  match = "";
  status = {} as ConceptReference
}
