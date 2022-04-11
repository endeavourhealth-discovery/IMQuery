import { ConceptType } from "./ConceptType";
import { ConceptStatus } from "./../ConceptStatus";
import { SortBy } from "./SortBy";

export class SearchRequest {
  termFilter!: string;
  statusFilter!: ConceptStatus[];
  typeFilter!: ConceptType[];
  schemeFilter!: string[];
  descendentFilter!: string[];
  markIfDescendentOf!: string[];
  sortBy!: SortBy;
  page!: number;
  size!: number;
}
