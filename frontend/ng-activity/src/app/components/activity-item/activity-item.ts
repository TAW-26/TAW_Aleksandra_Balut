import { Component, Input } from '@angular/core';
import { EventModel } from '../../models/event.model';
import { ActivityItemTextComponent } from '../activity-item-text/activity-item-text';
import { ActivityItemImageComponent } from '../activity-item-image/activity-item-image';
@Component({
  selector: 'app-activity-item',
  standalone: true,
  imports: [ActivityItemTextComponent, ActivityItemImageComponent],
  templateUrl: './activity-item.html',
  styleUrl: './activity-item.scss',
})
export class ActivityItemComponent {
  @Input() event!: EventModel;
}
