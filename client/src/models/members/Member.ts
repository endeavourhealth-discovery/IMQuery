import { ConceptReference } from "@/models/TTConcept/ConceptReference";
import { MemberNode } from "./MemberNode";

export class Member {
  excluded: MemberNode[];
  included: MemberNode[];
  valueSet: ConceptReference;

  constructor(
    excluded: MemberNode[],
    included: MemberNode[],
    valueSet: ConceptReference
  ) {
    this.excluded = excluded;
    this.included = included;
    this.valueSet = valueSet;
  }
}
