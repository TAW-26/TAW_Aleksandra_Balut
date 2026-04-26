import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-activity-item-text',
  imports: [DatePipe],
  standalone: true,
  templateUrl: './activity-item-text.html',
  styleUrl: './activity-item-text.scss',
})
export class ActivityItemTextComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() date!: string;
}
