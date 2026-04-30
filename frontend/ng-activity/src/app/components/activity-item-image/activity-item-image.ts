import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-activity-item-image',
  imports: [],
  standalone: true,
  templateUrl: './activity-item-image.html',
  styleUrl: './activity-item-image.scss',
})
export class ActivityItemImageComponent {
  @Input() imageUrl?: string | null;
}
