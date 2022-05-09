import {Match} from './Match';
import {TTIriRef} from '../tripletree/TTIriRef';
import {Order} from './Order';

export class SortLimit {
  public orderBy: TTIriRef;
  public count: number;
  public direction: Order;
  public must: Match[];
}
