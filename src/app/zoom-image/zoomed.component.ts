import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-zoome-image',
  templateUrl: './zoomed.component.html',
  styleUrls: ['./zoomed.component.scss']
})
export class ZoomedImageModalComponent {
  zoomLevel: number = 80; // Initial zoom level set to 100%

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageSrc: string }) {}

  zoomIn(): void {
    this.zoomLevel += 10; // Increase the zoom level by 10%
  }

  zoomOut(): void {
    if (this.zoomLevel > 10) {
      this.zoomLevel -= 10; // Decrease the zoom level by 10%, ensuring it doesn't go below 10%
    }
  }
}
