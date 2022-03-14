import { ConceptReference } from "./ConceptReference";
import { ConceptStatus } from "./ConceptStatus";

export interface Concept {
  dbid: number;
  iri: string;
  name: string;
  description: string;
  code: string;
  scheme: ConceptReference;
  status: ConceptStatus;
  version: number;
  isA: Set<Concept>;
  annotations: Set<any>;
  conceptType: string;
  SubClassOf: Set<any>;
  EquivalentTo: Set<any>;
  Expression: string;
  DisjointWith: Array<ConceptReference>;
  Property: Set<any>;
  Member: Set<any>;
}
