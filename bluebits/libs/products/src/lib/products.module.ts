import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { CategoriesBannerComponent } from './components/categories-banner/categories-banner.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ProductSearchComponent, CategoriesBannerComponent],
  exports: [ProductSearchComponent, CategoriesBannerComponent],
})
export class ProductsModule {}
