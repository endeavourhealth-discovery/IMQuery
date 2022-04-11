// Categories
// Set, Query Set, Value Set
// Class, Record Type
// Everything else

import { ConceptReference } from "@/models/TTConcept/ConceptReference";
import { IM } from "@/vocabulary/IM";
import { OWL } from "@/vocabulary/OWL";
import { SHACL } from "@/vocabulary/SHACL";

export function isValueSet(conceptTypeElements: ConceptReference[]): boolean {
  return conceptTypeElements?.some(
    (e: any) =>
      e.iri === IM.SET ||
      e.iri === IM.QUERY_SET ||
      e.iri === IM.VALUE_SET ||
      e.iri === IM.CONCEPT_SET ||
      e[IM.IRI] === IM.SET ||
      e[IM.IRI] === IM.QUERY_SET ||
      e[IM.IRI] === IM.VALUE_SET ||
      e[IM.IRI] === IM.CONCEPT_SET
  );
}

export function isClass(conceptTypeElements: ConceptReference[]): boolean {
  return conceptTypeElements?.some(
    (e: any) => e.iri === OWL.CLASS || e[IM.IRI] === OWL.CLASS
  );
}

export function isRecordModel(
  conceptTypeElements: ConceptReference[]
): boolean {
  return conceptTypeElements?.some((e: any) => {
    return e.iri === SHACL.NODESHAPE || e[IM.IRI] === SHACL.NODESHAPE;
  });
}

export function isProperty(conceptTypeElements: ConceptReference[]): boolean {
  return conceptTypeElements?.some((e: any) => {
    return e[IM.IRI] === OWL.OBJECT_PROPERTY || e[IM.IRI] === IM.DATA_PROPERTY;
  });
}

export function isFolder(conceptTypeElements: ConceptReference[]): boolean {
  return conceptTypeElements?.some((e: any) => {
    return e[IM.IRI] === IM.FOLDER || e.iri === IM.FOLDER;
  });
}

export function isQuery(conceptTypeElements: ConceptReference[]): boolean {
  return conceptTypeElements?.some((e: any) => {
    return e[IM.IRI] === IM.QUERY_TEMPLATE || e.iri === IM.QUERY_TEMPLATE;
  });
}

export function getIconFromType(conceptTypes: ConceptReference[]): string {
  if (isRecordModel(conceptTypes)) {
    return "fas fa-fw fa-project-diagram";
  }

  if (isProperty(conceptTypes)) {
    return "far fa-fw fa-edit";
  }

  if (isValueSet(conceptTypes)) {
    return "fas fa-fw fa-tasks";
  }

  if (isFolder(conceptTypes)) {
    return "fas fa-fw fa-folder";
  }

  if (isQuery(conceptTypes)) {
    return "fas fa-fw fa-search";
  }

  return "far fa-fw fa-lightbulb";
}

const palette = require("../../node_modules/google-palette");
export function getColourFromType(conceptTypes: ConceptReference[]): string {
  const bgs = palette("tol-rainbow", 6);
  const bgsFixed = bgs.map((color: string) => "#" + color + "88");

  if (isRecordModel(conceptTypes)) {
    return bgsFixed[0];
  }

  if (isProperty(conceptTypes)) {
    return bgsFixed[5];
  }

  if (isValueSet(conceptTypes)) {
    return bgsFixed[2];
  }

  if (isFolder(conceptTypes)) {
    return bgsFixed[1];
  }

  if (isQuery(conceptTypes)) {
    return bgsFixed[3];
  }

  return bgsFixed[4];
}
