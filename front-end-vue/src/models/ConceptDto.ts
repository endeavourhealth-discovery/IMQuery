import { ConceptReference } from "./ConceptReference";
import { ConceptStatus } from "./ConceptStatus";

export class ConceptDto {
  iri: string;
  name: string;
  description: string;
  code: string;
  scheme: ConceptReference;
  status: ConceptStatus;
  version: number;
  definitionText: string;

  constructor(
    iri?: string,
    name?: string,
    description?: string,
    code?: string,
    scheme?: ConceptReference,
    status?: ConceptStatus,
    version?: number,
    definitionText?: string
  ) {
    this.iri = iri || "";
    this.name = name || "";
    this.description = description || "";
    this.code = code || "";
    this.scheme = scheme || ({} as ConceptReference);
    this.status = status || ConceptStatus.Active;
    this.version = version || 0;
    this.definitionText = definitionText || "";
  }
}
