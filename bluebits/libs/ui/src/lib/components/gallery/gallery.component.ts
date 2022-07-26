import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-gallery',
  templateUrl: './gallery.component.html',
  styles: [],
})
export class GalleryComponent implements OnInit {
  selectedImage!: string;

  @Input()
  images!: string[];
  constructor() {}

  ngOnInit(): void {
    if (this.hasImages) {
      this.selectedImage = this.images[0];
    }
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  get hasImages() {
    return this.images?.length > 0;
  }
}
