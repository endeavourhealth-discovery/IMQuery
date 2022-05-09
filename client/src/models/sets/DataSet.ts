import { TTIriRef } from '../tripletree/TTIriRef';
import { Select } from './Select';
import { Match } from './Match';

export class DataSet {
  public graph: TTIriRef;
  public select: Select[];
  public subset: DataSet[];
  public groupBy: Select[];
  public match: Match;

   entityType(): TTIriRef {
    return this.match.entityType;
  }
}
