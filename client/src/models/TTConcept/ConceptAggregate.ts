import { ConceptNode } from "./ConceptNode";

export class ConceptAggregate {
  concept: any;
  children: Array<ConceptNode>;
  parents: Array<ConceptNode>;

  constructor(
    concept: any,
    children: Array<ConceptNode>,
    parents: Array<ConceptNode>
  ) {
    this.concept = concept;
    this.children = children;
    this.parents = parents;
  }
}
