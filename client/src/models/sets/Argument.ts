import {TTIriRef} from '../tripletree/TTIriRef';
import {Filter} from './Filter';

export class Argument {
  public parameter: string;
  public value: string | TTIriRef | Filter | boolean | number;
}
