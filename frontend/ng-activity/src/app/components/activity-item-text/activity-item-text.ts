import { Component, Input } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
@Component({
  selector: 'app-activity-item-text',
  imports: [DatePipe, SlicePipe],
  standalone: true,
  templateUrl: './activity-item-text.html',
  styleUrl: './activity-item-text.scss',
})
export class ActivityItemTextComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() date!: string;
}
