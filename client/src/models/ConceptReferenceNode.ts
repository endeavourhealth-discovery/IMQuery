import { TTIriRef } from "@/models/TTIriRef";

export class ConceptReferenceNode extends TTIriRef {
  parents!: ConceptReferenceNode[];
  children!: ConceptReferenceNode[];
  moduleId!: string;
  hasChildren!: boolean;
}
