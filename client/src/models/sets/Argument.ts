import {TTIriRef} from '../tripletree/TTIriRef';
import {Match} from './Match';

export class Argument {
  public parameter: string;
  public value: string | TTIriRef | Match | boolean | number;
}
