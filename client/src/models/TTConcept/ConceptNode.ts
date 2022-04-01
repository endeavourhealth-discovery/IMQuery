import { ConceptReference } from "./ConceptReference";

export interface ConceptNode {
  hasChildren: boolean;
  iri: string;
  name: string;
  type: { elements: Array<ConceptReference> };
}
