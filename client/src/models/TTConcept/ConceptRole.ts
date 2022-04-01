import { ConceptReference } from "./ConceptReference";

export class ConceptRole {
  group: number;
  property: ConceptReference;
  valueType: ConceptReference;

  constructor(
    group: number,
    property: ConceptReference,
    valueType: ConceptReference
  ) {
    this.group = group;
    this.property = property;
    this.valueType = valueType;
  }
}
