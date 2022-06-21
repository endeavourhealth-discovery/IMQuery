import { TTIriRef } from '../tripletree/TTIriRef';
import { SortLimit } from './SortLimit';
import { TTIri } from '../tripletree/TTIri';
import { Compare } from './Compare';
import { Within } from './Within';
import { Function } from './Function';


export class Filter extends TTIri {
  public and: Filter[];
  public or: Filter[];
  public may: Filter[];
  public sortLimit: SortLimit;
  public graph: TTIriRef;
  public entityType: TTIriRef;
  public entityId: TTIriRef;
  public subsetOf: TTIriRef[];

  public property: TTIriRef;
  public valueCompare: Compare;
  public valueIn: TTIriRef[];
  public valueNotIn: TTIriRef[];
  public range: Range;
  public valueVar: string;
  public valueObject: Filter;
  public function: Function;
  public valueWithin: Within;
  public inverseOf: boolean;
  public notExist: boolean;
  public includeMembers: boolean;
  public index: boolean;
}
