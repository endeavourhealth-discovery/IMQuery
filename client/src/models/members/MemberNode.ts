import { ConceptReference } from "@/models/TTConcept/ConceptReference";

export interface MemberNode {
  code: string;
  concept: ConceptReference;
  scheme: ConceptReference;
}
