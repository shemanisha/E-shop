import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/Category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'products-categories-banner',
  templateUrl: './categories-banner.component.html',
  styles: [],
})
export class CategoriesBannerComponent implements OnInit {
  categories: Category[] = [];
  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories.categories;
    });
  }
}
