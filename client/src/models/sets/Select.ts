import { DataSet } from './DataSet';
import { Filter } from './Filter';
import { ConceptRef } from './ConceptRef';
import { TTIriRef } from '../tripletree/TTIriRef';

export class Select {
  public name: string;
  public sum: boolean;
  public average: boolean;
  public max: boolean;
  public count: boolean;
  public propert: any;
  public filter: Filter;
  public distinct: boolean;
  public entityType: ConceptRef;
  public entityId: ConceptRef;
  public entityIn: TTIriRef;
  public groupBy: string[];

  // public object: DataSet;
}
