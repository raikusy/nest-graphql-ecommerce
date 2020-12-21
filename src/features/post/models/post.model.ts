import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';
import { BaseModel } from '@app/common/models/base.model';

@ObjectType()
export class Post extends BaseModel {
  title: string;
  content: string;
  published: boolean;
  author: User;
}
