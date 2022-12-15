import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { CommentService } from '@/app/@core/entity/comment.service';
import { Comment } from '@/app/@core/interfaces/business/comment';
import { Plan } from '@/app/@core/interfaces/business/plan';
import { q } from '@/utils/request';
import { User } from '@/app/@core/interfaces/common/users';

/**
 * Component used to display and post comments. This is a stateful component, since it is
 * the only component in the display that tracks and displays comments.
 *
 * In the future, we might want to move into this convention: allow components that solely
 * tracks a type of entity to be stateful.
 */
@Component({
  selector: 'cel-planning-comments',
  templateUrl: './planning-comments.component.html',
  styleUrls: ['./planning-comments.component.scss'],
})
export class PlanningCommentsComponent implements OnChanges {
  /** Plan associated to the comments displayed. */
  @Input() plan?: Plan;
  @Input() user?:User;

  /** List of comments. */
  comments: Comment[] = [];

  /** Text content of the input textarea. */
  text = '';

  constructor(private readonly commentService: CommentService) {}
  
  ngOnChanges(changes: SimpleChanges) {
    if ('plan' in changes) {
      void this.refresh();
    }
  }

  /** Refresh list of displayed comments. */
  private async refresh() {
    // Don't even bother to refresh if there are no associated plans.
    if (!this.plan) {
      return;
    }
    this.comments = await lastValueFrom(
      this.commentService.getWithQuery({ plan: this.plan.id }),
    );
    this.comments.sort(
      (a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime(),
    );
  }

  /** Create a new comment. */
  private async post(text: string) {
    if (!this.plan) return;
    await this.commentService.add({ text, plan: this.plan, user: this.user }).toPromise();
    await this.refresh();
  }

  /** Handler for on keydown of enter key inside the textarea. */
  async onEnter(event: KeyboardEvent) {
    // If shift-key is pressed during enter, just do a simple new line.
    if (event.shiftKey) {
      this.text += '\n';
      return;
    }

    // Prevent inserting newline.
    event.preventDefault();

    // Post comment.
    await this.post(this.text);

    // Reset text to empty.
    this.text = '';
  }
}
