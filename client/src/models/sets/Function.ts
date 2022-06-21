import {TTIriRef} from '../tripletree/TTIriRef';
import {Argument} from './Argument';

export class Function {
  public id: TTIriRef;
  public name: string;
  public argument: Argument[];
}
