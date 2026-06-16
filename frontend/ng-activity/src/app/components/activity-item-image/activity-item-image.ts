import { Component, input, computed } from '@angular/core';
 

@Component({
  selector: 'app-activity-item-image',
  imports: [],
  standalone: true,
  templateUrl: './activity-item-image.html',
  styleUrl: './activity-item-image.scss',
})
export class ActivityItemImageComponent {
  
  category = input<string | null | undefined>(null);
  altText = input<string>('Zdjęcie wydarzenia');

  
  categoryImage = computed(() => {
    const cat = this.category();
    if (!cat) return 'meeting.jpg';

    const normalizedCategory = cat.toLowerCase().trim();


    switch (normalizedCategory) {
      case 'sport':
        return 'sport.jpg';
      case 'gry':
        return 'games2.jpg';
      case 'dzieci':
        return 'children.jpg';
      case 'spotkania':
        return 'meeting.jpg';
      default:
        return 'games2.jpg';
    }
  });
}

