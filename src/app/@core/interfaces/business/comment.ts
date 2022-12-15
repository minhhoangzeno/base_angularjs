import { ObjectRef } from '../common/mongo';
import { BaseEntity } from '../common/mongo';
import { User } from '../common/users';
import { Plan } from './plan';

export declare interface Comment extends BaseEntity {
  user?: ObjectRef<User>;
  text: string;
  plan: ObjectRef<Plan>;
}
