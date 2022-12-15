import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { Comment } from '../interfaces/business/comment';

@Injectable({ providedIn: 'root' })
export class CommentService extends EntityCollectionServiceBase<Comment> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('explorer/comments', serviceElementsFactory);
  }
}
