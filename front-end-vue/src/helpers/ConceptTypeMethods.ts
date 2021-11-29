// Categories
// Set, Query Set, Value Set
// Class, Record Type
// Everything else

import { ConceptReference } from "@/models/ConceptReference";
import { IM } from "@/vocabulary/IM";
import { OWL } from "@/vocabulary/OWL";
import { SHACL } from "@/vocabulary/SHACL";

export function isOfTypes(conceptTypeElements: ConceptReference[], ...types: string[]): boolean {
  if (!conceptTypeElements || !conceptTypeElements.length) {
    return false;
  }
  let found = false;
  let index = 0;
  while (!found && index < types.length) {
    if (conceptTypeElements.some((e: any) => e.iri === types[index] || e[IM.IRI] === types[index])) {
      found = true;
    }
    index++;
  }
  return found;
}

export function isValueSet(conceptTypes: ConceptReference[]): boolean {
  return isOfTypes(conceptTypes, IM.SET, IM.QUERY_SET, IM.VALUE_SET, IM.CONCEPT_SET);
}

export function getIconFromType(conceptTypes: ConceptReference[]): string {
  if (isOfTypes(conceptTypes, SHACL.NODESHAPE)) {
    return "fas fa-fw fa-project-diagram";
  }

  if (isOfTypes(conceptTypes, OWL.OBJECT_PROPERTY, IM.DATA_PROPERTY)) {
    return "far fa-fw fa-edit";
  }

  if (isValueSet(conceptTypes)) {
    return "fas fa-fw fa-tasks";
  }

  if (isOfTypes(conceptTypes, IM.FOLDER)) {
    return "fas fa-fw fa-folder";
  }

  if (isOfTypes(conceptTypes, IM.QUERY_TEMPLATE)) {
    return "fas fa-fw fa-search";
  }

  return "far fa-fw fa-lightbulb";
}

const palette = require("../../node_modules/google-palette");
export function getColourFromType(conceptTypes: ConceptReference[]): string {
  const bgs = palette("tol-rainbow", 6);
  const bgsFixed = bgs.map((color: string) => "#" + color + "88");

  if (isOfTypes(conceptTypes, SHACL.NODESHAPE)) {
    return bgsFixed[0];
  }

  if (isOfTypes(conceptTypes, OWL.OBJECT_PROPERTY, IM.DATA_PROPERTY)) {
    return bgsFixed[5];
  }

  if (isValueSet(conceptTypes)) {
    return bgsFixed[2];
  }

  if (isOfTypes(conceptTypes, IM.FOLDER)) {
    return bgsFixed[1];
  }

  if (isOfTypes(conceptTypes, IM.QUERY_TEMPLATE)) {
    return bgsFixed[3];
  }

  return bgsFixed[4];
}
