import { TTIriRef } from '../tripletree/TTIriRef';
import { Select } from './Select';
import { Filter } from './Filter';

export class DataSet {
  public graph: TTIriRef;
  public select: Select;
  public subselect: Select[];
  public subset: DataSet[];
  public groupBy: Select[];
  public resultFormat: any;


}
